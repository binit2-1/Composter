/**
 * Documentation Content Configuration
 * 
 * This file contains all documentation content in an easily editable format.
 * To add new sections:
 * 1. Add a new entry to the appropriate category in `sidebarNav`
 * 2. Add corresponding content in `docsContent` with matching id
 * 
 * Content types:
 * - text: Simple paragraph text
 * - code: Code block with syntax highlighting
 * - list: Bullet or numbered list
 * - cards: Grid of info cards
 * - steps: Numbered steps with optional code
 */

// Sidebar navigation structure
export const sidebarNav = [
  {
    title: "Get Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start" },
    ],
  },
  {
    title: "CLI",
    items: [
      { id: "cli-login", label: "Login" },
      { id: "cli-push", label: "Push Components" },
      { id: "cli-pull", label: "Pull Components" },
      { id: "cli-list", label: "List Components" },
    ],
  },
  {
    title: "Dashboard",
    items: [
      { id: "dashboard-overview", label: "Overview" },
      { id: "dashboard-upload", label: "Upload Components" },
    ],
  },
  {
    title: "MCP",
    items: [
      { id: "mcp-overview", label: "Overview" },
      { id: "mcp-setup", label: "Setup" },
      { id: "mcp-tools", label: "Available Tools" },
    ],
  },
];

// Documentation content - easily editable
export const docsContent = {
  // ============================================
  // GET STARTED SECTION
  // ============================================
  
  introduction: {
    title: "Introduction",
    description: `Composter is your personal vault for storing and retrieving reusable React components. 
Save components once, then pull them into any project using the CLI or web dashboard.`,
    cards: [
      {
        title: "CLI Tool",
        description: "Push, pull, and manage components directly from your terminal with simple commands.",
      },
      {
        title: "Web Dashboard",
        description: "Visual interface to browse, upload, and organize your component library.",
      },
    ],
  },

  installation: {
    title: "Installation",
    description: "Using components is very straightforward, anyone can do it.",
    methodDescription: "You can keep it simple and copy code directly from the dashboard, or you can use CLI commands to install components into your project.",
    methodNote: "Click the cards below to change your preferred method.",
    steps: {
      cli: [
        {
          title: "Install the CLI",
          description: "Install the Composter CLI globally to get started.",
          code: "npm install -g composter-cli",
        },
        {
          title: "Login to your account",
          description: "Authenticate with your Composter account.",
          code: "composter login",
        },
        {
          title: "Pull components",
          description: "Pull any component from your vault into your current project.",
          code: "composter pull <CATEGORY_NAME> <COMPONENT_NAME> <PATH_TO_IMPORT>",
        },
      ],
      manual: [
        {
          title: "Browse components",
          description: "Navigate to the dashboard and find a component you want to use.",
        },
        {
          title: "Copy the code",
          description: "Click on the component to view its code, then copy it to your project.",
        },
        {
          title: "Install dependencies",
          description: "Check if the component has any dependencies and install them.",
        },
      ],
    },
  },

  "quick-start": {
    title: "Quick Start",
    description: "Get up and running with Composter in under 2 minutes.",
    steps: [
      {
        title: "Create a category",
        description: "Categories help you organize related components together.",
        code: "composter mkcat <CATEGORY_NAME>",
      },
      {
        title: "Push your first component",
        description: "Upload a component file to your vault.",
        code: "composter push <CATEGORY_NAME> <COMPONENT_NAME> <FILE_PATH_TO_COMPONENT>",
      },
      {
        title: "Pull into another project",
        description: "Download the component into your current working directory.",
        code: "composter pull <CATEGORY_NAME> <COMPONENT_NAME> <PATH_TO_IMPORT>",
      },
    ],
  },

  // ============================================
  // CLI SECTION
  // ============================================

  "cli-login": {
    title: "Login",
    description: "Authenticate with your Composter account to access your component vault.",
    code: "composter login",
    note: "You'll be prompted to enter your email and password. Your session token is stored locally for future commands.",
    links: [
      { label: "CLI: https://www.npmjs.com/package/composter-cli", href: "https://www.npmjs.com/package/composter-cli" },
    ],
  },

  "cli-push": {
    title: "Push Components",
    description: "Upload components to your vault for later use.",
    code: `composter push <category> <file-path>

# Example
composter push buttons ./src/Button.jsx
composter push cards ./src/ProfileCard.tsx`,
    args: [
      { name: "category", description: "The category to store the component in" },
      { name: "file-path", description: "Path to your component file" },
    ],
  },

  "cli-pull": {
    title: "Pull Components",
    description: "Download components from your vault into your project.",
    code: `composter pull <category> <component-name>

# Example
composter pull buttons PrimaryButton`,
    note: "Components are downloaded to a `composter/` folder in your current directory.",
  },

  "cli-list": {
    title: "List Components",
    description: "View all components in a category.",
    code: `composter list <category>

# Example
composter list buttons`,
  },

  // ============================================
  // DASHBOARD SECTION
  // ============================================

  "dashboard-overview": {
    title: "Dashboard Overview",
    description: "The web dashboard provides a visual interface to manage your component library without using the command line.",
    features: [
      { title: "Browse Components", description: "View all your stored components organized by category." },
      { title: "Live Preview", description: "See components rendered in real-time with Sandpack." },
      { title: "Code View", description: "Inspect and copy component source code directly." },
      { title: "Search", description: "Quickly find components across all categories." },
    ],
  },

  "dashboard-upload": {
    title: "Upload Components",
    description: "Add new components to your vault through the web interface with full file structure support.",
    steps: [
      "Enter a component name and select or create a category",
      "Add files to your component (supports multiple files for complex components)",
      "Write or paste code for each file - double-click file names to rename them",
      "Add npm dependencies your component requires (e.g., framer-motion@10.0.0)",
      "Click \"Upload Component\" to save to your vault",
    ],
    features: [
      { title: "Multi-file Support", description: "Organize components with multiple files like Component.jsx, styles.css, utils.js" },
      { title: "Dependency Management", description: "Specify npm packages with versions that your component needs" },
      { title: "Category Organization", description: "Group related components into categories or create new ones on the fly" },
    ],
  },

  // ============================================
  // MCP SECTION
  // ============================================

  "mcp-overview": {
    title: "MCP Overview",
    description: "The Model Context Protocol (MCP) enables AI assistants like Claude, Cursor, and GitHub Copilot to interact with your Composter component vault directly.",
    features: [
      { title: "Search Components", description: "AI can search through your saved components by name or category." },
      { title: "Read Source Code", description: "AI can read the full source code of any component in your vault." },
      { title: "User Scoped", description: "All operations are securely scoped to your authenticated account." },
      { title: "Real-time Access", description: "Your AI assistant always has access to your latest components." },
    ],
  },

  "mcp-setup": {
    title: "MCP Setup",
    description: "Configure your AI assistant to connect with Composter MCP server.",
    steps: [
      {
        title: "Login via CLI",
        description: "First, authenticate with your Composter account using the CLI.",
        code: "composter login",
      },
      {
        title: "Auto-Configure (Recommended)",
        description: "Use the init command to automatically set up MCP for your AI tool.",
        code: `# For Claude Desktop
npx composter-mcp init claude

# For Cursor
npx composter-mcp init cursor

# For VS Code (Copilot)
npx composter-mcp init vscode

# For Windsurf
npx composter-mcp init windsurf`,
      },
      {
        title: "Restart Your AI Assistant",
        description: "Close and reopen your AI assistant to apply the configuration.",
      },
      {
        title: "Docs & Packages",
        description: "Refer to the npm package pages for MCP usage.",
        links: [
          { label: "MCP: https://www.npmjs.com/package/composter-mcp", href: "https://www.npmjs.com/package/composter-mcp" },
        ],
      },
    ],
    configs: [
      {
        title: "Claude Desktop",
        path: "~/.config/claude/claude_desktop_config.json (Linux) or ~/Library/Application Support/Claude/ (macOS)",
        code: `{
  "mcpServers": {
    "composter": {
      "command": "npx",
      "args": ["composter-mcp"]
    }
  }
}`,
      },
      {
        title: "Cursor",
        path: ".cursor/mcp.json (in project root)",
        code: `{
  "mcpServers": {
    "composter": {
      "command": "npx",
      "args": ["composter-mcp"]
    }
  }
}`,
      },
      {
        title: "VS Code (Copilot)",
        path: ".vscode/mcp.json (in project root)",
        code: `{
  "mcpServers": {
    "composter": {
      "command": "npx",
      "args": ["composter-mcp"]
    }
  }
}`,
      },
      {
        title: "Windsurf",
        path: "~/.codeium/windsurf/mcp_config.json",
        code: `{
  "mcpServers": {
    "composter": {
      "command": "npx",
      "args": ["composter-mcp"]
    }
  }
}`,
      },
    ],
  },

  "mcp-tools": {
    title: "Available Tools",
    description: "The Composter MCP server exposes the following tools for AI assistants.",
    tools: [
      {
        name: "search_components",
        description: "Search for React components by title or category name. Returns a list of matching components with their IDs and categories.",
        params: [
          { name: "query", type: "string", description: "Search term for component title or category name" },
        ],
        example: `Found the following components:
- [ID: abc123] Button (Category: UI)
- [ID: def456] ButtonGroup (Category: UI)`,
      },
      {
        name: "list_categories",
        description: "List all categories in your component vault.",
        params: [],
        example: `Your categories:
- ui (5 components)
- hooks (3 components)
- layouts (2 components)`,
      },
      {
        name: "list_components",
        description: "List all components in a specific category.",
        params: [
          { name: "categoryName", type: "string", description: "The name of the category" },
        ],
        example: `Components in "ui":
- Button
- Card
- Modal
- Dropdown
- Toast`,
      },
      {
        name: "read_component",
        description: "Read the full source code of a specific React component by its name. Returns the component code, category, and creation date.",
        params: [
          { name: "componentName", type: "string", description: "The name of the component to read" },
        ],
        example: `Filename: Button.jsx
Category: UI
Created: 2024-01-15T10:30:00.000Z

\`\`\`javascript
export const Button = ({ children }) => {
  return <button>{children}</button>;
};
\`\`\``,
      },
    ],
  },
};

// CTA section at the bottom
export const ctaSection = {
  title: "Ready to get started?",
  description: "Create an account and start building your personal component library.",
  buttons: [
    { label: "Create Account", href: "/signup", variant: "primary" },
    { label: "Go to Dashboard", href: "/app", variant: "outline" },
  ],
};

