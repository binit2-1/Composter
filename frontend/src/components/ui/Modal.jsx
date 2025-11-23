import React, { useEffect } from 'react';
import GlassSurface from '../external/GlassSurface.jsx';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    children,
    title,
    width = 520,
    className = ""
}) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => (document.body.style.overflow = '');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <GlassSurface
                width={width}
                height={'auto'}
                borderRadius={24}
                className={`relative z-10 max-w-full ${className}`}
                mixBlendMode="normal"
            >
                <div className="w-full p-6 text-white relative">
                    <div className="flex items-center justify-between mb-6">
                        {title && <h3 className="text-xl font-semibold">{title}</h3>}
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {children}
                </div>
            </GlassSurface>
        </div>
    );
};

export default Modal;
