import React from "react";

const Badge = ({
    children,
    variant = "default", // default, outline, secondary
    className = ""
}) => {
    const variants = {
        default: "bg-violet-500/20 text-violet-200 border border-violet-500/20",
        outline: "bg-transparent border border-white/20 text-white/70",
        secondary: "bg-white/5 text-white/60 border border-white/5",
        success: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/20",
    };

    return (
        <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant] || variants.default}
      ${className}
    `}>
            {children}
        </span>
    );
};

export default Badge;
