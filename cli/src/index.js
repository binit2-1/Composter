#!/usr/bin/env node

import { Command } from "commander";
import { login } from "./commands/login.js";
import { mkcat } from "./commands/mkcat.js";
import { listCategories } from "./commands/listCat.js";

const program = new Command();

program
  .name("composter")
  .description("CLI for Composter Platform")
  .version("0.1.0");

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

program.parse(process.argv);
