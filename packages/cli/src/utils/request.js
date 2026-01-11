import { clearSession, loadSession } from "./session.js";
import { safeFetch } from "./safeFetch.js";
import { handleSessionError } from "./errorHandlers/sessionErrorHandler.js";
import { handleFetchError } from "./errorHandlers/fetchErrorHandler.js";
import { log } from "./log.js";

const BASE_URL = process.env.BASE_URL || "https://composter.vercel.app/api";

export async function apiRequest(path, options = {}) {

  try {
    const session = loadSession();
    const headers = options.headers || {};
  
    if (session?.jwt) {
      headers["Authorization"] = `Bearer ${session.jwt}`;
    }
  
    const res = await safeFetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  
    return res;
  } catch (error) {
      if (error.type === "SESSION_ERROR") {
        handleSessionError(error);
        process.exit(1);
      } 
      else {
        // if we get an 401 error, it usually means the session is invalid or expired
        // hence we clear the session and handle the error accordingly
        if(error.type === "FETCH_ERROR" && error.message === "UNAUTHORIZED") {
          clearSession();
          log.warn("Session invalid or expired. Please log in again.");
          log.info("Run: composter login");
          process.exit(1);
        }
        handleFetchError(error);
        process.exit(1);
      }
  }

}
