import inquirer from "inquirer";
import fetch from "node-fetch";
import { saveSession } from "../utils/session.js";
import dotenv from "dotenv";
dotenv.config({ silent: true });

const BASE_URL = `${process.env.BASE_URL}/auth`;

export async function login() {
  console.log("=== Composter Login ===");

  const { email, password } = await inquirer.prompt([
    { type: "input", name: "email", message: "Email:" },
    { type: "password", name: "password", message: "Password:" }
  ]);

  // Step 1 — Sign in
  const res = await fetch(`${BASE_URL}/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    // try to parse JSON error body, fall back to statusText
    let errBody = null;
    try {
      errBody = await res.json();
    } catch (e) {
      // body wasn't JSON or couldn't be parsed
    }
    const message =
      (errBody && (errBody.message || errBody.error || JSON.stringify(errBody))) ||
      res.statusText ||
      `HTTP ${res.status}`;
    console.log("\nLogin failed:", message);
    return;
  }

  // Step 2 — Extract session cookie
  const cookie = res.headers.get("set-cookie");
  if (!cookie) {
    console.log("Failed: No session cookie returned.");
    return;
  }

  // Step 3 — Fetch JWT token
  const tokenRes = await fetch(`${BASE_URL}/token`, {
    method: "GET",
    headers: { "Cookie": cookie }
  });

  let token = null;
  if (tokenRes.ok) {
    const json = await tokenRes.json();
    token = json.token;
  }

  // Step 4 — Save session + jwt locally
  saveSession({
    cookies: cookie,
    jwt: token
  });

  console.log("\nLogged in successfully!");
}
