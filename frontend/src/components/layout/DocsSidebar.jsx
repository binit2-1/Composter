import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Book, Terminal, Code, Layers, Shield, FileText, HelpCircle, GitBranch, ArrowLeft } from "lucide-react";
import GlassSurface from "../external/GlassSurface.jsx";

const DocsSidebar = () => {
    const navItems = [
        { icon: Book, label: "Introduction", path: "/dashboard/docs#introduction" },
        { icon: Layers, label: "Getting Started", path: "/dashboard/docs#getting-started" },
        { icon: Code, label: "Installation", path: "/dashboard/docs#installation" },
        { icon: Terminal, label: "CLI Commands", path: "/dashboard/docs#cli" },
        { icon: FileText, label: "Component Structure", path: "/dashboard/docs#structure" },
        { icon: Shield, label: "Best Practices", path: "/dashboard/docs#best-practices" },
        { icon: GitBranch, label: "Versioning", path: "/dashboard/docs#versioning" },
        { icon: HelpCircle, label: "FAQ", path: "/dashboard/docs#faq" },
    ];

    return (
        <div className="w-64 h-[calc(100vh-2rem)] sticky top-4">
            <GlassSurface
                width="100%"
                height="100%"
                borderRadius={24}
                className="h-full"
                mixBlendMode="normal"
            >
                <div className="flex flex-col h-full p-4 text-white relative z-10">
                    <div className="mb-8 px-2">
                        <Link to="/app" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm">Back to Dashboard</span>
                        </Link>
                        <h2 className="text-lg font-bold text-white">Documentation</h2>
                        <p className="text-xs text-white/50">Version 1.0.0</p>
                    </div>

                    <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/dashboard/docs"}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? "bg-white/10 text-white shadow-lg shadow-violet-500/10"
                                        : "text-white/60 hover:text-white hover:bg-white/5 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                    }
                `}
                            >
                                <item.icon size={18} className={`transition-colors ${
                                    // active state is handled by NavLink className, but we can add group-hover effects
                                    "group-hover:text-violet-400"
                                    }`} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </NavLink>
                        ))}

                        <div className="my-4 border-t border-white/10" />

                        <NavLink
                            to="/dashboard/docs/terminal"
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group mt-2
                ${isActive
                                    ? "bg-fuchsia-500/20 text-white shadow-lg shadow-fuchsia-500/20 border border-fuchsia-500/30"
                                    : "text-white/60 hover:text-white hover:bg-fuchsia-500/10 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                                }
              `}
                        >
                            <Terminal size={18} className="group-hover:text-fuchsia-400" />
                            <span className="text-sm font-medium">Interactive Terminal</span>
                        </NavLink>
                    </nav>
                </div>
            </GlassSurface>
        </div>
    );
};

export default DocsSidebar;
