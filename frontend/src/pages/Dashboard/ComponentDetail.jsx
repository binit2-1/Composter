import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Clock, Layers, FileText, FolderTree, PackageIcon } from "lucide-react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import CodeBlock from "../../components/ui/CodeBlock.jsx";

const ComponentDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("preview");
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/components/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setComponent(data.component);
      } catch (error) {
        console.error("Error fetching component:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComponent();
  }, [id]);

  // Parse multi-file structure and dependencies
  const { sandpackFiles, mainFilename, dependencies } = useMemo(() => {
    if (!component) return { sandpackFiles: {}, mainFilename: "", dependencies: {} };

    let files = {};
    let isMultiFile = false;

    // Parse code (handle both JSON multi-file and legacy single string)
    try {
      const parsed = JSON.parse(component.code);
      if (typeof parsed === 'object' && parsed !== null) {
        files = parsed;
        isMultiFile = true;
      } else {
        files = { "/App.js": component.code };
      }
    } catch (e) {
      // Legacy format: raw string
      files = { "/App.js": component.code };
    }

    // Normalize file paths (ensure leading '/')
    const normalizedFiles = {};
    let firstFile = "";
    
    Object.keys(files).forEach((filename, index) => {
      const key = filename.startsWith("/") ? filename : `/${filename}`;
      normalizedFiles[key] = typeof files[filename] === 'string' 
        ? files[filename] 
        : files[filename].code || files[filename];
      if (index === 0) firstFile = key;
    });

    // Create entry point wrapper
    const entryImport = firstFile.replace(/\.(tsx|jsx|js)$/, "");
    
    normalizedFiles["/root.js"] = `import React from "react";
import { createRoot } from "react-dom/client";
import * as UserExports from "${entryImport}";

// Smart Component Detection: Handle both default and named exports
const UserComponent = UserExports.default || 
  Object.values(UserExports).find(exp => typeof exp === 'function') || 
  (() => <div className="text-red-500 p-4">Error: No React component exported. Please export your component.</div>);

const root = createRoot(document.getElementById("root"));
root.render(
  <div className="p-8 flex justify-center min-h-screen items-center bg-black text-white">
    <UserComponent />
  </div>
);`;

    normalizedFiles["/public/index.html"] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

    // Inject tsconfig.json for @/ path alias support
    normalizedFiles["/tsconfig.json"] = JSON.stringify({
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"]
        }
      }
    }, null, 2);

    // Parse dependencies from component (stored as JSON in DB)
    let deps = {};
    if (component.dependencies) {
      try {
        deps = typeof component.dependencies === 'string' 
          ? JSON.parse(component.dependencies) 
          : component.dependencies;
      } catch (e) {
        console.error("Failed to parse dependencies:", e);
      }
    }

    return {
      sandpackFiles: normalizedFiles,
      mainFilename: firstFile,
      dependencies: deps
    };
  }, [component]);

  // Generate file tree structure from files
  const fileTree = useMemo(() => {
    if (!sandpackFiles || Object.keys(sandpackFiles).length === 0) return [];

    const tree = {};
    const visibleFiles = Object.keys(sandpackFiles).filter(
      path => path !== '/root.js' && path !== '/public/index.html'
    );

    visibleFiles.forEach(filePath => {
      const parts = filePath.split('/').filter(Boolean);
      let current = tree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          current[part] = { type: 'file', path: filePath };
        } else {
          // It's a folder
          if (!current[part]) {
            current[part] = { type: 'folder', children: {} };
          }
          current = current[part].children;
        }
      });
    });

    return tree;
  }, [sandpackFiles]);

  // Generate instructions based on file structure
  const instructions = useMemo(() => {
    if (!component) return "";

    const fileCount = Object.keys(sandpackFiles).filter(
      path => path !== '/root.js' && path !== '/public/index.html'
    ).length;

    const depsCount = Object.keys(dependencies).length;

    return `## ${component.title}

### Overview
This component is located in the **${component.category?.name || "Uncategorized"}** category.

### File Structure
This component contains **${fileCount}** file${fileCount > 1 ? 's' : ''}:
${Object.keys(sandpackFiles)
  .filter(path => path !== '/root.js' && path !== '/public/index.html')
  .map(file => `- \`${file}\``)
  .join('\n')}

${depsCount > 0 ? `### Dependencies
This component requires **${depsCount}** external package${depsCount > 1 ? 's' : ''}:
${Object.entries(dependencies).map(([name, version]) => `- **${name}**: ${version}`).join('\n')}` : ''}

### Usage
Import and use this component in your React application. Make sure all dependencies are installed and file paths are correctly set up.`;
  }, [component, sandpackFiles, dependencies]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const handleCopy = () => {
    if (sandpackFiles[mainFilename]) {
      navigator.clipboard.writeText(sandpackFiles[mainFilename]);
    }
  };

  // Render file tree recursively
  const renderFileTree = (tree, parentPath = '') => {
    return Object.entries(tree).map(([name, node]) => {
      if (node.type === 'file') {
        const isSelected = selectedFile === node.path;
        return (
          <button
            key={node.path}
            onClick={() => setSelectedFile(node.path)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors w-full text-left ${
              isSelected
                ? 'bg-violet-500/20 text-violet-300'
                : 'text-white/70 hover:text-white hover:bg-[#060010]'
            }`}
          >
            <FileText size={16} />
            <span>{name}</span>
          </button>
        );
      } else {
        return (
          <div key={`${parentPath}/${name}`} className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-white/50">
              <FolderTree size={16} />
              <span>{name}</span>
            </div>
            <div className="ml-4 space-y-1">
              {renderFileTree(node.children, `${parentPath}/${name}`)}
            </div>
          </div>
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-white/60">Loading component...</h2>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Component not found</h2>
        <Link to="/app/components">
          <Button className="mt-4">Back to Components</Button>
        </Link>
      </div>
    );
  }

  // Set initial selected file
  if (!selectedFile && mainFilename) {
    setSelectedFile(mainFilename);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/app/components" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={16} />
            Back to Components
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{component.title}</h1>

          <div className="flex items-center gap-4 mt-4">
            <Badge variant="secondary">{component.category?.name || "Uncategorized"}</Badge>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Clock size={14} />
              <span>Created {formatTimeAgo(component.createdAt)}</span>
            </div>
            {Object.keys(dependencies).length > 0 && (
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Layers size={14} />
                <span>{Object.keys(dependencies).length} dependencies</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="secondary"
            onClick={handleCopy}
          >
            <Copy size={16} className="mr-2" />
            Copy Code
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-6">
          {["preview", "code"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                pb-3 text-sm font-medium capitalize transition-all relative
                ${activeTab === tab ? "text-white" : "text-white/40 hover:text-white/70"}
              `}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "code" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column: File Tree + Dependencies */}
            <div className="lg:col-span-1 space-y-4">
              {/* File Structure */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <FolderTree size={16} />
                  File Structure
                </h3>
                <div className="space-y-1">
                  {renderFileTree(fileTree)}
                </div>
              </Card>

              {/* Dependencies */}
              {Object.keys(dependencies).length > 0 && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <PackageIcon size={16} />
                    Dependencies
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(dependencies).map(([name, version]) => (
                      <div key={name} className="flex justify-between items-center text-xs">
                        <span className="text-white/70 font-mono">{name}</span>
                        <Badge variant="secondary" className="text-xs">{version}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column: Code Viewer */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="p-0 overflow-hidden">
                <div className="bg-[#060010] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-sm font-mono text-white/70">{selectedFile || mainFilename}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const code = sandpackFiles[selectedFile || mainFilename];
                      if (code) navigator.clipboard.writeText(code);
                    }}
                  >
                    <Copy size={14} className="mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="max-h-[600px] overflow-auto">
                  <CodeBlock 
                    code={sandpackFiles[selectedFile || mainFilename] || "// No code available"} 
                    language="jsx" 
                  />
                </div>
              </Card>

              {/* Installation Commands */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Installation</h3>
                <div className="space-y-3">
                  {/* NPM Install */}
                  {Object.keys(dependencies).length > 0 && (
                    <div>
                      <p className="text-xs text-white/60 mb-2">Install dependencies:</p>
                      <div className="relative group">
                        <pre className="bg-black/40 rounded-lg p-3 text-xs font-mono text-white/80 overflow-x-auto">
                          npm install {Object.keys(dependencies).join(' ')}
                        </pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(`npm install ${Object.keys(dependencies).join(' ')}`)}
                          className="absolute right-2 top-2 p-1.5 rounded bg-[#060010] hover:bg-[#0a0018] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy size={12} className="text-white" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Component Pull */}
                  <div>
                    <p className="text-xs text-white/60 mb-2">Pull component via CLI:</p>
                    <div className="relative group">
                      <pre className="bg-black/40 rounded-lg p-3 text-xs font-mono text-white/80 overflow-x-auto">
                        composter pull {component.category?.name || 'category'} {component.title} ./
                      </pre>
                      <button
                        onClick={() => navigator.clipboard.writeText(`composter pull ${component.category?.name || 'category'} ${component.title} ./`)}
                        className="absolute right-2 top-2 p-1.5 rounded bg-white/10 hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy size={12} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <Card className="overflow-hidden p-0 bg-[#151515]">
            <Sandpack
              template="react"
              theme={dracula}
              files={sandpackFiles}
              options={{
                showNavigator: false,
                showTabs: Object.keys(sandpackFiles).length > 3,
                editorHeight: 600,
                activeFile: mainFilename,
                externalResources: ["https://cdn.tailwindcss.com"],
              }}
              customSetup={{
                entry: "/root.js",
                dependencies: {
                  ...dependencies,
                  "react": "^18.2.0",
                  "react-dom": "^18.2.0",
                  "lucide-react": "latest",
                  "clsx": "latest",
                  "tailwind-merge": "latest"
                }
              }}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default ComponentDetail;