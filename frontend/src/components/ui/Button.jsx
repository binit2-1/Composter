import React, { memo } from "react";
import GlareHover from "../external/GlareHover.jsx";

/**
 * Primary Button component for the application.
 * Wraps the GlareHover effect for a premium feel.
 */
const Button = ({
    onClick,
    className = "",
    children,
    width = "auto",
    height = "44px",
    variant = "primary", // primary, secondary, ghost
    ...props
}) => {
    // Common base styles for touch targets and layout
    const baseStyles = "flex items-center justify-center font-semibold transition-all duration-200 active:scale-95";

    if (variant === "primary") {
        return (
            <button
                onClick={onClick}
                className={`${baseStyles} text-white bg-transparent border-none p-0 ${className}`}
                {...props}
            >
                <GlareHover
                    width={width}
                    height={height}
                    background="linear-gradient(135deg, #9E59ED, #7B00FF)"
                    borderRadius="999px"
                    glareColor="#ffffff"
                    glareOpacity={0.22}
                    glareAngle={-45}
                    glareSize={220}
                    transitionDuration={600}
                    className="px-6 py-2 flex items-center justify-center gap-2"
                    style={{ boxShadow: "0 6px 18px rgba(43,7,118,0.35)" }}
                >
                    {children}
                </GlareHover>
            </button>
        );
    }

    if (variant === "secondary") {
        return (
            <button
                onClick={onClick}
                className={`${baseStyles} px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 ${className}`}
                style={{ height, width }}
                {...props}
            >
                {children}
            </button>
        );
    }

    if (variant === "ghost") {
        return (
            <button
                onClick={onClick}
                className={`${baseStyles} px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 ${className}`}
                style={{ height }}
                {...props}
            >
                {children}
            </button>
        );
    }

    return null;
};

export default memo(Button);
