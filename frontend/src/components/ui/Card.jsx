import React, { memo } from "react";
import GlassSurface from "../external/GlassSurface.jsx";

/**
 * Reusable Card component based on the GlassSurface.
 * Provides a consistent container with optional hover effects.
 */
const Card = ({
    children,
    className = "",
    width = "100%",
    height = "auto",
    hoverEffect = false,
    ...props
}) => {
    return (
        <GlassSurface
            width={width}
            height={height}
            borderRadius={24}
            className={`
        ${className}
        ${hoverEffect ? 'hover:scale-[1.02] hover:brightness-110 cursor-pointer' : ''}
`}
            mixBlendMode="normal"
            {...props}
        >
            <div className="w-full h-full p-6 relative z-10">
                {children}
            </div>
        </GlassSurface>
    );
};

export default memo(Card);
