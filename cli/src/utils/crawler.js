import fs from "fs";
import path from "path";

const IMPORT_REGEX = /(?:import|export)\s+(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]/g;

// Helper: Find the nearest package.json starting from a file's directory
function findPackageRoot(startDir) {
  let current = startDir;
  const root = path.parse(current).root;

  while (current !== root) {
    if (fs.existsSync(path.join(current, "package.json"))) {
      return current;
    }
    current = path.dirname(current);
  }
  // Fallback: If no package.json, use the directory of the entry file itself
  return startDir;
}

export function scanComponent(entryFilePath) {
  const absoluteEntry = path.resolve(entryFilePath);
  
  // FIX: Anchor the root to the package.json folder
  // This ensures paths are like "src/Button.jsx", not "frontend/src/Button.jsx"
  const projectRoot = findPackageRoot(path.dirname(absoluteEntry));
  
  const filesMap = {};       
  const npmDependencies = {}; 
  const processed = new Set();
  const queue = [absoluteEntry];

  // Load package.json for versions
  const localPkgPath = path.join(projectRoot, "package.json");
  let localPkg = { dependencies: {}, devDependencies: {} };
  try {
    if (fs.existsSync(localPkgPath)) {
      localPkg = JSON.parse(fs.readFileSync(localPkgPath, "utf-8"));
    }
  } catch (e) {}

  while (queue.length > 0) {
    const fullPath = queue.shift();
    if (processed.has(fullPath)) continue;
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Warning: File not found: ${fullPath}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    processed.add(fullPath);

    // --- CLEAN PATH GENERATION ---
    // Calculate path relative to the PROJECT ROOT (package.json location)
    let relativePath = path.relative(projectRoot, fullPath);
    
    // Normalize slashes for Sandpack
    relativePath = relativePath.split(path.sep).join("/");

    // SANITY CHECK: If path still starts with "..", force it into a virtual root
    // This handles cases where you import a file OUTSIDE your project root
    if (relativePath.startsWith("..")) {
        // Strip the dots: "../external/File.js" -> "/_external/File.js"
        relativePath = relativePath.replace(/^(\.\.\/)+/, "_external/");
    }

    const virtualPath = `/${relativePath}`; 
    filesMap[virtualPath] = content;

    // --- SCAN IMPORTS ---
    let match;
    IMPORT_REGEX.lastIndex = 0; 
    while ((match = IMPORT_REGEX.exec(content)) !== null) {
        const importPath = match[1];

        if (importPath.startsWith(".")) {
            // CASE A: Relative Import (e.g. "./button")
            const currentFileDir = path.dirname(fullPath);
            const resolvedPath = resolveLocalImport(currentFileDir, importPath);
            if (resolvedPath && !processed.has(resolvedPath)) {
                queue.push(resolvedPath);
            }
        } else if (importPath.startsWith("@/")) {
            // CASE B: Alias Import (e.g. "@/components/ui/button")
            // We assume "@/" maps to "<projectRoot>/src/" (Standard Shadcn/Vite convention)
            const pathInsideSrc = importPath.slice(2); // Remove "@/"
            const srcDir = path.join(projectRoot, "src");
            
            const resolvedPath = resolveLocalImport(srcDir, pathInsideSrc);
            if (resolvedPath && !processed.has(resolvedPath)) {
                queue.push(resolvedPath);
            }
        } else {
            // CASE C: External Package (e.g. "lucide-react")
             const pkgName = getPackageName(importPath);
             const version = 
               localPkg.dependencies?.[pkgName] || 
               localPkg.devDependencies?.[pkgName] || 
               "latest";
             npmDependencies[pkgName] = version;
        }
    }
  }

  return { files: filesMap, dependencies: npmDependencies };
}

function resolveLocalImport(dir, importPath) {
  const extensions = [".tsx", ".ts", ".jsx", ".js", ".css"];
  const base = path.join(dir, importPath);
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const ext of extensions) {
    if (fs.existsSync(base + ext)) return base + ext;
  }
  for (const ext of extensions) {
    const indexPath = path.join(base, `index${ext}`);
    if (fs.existsSync(indexPath)) return indexPath;
  }
  return null;
}

function getPackageName(importPath) {
  if (importPath.startsWith("@")) {
    const parts = importPath.split("/");
    return `${parts[0]}/${parts[1]}`;
  }
  return importPath.split("/")[0];
}