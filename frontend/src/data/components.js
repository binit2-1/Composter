export const components = [
    {
        id: 1,
        name: "Pixel Card",
        description: "A card that reveals a pixelated pattern on hover, perfect for retro-themed UIs or adding a glitchy tech feel.",
        tags: ["UI", "Card", "Hover Effect"],
        version: "1.0.0",
        updated: "2 days ago",
        author: "Somesh Talligeri",
        code: `import React from 'react';

const PixelCard = () => {
  return (
    <div className="group relative w-[300px] h-[350px] bg-[#111] rounded-xl overflow-hidden border border-white/10">
      {/* Pixel Grid Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{
             backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
             backgroundSize: '10px 10px'
           }}
      />
      
      <div className="relative z-10 p-6 h-full flex flex-col justify-end">
        <h3 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          Pixel Card
        </h3>
        <p className="text-white/60 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
          Hover to reveal the pixel grid pattern.
        </p>
      </div>
    </div>
  );
};

export default PixelCard;`
    },
    {
        id: 2,
        name: "Spotlight Card",
        description: "A card with a spotlight gradient that follows your mouse cursor, creating a premium lighting effect.",
        tags: ["UI", "Interactive", "Mouse Follow"],
        version: "2.1.0",
        updated: "1 week ago",
        author: "Somesh Talligeri",
        code: `import React, { useRef, useState } from 'react';

const SpotlightCard = () => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="relative w-[300px] h-[200px] bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: \`radial-gradient(600px circle at \${position.x}px \${position.y}px, rgba(255,255,255,0.1), transparent 40%)\`
        }}
      />
      <span className="text-white font-medium z-10">Hover me</span>
    </div>
  );
};

export default SpotlightCard;`
    },
    {
        id: 3,
        name: "Magnet Lines",
        description: "A grid of lines that rotate to face your cursor, creating a magnetic field visualization.",
        tags: ["Canvas", "Animation", "Interactive"],
        version: "1.0.5",
        updated: "3 days ago",
        author: "Somesh Talligeri",
        code: `import React, { useEffect, useRef } from 'react';

const MagnetLines = () => {
  // Simplified version for preview
  return (
    <div className="w-full h-[300px] bg-black flex items-center justify-center overflow-hidden relative">
      <div className="grid grid-cols-10 gap-4">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="w-1 h-8 bg-violet-500/50 rounded-full transform hover:rotate-45 transition-transform duration-300" />
        ))}
      </div>
      <p className="absolute bottom-4 text-white/40 text-sm">Move cursor to interact</p>
    </div>
  );
};

export default MagnetLines;`
    },
    {
        id: 4,
        name: "Tilted Card",
        description: "A 3D card that tilts based on mouse position, adding depth and interactivity to your UI.",
        tags: ["3D", "Transform", "Card"],
        version: "1.2.0",
        updated: "5 hours ago",
        author: "Somesh Talligeri",
        code: `import React from 'react';

const TiltedCard = () => {
  return (
    <div className="perspective-1000 w-[300px] h-[400px] flex items-center justify-center">
      <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl shadow-2xl transform transition-transform duration-200 hover:scale-105 hover:rotate-y-12 hover:rotate-x-12 flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-3xl font-bold mb-2">3D Tilt</h2>
        <p className="text-center opacity-80">Hover to see the perspective effect.</p>
      </div>
    </div>
  );
};

export default TiltedCard;`
    },
    {
        id: 5,
        name: "True Focus",
        description: "An input field that dims the surrounding page when focused, helping users concentrate on the task.",
        tags: ["Form", "Input", "UX"],
        version: "1.0.0",
        updated: "1 month ago",
        author: "Somesh Talligeri",
        code: `import React, { useState } from 'react';

const TrueFocus = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {isFocused && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500" />
      )}
      <div className="relative z-50">
        <label className="block text-white mb-2 font-medium">Focus Input</label>
        <input
          type="text"
          placeholder="Focus me..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 bg-[#222] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
        />
      </div>
    </div>
  );
};

export default TrueFocus;`
    },
    {
        id: 6,
        name: "Hyperspeed",
        description: "A high-speed warp drive effect using Three.js, perfect for immersive landing page backgrounds.",
        tags: ["Three.js", "Background", "WebGL"],
        version: "0.9.0",
        updated: "2 weeks ago",
        author: "Somesh Talligeri",
        code: `// Requires @react-three/fiber and @react-three/drei
import React from 'react';

const Hyperspeed = () => {
  return (
    <div className="w-full h-[400px] bg-black relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[2px] h-[100px] bg-white/50 animate-ping absolute left-1/4 top-1/4" />
        <div className="w-[2px] h-[150px] bg-white/30 animate-ping absolute right-1/3 top-1/2 delay-100" />
        <div className="w-[2px] h-[80px] bg-white/70 animate-ping absolute left-1/2 bottom-1/4 delay-300" />
        <h1 className="text-4xl font-bold text-white italic tracking-tighter z-10 mix-blend-difference">
          HYPERSPEED
        </h1>
      </div>
    </div>
  );
};

export default Hyperspeed;`
    },
    {
        id: 7,
        name: "Decay Card",
        description: "A card that appears to disintegrate into particles when hovered, using SVG filters and noise.",
        tags: ["SVG", "Filter", "Experimental"],
        version: "1.0.1",
        updated: "4 days ago",
        author: "Somesh Talligeri",
        code: `import React from 'react';

const DecayCard = () => {
  return (
    <div className="group relative w-[300px] h-[400px] bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="p-8 relative z-10">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 group-hover:blur-[2px] transition-all duration-500">
          Decay
        </h3>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default DecayCard;`
    },
    {
        id: 8,
        name: "Variable Font Hover",
        description: "Text that smoothly animates its weight and width properties on hover using variable fonts.",
        tags: ["Typography", "Animation", "CSS"],
        version: "1.1.0",
        updated: "Yesterday",
        author: "Somesh Talligeri",
        code: `import React from 'react';

const VariableFont = () => {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <h1 
        className="text-6xl text-white cursor-default transition-all duration-500 hover:font-[900] hover:tracking-widest"
        style={{ fontVariationSettings: '"wght" 100, "wdth" 85' }}
      >
        HOVER ME
      </h1>
    </div>
  );
};

export default VariableFont;`
    }
];
