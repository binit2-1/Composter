import prisma from "../prisma/prisma.js";

export async function countCategories(req, res) {
  try{
    const userId = req.user.id;

    const count = await prisma.category.count({
      where: { userId }
    });

    return res.status(200).json({ count });
  } catch (err) {
    console.error("Count Categories Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const userId = req.user.id; // set by authMiddleware

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Category name required" });
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (existingCategory) {
      return res.status(409).json({ error: `Category ${name} already exists` });
    }

    const category = await prisma.category.create({
      data: {
        name,
        userId,
      },
    });

    return res.status(201).json({ category });
  } catch (err) {
    console.error("Create Category Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function listCategories(req, res) {
  try {
    const userId = req.user.id;

    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ categories });
  } catch (err) {
    console.error("List Category Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
