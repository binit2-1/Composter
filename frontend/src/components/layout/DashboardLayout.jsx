import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import DarkVeil from "../external/DarkVeil.jsx";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#050505] font-[font] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DarkVeil />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      </div>

      <Sidebar />
      <Topbar />

      {/* Main Content Area */}
      <main className="pl-64 pt-20 min-h-screen relative z-10">
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;