<p align="center">
  <img src="frontend/public/logo.png" alt="Composter Logo" width="120" height="120">
</p>

<h1 align="center">Composter</h1>

<p align="center">
  <strong>Your Personal Vault for React Components</strong>
</p>

<p align="center">
  Upload, organize, and retrieve your components instantly with CLI, Dashboard, and MCP integration.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#mcp-integration">MCP Integration</a> •
  <a href="#contributing">Contributing</a>
</p>

---

<!-- SCREENSHOT: Landing Page -->
<!-- 
📸 ADD SCREENSHOT HERE:
1. Take a screenshot of the landing page (full hero section with CLI gif)
2. Save as: docs/screenshots/landing-page.png
3. Uncomment the line below:
-->
<!-- ![Composter Landing Page](docs/screenshots/landing-page.png) -->

## ✨ Features

- **🗃️ Component Vault** — Store and organize your React components in categories
- **⚡ CLI Tool** — Push, pull, and manage components directly from your terminal
- **🎨 Web Dashboard** — Visual interface to browse, preview, and manage your library
- **🔌 MCP Compatible** — Works with Claude, Cursor, GitHub Copilot, and other AI assistants
- **🔐 Secure Auth** — Better Auth integration with JWT-based authentication
- **📦 Live Preview** — Sandpack-powered component previews with Tailwind CSS support
- **📋 One-Click Copy** — Copy component code or CLI commands instantly

## 🏗️ Architecture

```
Composter/
├── backend/          # Express.js API server
│   ├── auth/         # Better Auth configuration
│   ├── controllers/  # Route handlers
│   ├── prisma/       # Database schema & client
│   └── routes/       # API routes
├── cli/              # Command-line interface
│   └── src/
│       └── commands/ # CLI commands (login, push, pull, etc.)
├── frontend/         # React + Vite dashboard
│   └── src/
│       ├── components/
│       └── pages/
└── mcp/              # Model Context Protocol server
    ├── lib/          # Auth & tool definitions
    └── src/          # MCP entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/binit2-1/Composter.git
cd Composter

# Install all dependencies
cd backend && npm install
cd ../cli && npm install
cd ../frontend && npm install
cd ../mcp && npm install
```

### 2. Configure Environment

Create `.env` files in each directory:

**backend/.env**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/composter"
CLIENT_URL="http://localhost:5173"
BETTER_AUTH_SECRET="your-secret-key"
```

**frontend/.env**
```env
VITE_API_URL="http://localhost:3000"
```

**mcp/.env**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/composter"
```

### 3. Setup Database

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 4. Start Services

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: (Optional) MCP Server
cd mcp && npm start
```

### 5. Install CLI Globally

```bash
cd cli
npm link
```

Now you can use `composter` command anywhere!

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

<!-- SCREENSHOT: CLI Usage -->
<!-- 
📸 ADD SCREENSHOT HERE:
1. Record or screenshot the CLI in action (showing login and push commands)
2. Save as: docs/screenshots/cli-usage.png
3. Uncomment the line below:
-->
<!-- ![CLI Usage](docs/screenshots/cli-usage.png) -->

### Web Dashboard

Access the dashboard at `http://localhost:5173` after starting the frontend.

<!-- SCREENSHOT: Dashboard -->
<!-- 
📸 ADD SCREENSHOT HERE:
1. Take a screenshot of the dashboard home page showing components
2. Save as: docs/screenshots/dashboard.png
3. Uncomment the line below:
-->
<!-- ![Dashboard](docs/screenshots/dashboard.png) -->

#### Dashboard Features

- **Browse Components** — View all saved components organized by category
- **Live Preview** — See components rendered in real-time
- **Code View** — Inspect source code with syntax highlighting
- **Copy Commands** — One-click copy for npm install and CLI commands

<!-- SCREENSHOT: Component Detail -->
<!-- 
📸 ADD SCREENSHOT HERE:
1. Take a screenshot of a component detail page showing preview and code
2. Save as: docs/screenshots/component-detail.png
3. Uncomment the line below:
-->
<!-- ![Component Detail](docs/screenshots/component-detail.png) -->

## 🤖 MCP Integration

Composter includes a Model Context Protocol (MCP) server that enables AI assistants to interact with your component vault.

### Supported AI Tools

| Tool | Status |
|------|--------|
| Claude Desktop | ✅ Supported |
| Cursor | ✅ Supported |
| GitHub Copilot | ✅ Supported |
| VS Code + MCP Extensions | ✅ Supported |

### Setup

1. **Login via CLI first:**
   ```bash
   composter login
   ```

2. **Add to your AI tool's MCP config:**

   **Claude Desktop** (`~/.config/claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "composter": {
         "command": "node",
         "args": ["/path/to/Composter/mcp/src/server.js"],
         "cwd": "/path/to/Composter"
       }
     }
   }
   ```

   **Cursor** (Settings > MCP):
   ```json
   {
     "composter": {
       "command": "node",
       "args": ["mcp/src/server.js"],
       "cwd": "/path/to/Composter"
     }
   }
   ```

3. **Restart your AI assistant**

### MCP Tools

| Tool | Description |
|------|-------------|
| `search_components` | Search components by name or category |
| `read_component` | Read the full source code of a component |

<!-- SCREENSHOT: MCP in Action -->
<!-- 
📸 ADD SCREENSHOT HERE:
1. Take a screenshot showing an AI assistant using Composter MCP
   (e.g., Claude searching for components or reading component code)
2. Save as: docs/screenshots/mcp-integration.png
3. Uncomment the line below:
-->
<!-- ![MCP Integration](docs/screenshots/mcp-integration.png) -->

For detailed MCP documentation, see [mcp/README.md](mcp/README.md).

## 📁 Project Structure

### Backend

| File/Directory | Description |
|----------------|-------------|
| `server.js` | Express server entry point |
| `auth/auth.ts` | Better Auth configuration |
| `controllers/` | API route handlers |
| `prisma/schema.prisma` | Database schema |
| `routes/` | API route definitions |

### Frontend

| Directory | Description |
|-----------|-------------|
| `src/pages/` | Page components (Landing, Dashboard, Auth) |
| `src/components/ui/` | Reusable UI components |
| `src/components/layout/` | Layout components (Sidebar, Topbar) |
| `src/lib/` | Utilities and auth client |
| `src/data/` | Static data and configurations |

### CLI

| File | Description |
|------|-------------|
| `src/index.js` | CLI entry point |
| `src/commands/` | Individual command implementations |
| `src/utils/` | Helper utilities (session, paths) |

### MCP

| File | Description |
|------|-------------|
| `src/server.js` | MCP server entry point |
| `lib/auth.js` | JWT authentication |
| `lib/factory.js` | MCP tool definitions |

## 🔧 Development

### Running in Development Mode

```bash
# Backend with hot reload
cd backend && npm run dev

# Frontend with hot reload
cd frontend && npm run dev

# MCP with inspector
cd mcp && npm run server:inspect
```

### Database Migrations

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

### Building for Production

```bash
# Build frontend
cd frontend && npm run build

# The build output will be in frontend/dist/
```

## 🛡️ Security

- **JWT Authentication** — All API requests are authenticated
- **User Scoping** — Components are isolated per user
- **JWKS Verification** — MCP server verifies tokens against backend
- **Session Management** — Secure session storage with expiry handling

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

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

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/binit2-1">binit2-1</a>
</p>

---

## 📸 Screenshot Guide

To add screenshots to this README:

### 1. Create Screenshots Directory

```bash
mkdir -p docs/screenshots
```

### 2. Required Screenshots

| Screenshot | Description | Suggested Size |
|------------|-------------|----------------|
| `landing-page.png` | Full landing page with hero section | 1920x1080 |
| `cli-usage.png` | Terminal showing CLI commands | 800x600 |
| `dashboard.png` | Dashboard home with components list | 1920x1080 |
| `component-detail.png` | Component preview and code view | 1920x1080 |
| `mcp-integration.png` | AI assistant using Composter | 1200x800 |

### 3. Taking Screenshots

**For Web Pages:**
1. Open the page in your browser
2. Press `F12` to open DevTools
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type "screenshot" and select "Capture full size screenshot"

**For Terminal:**
1. Use a terminal with a clean theme
2. Run the commands you want to showcase
3. Use a screenshot tool or `gnome-screenshot` on Linux

**For AI Integration:**
1. Open your AI assistant (Claude, Cursor, etc.)
2. Run a Composter MCP command
3. Screenshot the conversation showing the result

### 4. Adding to README

After saving screenshots to `docs/screenshots/`, uncomment the relevant lines in this README:

```markdown
<!-- Before -->
<!-- ![Dashboard](docs/screenshots/dashboard.png) -->

<!-- After -->
![Dashboard](docs/screenshots/dashboard.png)
```

### 5. Image Optimization (Optional)

For faster loading, optimize images before committing:

```bash
# Using ImageMagick
mogrify -resize 1920x1080 -quality 85 docs/screenshots/*.png

# Or using online tools like:
# - TinyPNG (https://tinypng.com)
# - Squoosh (https://squoosh.app)
```

