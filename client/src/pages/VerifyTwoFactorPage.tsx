import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import OTPInput from "../components/OTPInput";

// Standalone 2FA verification page — reached after successful password auth
// Receives userId via React Router location state from LoginPage
export default function VerifyTwoFactorPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract userId passed from LoginPage via navigate state
  const userId = location.state?.userId;

  // Redirect to login if page accessed directly without userId
  if (!userId) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Verify the TOTP code against the stored secret
      await api.post("/api/2fa/authenticate", { userId, token });

      // Fetch full user data and issue JWT after successful 2FA
      const { data } = await api.post("/api/auth/login-2fa", { userId });
      login(data);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid verification code";
      setError(message);
      setToken("");
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
        {/* Shield icon and heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-quantum-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <h1 className="text-quantum-light-text dark:text-quantum-text text-2xl font-bold mb-1">
            Verify your identity
          </h1>
          <p className="text-quantum-light-muted dark:text-quantum-muted text-sm text-center">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {/* Verification form */}
        <div className="bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border rounded-2xl p-6">
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-quantum-light-muted dark:text-quantum-muted text-xs font-semibold uppercase tracking-wider text-center">
                Authentication Code
              </label>
              <OTPInput
                value={token}
                onChange={setToken}
                onComplete={(completedValue) => {
                  setToken(completedValue);
                  setTimeout(() => {
                    const form = document.querySelector("form");
                    form?.requestSubmit();
                  }, 50);
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || token.length !== 6}
              className="bg-quantum-accent hover:bg-quantum-accent-hover text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify code"}
            </button>
          </form>
        </div>

        {/* Back to login */}
        <button
          onClick={() => navigate("/login")}
          className="mt-4 w-full text-center text-quantum-light-muted dark:text-quantum-muted hover:text-quantum-accent text-sm transition-colors"
        >
          ← Back to login
        </button>
      </motion.div>
    </div>
  );
}
