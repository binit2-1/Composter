import { apiRequest } from "../utils/request.js";
import { loadSession } from "../utils/session.js";

export async function listCategories() {
  const session = loadSession();
  if (!session || !session.jwt) {
    console.log("You must be logged in. Run: composter login");
    return;
  }

  try{
    const res = await apiRequest("/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
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
      const categories = body?.categories || [];
      if (categories.length === 0) {
        console.log("No categories found.");
        return;
      }
      categories.forEach((cat) => {
        //list them adjacent to each other with tab space between
        process.stdout.write(`${cat.name}\t\t`);
      });
      console.log();
      return;
    }

    // Handle other errors
    const errorMessage =
      (body && (body.message || body.error || JSON.stringify(body))) ||
      res.statusText ||
      `HTTP ${res.status}`;
    console.log("Error listing categories:", errorMessage);
    return;
  } catch (error) {
    console.log("Error fetching categories:", error);
    return;
  }
}
