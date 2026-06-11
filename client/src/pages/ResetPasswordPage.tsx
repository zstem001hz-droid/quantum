import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";

// Reset password page — reached via tokenized link in reset email
export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract reset token from URL query string
  const token = searchParams.get("token");

  // Redirect to forgot password if no token in URL
  if (!token) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { token, password });
      setSuccess(true);
      // Redirect to login after short delay
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Reset failed. The link may have expired.";
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
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-quantum-light-text dark:text-quantum-text text-2xl font-bold mb-1">
            Set new password
          </h1>
          <p className="text-quantum-light-muted dark:text-quantum-muted text-sm text-center">
            Choose a strong password for your account
          </p>
        </div>

        <div className="bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border rounded-2xl p-6">
          {success ? (
            // Success state — redirects to login automatically
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
                Password reset successful
              </p>
              <p className="text-quantum-light-muted dark:text-quantum-muted text-xs">
                Redirecting you to login...
              </p>
            </div>
          ) : (
            <>
              {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* New password input */}
                <div className="flex flex-col gap-1">
                  <label className="text-quantum-light-muted dark:text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      className="w-full bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-3 pr-10 text-quantum-light-text dark:text-quantum-text text-sm outline-none focus:border-quantum-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-quantum-light-muted dark:text-quantum-muted hover:text-quantum-accent transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password input */}
                <div className="flex flex-col gap-1">
                  <label className="text-quantum-light-muted dark:text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-3 pr-10 text-quantum-light-text dark:text-quantum-text text-sm outline-none focus:border-quantum-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-quantum-light-muted dark:text-quantum-muted hover:text-quantum-accent transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-quantum-accent hover:bg-quantum-accent-hover text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>
              </form>
            </>
          )}
        </div>

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
