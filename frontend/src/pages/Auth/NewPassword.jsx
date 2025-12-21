import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/composter-logos/full_logo.png";
import { resetPassword } from "@/lib/auth-client";

const ResetPassword = () => {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);   
    const [passwordError, setPasswordError] = useState(null);

    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
        return (
            <div className="min-h-screen w-full bg-background relative flex items-center justify-center overflow-hidden">
                <div className="relative z-10 w-full max-w-md mx-4">
                    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-black/20 text-center">
                        <h1 className="text-3xl font-medium mb-3 text-balance">
                            Invalid Password Reset Link
                        </h1>
                        <p className="text-foreground/80">
                            The password reset link is missing a token. Please check your email for the correct link.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            setLoading(false);
            return;
        }
        const { data, error } = await resetPassword({
            token: token,
            newPassword: password
        });
        if (error) {
            if(error.message === "Invalid token") {
                setPasswordError("The password reset link is invalid or has expired.");
            } else {
                setPasswordError(error.message);
            }
        } else {
            setSent("Password has been reset successfully. You can now log in with your new password.");
            setPasswordError(null);
        }
        setLoading(false);
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
                        <h1 className="text-3xl font-medium mb-3 text-balance">
                            Create a New Password
                        </h1>
                    </div>

                    {sent ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-foreground font-medium mb-2">You have updated your password successfully. You can now log in with your new password.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-2">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="New password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder-muted-foreground/50 outline-none transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 hover:border-border"
                                />

                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground/80 mb-2 mt-6">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder-muted-foreground/50 outline-none transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 hover:border-border"
                                />
                            </div>

                             
                                {passwordError && (
                                    <div className=" text-red-400">
                                        {passwordError}
                                    </div>
                                )}
                              

                            <Button type="submit" className="w-full h-12 text-base rounded-xl" disabled={loading}>
                                {loading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
