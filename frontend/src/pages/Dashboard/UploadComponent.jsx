import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Plus, X, File, Folder, FolderOpen, ChevronDown, ChevronRight, Package, AlertCircle, Check, Loader2, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Card from "../../components/ui/Card.jsx";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Get language from file extension
const getLanguageFromPath = (path) => {
  const ext = path.split(".").pop()?.toLowerCase();
  const langMap = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    css: "css",
    scss: "scss",
    less: "less",
    html: "html",
    json: "json",
    md: "markdown",
    py: "python",
    go: "go",
    rs: "rust",
    java: "java",
    c: "c",
    cpp: "cpp",
    h: "c",
    hpp: "cpp",
    vue: "vue",
    svelte: "svelte",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
  };
  return langMap[ext] || "plaintext";
};

// Build a tree structure from flat file paths
const buildFileTree = (files) => {
  const tree = { name: "root", type: "folder", children: {}, path: "" };
  
  files.forEach(file => {
    const parts = file.path.split("/").filter(Boolean);
    let current = tree;
    
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // It's a file
        current.children[part] = { 
          name: part, 
          type: "file", 
          id: file.id, 
          path: file.path 
        };
      } else {
        // It's a folder
        if (!current.children[part]) {
          current.children[part] = { 
            name: part, 
            type: "folder", 
            children: {}, 
            path: parts.slice(0, index + 1).join("/") 
          };
        }
        current = current.children[part];
      }
    });
  });
  
  return tree;
};

// Recursive tree node component
const TreeNode = ({ node, level = 0, activeFileId, onSelect, onRemove, expandedFolders, toggleFolder }) => {
  const isFolder = node.type === "folder";
  const isExpanded = expandedFolders.has(node.path);
  const isActive = !isFolder && node.id === activeFileId;
  
  const children = isFolder ? Object.values(node.children).sort((a, b) => {
    // Folders first, then files
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  }) : [];

  if (node.name === "root") {
    return (
      <div className="space-y-0.5">
        {children.map(child => (
          <TreeNode 
            key={child.path || child.id} 
            node={child} 
            level={0}
            activeFileId={activeFileId}
            onSelect={onSelect}
            onRemove={onRemove}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer transition-all text-sm",
          isActive 
            ? "bg-primary/15 text-primary" 
            : "hover:bg-zinc-800/50 text-muted-foreground hover:text-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => isFolder ? toggleFolder(node.path) : onSelect(node.id)}
      >
        {isFolder ? (
          <>
            <ChevronRight size={12} className={cn("shrink-0 transition-transform", isExpanded && "rotate-90")} />
            {isExpanded ? <FolderOpen size={14} className="shrink-0 text-amber-500" /> : <Folder size={14} className="shrink-0 text-amber-500" />}
          </>
        ) : (
          <>
            <span className="w-3" /> {/* Spacer for alignment */}
            <File size={14} className="shrink-0" />
          </>
        )}
        <span className="flex-1 truncate">{node.name}</span>
        {!isFolder && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(node.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-zinc-700 rounded transition-all"
            title="Remove file"
          >
            <X size={10} />
          </button>
        )}
      </div>
      {isFolder && isExpanded && children.length > 0 && (
        <div>
          {children.map(child => (
            <TreeNode 
              key={child.path || child.id} 
              node={child} 
              level={level + 1}
              activeFileId={activeFileId}
              onSelect={onSelect}
              onRemove={onRemove}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Dependency tag component
const DependencyTag = ({ name, version, onRemove }) => (
  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-xs">
    <Package size={10} className="text-primary shrink-0" />
    <span className="text-foreground truncate max-w-[100px]">{name}</span>
    {version && version !== "latest" && <span className="text-muted-foreground">@{version}</span>}
    <button
      onClick={onRemove}
      className="p-0.5 hover:bg-primary/20 rounded transition-colors shrink-0"
    >
      <X size={10} className="text-muted-foreground hover:text-foreground" />
    </button>
  </div>
);

const UploadComponent = () => {
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // File structure state - now with full paths
  const [files, setFiles] = useState([
    { id: "1", path: "index.jsx", content: "" }
  ]);
  const [activeFileId, setActiveFileId] = useState("1");
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [newFilePath, setNewFilePath] = useState("");
  const [isAddingFile, setIsAddingFile] = useState(false);
  
  // Dependencies state
  const [dependencies, setDependencies] = useState([]);
  const [depInput, setDepInput] = useState("");
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Build file tree from flat files
  const fileTree = useMemo(() => buildFileTree(files), [files]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Get active file
  const activeFile = files.find(f => f.id === activeFileId);

  // Toggle folder expansion
  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  // File operations
  const addFile = () => {
    if (!newFilePath.trim()) return;
    
    // Normalize path
    let path = newFilePath.trim().replace(/^\/+/, "").replace(/\/+/g, "/");
    
    // Check for duplicates
    if (files.some(f => f.path === path)) {
      setNewFilePath("");
      setIsAddingFile(false);
      return;
    }
    
    const newId = Date.now().toString();
    setFiles([...files, { id: newId, path, content: "" }]);
    setActiveFileId(newId);
    
    // Auto-expand parent folders
    const parts = path.split("/");
    if (parts.length > 1) {
      const newExpanded = new Set(expandedFolders);
      for (let i = 1; i < parts.length; i++) {
        newExpanded.add(parts.slice(0, i).join("/"));
      }
      setExpandedFolders(newExpanded);
    }
    
    setNewFilePath("");
    setIsAddingFile(false);
  };

  const removeFile = (id) => {
    if (files.length === 1) return;
    const newFiles = files.filter(f => f.id !== id);
    setFiles(newFiles);
    if (activeFileId === id) {
      setActiveFileId(newFiles[0].id);
    }
  };

  const updateFileContent = (content) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content } : f));
  };

  // Dependency operations
  const addDependency = () => {
    if (!depInput.trim()) return;
    
    const match = depInput.trim().match(/^(@?[^@]+)(?:@(.+))?$/);
    if (!match) return;
    
    const [, name, version] = match;
    
    if (dependencies.some(d => d.name === name)) {
      setDepInput("");
      return;
    }
    
    setDependencies([...dependencies, { name, version: version || "latest" }]);
    setDepInput("");
  };

  const removeDependency = (name) => {
    setDependencies(dependencies.filter(d => d.name !== name));
  };

  // Handle category creation
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newCategory.trim() })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories([data.category, ...categories]);
        setCategory(newCategory.trim());
        setNewCategory("");
        setIsCreatingCategory(false);
      }
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!title.trim()) {
      setError("Component name is required");
      return;
    }
    if (!category) {
      setError("Please select or create a category");
      return;
    }
    if (!files.some(f => f.content.trim())) {
      setError("At least one file must have content");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Build the code object with full paths
      const codeObject = {};
      files.forEach(file => {
        if (file.content.trim()) {
          codeObject[file.path] = file.content;
        }
      });
      
      const depsObject = {};
      dependencies.forEach(dep => {
        depsObject[dep.name] = dep.version;
      });
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/components`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          category,
          code: JSON.stringify(codeObject),
          dependencies: depsObject
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload component");
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/app/components");
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link to="/app/components" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft size={16} />
          Back to Components
        </Link>
        <h1 className="text-3xl font-medium text-foreground mb-1">Upload Component</h1>
        <p className="text-muted-foreground">Add a new component to your vault with custom file structure.</p>
      </div>

      {/* Success State */}
      {success && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-3 text-emerald-400">
            <Check size={20} />
            <span>Component uploaded successfully! Redirecting...</span>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Left Sidebar */}
          <div className="space-y-4">
            {/* Component Info */}
            <Card>
              <h3 className="text-sm font-medium text-foreground/80 mb-3">Component Info</h3>
              
              <div className="space-y-3">
                {/* Component Name */}
                <div>
                  <label htmlFor="title" className="block text-xs text-muted-foreground mb-1">
                    Name *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AuthModal"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900/50 border border-border/50 text-foreground text-sm placeholder-muted-foreground/50 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Category *
                  </label>
                  {isCreatingCategory ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreateCategory())}
                        placeholder="Category name"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900/50 border border-border/50 text-foreground text-sm placeholder-muted-foreground/50 outline-none transition-all focus:border-primary/50"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          size="sm" 
                          className="flex-1"
                          onClick={handleCreateCategory}
                          disabled={!newCategory.trim()}
                        >
                          Create
                        </Button>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline"
                          className="px-3"
                          onClick={() => setIsCreatingCategory(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => {
                          if (e.target.value === "__new__") {
                            setIsCreatingCategory(true);
                          } else {
                            setCategory(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900/50 border border-border/50 text-foreground text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                        <option value="__new__">+ Create new category</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* File Structure */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground/80">File Structure</h3>
                <button
                  type="button"
                  onClick={() => setIsAddingFile(true)}
                  className="p-1 rounded hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors"
                  title="Add file"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              {/* Add new file input */}
              {isAddingFile && (
                <div className="mb-3 space-y-2">
                  <input
                    type="text"
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFile();
                      } else if (e.key === "Escape") {
                        setIsAddingFile(false);
                        setNewFilePath("");
                      }
                    }}
                    placeholder="e.g. src/components/Button.jsx"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900/50 border border-border/50 text-foreground text-sm placeholder-muted-foreground/50 outline-none transition-all focus:border-primary/50 font-mono"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      size="sm" 
                      className="flex-1"
                      onClick={addFile}
                      disabled={!newFilePath.trim()}
                    >
                      Add File
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      className="px-3"
                      onClick={() => {
                        setIsAddingFile(false);
                        setNewFilePath("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {/* File tree */}
              <div className="max-h-[250px] overflow-y-auto -mx-2 px-2">
                <TreeNode 
                  node={fileTree}
                  activeFileId={activeFileId}
                  onSelect={setActiveFileId}
                  onRemove={removeFile}
                  expandedFolders={expandedFolders}
                  toggleFolder={toggleFolder}
                />
              </div>
              
              <p className="text-xs text-muted-foreground/60 mt-3">
                Use paths like <code className="text-primary/70">src/Button.jsx</code> to create folders.
              </p>
            </Card>

            {/* Dependencies */}
            <Card>
              <h3 className="text-sm font-medium text-foreground/80 mb-3">Dependencies</h3>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={depInput}
                    onChange={(e) => setDepInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDependency())}
                    placeholder="react@18.0.0"
                    className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-zinc-900/50 border border-border/50 text-foreground text-sm placeholder-muted-foreground/50 outline-none transition-all focus:border-primary/50"
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline" 
                    onClick={addDependency}
                    className="shrink-0 px-3"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                
                {dependencies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dependencies.map(dep => (
                      <DependencyTag
                        key={dep.name}
                        name={dep.name}
                        version={dep.version}
                        onRemove={() => removeDependency(dep.name)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right - Code Editor */}
          <Card noPadding className="overflow-hidden flex flex-col">
            {/* Editor Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/80 border-b border-border/30 shrink-0">
              <File size={14} className="text-primary" />
              <span className="text-foreground text-sm font-mono">{activeFile?.path}</span>
              <span className="text-xs text-muted-foreground ml-auto px-2 py-0.5 rounded bg-zinc-800">
                {getLanguageFromPath(activeFile?.path || "")}
              </span>
            </div>
            
            {/* Monaco Code Editor */}
            <div style={{ height: "calc(100vh - 300px)", minHeight: "500px" }}>
              <Editor
                height="100%"
                language={getLanguageFromPath(activeFile?.path || "")}
                value={activeFile?.content || ""}
                onChange={(value) => updateFileContent(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  padding: { top: 16, bottom: 16 },
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                  formatOnPaste: true,
                  formatOnType: true,
                  bracketPairColorization: { enabled: true },
                  guides: {
                    bracketPairs: true,
                    indentation: true,
                  },
                  scrollbar: {
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                  },
                }}
                loading={
                  <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-muted-foreground">
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Loading editor...
                  </div>
                }
              />
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link to="/app/components">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting || success}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              "Upload Component"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadComponent;
