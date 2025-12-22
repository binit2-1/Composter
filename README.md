<p align="center">
  <img src="frontend/public/composter_logo.png" alt="Composter Logo" width="120" height="120">
</p>

<h1 align="center">Composter</h1>

<p align="center">
  <strong>Your Personal Vault for React Components</strong>
</p>

<p align="center">
  Upload, organize, and retrieve your components instantly with CLI, Dashboard, and MCP integration.
</p>

<p align="center">
  <a href="https://github.com/binit2-1/Composter/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License">
  </a>
  <a href="https://www.npmjs.com/package/composter-cli">
    <img src="https://img.shields.io/npm/v/composter-cli.svg" alt="npm version">
  </a>
  <a href="https://github.com/binit2-1/Composter/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/binit2-1/Composter/ci.yml?branch=main" alt="CI Status">
  </a>
  <a href="https://github.com/binit2-1/Composter/issues">
    <img src="https://img.shields.io/github/issues/binit2-1/Composter.svg" alt="Issues">
  </a>
  <a href="https://github.com/binit2-1/Composter/stargazers">
    <img src="https://img.shields.io/github/stars/binit2-1/Composter.svg?style=social" alt="GitHub stars">
  </a>
</p>

---

![Composter Landing Page](docs/screenshots/landing-page.png)

## ✨ Features

- **🗃️ Component Vault** — Store and organize your React components in categories
- **⚡ CLI Tool** — Push, pull, and manage components directly from your terminal
- **🎨 Web Dashboard** — Visual interface to browse, preview, and manage your library
- **🔌 MCP Compatible** — Works with Claude, Cursor, GitHub Copilot, and other AI assistants
- **🔐 Secure Auth** — Better Auth integration with JWT-based authentication
- **📦 Live Preview** — Sandpack-powered component previews with Tailwind CSS support
- **📋 One-Click Copy** — Copy component code or CLI commands instantly

## 🔗 Links

- Web App: [composter.vercel.app](https://composter.vercel.app)
- CLI npm: [npmjs.com/package/composter-cli](https://www.npmjs.com/package/composter-cli)
- MCP npm: [npmjs.com/package/composter-mcp](https://www.npmjs.com/package/composter-mcp)
- GitHub: [github.com/binit2-1/Composter](https://github.com/binit2-1/Composter)
 - Wiki: [DeepWiki - Composter](https://deepwiki.com/binit2-1/Composter)

## 🚀 Quick Start

### For Users (No Setup Required)

1. **Install the CLI:**
   ```bash
   npm install -g composter-cli
   ```

2. **Login and start using:**
   ```bash
   composter login
   composter mkcat my-category
   composter push my-category "MyComponent" ./component.jsx
   ```

3. **Access the web dashboard:**
   - Visit [composter.vercel.app](https://composter.vercel.app)

### For Contributors

Want to contribute or run locally? See [CONTRIBUTING.md](CONTRIBUTING.md) for full setup instructions.

## 📖 Usage

### CLI Commands

```bash
# Login to your account
composter login

# Create a category
composter mkcat buttons

# List all categories
composter ls

# Push a component
composter push buttons "PrimaryButton" ./src/components/Button.jsx

# Pull a component
composter pull buttons "PrimaryButton" ./components/
```


![CLI Usage](docs/screenshots/cli-usage.gif)

### Web Dashboard

Access the dashboard at [composter.vercel.app](https://composter.vercel.app)

![Dashboard](docs/screenshots/dashboard.png)

#### Dashboard Features

- **Browse Components** — View all saved components organized by category
- **Live Preview** — See components rendered in real-time
- **Code View** — Inspect source code with syntax highlighting
- **Copy Commands** — One-click copy for npm install and CLI commands

![Component Detail](docs/screenshots/component-detail.png)

## 🤖 MCP Integration

Composter includes a Model Context Protocol (MCP) server that enables AI assistants to interact with your component vault.

### Supported AI Tools

| Tool | Status |
|------|--------|
| Claude Desktop | ✅ Supported |
| Cursor | ✅ Supported |
| GitHub Copilot | ✅ Supported |
| VS Code + MCP Extensions | ✅ Supported |
| Windsurf | ✅ Supported |

### Setup

1. **Login via CLI first:**
   ```bash
   composter login
   ```

2. **Auto-Configure (Recommended):**
   ```bash
   # For Claude Desktop
   npx composter-mcp init claude

   # For Cursor
   npx composter-mcp init cursor

   # For VS Code (Copilot)
   npx composter-mcp init vscode

   # For Windsurf
   npx composter-mcp init windsurf
   ```

3. **Restart your AI assistant**

### Manual Configuration

If you prefer manual setup, add to your IDE's MCP config file:

```json
{
  "mcpServers": {
    "composter": {
      "command": "npx",
      "args": ["composter-mcp"]
    }
  }
}
```

**Config file locations:**
- **Claude Desktop (macOS):** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Claude Desktop (Linux):** `~/.config/claude/claude_desktop_config.json`
- **Claude Desktop (Windows):** `%APPDATA%\Claude\claude_desktop_config.json`
- **Cursor:** `.cursor/mcp.json` (in project root)
- **VS Code:** `.vscode/mcp.json` (in project root)
- **Windsurf:** `~/.codeium/windsurf/mcp_config.json`

### MCP Tools

| Tool | Description |
|------|-------------|
| `search_components` | Search components by name or category |
| `list_categories` | List all categories in your vault |
| `list_components` | List all components in a category |
| `read_component` | Read the full source code of a component |

For detailed MCP documentation, see [mcp/README.md](mcp/README.md).

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup instructions, development guidelines, and how to submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Better Auth](https://better-auth.com/) — Authentication framework
- [Prisma](https://prisma.io/) — Database ORM
- [Sandpack](https://sandpack.codesandbox.io/) — Live code preview
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Model Context Protocol](https://modelcontextprotocol.io/) — AI integration
- [@lobehub/icons](https://github.com/lobehub/lobe-icons) — Beautiful icons

## 🌟 Community

- **Discussions:** [Ask questions and share ideas](https://github.com/binit2-1/Composter/discussions)
- **Issues:** [Report bugs or request features](https://github.com/binit2-1/Composter/issues)
- **Contributing:** [Read our contribution guide](CONTRIBUTING.md)
- **Security:** [Report vulnerabilities](SECURITY.md)

### Contributors

Thanks to all our contributors! 🎉

<a href="https://github.com/binit2-1/Composter/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=binit2-1/Composter&max=500&anon=1" />
</a>

---


