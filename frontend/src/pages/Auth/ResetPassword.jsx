import React from "react";
import { Link } from "react-router-dom";
import GlassSurface from "../../components/external/GlassSurface.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import DarkVeil from "../../components/external/DarkVeil.jsx";
import { ArrowLeft } from "lucide-react";

const ResetPassword = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement reset logic
    };

    return (
        <div className="w-screen h-screen font-[font] relative flex items-center justify-center overflow-hidden">
            <DarkVeil />

            {/* Background Blob - Optimized blur for better performance */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[40px] mix-blend-screen pointer-events-none" style={{ willChange: 'transform' }} />

            <GlassSurface
                width={480}
                height="auto"
                borderRadius={24}
                className="relative z-10 p-8"
                mixBlendMode="normal"
            >
                <div className="w-full text-white">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                        <p className="text-white/60">Enter your email to receive reset instructions</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            id="email"
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            required
                        />

                        <Button type="submit" width="100%" className="w-full">
                            Send Instructions
                        </Button>
                    </form>
                </div>
            </GlassSurface>
        </div>
    );
};

export default ResetPassword;
