import { registerGeneralTools } from "./general.js";
import { registerComponentTools } from "./components.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Registers all tools to the provided MCP server instance
 * @param {McpServer} server - The Model Context Protocol server instance
 */
export function registerTools(server) {
  registerGeneralTools(server);
  registerComponentTools(server);
}