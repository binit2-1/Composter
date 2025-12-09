#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0];

// If first arg is a subcommand, run init tool
if (command === "init" || command === "--help" || command === "-h") {
  import("../src/init.js");
} else {
  // Otherwise run the MCP server
  import("../src/server.js");
}

