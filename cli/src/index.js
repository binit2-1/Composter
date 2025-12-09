#!/usr/bin/env node

import { Command } from "commander";
import { login } from "./commands/login.js";
import { mkcat } from "./commands/mkcat.js";
import { listCategories } from "./commands/listCat.js";
import { pushComponent } from "./commands/push.js";
import { pullComponent } from "./commands/pull.js";
import { create } from "framer-motion/m";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

const program = new Command();

program
  .name("composter")
  .description("CLI for Composter Platform")
  .version(packageJson.version);

program
  .command("login")
  .description("Log into your Composter account")
  .action(login);

program
  .command("mkcat <category-name>")
  .description("Create a new category")
  .action((categoryName) => mkcat(categoryName));

program 
  .command("ls")
  .description("List categories")
  .action(() => {
    listCategories();
  });

program
  .command("push <category-name> <component-title> <file-path>")
  .description("Push a new component")
  .action((category, title, filepath) => {
    pushComponent(category, title, filepath);
  });

program
  .command("pull <category-name> <component-title> <file-path>")
  .description("Pull a component")
  .action((category, title, filepath) => {
    pullComponent(category, title, filepath);
  });

program.parse(process.argv);
