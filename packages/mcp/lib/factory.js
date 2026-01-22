/**
 * Composter MCP Server Factory
 * 
 * A sophisticated Model Context Protocol server that provides natural language
 * access to your personal React component vault. Works seamlessly across
 * Claude Desktop, Cursor, VS Code, Windsurf, and any MCP-compatible IDE.
 * 
 * @author Composter Team
 * @version 2.0.0
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAuthToken, getBaseUrl } from "./auth.js";

// ============================================================================
// API LAYER
// ============================================================================



// ============================================================================
// DATA FETCHERS
// ============================================================================



// ============================================================================
// FORMATTERS - Beautiful output for chat interfaces
// ============================================================================


// ============================================================================
// HELPERS
// ============================================================================

function normalizeText(text) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Fuzzy match a component by title across all components
 */
async function fuzzyFindComponent(searchTitle) {
  const allComponents = await getAllComponents();
  const normalized = normalizeText(searchTitle);
  
  // Exact match first
  let match = allComponents.find(c => 
    normalizeText(c.title) === normalized
  );
  if (match) return match;

  // Partial match
  match = allComponents.find(c => 
    normalizeText(c.title).includes(normalized) ||
    normalized.includes(normalizeText(c.title))
  );
  if (match) return match;

  // Word-based match
  const searchWords = normalized.split(/\s+/);
  match = allComponents.find(c => {
    const titleNorm = normalizeText(c.title);
    return searchWords.every(word => titleNorm.includes(word));
  });

  return match;
}

/**
 * Fuzzy match a category by name
 */
async function fuzzyFindCategory(searchName) {
  const categories = await getAllCategories();
  const normalized = normalizeText(searchName);
  
  // Exact match
  let match = categories.find(c => normalizeText(c.name) === normalized);
  if (match) return match.name;

  // Partial match
  match = categories.find(c => 
    normalizeText(c.name).includes(normalized) ||
    normalized.includes(normalizeText(c.name))
  );
  
  return match?.name || null;
}

// ============================================================================
// NATURAL LANGUAGE PROCESSOR
// ============================================================================



// ============================================================================
// MCP SERVER FACTORY
// ============================================================================

/**
 * Creates and configures the Composter MCP server with all tools
 */
export function createMcpServer() {
  const server = new McpServer({
    name: "Composter",
    version: "2.0.0",
  });

  // ===========================================================================
  // TOOL: ask_composter (Primary Natural Language Interface)
  // ===========================================================================
  server.tool(
    "ask_composter",
    `Ask in plain English to list categories, show components in a category, search components, or read a component (e.g., 'list categories', 'show components in ui', 'read Simple Card from ui', 'find button components').`,
    {
      query: z.string().describe(
        "Natural language query - e.g., 'list categories', 'show components in buttons', 'read Card from ui', 'find forms'"
      ),
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

  // ===========================================================================
  // TOOL: search_components
  // ===========================================================================
  server.tool(
    "search_components",
    "Search vault components by name or topic. Triggers on queries like 'find button components', 'search cards', 'look up forms'. Returns matches with IDs and categories.",
    {
      query: z.string().describe("Search term for component title or category name"),
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

  // ===========================================================================
  // TOOL: list_categories
  // ===========================================================================
  server.tool(
    "list_categories",
    "List all categories in the vault. Trigger when user asks 'what categories do I have', 'show my categories', 'list vault categories'.",
    {},
    async () => {
      try {
        const categories = await getAllCategories();
        return { content: [{ type: "text", text: formatCategoriesList(categories) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `❌ **Error:** ${err.message}` }] };
      }
    }
  );

  // ===========================================================================
  // TOOL: list_components
  // ===========================================================================
  server.tool(
    "list_components",
    "List components inside a given category. Trigger on requests like 'show components in ui', 'what's in forms', 'list items in buttons'.",
    {
      category: z.string().describe("The category name to list components from"),
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

  // ===========================================================================
  // TOOL: read_component
  // ===========================================================================
  server.tool(
    "read_component",
    "Read a component's full source. Trigger on 'read/open/show/get <component> from <category>' or similar. Returns code, category, dependencies, and creation date.",
    {
      category: z.string().describe("The category name the component belongs to"),
      title: z.string().describe("The title/name of the component to read"),
    },
    async ({ category, title }) => {
      try {
        const categoryName = await fuzzyFindCategory(category.trim());
        
        if (!categoryName) {
          return { 
            content: [{ 
              type: "text", 
              text: `❌ **Category "${category}" not found**\n\n💡 *Try "list categories" to see available options*` 
            }] 
          };
        }

        // Try exact match
        let component = await getComponent(categoryName, title.trim());
        
        // Try fuzzy match if exact fails
        if (!component) {
          const categoryComponents = await getComponentsByCategory(categoryName);
          if (categoryComponents) {
            const normalized = normalizeText(title);
            const fuzzyMatch = categoryComponents.find(c => 
              normalizeText(c.title).includes(normalized) ||
              normalized.includes(normalizeText(c.title))
            );
            if (fuzzyMatch) {
              component = await getComponent(categoryName, fuzzyMatch.title);
            }
          }
        }

        if (!component) {
          const categoryComponents = await getComponentsByCategory(categoryName);
          const suggestions = categoryComponents?.slice(0, 5).map(c => `"${c.title}"`).join(", ");
          return { 
            content: [{ 
              type: "text", 
              text: `❌ **Component "${title}" not found in "${categoryName}"**\n\nAvailable: ${suggestions || "none"}` 
            }] 
          };
        }

        return { 
          content: [{ type: "text", text: formatComponentDetail(component, categoryName) }] 
        };
      } catch (err) {
        return { content: [{ type: "text", text: `❌ **Error:** ${err.message}` }] };
      }
    }
  );

  return server;
}
