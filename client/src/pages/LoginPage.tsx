import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuantumLogo from "../components/animations/QuantumLogo";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import ThemeSwitcher from "../components/ThemeSwitcher";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      // If user has 2FA enabled, redirect to verification step before issuing JWT
      if (data.requiresTwoFactor) {
        navigate("/verify-2fa", { state: { userId: data.userId } });
        return;
      }

      // Standard login - store user and JWT, redirect to dashboard
      login(data);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-quantum-light-bg dark:bg-quantum-bg flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm flex flex-col items-center gap-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <QuantumLogo size={120} />
          <h1 className="text-3xl font-bold text-quantum-accent dark:text-quantum-text">Quantum</h1>
          <p className="text-quantum-muted text-sm text-center">
            Project intelligence for modern teams
          </p>
        </div>

        <div className="w-full bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border rounded-2xl p-6 flex flex-col gap-4">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 text-quantum-gold text-sm outline-none focus:border-quantum-accent transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 text-quantum-gold text-sm outline-none focus:border-quantum-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-quantum-accent hover:bg-quantum-accent-hover text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in to workspace"}
            </button>
            <Link
              to="/forgot-password"
              className="text-center text-quantum-light-muted dark:text-quantum-muted hover:text-quantum-accent text-xs transition-colors"
            >
              Forgot your password?
            </Link>
          </form>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-quantum-border" />
            <span className="text-quantum-muted text-xs">or</span>
            <div className="flex-1 h-px bg-quantum-border" />
          </div>
          <Link to="/register" className="text-quantum-accent text-sm text-center hover:underline">
            Create a new account →
          </Link>
        </div>
        <div className="mt-4">
          <ThemeSwitcher />
        </div>
      </motion.div>
    </div>
  );
}
