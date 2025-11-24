import fetch from "node-fetch";
import { loadSession } from "./session.js";
import dotenv from "dotenv";
dotenv.config({ silent: true });

const BASE_URL = process.env.BASE_URL;

export async function apiRequest(path, options = {}) {
  const session = loadSession();
  const headers = options.headers || {};

  if (session?.jwt) {
    headers["Authorization"] = `Bearer ${session.jwt}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return res;
}
