import { getAuthToken, getBaseUrl } from "./auth.js";

/**
 * Makes authenticated API requests to the Composter backend
 * @param {string} path - The API endpoint path
 * @param {Object} options - The fetch options
 * @returns {Response} The API response
 */
async function api(path, options = {}) {
  const token = getAuthToken();
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });

  return response;
}

export default api;
    