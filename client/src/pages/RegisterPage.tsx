import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuantumLogo from "../components/animations/QuantumLogo";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateUsername = (value: string) => {
    if (value.length < 5) {
      setUsernameError("Username must be at least 5 characters");
    } else if (!/^[a-zA-Z0-9-]+$/.test(value)) {
      setUsernameError("Letters, numbers, and hyphens only");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else if (!/(?=.*[A-Z])/.test(value)) {
      setPasswordError("Must include an uppercase letter");
    } else if (!/(?=.*[0-9])/.test(value)) {
      setPasswordError("Must include a number");
    } else if (!/(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~])/.test(value)) {
      setPasswordError("Must include a special character");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        username,
        email,
        password,
      });
      login(data);
      navigate("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-quantum-light-bg dark:bg-quantum-bg flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm flex flex-col items-center gap-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <QuantumLogo size={80} />
          <h1 className="text-3xl font-bold text-quantum-text">Quantum</h1>
          <p className="text-quantum-muted text-sm text-center">
            Create your account
          </p>
        </div>

        {/* Form */}
        <div className="w-full bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border rounded-2xl p-6 flex flex-col gap-4">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 text-quantum-gold text-sm outline-none focus:border-quantum-accent transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUsername(e.target.value);
                }}
                required
                minLength={8}
                maxLength={20}
                className="bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 text-quantum-gold text-sm outline-none focus:border-quantum-accent transition-colors"
              />
              {usernameError && (
                <p className="text-red-400 text-xs mt-1">{usernameError}</p>
              )}
            </div>
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  required
                  className="w-full bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 pr-10 text-quantum-gold text-sm outline-none focus:border-quantum-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-quantum-muted hover:text-quantum-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-xs mt-1">{passwordError}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 pr-10 text-quantum-gold text-sm outline-none focus:border-quantum-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-quantum-muted hover:text-quantum-accent transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-quantum-accent hover:bg-quantum-accent-hover text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-quantum-border" />
            <span className="text-quantum-muted text-xs">or</span>
            <div className="flex-1 h-px bg-quantum-border" />
          </div>
          <Link
            to="/login"
            className="text-quantum-accent text-sm text-center hover:underline"
          >
            Already have an account? Sign in →
          </Link>
        </div>
        <div className="mt-4"></div>
      </motion.div>
    </div>
  );
}
