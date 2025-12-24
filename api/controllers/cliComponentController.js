import prisma from "../prisma/prisma.js";

export async function getComponentById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const component = await prisma.component.findFirst({
      where: { 
        id,
        userId 
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    if (!component) {
      return res.status(404).json({ error: "Component not found" });
    }

    return res.status(200).json({ component });
  } catch (err) {
    console.error("Get Component Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function listComponents(req, res) {
  try {
    const userId = req.user.id;

    const components = await prisma.component.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        code: true,
        dependencies: true,
        createdAt: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({ components });
  } catch (err) {
    console.error("List Components Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function recentComponents(req, res) {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const components = await prisma.component.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return res.status(200).json({ components });
  } catch (err) {
    console.error("Recent Components Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function countComponents(req, res){
  try{
    const userId = req.user.id;

    const count = await prisma.component.count({
      where: { userId }
    });

    return res.status(200).json({ count });
  } catch (err) {
    console.error("Count Components Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function pushComponent(req, res) {
  try {
    const { title, code, category, dependencies } = req.body;
    const userId = req.user.id;

    if (!title || !code || !category) {
      return res.status(400).json({ error: "title, code, and category are required" });
    }

    // Step 1 — check if category exists
    let cat = await prisma.category.findFirst({
      where: { name: category, userId },
    });

     // check if a component with same title exists for this user under this category
    const existingComponent = await prisma.component.findFirst({
      where: {
        title,
        categoryId: cat?.id,
        userId,
      },
    });

    if (existingComponent) {
      return res.status(409).json({ error: `Component ${title} already exists in this category` });
    }

    // Step 2 — if not exists, create category (NO EXPRESS CONTROLLER INVOCATION)
    if (!cat) {
      cat = await prisma.category.create({
        data: { name: category, userId },
      });
    }

    // Step 3 — create component under that category
    const component = await prisma.component.create({
      data: {
        title,
        code,
        dependencies: dependencies || {},
        categoryId: cat.id,
        userId,
      },
    });

    return res.status(201).json({ component });

  } catch (err) {
    console.error("Push Component Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


export async function pullComponent(req, res){
  try{
    const { category, title } = req.query;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Find the category
    const cat = await prisma.category.findFirst({
      where:{ name: category, userId }
    });

    if(!cat){
      return res.status(404).json({ error: "Category not found" });
    }

    // Find the component under that category
    const component = await prisma.component.findFirst({
      where: { title, categoryId: cat.id, userId }
    });

    if (!component) {
      return res.status(404).json({ error: "Component not found" });
    }

    return res.status(200).json({ component });
    
  } catch(err){
    console.error("Pull Component Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Search components by title or category name (for MCP)
export async function searchComponents(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Search query 'q' is required" });
    }

    const components = await prisma.component.findMany({
      where: {
        AND: [
          { userId },
          {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { category: { name: { contains: q, mode: "insensitive" } } }
            ]
          }
        ]
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    return res.status(200).json({ components });
  } catch (err) {
    console.error("Search Components Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// List components by category (for MCP)
export async function listComponentsByCategory(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ error: "Category query param is required" });
    }

    // Find the category first
    const cat = await prisma.category.findFirst({
      where: { name: category, userId }
    });

    if (!cat) {
      return res.status(404).json({ error: "Category not found" });
    }

    const components = await prisma.component.findMany({
      where: {
        categoryId: cat.id,
        userId
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({ components });
  } catch (err) {
    console.error("List Components By Category Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteComponent(req, res){
  try{
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Component ID is required" });

    const component = await prisma.component.delete({
      where: { id, userId }
    });
    
    return res.status(200).json({ message: "Component deleted successfully" });
  } catch (err) {
    console.error("Delete Component Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}