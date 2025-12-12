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

/**
 * Makes authenticated API requests to the Composter backend
 */
async function api(path, options = {}) {
  const token = getAuthToken();
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });

  return response;
}

// ============================================================================
// DATA FETCHERS
// ============================================================================

async function getAllCategories() {
  const res = await api("/categories");
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const data = await res.json();
  return data.categories || [];
}

async function getAllComponents() {
  const res = await api("/components/list");
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const data = await res.json();
  return data.components || [];
}

async function getComponentsByCategory(categoryName) {
  const res = await api(`/components/list-by-category?category=${encodeURIComponent(categoryName)}`);
  if (res.status === 404) return null; // Category not found
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const data = await res.json();
  return data.components || [];
}

async function getComponent(category, title) {
  const res = await api(`/components?category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const data = await res.json();
  return data.component;
}

async function searchComponents(query) {
  const res = await api(`/components/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const data = await res.json();
  return data.components || [];
}

async function getErrorMessage(res) {
  try {
    const data = await res.json();
    return data.message || data.error || res.statusText;
  } catch {
    return res.statusText;
  }
}

// ============================================================================
// FORMATTERS - Beautiful output for chat interfaces
// ============================================================================

function formatCategoriesList(categories) {
  if (!categories.length) {
    return `📁 **No categories found**

Your vault is empty! Get started by creating a category:

\`\`\`bash
composter mkcat buttons
\`\`\`

Then push your first component:

\`\`\`bash
composter push buttons "MyButton" ./src/components/Button.jsx
\`\`\``;
  }

  const list = categories.map(c => `  • **${c.name}**`).join("\n");
  return `📁 **Your Categories** (${categories.length})

${list}

💡 *Ask me to "show components in [category]" to explore further*`;
}

function formatComponentsList(components, categoryName = null) {
  if (!components.length) {
    const context = categoryName ? ` in "${categoryName}"` : "";
    return `📦 **No components found${context}**

Push components using the CLI:

\`\`\`bash
composter push ${categoryName || "category"} "ComponentName" ./path/to/component.jsx
\`\`\``;
  }

  const header = categoryName 
    ? `📦 **Components in "${categoryName}"** (${components.length})`
    : `📦 **All Components** (${components.length})`;

  const list = components.map(c => {
    const category = c.category?.name || "uncategorized";
    const date = new Date(c.createdAt).toLocaleDateString();
    const deps = getDepsCount(c);
    const depsLabel = deps > 0 ? ` · ${deps} deps` : "";
    
    return categoryName
      ? `  • **${c.title}** — ${date}${depsLabel}`
      : `  • **${c.title}** *(${category})* — ${date}${depsLabel}`;
  }).join("\n");

  return `${header}

${list}

💡 *Ask me to "read [component] from [category]" to see the code*`;
}

function formatComponentDetail(component, categoryName) {
  if (!component) {
    return `❌ **Component not found**

Try searching: *"find [keyword]"*`;
  }

  // Parse multi-file or single-file code
  let codeBlocks = "";
  try {
    const files = JSON.parse(component.code);
    codeBlocks = Object.entries(files)
      .map(([filePath, content]) => {
        const lang = getLanguageFromPath(filePath);
        return `### 📄 \`${filePath}\`

\`\`\`${lang}
${content}
\`\`\``;
      })
      .join("\n\n");
  } catch {
    // Single file component
    codeBlocks = `\`\`\`tsx
${component.code}
\`\`\``;
  }

  // Format dependencies
  let depsSection = "";
  if (component.dependencies && Object.keys(component.dependencies).length > 0) {
    const deps = Object.entries(component.dependencies)
      .map(([pkg, ver]) => `  • \`${pkg}\`: ${ver}`)
      .join("\n");
    
    const installCmd = Object.keys(component.dependencies).join(" ");
    depsSection = `
---

### 📦 Dependencies

${deps}

**Install command:**
\`\`\`bash
npm install ${installCmd}
\`\`\`
`;
  }

  const createdDate = new Date(component.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return `# ${component.title}

| Property | Value |
|----------|-------|
| **Category** | ${categoryName} |
| **Created** | ${createdDate} |

---

## Source Code

${codeBlocks}
${depsSection}
---

💡 *Pull this component:* \`composter pull ${categoryName} "${component.title}" ./components/\``;
}

function formatSearchResults(components, query) {
  if (!components.length) {
    return `🔍 **No results for "${query}"**

Try:
  • Different keywords
  • *"list categories"* to see what's available
  • *"show all components"* to browse everything`;
  }

  const results = components.slice(0, 10).map(c => {
    const category = c.category?.name || "uncategorized";
    return `  • **${c.title}** in *${category}*`;
  }).join("\n");

  const moreNote = components.length > 10 
    ? `\n\n*...and ${components.length - 10} more results*` 
    : "";

  return `🔍 **Search results for "${query}"** (${components.length})

${results}${moreNote}

💡 *Ask me to "read [component] from [category]" to see the full code*`;
}

// ============================================================================
// HELPERS
// ============================================================================

function getDepsCount(component) {
  if (!component.dependencies) return 0;
  try {
    const deps = typeof component.dependencies === "string"
      ? JSON.parse(component.dependencies)
      : component.dependencies;
    return Object.keys(deps).length;
  } catch {
    return 0;
  }
}

function getLanguageFromPath(filePath) {
  const ext = filePath.split(".").pop()?.toLowerCase();
  const langMap = {
    tsx: "tsx",
    ts: "typescript",
    jsx: "jsx", 
    js: "javascript",
    css: "css",
    scss: "scss",
    json: "json",
    md: "markdown"
  };
  return langMap[ext] || "tsx";
}

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

/**
 * Intelligent query parser that understands natural language requests
 * and routes them to the appropriate handler
 */
async function processNaturalQuery(query) {
  const q = normalizeText(query);
  
  // -------------------------------------------------------------------------
  // PATTERN: List all categories
  // "list categories", "show my categories", "what categories do i have"
  // -------------------------------------------------------------------------
  if (
    /\b(list|show|get|what|my)\b.*\bcategor(y|ies)\b/.test(q) ||
    /\bcategor(y|ies)\b.*\b(list|show|have)\b/.test(q) ||
    q === "categories"
  ) {
    const categories = await getAllCategories();
    return formatCategoriesList(categories);
  }

  // -------------------------------------------------------------------------
  // PATTERN: List all components
  // "show all components", "list everything", "what components do i have"
  // -------------------------------------------------------------------------
  if (
    /\b(all|every)\b.*\bcomponent/.test(q) ||
    /\bcomponent.*\b(all|every|have)\b/.test(q) ||
    /\blist\s+(everything|all)\b/.test(q) ||
    /\bshow\s+(everything|all)\b/.test(q) ||
    q === "components" ||
    q === "all"
  ) {
    const components = await getAllComponents();
    return formatComponentsList(components);
  }

  // -------------------------------------------------------------------------
  // PATTERN: List components in a specific category
  // "show components in buttons", "what's in ui", "list items in forms"
  // -------------------------------------------------------------------------
  const categoryListPatterns = [
    /(?:show|list|get|what'?s?)\s+(?:components?|items?)?\s*(?:in|from|under)\s+['"]?([a-z0-9_-]+)['"]?/i,
    /(?:in|from)\s+['"]?([a-z0-9_-]+)['"]?\s+(?:category|folder)/i,
    /['"]?([a-z0-9_-]+)['"]?\s+(?:components?|category)/i,
  ];

  for (const pattern of categoryListPatterns) {
    const match = q.match(pattern);
    if (match) {
      const categoryInput = match[1];
      const categoryName = await fuzzyFindCategory(categoryInput);
      
      if (!categoryName) {
        const categories = await getAllCategories();
        const suggestions = categories.slice(0, 5).map(c => `"${c.name}"`).join(", ");
        return `❌ **Category "${categoryInput}" not found**

Available categories: ${suggestions || "none"}

💡 *Try "list categories" to see all available categories*`;
      }

      const components = await getComponentsByCategory(categoryName);
      if (components === null) {
        return `❌ **Category "${categoryName}" not found**`;
      }
      return formatComponentsList(components, categoryName);
    }
  }

  // -------------------------------------------------------------------------
  // PATTERN: Read/show a specific component
  // "read Button from ui", "show me the Card component", "get LoginForm from auth"
  // -------------------------------------------------------------------------
  const readPatterns = [
    // "read X from Y", "get X from Y", "show X from Y"
    /(?:read|show|get|open|fetch|view|display)\s+['"]?(.+?)['"]?\s+(?:from|in)\s+['"]?([a-z0-9_-]+)['"]?/i,
    // "X component from Y"
    /['"]?(.+?)['"]?\s+(?:component\s+)?(?:from|in)\s+['"]?([a-z0-9_-]+)['"]?/i,
  ];

  for (const pattern of readPatterns) {
    const match = query.match(pattern);
    if (match) {
      const titleInput = match[1].trim().replace(/^(the|a|my)\s+/i, "").replace(/\s+component$/i, "");
      const categoryInput = match[2].trim();

      const categoryName = await fuzzyFindCategory(categoryInput);
      if (!categoryName) {
        return `❌ **Category "${categoryInput}" not found**

💡 *Try "list categories" to see available categories*`;
      }

      // Try exact match first
      let component = await getComponent(categoryName, titleInput);
      
      // If not found, try fuzzy match within the category
      if (!component) {
        const categoryComponents = await getComponentsByCategory(categoryName);
        if (categoryComponents) {
          const normalized = normalizeText(titleInput);
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
        return `❌ **Component "${titleInput}" not found in "${categoryName}"**

Available in ${categoryName}: ${suggestions || "no components"}

💡 *Try "show components in ${categoryName}" to see all*`;
      }

      return formatComponentDetail(component, categoryName);
    }
  }

  // -------------------------------------------------------------------------
  // PATTERN: Read component (without category specified)
  // "show me the Button component", "get Card", "read LoginForm"
  // -------------------------------------------------------------------------
  const simpleReadPatterns = [
    /(?:read|show|get|open|fetch|view|display)\s+(?:me\s+)?(?:the\s+)?['"]?(.+?)['"]?(?:\s+component)?$/i,
    /^['"]?(.+?)['"]?\s+(?:code|source|component)$/i,
  ];

  for (const pattern of simpleReadPatterns) {
    const match = query.match(pattern);
    if (match) {
      const titleInput = match[1].trim();
      
      // Skip if it looks like a different command
      if (/^(all|my|the|in|from|categories?|components?)$/i.test(titleInput)) continue;

      const foundComponent = await fuzzyFindComponent(titleInput);
      
      if (foundComponent) {
        const categoryName = foundComponent.category?.name;
        const component = await getComponent(categoryName, foundComponent.title);
        return formatComponentDetail(component, categoryName);
      }

      // Not found - search and suggest
      const searchResults = await searchComponents(titleInput);
      if (searchResults.length > 0) {
        const suggestions = searchResults.slice(0, 5).map(c => 
          `  • **${c.title}** in *${c.category?.name}*`
        ).join("\n");
        return `❓ **Did you mean one of these?**

${suggestions}

💡 *Be more specific: "read [component] from [category]"*`;
      }

      return `❌ **Component "${titleInput}" not found**

💡 *Try "list all components" or "search [keyword]"*`;
    }
  }

  // -------------------------------------------------------------------------
  // PATTERN: Search
  // "find buttons", "search for cards", "look up forms"
  // -------------------------------------------------------------------------
  const searchPatterns = [
    /(?:search|find|look\s*up|look\s*for)\s+(?:for\s+)?['"]?(.+?)['"]?$/i,
    /^['"]?(.+?)['"]?\s+(?:search|find)$/i,
  ];

  for (const pattern of searchPatterns) {
    const match = query.match(pattern);
    if (match) {
      const searchQuery = match[1].trim();
      const results = await searchComponents(searchQuery);
      return formatSearchResults(results, searchQuery);
    }
  }

  // -------------------------------------------------------------------------
  // PATTERN: Help
  // "help", "what can you do", "how do i use this"
  // -------------------------------------------------------------------------
  if (/\b(help|usage|how|what can)\b/.test(q)) {
    return `# 🧩 Composter - Your Component Vault

I can help you manage your React component library. Here's what you can ask:

## 📁 Categories
  • *"list categories"* — See all your categories
  • *"show components in [category]"* — Browse a category

## 📦 Components  
  • *"show all components"* — List everything
  • *"read [component] from [category]"* — Get full source code
  • *"find [keyword]"* — Search your vault

## 💡 Examples
  • "What categories do I have?"
  • "Show me components in ui"
  • "Read Button from buttons"
  • "Find form components"

---

**CLI Commands:**
\`\`\`bash
composter login          # Authenticate
composter ls             # List categories  
composter push ui "Card" ./Card.jsx
composter pull ui "Card" ./components/
\`\`\``;
  }

  // -------------------------------------------------------------------------
  // FALLBACK: Treat as search query
  // -------------------------------------------------------------------------
  const results = await searchComponents(query);
  if (results.length > 0) {
    return formatSearchResults(results, query);
  }

  // Nothing found - provide guidance
  const categories = await getAllCategories();
  const categoryList = categories.slice(0, 5).map(c => `"${c.name}"`).join(", ");
  
  return `🤔 **I'm not sure what you're looking for**

I couldn't find anything matching "${query}".

**Try asking:**
  • "list categories"
  • "show all components"
  • "find [keyword]"
${categoryList ? `\n**Your categories:** ${categoryList}` : ""}

💡 *Type "help" for more guidance*`;
}

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
