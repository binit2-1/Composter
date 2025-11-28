import { apiRequest } from "../utils/request.js";
import { loadSession } from "../utils/session.js";
import fs from "fs";
import path from "path";
// IMPORT THE NEW SPIDER
import { scanComponent } from "../utils/crawler.js"; 

export async function pushComponent(category, title, filepath) { 
    // 1. Validate Input
    if (!category?.trim() || !title?.trim() || !filepath?.trim()) {
        console.log("❌ Category, title, and filepath are required.");
        return;
    }

    // 2. Validate Entry File
    const absolutePath = path.resolve(filepath);
    if (!fs.existsSync(absolutePath)) {
        console.log(`❌ File not found: ${absolutePath}`);
        return;
    }

    // 3. Check Session
    const session = loadSession();
    if (!session || !session.jwt) {
        console.log("❌ You must be logged in. Run: composter login");
        return;
    }

    // 4. RUN THE CRAWLER
    console.log(`Scanning ${path.basename(absolutePath)} and its dependencies...`);
    
    const { files, dependencies } = scanComponent(absolutePath);
    
    const fileCount = Object.keys(files).length;
    const depCount = Object.keys(dependencies).length;

    console.log(`📦 Bundled ${fileCount} file(s) and detected ${depCount} external package(s).`);

    try {
        // 5. Send Request
        // We send 'files' as a JSON string because your DB 'code' column is a String.
        const res = await apiRequest("/components", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                title, 
                category,
                code: JSON.stringify(files), 
                dependencies: dependencies   
            }),
        });

        // 6. Handle Response
        let body = null;
        try { body = await res.json(); } catch {}

        if (res.status === 401) {
            console.log("❌ Session expired. Run composter login again.");
            return;
        }

        if (res.ok) {
            console.log(`✅ Success! Component '${title}' pushed to '${category}'.`);
            return;
        }

        const errorMessage = body?.message || body?.error || res.statusText;
        console.log("❌ Error pushing component:", errorMessage);

    } catch (error) {
        console.log("❌ Network Error:", error.message);
    }
}