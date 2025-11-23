import React from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassSurface from "../../components/external/GlassSurface.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import DarkVeil from "../../components/external/DarkVeil.jsx";

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement actual login logic
        navigate("/app");
    };

    return (
        <div className="w-screen h-screen font-[font] relative flex items-center justify-center overflow-hidden">
            <DarkVeil />

            {/* Background Blobs - Optimized blur for better performance */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[40px] mix-blend-screen pointer-events-none" style={{ willChange: 'transform' }} />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[30px] mix-blend-screen pointer-events-none" style={{ willChange: 'transform' }} />

            <GlassSurface
                width={480}
                height="auto"
                borderRadius={24}
                className="relative z-10 p-8"
                mixBlendMode="normal"
            >
                <div className="w-full text-white">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                            Welcome Back
                        </h1>
                        <p className="text-white/60">Enter your credentials to access your vault</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            id="email"
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            required
                        />

                        <div>
                            <Input
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="••••••••"
                                required
                            />
                            <div className="flex justify-end mt-2">
                                <Link to="/reset-password" class="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button type="submit" width="100%" className="w-full mt-4">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-white/60">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </GlassSurface>
        </div>
    );
};

export default Login;
