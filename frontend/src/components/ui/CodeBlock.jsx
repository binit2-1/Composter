import React from "react";
import { Copy } from "lucide-react";

const CodeBlock = ({ code, language = "javascript", className = "" }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        // Could add toast notification here
    };

    return (
        <div className={`relative group rounded-xl overflow-hidden bg-[#0d0d0d] border border-white/10 ${className}`}>
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                    title="Copy code"
                >
                    <Copy size={16} />
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
