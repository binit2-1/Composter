import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Circle } from "lucide-react";
import GlassSurface from "../../components/external/GlassSurface.jsx";

const TerminalPage = () => {
    const [lines, setLines] = useState([
        { type: "system", content: "Composter CLI v1.0.0" },
        { type: "system", content: "Type 'help' to see available commands." },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lines]);

    const handleCommand = async (cmd) => {
        const command = cmd.trim().toLowerCase();

        // Push the user's command to the history immediately
        setLines(prev => [...prev, { type: "user", content: cmd }]);
        setInput("");
        setIsTyping(true);

        // Fake a little network delay so it feels like a real CLI
        await new Promise(r => setTimeout(r, 400));

        let response = [];

        switch (command) {
            case "help":
                response = [
                    { type: "success", content: "Available commands:" },
                    { type: "info", content: "  login     Authenticate with Composter" },
                    { type: "info", content: "  push      Upload a component" },
                    { type: "info", content: "  pull      Download a component" },
                    { type: "info", content: "  list      List your components" },
                    { type: "info", content: "  clear     Clear terminal" },
                ];
                break;
            case "login":
                response = [
                    { type: "info", content: "Initiating authentication..." },
                    { type: "wait", content: "Opening browser..." },
                    { type: "success", content: "✓ Successfully logged in as Somesh" },
                ];
                break;
            case "push":
                response = [
                    { type: "error", content: "Error: Missing arguments." },
                    { type: "info", content: "Usage: composter push <filename>" },
                ];
                break;
            case "push button.jsx":
                response = [
                    { type: "info", content: "Analyzing Button.jsx..." },
                    { type: "info", content: "Found 1 dependency: GlareHover.jsx" },
                    { type: "wait", content: "Uploading..." },
                    { type: "success", content: "✓ Button.jsx pushed (v1.0.0)" },
                ];
                break;
            case "pull":
                response = [
                    { type: "error", content: "Error: Missing arguments." },
                    { type: "info", content: "Usage: composter pull <component>" },
                ];
                break;
            case "list":
                response = [
                    { type: "info", content: "Your Components:" },
                    { type: "info", content: "- Button (v1.0.2)" },
                    { type: "info", content: "- Card (v2.1.0)" },
                    { type: "info", content: "- Modal (v1.0.0)" },
                ];
                break;
            case "clear":
                setLines([]);
                setIsTyping(false);
                return;
            default:
                if (command) {
                    response = [{ type: "error", content: `Command not found: ${command}` }];
                }
        }

        // Stream the response lines one by one to simulate processing output
        for (const line of response) {
            await new Promise(r => setTimeout(r, 150));
            setLines(prev => [...prev, line]);
        }

        setIsTyping(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !isTyping) {
            handleCommand(input);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Interactive Terminal</h1>
                <p className="text-white/60">Try out the Composter CLI directly in your browser.</p>
            </div>

            <GlassSurface
                width="100%"
                height="100%"
                borderRadius={16}
                className="h-full relative overflow-hidden group"
                mixBlendMode="normal"
            >
                {/* Terminal Window Header */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2 z-20">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="flex-1 text-center text-xs font-mono text-white/40">
                        user@composter-cli ~
                    </div>
                </div>

                {/* Terminal Content */}
                <div className="absolute inset-0 pt-12 pb-4 px-4 overflow-y-auto font-mono text-sm custom-scrollbar bg-black/40 backdrop-blur-xl">
                    {lines.map((line, i) => (
                        <div key={i} className="mb-1 animate-fade-in">
                            {line.type === "user" && (
                                <div className="flex gap-2 text-white">
                                    <span className="text-fuchsia-400">➜</span>
                                    <span className="text-violet-400">~</span>
                                    <span>{line.content}</span>
                                </div>
                            )}
                            {line.type === "system" && <div className="text-white/50">{line.content}</div>}
                            {line.type === "info" && <div className="text-blue-300">{line.content}</div>}
                            {line.type === "success" && <div className="text-green-400">{line.content}</div>}
                            {line.type === "error" && <div className="text-red-400">{line.content}</div>}
                            {line.type === "wait" && <div className="text-yellow-400 animate-pulse">{line.content}</div>}
                        </div>
                    ))}

                    {/* Input Line */}
                    <div className="flex gap-2 text-white mt-2 items-center">
                        <span className="text-fuchsia-400">➜</span>
                        <span className="text-violet-400">~</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none flex-1 text-white caret-fuchsia-500"
                            autoFocus
                            disabled={isTyping}
                        />
                    </div>
                    <div ref={bottomRef} />
                </div>

                {/* Neon Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-2xl -z-10 opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            </GlassSurface>
        </div>
    );
};

export default TerminalPage;
