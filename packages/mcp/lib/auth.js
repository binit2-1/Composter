import fs from "fs";
import path from "path";
import os from "os";

// Session path (same as CLI)
const SESSION_PATH = path.join(os.homedir(), ".config", "composter", "session.json");

// Get base URL - supports both dev and production
export function getBaseUrl() {
  // Check for explicit env var first
  if (process.env.COMPOSTER_API_URL) {
    return process.env.COMPOSTER_API_URL;
  }
  // Check for dev mode
  if (process.env.COMPOSTER_DEV === "true" || process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api";
  }
  // Default to production
  return "https://composter-api.vercel.app/api";
}

// Load session from CLI's session file
export function loadSession() {
  if (!fs.existsSync(SESSION_PATH)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(SESSION_PATH, "utf-8");
    const session = JSON.parse(raw);

    // Check if session is expired
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// Get JWT token from session
export function getAuthToken() {
  const session = loadSession();
  if (!session) {
    throw new Error("No session found. Please run 'composter login' first.");
  }

  const token = session.jwt || session.token || session.accessToken;
  if (!token) {
    throw new Error("Session file missing token. Please run 'composter login' again.");
  }

  return token;
}

// Verify session is valid by making a test API call
export async function verifySession() {
  const token = getAuthToken();
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl.replace('/api', '')}/api/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Session expired. Please run 'composter login' again.");
    }
    throw new Error(`Authentication failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data?.user?.id || data?.session?.userId;
}
