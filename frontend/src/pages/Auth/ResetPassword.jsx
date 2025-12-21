import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/composter-logos/full_logo.png";
import { requestPasswordReset } from "@/lib/auth-client";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await requestPasswordReset({
            email: email,
            redirectTo: `${import.meta.env.VITE_CLIENT_URL}/new-password`
        });
        setLoading(false);
        if (error) {
            setError(true);
        } else {
            setSent(true);
            setError(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-background relative flex items-center justify-center overflow-hidden">
            {/* Purple gradient background effects */}
            <div 
                aria-hidden 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-[radial-gradient(circle,hsla(262,83%,58%,.1)_0%,transparent_60%)] pointer-events-none" 
            />
            <div 
                aria-hidden 
                className="absolute top-0 right-1/4 w-[30rem] h-[30rem] rounded-full bg-[radial-gradient(circle,hsla(280,83%,58%,.08)_0%,transparent_70%)] pointer-events-none blur-2xl" 
            />

            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <img src={logo} alt="Composter" className="h-12 w-12 object-contain rounded-xl" />
                    <span className="text-2xl font-bold text-foreground">Composter</span>
                </Link>

                {/* Card */}
                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-black/20">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>

                    <div className="mb-8">
                        {error && (
                            <div className="py-3 text-red-400">
                                Something went wrong, please try again later.
                            </div>
                        )}
                        <h1 className="text-3xl font-medium mb-3 text-balance">
                            Reset Password
                        </h1>
                        <p className="text-muted-foreground text-balance">Enter your email to receive reset instructions</p>
                    </div>

                    {sent ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-foreground font-medium mb-2">Check your email</p>
                            <p className="text-muted-foreground text-sm">We've sent reset instructions to {email}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder-muted-foreground/50 outline-none transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 hover:border-border"
                                />
                            </div>

                            <Button type="submit" className="w-full h-12 text-base rounded-xl" disabled={loading}>
                                {loading ? "Sending..." : "Send Instructions"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
