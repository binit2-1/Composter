import React, { useState, useEffect } from "react";
import { Search, Filter, Layers, Code2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";

// --- SUB-COMPONENT: Simple card without live preview ---
const ComponentCard = ({ comp, formatTimeAgo }) => {
  // Parse dependencies count
  let depsCount = 0;
  if (comp.dependencies) {
    try {
      const deps = typeof comp.dependencies === 'string' 
        ? JSON.parse(comp.dependencies) 
        : comp.dependencies;
      depsCount = Object.keys(deps).length;
    } catch (e) {}
  }

  return (
    <Link to={`/app/components/${comp.id}`}>
      <Card hoverEffect className="h-full group cursor-pointer">
        {/* Preview Area - Static Placeholder */}
        <div className="aspect-video rounded-xl mb-4 overflow-hidden border border-white/5 bg-gradient-to-br from-[#151515] to-[#0a0018] flex items-center justify-center relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center gap-2 text-white/40 group-hover:text-violet-400 transition-colors">
            <Code2 size={32} strokeWidth={1.5} />
            <div className="flex items-center gap-1 text-xs">
              <Eye size={12} />
              <span>Click to preview</span>
            </div>
          </div>
        </div>

        {/* Component Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
            {comp.title}
          </h3>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">
              {comp.category?.name || "Uncategorized"}
            </span>
            <div className="flex items-center gap-3">
              {depsCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <Layers size={12} /> {depsCount}
                </span>
              )}
              <span className="text-white/40 text-xs">
                {formatTimeAgo(comp.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const ComponentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [components, setComponents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compsRes, catsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/components/list`, { 
            headers: { "Content-Type": "application/json" },
            credentials: "include" 
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, { 
            headers: { "Content-Type": "application/json" },
            credentials: "include" 
          })
        ]);
        
        const compsData = await compsRes.json();
        const catsData = await catsRes.json();

        setComponents(compsData.components || []);
        setCategories(catsData.categories || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter components based on search query and category
  const displayComponents = components.filter((comp) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = comp.title.toLowerCase().includes(query) ||
           (comp.category?.name || "").toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "all" || comp.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Components</h1>
          <p className="text-white/60">Manage and organize your component library</p>
        </div>
        <Link to="/app/upload">
          <Button>
            Upload Component
          </Button>
        </Link>
      </div>

      {/* Search Bar with Filter */}
      <div className="flex items-center gap-4 bg-[#060010] p-2 rounded-2xl border border-white/10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full bg-transparent border-none text-white placeholder-white/40 pl-10 pr-4 py-2 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              selectedCategory !== "all" 
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" 
                : "bg-[#0a0018] text-white/70 hover:text-white border border-white/10"
            }`}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">
              {selectedCategory === "all" ? "Filter" : selectedCategory}
            </span>
          </button>
          
          {/* Filter Dropdown */}
          {showFilter && (
            <div className="absolute right-0 mt-2 w-56 bg-[#060010] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setShowFilter(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                  selectedCategory === "all"
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-white/70 hover:bg-[#0a0018] hover:text-white"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setShowFilter(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                    selectedCategory === category.name
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-white/70 hover:bg-[#0a0018] hover:text-white"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {!loading && displayComponents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayComponents.map((comp) => (
            <ComponentCard key={comp.id} comp={comp} formatTimeAgo={formatTimeAgo} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && displayComponents.length === 0 && (
        <div className="text-center text-white/60 py-12">
          {searchQuery ? "No components found matching your search" : "No components yet. Upload your first component!"}
        </div>
      )}
    </div>
  );
};

export default ComponentsList;