import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Clock, Layers } from "lucide-react";
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
import UserComponent from "${entryImport}";

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
          <CodeBlock code={sandpackFiles[mainFilename] || "// No code available"} language="jsx" />
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