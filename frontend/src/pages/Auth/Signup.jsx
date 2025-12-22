import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../lib/auth-client";
import { Button } from "@/components/ui/button";
import logo from "@/assets/composter-logos/full_logo.png";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

// Define the validation schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Validate Form Data locally using Zod
    const result = signupSchema.safeParse({ name, email, password });

    if (!result.success) {
      // Display the first validation error found
      const errorMessage = result.error.issues?.[0]?.message || "Invalid input";
      setError(errorMessage);
      return;
    }

    setLoading(true);

    try {
      // 2. Call the API only if validation passes
      const { error: apiError } = await signUp.email({
        name,
        email,
        password,
      });

      if (apiError) {
        setError(
          apiError.message || "Failed to create account. Please try again."
        );
        return;
      }

      navigate("/app");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background relative flex items-center justify-center overflow-hidden py-8">
      {/* Background effects */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-[40rem] h-[40rem] -translate-y-1/4 -translate-x-1/4 rounded-full bg-[radial-gradient(circle,hsla(262,83%,58%,.15)_0%,transparent_70%)] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[35rem] h-[35rem] translate-y-1/4 translate-x-1/4 rounded-full bg-[radial-gradient(circle,hsla(280,83%,58%,.12)_0%,transparent_70%)] pointer-events-none blur-2xl"
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img
            src={logo}
            alt="Composter"
            className="h-12 w-12 object-contain"
          />
          <span className="text-2xl font-bold text-foreground">Composter</span>
        </Link>

        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-medium mb-3 text-balance">
              Create Account
            </h1>
            <p className="text-muted-foreground text-balance">
              Join the community of developers
            </p>
            {error && (
              <p className="text-red-400 text-sm mt-3 bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
                {error}
              </p>
            )}
          </div>

          {/* noValidate allows Zod to handle the errors instead of the browser */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder-muted-foreground/50 outline-none transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 hover:border-border"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                  className="absolute right-5 cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {passwordVisible ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base rounded-xl mt-2"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
