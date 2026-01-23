import { z } from "zod";
import { processNaturalQuery } from "../utils/nlp.js";
import { getAllCategories } from "../services/catalog.js";
import { formatCategoriesList } from "../utils/formatting.js";

/**
 * Register general tools related to vault management
 */
export function registerGeneralTools(server) {
  server.registerTool(
    "ask_composter",
    {
      title: "Ask Composter",
      description: "Ask in plain English to manage vault components.",
      inputSchema: z.object({
        query: z.string().describe("Natural language query")
      })
    },
    async ({ query }) => {
      try {
        const result = await processNaturalQuery(query.trim());
        return { content: [{ type: "text", text: result }] };
      } catch (err) {
        return { 
          content: [{ 
            type: "text", 
            text: `❌ **Error:** ${err.message}\n\n💡 *Make sure you're logged in: \`composter login\`*` 
          }] 
        };
      }
    }
  );

  server.registerTool(
    "list_categories",
    {
      title: "List Categories",
      description: "List all categories in the vault.",
      inputSchema: z.object({})
    },
    async () => {
      try {
        const categories = await getAllCategories();
        return { content: [{ type: "text", text: formatCategoriesList(categories) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `❌ **Error:** ${err.message}` }] };
      }
    }
  );
}