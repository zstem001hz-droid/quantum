import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import OTPInput from "../OTPInput";

interface TwoFactorSetupModalProps {
  onClose: () => void;
  onEnabled: () => void;
}

// Multi-step modal for enabling TOTP 2FA
// Step 1: display QR code and manual secret entry
// Step 2: verify user scanned correctly by entering a live code
const TwoFactorSetupModal = ({ onClose, onEnabled }: TwoFactorSetupModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Copy secret to clipboard for manual authenticator app entry
  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Verify the TOTP code entered by the user to confirm setup
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/2fa/verify", { token });
      onEnabled();
      onClose();
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

  // Fetch setup data when modal first renders
  useEffect(() => {
    const initSetup = async () => {
      try {
        const { data } = await api.post("/api/2fa/setup");
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to initialize 2FA setup";
        setError(message);
      }
    };
    initSetup();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border rounded-2xl p-6 w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? "bg-quantum-accent text-white" : "bg-status-complete-bg text-status-complete"}`}
            >
              {step === 1 ? "1" : "✓"}
            </div>
            <div className="flex-1 h-0.5 bg-quantum-light-border dark:bg-quantum-border" />
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? "bg-quantum-accent text-white" : "bg-quantum-light-border dark:bg-quantum-surface2 text-quantum-light-muted dark:text-quantum-muted"}`}
            >
              2
            </div>
          </div>

          {step === 1 && (
            <>
              <h2 className="text-quantum-light-text dark:text-quantum-text font-bold text-lg mb-1">
                Set up authenticator app
              </h2>
              <p className="text-quantum-light-muted dark:text-quantum-muted text-sm mb-4">
                Scan the QR code with your authenticator app, or enter the setup key manually.
              </p>

              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

              {/* QR code display */}
              {qrCode && (
                <div className="flex justify-center mb-4">
                  <img
                    src={qrCode}
                    alt="2FA QR Code"
                    className="w-48 h-48 rounded-lg border border-quantum-light-border dark:border-quantum-border"
                  />
                </div>
              )}

              {/* Security warning */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 mb-4">
                <p className="text-amber-500 text-xs">
                  ⚠ Do not screenshot this QR code. Store your setup key securely.
                </p>
              </div>

              {/* Manual secret entry */}
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-quantum-light-muted dark:text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                  Setup key — manual entry
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={secret}
                    readOnly
                    className="flex-1 bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 text-quantum-gold text-xs font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="bg-quantum-accent hover:bg-quantum-accent-hover text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-quantum-muted hover:text-quantum-crimson text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-quantum-accent hover:bg-quantum-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-quantum-light-text dark:text-quantum-text font-bold text-lg mb-1">
                Confirm your setup
              </h2>
              <p className="text-quantum-light-muted dark:text-quantum-muted text-sm mb-4">
                Enter the 6-digit code from your authenticator app to confirm 2FA is working.
              </p>

              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

              <form onSubmit={handleVerify} className="flex flex-col gap-4">
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
                <div className="flex gap-3 justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-quantum-muted hover:text-quantum-accent text-sm transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || token.length !== 6}
                    className="bg-quantum-accent hover:bg-quantum-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Enable 2FA"}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TwoFactorSetupModal;
