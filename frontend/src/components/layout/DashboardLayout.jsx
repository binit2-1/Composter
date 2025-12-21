import { Outlet, NavLink } from "react-router-dom";
import { Home, Box, Settings } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { cn } from "@/lib/utils";

// Mobile bottom navigation
const MobileNav = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/app" },
    { icon: Box, label: "Components", path: "/app/components" },
    { icon: Settings, label: "Settings", path: "/app/settings" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-lg border-t border-border/30">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/app"}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-[64px]",
              isActive
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-foreground relative">
      {/* Subtle purple gradient backgrounds - hidden on mobile for performance */}
      <div 
        aria-hidden 
        className="hidden sm:block fixed top-0 right-0 w-[50rem] h-[50rem] -translate-y-1/3 translate-x-1/4 rounded-full bg-[radial-gradient(circle,hsla(262,83%,58%,.06)_0%,transparent_70%)] pointer-events-none" 
      />
      <div 
        aria-hidden 
        className="hidden sm:block fixed bottom-0 left-0 w-[40rem] h-[40rem] translate-y-1/3 -translate-x-1/4 rounded-full bg-[radial-gradient(circle,hsla(280,83%,58%,.04)_0%,transparent_70%)] pointer-events-none" 
      />

      <Sidebar />
      <Topbar />
      <MobileNav />

      {/* Main Content Area */}
      <main className="lg:pl-64 pt-16 pb-20 lg:pb-0 min-h-screen relative z-10">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;