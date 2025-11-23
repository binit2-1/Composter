import React from "react";
import { Outlet } from "react-router-dom";
import DocsSidebar from "./DocsSidebar.jsx";
import DarkVeil from "../external/DarkVeil.jsx";
import Topbar from "./Topbar.jsx";

const DocsLayout = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-violet-500/30">
            <DarkVeil />

            <div className="flex">
                {/* Sidebar Wrapper */}
                <div className="hidden lg:block w-64 fixed left-4 top-4 bottom-4 z-40">
                    <DocsSidebar />
                </div>

                {/* Main Content Wrapper */}
                <div className="flex-1 lg:ml-72 p-4 min-h-screen flex flex-col">
                    <Topbar />

                    <main className="flex-1 mt-8 pb-12 animate-fade-in">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DocsLayout;
