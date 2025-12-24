import { apiRequest } from "../utils/request.js";
import { loadSession } from "../utils/session.js";

export async function mkcat(categoryName) {
  // Validate input
  if (
    !categoryName ||
    categoryName.trim() === "" ||
    categoryName.includes(" ") ||
    categoryName.length > 10
  ) {
    console.log(
      "Invalid category name. It must be non-empty, without spaces, and ≤ 10 characters."
    );
    return;
  }

  // Check session
  const session = loadSession();
  if (!session || !session.jwt) {
    console.log("You must be logged in. Run: composter login");
    return;
  }

  try {
    // Send request
    const res = await apiRequest("/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName }),
    });

    // Parse JSON once
    let body = null;
    try {
      body = await res.json();
    } catch {
      // Ignore if no JSON
    }

    // Handle auth failure
    if (res.status === 401) {
      console.log("Session expired. Run composter login again.");
      return;
    }

    // Handle server errors
    if (res.status >= 500) {
      console.log("Server error. Try again later.");
      return;
    }

    // Handle success
    if (res.ok) {
      console.log(`Category '${categoryName}' created successfully!`);
      return;
    }

    // Handle other errors
    const msg =
      body?.error ||
      body?.message ||
      JSON.stringify(body) ||
      `HTTP ${res.status}`;

    console.log("Failed to create category:", msg);
  } catch (err) {
    console.log("Network or unexpected error:", err.message);
  }
}
