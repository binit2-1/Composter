import React, { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";

import { components } from "../../data/components.js";

const ComponentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTag, setSelectedTag] = useState("All");

  // Extract unique tags
  const allTags = ["All", ...new Set(components.flatMap(c => c.tags))];

  // Filter components based on search query and selected tag
  const displayComponents = components.filter((comp) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = comp.name.toLowerCase().includes(query) ||
      comp.tags.some((tag) => tag.toLowerCase().includes(query));

    const matchesTag = selectedTag === "All" || comp.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

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

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 relative z-20">
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
        <div className="h-6 w-px bg-white/10"></div>

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${showFilters || selectedTag !== "All"
                ? "bg-violet-500/20 text-violet-300"
                : "text-white/70 hover:text-white"
              }`}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">
              {selectedTag === "All" ? "Filter" : selectedTag}
            </span>
          </button>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedTag === tag
                      ? "bg-violet-500/10 text-violet-400"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayComponents.map((comp) => (
          <Link key={comp.id} to={`/app/components/${comp.id}`}>
            <Card hoverEffect className="h-full group">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-white/5 to-white/10 mb-4 flex items-center justify-center group-hover:from-violet-500/10 group-hover:to-fuchsia-500/10 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-black/20 flex items-center justify-center text-white/20 group-hover:text-violet-400 transition-colors">
                  <span className="text-xl font-bold">Aa</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors">
                {comp.name}
              </h3>
              <p className="text-sm text-white/60 mb-4 line-clamp-2">
                {comp.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                  {comp.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <span className="text-xs text-white/40">{comp.updated}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ComponentsList;