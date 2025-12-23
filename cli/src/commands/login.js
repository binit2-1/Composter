import inquirer from "inquirer";
import fetch from "node-fetch";
import { saveSession } from "../utils/session.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env") });

const BASE_URL = `${process.env.BASE_URL || "https://composter.onrender.com/api"}/auth`;

export async function login() {
  console.log("=== Composter Login ===");

  const { email, password } = await inquirer.prompt([
    { type: "input", name: "email", message: "Email:" },
    { type: "password", name: "password", message: "Password:" }
  ]);
// Step 1 — Sign in/Register
  let res;
  try {
    res = await fetch(`${BASE_URL}/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      console.log("\nCannot reach server. Check your internet connection or VPN.");
    } else {
      console.log("\nNetwork error occurred. Please try again later.");
    }
    return;
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      console.log("\nInvalid email or password.");
      return;
    }

    if (res.status >= 500) {
      console.log("\nService is temporarily unavailable. Please try again later.");
      return;
    }

    let errBody = null;
    try {
      errBody = await res.json();
    } catch {}

    console.log(
      "\nLogin failed:",
      (errBody && (errBody.message || errBody.error)) || `HTTP ${res.status}`
    );
    return;
  }

  // Step 2 — Extract session cookie
  const cookie = res.headers.get("set-cookie");
  if (!cookie) {
    console.log("\nLogin failed. No session cookie returned.");
    return;
  }

   // Step 3 — Fetch JWT token
  let token = null;
  try {
    const tokenRes = await fetch(`${BASE_URL}/token`, {
      method: "GET",
      headers: { Cookie: cookie }
    });

    if (tokenRes.ok) {
      const json = await tokenRes.json();
      token = json.token;
    }
  } catch {
    console.log("\nLogged in, but failed to retrieve session token.");
  }

  // Step 4 — Save session + jwt locally with expiration
  const expiresAt = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  saveSession({
    cookies: cookie,
    jwt: token,
    createdAt: new Date().toISOString(),
    expiresAt
  });

  console.log("\nLogged in successfully!");
  console.log(`Session expires: ${expiresAt}`);
}
