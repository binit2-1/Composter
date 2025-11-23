import React from "react";

const Input = ({
    label,
    id,
    type = "text",
    className = "",
    error,
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-white/80 mb-1.5 ml-1"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`
          w-full px-4 py-2.5 rounded-xl
          bg-white/5 border border-white/10
          text-white placeholder-white/30
          outline-none transition-all duration-200
          focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
          hover:border-white/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400 ml-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
