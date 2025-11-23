import React from "react";
import { Box, ArrowUp, Clock, Star } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";

const StatCard = ({ title, value, change, icon: Icon }) => (
  <Card className="h-full">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-white/60 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className="p-2 rounded-lg bg-white/5 text-white/80">
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs">
      <span className="text-emerald-400 flex items-center gap-1">
        <ArrowUp size={12} /> {change}
      </span>
      <span className="text-white/40">vs last month</span>
    </div>
  </Card>
);

const DashboardHome = () => {
  const recentComponents = [
    { name: "Auth Modal", type: "UI Element", date: "2 mins ago", status: "Live" },
    { name: "Data Table", type: "Layout", date: "2 hours ago", status: "Draft" },
    { name: "Sidebar Nav", type: "Navigation", date: "1 day ago", status: "Live" },
    { name: "Payment Form", type: "Form", date: "2 days ago", status: "Review" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/60">Welcome back, here's what's happening with your components.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Components" value="124" change="+12%" icon={Box} />
        <StatCard title="Total Views" value="45.2k" change="+8%" icon={Star} />
        <StatCard title="Recent Updates" value="12" change="+24%" icon={Clock} />
        <StatCard title="Storage Used" value="1.2GB" change="+2%" icon={Box} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Components</h2>
          <div className="space-y-4">
            {recentComponents.map((comp, i) => (
              <Card key={i} hoverEffect className="group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-300">
                      <Box size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium group-hover:text-violet-400 transition-colors">{comp.name}</h4>
                      <p className="text-xs text-white/50">{comp.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/40">{comp.date}</span>
                    <Badge variant={comp.status === "Live" ? "success" : "secondary"}>
                      {comp.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions or Info */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <Card className="h-auto">
            <div className="space-y-3">
              <button className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors text-left flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300">
                  <Box size={16} />
                </div>
                Create New Component
              </button>
              <button className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors text-left flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-300">
                  <Clock size={16} />
                </div>
                View History
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;