import chalk from "chalk";
import { log } from "../utils/log.js";
import { apiRequest } from "../utils/request.js";
import fs from "fs";
import path from "path";

export async function pullComponent(category, title, targetDir) { 
    // 1. Validate Input
    // although commander ensures these are provided, we double-check here
    if (!category?.trim() || !title?.trim() || !targetDir?.trim()) {
        log.error("Category, title, and target directory are required.");
        process.exit(1);
    }
 
    // 2. Resolve Target Directory
    // In multi-file mode, the target is usually a FOLDER, not a specific file.
    const absoluteRoot = path.resolve(targetDir);
 
        log.info(`⏳ Fetching '${title}' from '${category}'...`);

        const res = await apiRequest(`/components?category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        // Parse Body
        let body = null;
        try { body = await res.json(); } catch {}

        const component = body.component ?? null;

        // PARSE FILES (Handle JSON vs String) 
        let filesMap = {};
        try {
            // Try to parse new multi-file format
            filesMap = JSON.parse(component.code);
        } catch (e) {
            // Fallback for old single-file components
            // We'll create a default filename based on the title
            let fileName = `${title}.jsx`; 
            // If the user pointed to a specific file (e.g. ./src/Button.js), use that name
            if (path.extname(absoluteRoot)) {
                fileName = path.basename(absoluteRoot);
            }
            filesMap[`/${fileName}`] = component.code;
        }

        // WRITE FILES TO DISK 
        log.info(`📦 Unpacking ${Object.keys(filesMap).length} file(s) into: ${absoluteRoot}`);

        // Ensure the root target folder exists
        if (!fs.existsSync(absoluteRoot)) {
            fs.mkdirSync(absoluteRoot, { recursive: true });
        }

        const createdFiles = [];

        for (const [virtualPath, content] of Object.entries(filesMap)) {
            // Remove leading slash (e.g. "/ui/Button.tsx" -> "ui/Button.tsx")
            const relPath = virtualPath.startsWith('/') ? virtualPath.slice(1) : virtualPath;
            
            // Construct full system path
            const writePath = path.join(absoluteRoot, relPath);
            const writeDir = path.dirname(writePath);

            // Create sub-folders if needed
            if (!fs.existsSync(writeDir)) {
                fs.mkdirSync(writeDir, { recursive: true });
            }

            // Write file
            fs.writeFileSync(writePath, content, "utf-8");
            createdFiles.push(relPath);
            console.log(chalk.cyan(`   + ${relPath}`));
        }

        // CHECK DEPENDENCIES 
        if (component.dependencies && Object.keys(component.dependencies).length > 0) {
            checkDependencies(component.dependencies);
        }

        log.success(`Component '${title}' pulled successfully!`);
}

/**
 * Helper to check local package.json against required dependencies
 */
function checkDependencies(requiredDeps) {
    const localPkgPath = path.resolve(process.cwd(), "package.json");
    
    // If no package.json, we can't check, so just list them all
    if (!fs.existsSync(localPkgPath)) {
        log.warn("This component requires these packages:");
        Object.entries(requiredDeps).forEach(([pkg, ver]) => log.warn(`   - ${pkg}@${ver}`));
        return;
    }

    try {
        const localPkg = JSON.parse(fs.readFileSync(localPkgPath, "utf-8"));
        const installed = { ...localPkg.dependencies, ...localPkg.devDependencies };
        const missing = [];

        for (const [pkg, version] of Object.entries(requiredDeps)) {
            if (!installed[pkg]) {
                missing.push(`${pkg}@${version}`);
            }
        }

        if (missing.length > 0) {
            log.warn("Missing Dependencies (Run this to fix):");
            log.info(`   npm install ${missing.map(d => d.split('@')[0]).join(" ")}`);
        } else {
            log.info("All dependencies are already installed.");
        }
    } catch (e) {
        // Ignore JSON parse errors
    }
}