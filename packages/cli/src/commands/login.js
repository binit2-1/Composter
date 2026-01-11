import inquirer from "inquirer";
import { safeFetch } from "../utils/safeFetch.js";
import { saveSession } from "../utils/session.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { log } from "../utils/log.js";
import { handleFetchError } from "../utils/errorHandlers/fetchErrorHandler.js";
import chalk from "chalk";
import { composterLoginArtv2 } from "../constants/asciiArts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = `${process.env.BASE_URL || "https://composter-api.vercel.app"}/auth`;

export async function login() {
  console.log(chalk.bold.blue(composterLoginArtv2));

  const { email, password } = await inquirer.prompt([
    { type: "input", name: "email", message: "Email:" },
    { type: "password", name: "password", message: "Password:" }
  ]);

  const isValidEmail = /\S+@\S+\.\S+/.test(email);
  if (!isValidEmail) {
    log.error("Please enter a valid email address.");
    return;
  }

  try {

    // Step 1: Sign in with email and password to obtain session cookie
    const res = await safeFetch(`${BASE_URL}/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const cookie = res.headers.get("set-cookie");
    if (!cookie) {
      log.error("Unable to retrieve session cookie. Login failed.");
      return;
    }

    const tokenRes = await safeFetch(`${BASE_URL}/token`, {
      method: "GET",
      headers: { Cookie: cookie }
    });

    const json = await tokenRes.json();
    const token = json.token;

    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    saveSession({
      cookies: cookie,
      jwt: token,
      createdAt: new Date().toISOString(),
      expiresAt
    });

    log.success("You have successfully logged in");
    log.info(`Session expires: ${expiresAt}`);
  } catch (err) {
    handleFetchError(err);
  }

}
