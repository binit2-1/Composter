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
import { registerTools } from "../src/tools/index.js";

/**
 * Creates and configures the Composter MCP server with all tools
 */
export function createMcpServer() {
  const server = new McpServer({
    name: "Composter",
    version: "2.0.0",
  });

  // Register all tools
  registerTools(server);

  return server;
}
