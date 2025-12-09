#!/usr/bin/env node
import fs from "fs";
import path from "path";
import os from "os";

// Client configuration templates
const CLIENT_CONFIGS = {
  claude: {
    name: "Claude Desktop",
    configPath: () => {
      if (process.platform === "darwin") {
        return path.join(os.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
      } else if (process.platform === "win32") {
        return path.join(process.env.APPDATA, "Claude", "claude_desktop_config.json");
      } else {
        return path.join(os.homedir(), ".config", "claude", "claude_desktop_config.json");
      }
    },
    generateConfig: () => ({
      mcpServers: {
        composter: {
          command: "npx",
          args: ["composter-mcp"],
        },
      },
    }),
    mergeKey: "mcpServers",
  },
  cursor: {
    name: "Cursor",
    configPath: () => path.join(process.cwd(), ".cursor", "mcp.json"),
    generateConfig: () => ({
      mcpServers: {
        composter: {
          command: "npx",
          args: ["composter-mcp"],
        },
      },
    }),
    mergeKey: "mcpServers",
  },
  vscode: {
    name: "VS Code (Copilot)",
    configPath: () => path.join(process.cwd(), ".vscode", "mcp.json"),
    generateConfig: () => ({
      mcpServers: {
        composter: {
          command: "npx",
          args: ["composter-mcp"],
        },
      },
    }),
    mergeKey: "mcpServers",
  },
  windsurf: {
    name: "Windsurf",
    configPath: () => {
      if (process.platform === "darwin") {
        return path.join(os.homedir(), ".codeium", "windsurf", "mcp_config.json");
      } else if (process.platform === "win32") {
        return path.join(process.env.APPDATA, "Codeium", "windsurf", "mcp_config.json");
      } else {
        return path.join(os.homedir(), ".codeium", "windsurf", "mcp_config.json");
      }
    },
    generateConfig: () => ({
      mcpServers: {
        composter: {
          command: "npx",
          args: ["composter-mcp"],
        },
      },
    }),
    mergeKey: "mcpServers",
  },
};

function printUsage() {
  console.log(`
🤖 Composter MCP - Setup Tool

Usage:
  npx composter-mcp init <client>

Supported clients:
  claude    - Claude Desktop
  cursor    - Cursor IDE
  vscode    - VS Code with Copilot
  windsurf  - Windsurf IDE

Examples:
  npx composter-mcp init claude
  npx composter-mcp init cursor
`);
}

function initClient(clientName) {
  const client = CLIENT_CONFIGS[clientName?.toLowerCase()];
  
  if (!client) {
    console.log(`❌ Unknown client: ${clientName}`);
    console.log(`\nSupported clients: ${Object.keys(CLIENT_CONFIGS).join(", ")}`);
    process.exit(1);
  }

  const configPath = client.configPath();
  const configDir = path.dirname(configPath);

  console.log(`\n🔧 Setting up Composter MCP for ${client.name}...\n`);

  // Read existing config if it exists
  let existingConfig = {};
  if (fs.existsSync(configPath)) {
    try {
      existingConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      console.log(`📄 Found existing config at: ${configPath}`);
    } catch {
      console.log(`⚠️  Existing config is invalid JSON, will create new one.`);
    }
  }

  // Generate new config
  const newConfig = client.generateConfig();

  // Merge configs
  let mergedConfig;
  if (client.mergeKey) {
    mergedConfig = {
      ...existingConfig,
      [client.mergeKey]: {
        ...existingConfig[client.mergeKey],
        ...newConfig[client.mergeKey],
      },
    };
  } else {
    // Direct merge at root (e.g., Cursor)
    mergedConfig = {
      ...existingConfig,
      ...newConfig,
    };
  }

  // Create directory if needed
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
    console.log(`📁 Created directory: ${configDir}`);
  }

  // Write config
  fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2), "utf-8");
  console.log(`✅ Config written to: ${configPath}`);

  // Print success message
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                     🎉 Setup Complete!                            ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Composter MCP has been configured for ${client.name.padEnd(24)}  ║
║                                                                   ║
║  Next steps:                                                      ║
║  1. Make sure you're logged in: composter login                   ║
║  2. Restart ${client.name.padEnd(47)}  ║
║  3. Look for "Composter" in your MCP tools                        ║
║                                                                   ║
║  Available tools:                                                 ║
║  • search_components - Search your component vault                ║
║  • list_categories   - List all your categories                   ║
║  • list_components   - List components in a category              ║
║  • read_component    - Read full source code                      ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`);
}

// Main
const args = process.argv.slice(2);
const command = args[0];
const clientArg = args[1];

if (command === "init") {
  if (!clientArg) {
    console.log("❌ Please specify a client to configure.");
    printUsage();
    process.exit(1);
  }
  initClient(clientArg);
} else if (command === "--help" || command === "-h" || !command) {
  printUsage();
} else {
  console.log(`❌ Unknown command: ${command}`);
  printUsage();
  process.exit(1);
}

