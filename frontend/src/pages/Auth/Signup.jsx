import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassSurface from "../../components/external/GlassSurface.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import DarkVeil from "../../components/external/DarkVeil.jsx";
import { signUp } from "../../lib/auth-client.ts";

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { error } = await signUp.email({
                name,
                email,
                password,
            });

            if (error) {
                setError(error.message || "Failed to create account. Please try again.");
                return;
            }

            // Redirect to dashboard on success
            navigate("/app");
        } catch (err) {
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen font-[font] relative flex items-center justify-center overflow-hidden">
            <DarkVeil />

            {/* Background Blobs - Optimized blur for better performance */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[40px] mix-blend-screen pointer-events-none" style={{ willChange: 'transform' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[30px] mix-blend-screen pointer-events-none" style={{ willChange: 'transform' }} />

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
                            Create Account
                        </h1>
                        <p className="text-white/60">Join the community of developers</p>
                        {error && (
                            <p className="text-red-400 text-sm mt-2">{error}</p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            id="name"
                            type="text"
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <Input
                            id="email"
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" width="100%" className="w-full mt-4" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-white/60">
                        Already have an account?{" "}
                        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </GlassSurface>
        </div>
    );
};

export default Signup;
