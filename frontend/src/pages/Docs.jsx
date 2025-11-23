import React from "react";
import { Terminal, Download, RefreshCw, UploadCloud, ArrowRight } from "lucide-react";
import GlassSurface from "../components/external/GlassSurface.jsx";
import CodeBlock from "../components/ui/CodeBlock.jsx";
import DarkVeil from "../components/external/DarkVeil.jsx";
import Topbar from "../components/layout/Topbar.jsx"; // Reusing Topbar for consistent nav
import { Link } from "react-router-dom";

const Docs = () => {
  const sections = [
    {
      id: "install",
      title: "Installation",
      icon: Download,
      content: "Install the Composter CLI globally to access your components from anywhere.",
      code: "npm install -g composter-cli"
    },
    {
      id: "login",
      title: "Authentication",
      icon: Terminal,
      content: "Login to your account to sync your local environment.",
      code: "composter login"
    },
    {
      id: "push",
      title: "Push Component",
      icon: UploadCloud,
      content: "Push a component from your current directory to your vault.",
      code: "composter push ./src/components/Button.jsx"
    },
    {
      id: "pull",
      title: "Pull Component",
      icon: Download,
      content: "Pull a component from your vault to your project.",
      code: "composter pull Button"
    },
    {
      id: "sync",
      title: "Sync Project",
      icon: RefreshCw,
      content: "Sync all components in your project with the latest versions.",
      code: "composter sync"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] font-[font] text-white relative overflow-hidden">
      <DarkVeil />

      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
          Composter
        </Link>
        <div className="flex gap-4">
          <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors">Login</Link>
          <Link to="/app" className="text-sm font-medium text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">Dashboard</Link>
        </div>
      </div>

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Sidebar */}
        <div className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-32 space-y-1">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Getting Started</h3>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-9 space-y-16">
          <div>
            <h1 className="text-5xl font-bold mb-6">Documentation</h1>
            <p className="text-xl text-white/60 max-w-2xl">
              Learn how to use the Composter CLI to manage your component library efficiently.
            </p>
          </div>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-violet-400">
                  <section.icon size={24} />
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>

              <p className="text-white/70 mb-6 text-lg">{section.content}</p>

              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={16}
                className="overflow-hidden"
                mixBlendMode="normal"
              >
                <CodeBlock code={section.code} language="bash" className="border-none bg-transparent" />
              </GlassSurface>
            </section>
          ))}

          <div className="pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold mb-6">Ready to start?</h2>
            <Link to="/signup">
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform flex items-center gap-2">
                Create Free Account <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;