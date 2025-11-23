import React from "react";
import { Search, Bell } from "lucide-react";
import GlassSurface from "../external/GlassSurface.jsx";

const Topbar = () => {
    return (
        <div className="h-20 fixed top-0 right-0 left-64 z-30 p-4">
            <GlassSurface
                width="100%"
                height="100%"
                borderRadius={20}
                mixBlendMode="normal"
            >
                <div className="flex items-center justify-between h-full px-6 text-white relative z-10">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-violet-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search components..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:bg-white/10 focus:border-violet-500/30 transition-all"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full border-2 border-[#0d0d0d]"></span>
                        </button>

                        <div className="h-8 w-px bg-white/10 mx-2"></div>

                        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">Somesh Talligeri</p>
                                <p className="text-xs text-white/50">Pro Plan</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20">
                                ST
                            </div>
                        </div>
                    </div>
                </div>
            </GlassSurface>
        </div>
    );
};

export default Topbar;
