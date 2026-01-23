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

export {
    formatCategoriesList,
    formatComponentsList,
    formatComponentDetail,
    formatSearchResults,
}