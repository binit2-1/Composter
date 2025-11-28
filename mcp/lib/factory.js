import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import prisma from '../../backend/prisma/prisma.js';

export function createMcpServer(userId) {
  if (!userId) {
    throw new Error("Security Error: Cannot create MCP server without a User ID.");
  }

  const server = new McpServer({
    name: "Composter Vault",
    version: "1.0.0",
  });

  server.tool(
    "search_components",
    "Search for React components by title or category name. Returns a list of matching components with their IDs and categories.",
    { 
      query: z.string().describe("Search term for component title or category name") 
    },
    async ({ query }) => {
      const components = await prisma.component.findMany({
        where: {
          AND: [
            { userId: userId },
            {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { category: { name: { contains: query, mode: "insensitive" } } }
              ]
            }
          ]
        },
        include: { category: true },
        take: 10,
      });

      if (components.length === 0) {
        return { content: [{ type: "text", text: "No components found matching that query." }] };
      }

      const formatted = components.map(c => 
        `- [ID: ${c.id}] ${c.title} (Category: ${c.category.name})`
      ).join("\n");

      return {
        content: [{ type: "text", text: `Found the following components:\n${formatted}` }],
      };
    }
  );

  server.tool(
    "read_component",
    "Read the full source code of a specific React component by its name. Returns the component code, category, and creation date.",
    { 
      componentName: z.string().describe("The name of the component to read") 
    },
    async ({ componentName }) => {
      const component = await prisma.component.findFirst({
        where: { 
          title: { contains: componentName, mode: "insensitive" },
          userId: userId 
        },
        include: { category: true }
      });

      if (!component) {
        return { 
          content: [{ type: "text", text: `Component "${componentName}" not found or you do not have permission to view it.` }] 
        };
      }

      const output = `
Filename: ${component.title}
Category: ${component.category.name}
Created: ${component.createdAt.toISOString()}

\`\`\`javascript
${component.code}
\`\`\`
`;

      return {
        content: [{ type: "text", text: output }],
      };
    }
  );

  return server;
}