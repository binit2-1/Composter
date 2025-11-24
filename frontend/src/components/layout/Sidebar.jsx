import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Home, Box, Tag, User, Settings, LogOut, Book } from "lucide-react";
import GlassSurface from "../external/GlassSurface.jsx";

const Sidebar = () => {
    // Our main navigation items.
    // We might want to fetch these from a config later, but for now hardcoding is fine.
    const navItems = [
        { icon: Home, label: "Home", path: "/app" },
        { icon: Box, label: "My Components", path: "/app/components" },
        { icon: Tag, label: "Tags", path: "/app/tags" },
        { icon: Book, label: "Documentation", path: "/dashboard/docs" },
        { icon: User, label: "Account", path: "/app/account" },
        { icon: Settings, label: "Settings", path: "/app/settings" },
    ];

    return (
        <div className="w-64 h-screen fixed left-0 top-0 p-4 z-40">
            {/* Using GlassSurface for that nice premium feel */}
            <GlassSurface
                width="100%"
                height="100%"
                borderRadius={24}
                className="h-full"
                mixBlendMode="normal"
            >
                <div className="flex flex-col h-full p-4 text-white relative z-10">
                    {/* Logo Area */}
                    <Link to="/" className="block mb-8 px-2 hover:opacity-80 transition-opacity">
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                            Composter
                        </h1>
                        <p className="text-xs text-white/50">Developer Vault</p>
                    </Link>

                    {/* Main Navigation */}
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/app"}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                                        ? "bg-white/10 text-white shadow-lg shadow-violet-500/10"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                    }
                `}
                            >
                                <item.icon size={20} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer Actions (Logout, etc.) */}
                    <div className="mt-auto pt-4 border-t border-white/10">
                        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
                            <LogOut size={20} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </GlassSurface>
        </div>
    );
};

export default Sidebar;
