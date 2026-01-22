import {
  normalizeText,
  fuzzyFindCategory,
  fuzzyFindComponent
} from "./fuzzy";
import {
  getAllCategories,
  getAllComponents,
  getComponentsByCategory,
  getComponent,
  searchComponents,
} from "../services/catalog";
import {
  formatCategoriesList,
  formatComponentsList,
  formatComponentDetail,
  formatSearchResults,
} from "./formatting"
import {
  categoryListPatterns,
  readPatterns,
  simpleReadPatterns,
  searchPatterns,
} from "./regexPatterns"

/**
 * Intelligent query parser that understands natural language requests
 * and routes them to the appropriate handler
 */
export async function processNaturalQuery(query) {
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