# Composter MCP Server

The Composter MCP (Model Context Protocol) Server enables AI assistants like Claude, GitHub Copilot, Cursor, and other MCP-compatible tools to interact with your personal React component vault.

## Overview

The MCP server provides a secure bridge between your AI coding assistant and your Composter component library. It allows AI tools to:

- **Search** through your saved components by name or category
- **Read** the full source code of any component in your vault
- All operations are scoped to your authenticated user account

## Prerequisites

Before setting up the MCP server, ensure you have:

1. **Node.js** v18 or higher installed
2. **Composter Backend** running on `localhost:3000`
3. **Composter CLI** logged in (run `composter login` first)

## Installation

1. Navigate to the MCP directory:

```bash
cd mcp
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `mcp/` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/composter"
```

## Authentication

The MCP server uses the same authentication as the Composter CLI. Before starting the server:

```bash
# Login via CLI first
composter login
```

This creates a session file at `~/.config/composter/session.json` that the MCP server uses for authentication.

## Starting the Server

### Direct Start

```bash
npm start
```

### With Inspector (for debugging)

```bash
npm run server:inspect
```

This launches the MCP Inspector for debugging and testing tools.

## Available Tools

### 1. `search_components`

Search for React components in your vault by title or category name.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `query` | string | Search term for component title or category name |

**Example Response:**
```
Found the following components:
- [ID: abc123] Button (Category: UI)
- [ID: def456] ButtonGroup (Category: UI)
```

### 2. `read_component`

Read the full source code of a specific component.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `componentName` | string | The name of the component to read |

**Example Response:**
```
Filename: Button.jsx
Category: UI
Created: 2024-01-15T10:30:00.000Z

\`\`\`javascript
import React from 'react';

export const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
};
\`\`\`
```

## IDE Integration

### Claude Desktop

Add to your Claude Desktop config (`~/.config/claude/claude_desktop_config.json`):

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

### Cursor

Add to your Cursor MCP settings:

```json
{
  "composter": {
    "command": "node",
    "args": ["mcp/src/server.js"],
    "cwd": "/path/to/Composter"
  }
}
```

### VS Code with Copilot

For VS Code with GitHub Copilot MCP extension, add to settings:

```json
{
  "mcp.servers": {
    "composter": {
      "command": "node",
      "args": ["/path/to/Composter/mcp/src/server.js"]
    }
  }
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Assistant                             │
│              (Claude, Copilot, Cursor)                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ MCP Protocol (stdio)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Composter MCP Server                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   auth.js   │  │  factory.js │  │     server.js       │  │
│  │ (JWT Auth)  │  │ (Tools)     │  │ (Entry Point)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ Prisma ORM
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                        │
│         (Components, Categories, Users)                      │
└─────────────────────────────────────────────────────────────┘
```

## Security

- All database queries are scoped to the authenticated user's ID
- JWT tokens are verified against the backend JWKS endpoint
- Session tokens are stored locally and never transmitted to third parties
- The MCP server only exposes read-only operations

## Troubleshooting

### "No session found" Error

Run `composter login` in your terminal to authenticate.

### "Session expired" Error

Your session has expired. Run `composter login` again.

### "Cannot contact backend" Error

Ensure the Composter backend is running on `localhost:3000`:

```bash
cd backend
npm start
```

### Tools not appearing in AI assistant

1. Verify the MCP server is running: `npm start`
2. Check the path in your IDE configuration is correct
3. Restart your AI assistant/IDE after configuration changes

## Development

### Project Structure

```
mcp/
├── lib/
│   ├── auth.js      # JWT authentication & session handling
│   └── factory.js   # MCP server tools definition
├── src/
│   └── server.js    # Entry point & transport setup
├── package.json
└── README.md
```

### Adding New Tools

Edit `lib/factory.js` to add new MCP tools:

```javascript
server.tool(
  "tool_name",
  "Tool description for AI",
  { 
    param: z.string().describe("Parameter description") 
  },
  async ({ param }) => {
    // Tool implementation
    return {
      content: [{ type: "text", text: "Response" }],
    };
  }
);
```

## License

MIT License - see the main project LICENSE file.

