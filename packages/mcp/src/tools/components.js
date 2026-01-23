import { z } from "zod";
import {
  getComponentsByCategory,
  getComponent,
  searchComponents,
  getAllCategories,
} from "../services/catalog.js";
import {
  formatComponentDetail,
  formatSearchResults,
  formatComponentsList,
} from "../utils/formatting.js";
import { fuzzyFindCategory } from "../utils/fuzzy.js";

/**
 * Register component-related tools
 */
export function registerComponentTools(server) {
  server.registerTool(
    "search_components",
    {
      title: "Search Components",
      description: "Search vault components by name or topic.",
      inputSchema: z.object({
        query: z.string().describe("Search term for component or category")
      })
    },
    async ({ query }) => {
      try {
        const results = await searchComponents(query.trim());
        return { 
          content: [{ type: "text", text: formatSearchResults(results, query.trim()) }] 
        };
      } catch (err) {
        return { content: [{ type: "text", text: `❌ **Error:** ${err.message}` }] };
      }
    }
  );

  server.registerTool(
    "read_component",
    {
      title: "Read Component",
      description: "Read a component's full source code and metadata.",
      inputSchema: z.object({
        category: z.string().describe("The category name"),
        title: z.string().describe("The title/name of the component")
      })
    },
    async ({ category, title }) => {
      try {
        const categoryName = await fuzzyFindCategory(category.trim());
        if (!categoryName) {
          return { content: [{ type: "text", text: `❌ Category "${category}" not found.` }] };
        }

        let component = await getComponent(categoryName, title.trim());
        
        // Fuzzy logic remains same
        if (!component) {
          const categoryComponents = await getComponentsByCategory(categoryName);
          const normalized = title.toLowerCase();
          const fuzzyMatch = categoryComponents?.find(c => 
            c.title.toLowerCase().includes(normalized)
          );
          if (fuzzyMatch) component = await getComponent(categoryName, fuzzyMatch.title);
        }

        if (!component) {
          return { content: [{ type: "text", text: `❌ Component "${title}" not found.` }] };
        }

        return { content: [{ type: "text", text: formatComponentDetail(component, categoryName) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `❌ **Error:** ${err.message}` }] };
      }
    }
  );

  server.registerTool(
    "list_components",
    {
      title: "List Components",
      description: "List components inside a given category. Trigger on requests like 'show components in ui', 'what's in forms', 'list items in buttons'.",
      inputSchema: z.object({
        category: z.string().describe("The category name to list components from")
      })
    },
    async ({ category }) => {
      try {
        const categoryName = await fuzzyFindCategory(category.trim());

        if (!categoryName) {
          const categories = await getAllCategories();
          const suggestions = categories.slice(0, 5).map(c => `"${c.name}"`).join(", ");
          return {
            content: [{
              type: "text",
              text: `❌ **Category "${category}" not found**\n\nAvailable: ${suggestions || "none"}`
            }]
          };
        }

        const components = await getComponentsByCategory(categoryName);
        return {
          content: [{ type: "text", text: formatComponentsList(components, categoryName) }]
        };
      } catch (err) {
        return { content: [{ type: "text", text: `❌ **Error:** ${err.message}` }] };
      }
    }
  );
}