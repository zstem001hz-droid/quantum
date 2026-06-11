import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

// Forgot password page — accepts email and sends reset link via Resend
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      // Always show success — backend never reveals if email exists
      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-quantum-light-bg dark:bg-quantum-bg flex flex-col items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo and heading */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-quantum-light-text dark:text-quantum-text text-2xl font-bold mb-1">
            Reset your password
          </h1>
          <p className="text-quantum-light-muted dark:text-quantum-muted text-sm text-center">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border rounded-2xl p-6">
          {submitted ? (
            // Success state — shown regardless of whether email exists
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-status-complete-bg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-status-complete"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-quantum-light-text dark:text-quantum-text text-sm font-semibold mb-1">
                Check your inbox
              </p>
              <p className="text-quantum-light-muted dark:text-quantum-muted text-xs">
                If that email is registered, a reset link has been sent. Check your spam folder if
                you don't see it.
              </p>
            </div>
          ) : (
            // Request form
            <>
              {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-quantum-light-muted dark:text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-3 text-quantum-light-text dark:text-quantum-text text-sm outline-none focus:border-quantum-accent transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-quantum-accent hover:bg-quantum-accent-hover text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back to login */}
        <Link
          to="/login"
          className="mt-4 w-full text-center text-quantum-light-muted dark:text-quantum-muted hover:text-quantum-accent text-sm transition-colors block"
        >
          ← Back to login
        </Link>
      </motion.div>
    </div>
  );
}
