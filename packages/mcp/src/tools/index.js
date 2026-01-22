import { registerGeneralTools } from "./general.js";
import { registerComponentTools } from "./components.js";

/**
 * Registers all tools to the provided MCP server instance
 * @param {import("@modelcontextprotocol/sdk/server/mcp.js").McpServer} server - The Model Context Protocol server instance
 */
export function registerTools(server) {
  registerGeneralTools(server);
  registerComponentTools(server);
}