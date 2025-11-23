import React from "react";
import { Link } from "react-router-dom";
import DarkVeil from "../components/external/DarkVeil.jsx";
import SplitText from "../components/external/text-animation/SplitText.jsx";
import GlassSurface from "../components/external/GlassSurface.jsx";
import LoginButton from "../components/external/Button.jsx";
import logo from "../assets/logo.png";

const LandingPage = () => {
  return (
    <div className="w-screen min-h-screen font-[font] relative overflow-x-hidden bg-black">
      <DarkVeil />

      {/* Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 px-6 md:px-20">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="group flex items-center gap-3">
            <img
              src={logo}
              alt="Composter Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-bold text-white hover:scale-105 transition-transform">
              Composter
            </h1>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/signup">
              <GlassSurface
                width={140}
                height={44}
                borderRadius={30}
                className="cursor-pointer px-4 hover:brightness-110 active:scale-95"
                mixBlendMode="screen"
              >
                <span className="text-sm text-white font-medium">Sign up</span>
              </GlassSurface>
            </Link>

            <Link to="/login">
              <LoginButton width="140px" height="44px" className="-translate-y-px">
                Login
              </LoginButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 h-screen flex items-center justify-center px-4">
        <div className="relative text-center w-full max-w-5xl mx-auto">
          <div className="space-y-2">
            <SplitText
              text="Your Personal Vault"
              className="text-5xl md:text-7xl text-white font-medium leading-tight"
              delay={50}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />

            <SplitText
              text={"For\u00A0React\u00A0Components"}
              className="text-5xl md:text-7xl text-white font-medium leading-tight"
              delay={50}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>

          <div className="w-full mt-8 flex justify-center">
            <SplitText
              text={
                "Upload, organize, and retrieve your components instantly with our CLI and dashboard"
              }
              className="text-lg md:text-xl text-white/90 font-light max-w-3xl leading-relaxed text-center"
              delay={20}
              duration={1}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>

          <div className="mt-12 flex justify-center gap-6 opacity-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards" style={{ animationDelay: '1s' }}>
            <Link to="/docs">
              <button className="px-8 py-3 rounded-full bg-cyan-400 text-black font-bold hover:scale-105 transition-transform">
                Browse Docs
              </button>
            </Link>
            <Link to="/app">
              <button className="px-8 py-3 rounded-full bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
