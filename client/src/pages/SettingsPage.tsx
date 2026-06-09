import { useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import TwoFactorSetupModal from "../components/modals/TwoFactorSetupModal";
import api from "../services/api";
import OTPInput from "../components/OTPInput";

// User settings page — expandable hub for account and security preferences
export default function SettingsPage() {
  const { user, login } = useAuth();
  const [showSetup2FA, setShowSetup2FA] = useState(false);
  const [showDisable2FA, setShowDisable2FA] = useState(false);
  const [disableToken, setDisableToken] = useState("");
  const [disableError, setDisableError] = useState("");
  const [disableLoading, setDisableLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled ?? false);

  // Disable 2FA — requires valid TOTP code to confirm
  const handleDisable2FA = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisableError("");
    setDisableLoading(true);
    try {
      await api.post("/api/2fa/disable", { token: disableToken });
      setTwoFactorEnabled(false);
      setShowDisable2FA(false);
      setDisableToken("");

      // Update stored user so refresh reflects correct 2FA state
      if (user) login({ ...user, twoFactorEnabled: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid verification code";
      setDisableError(message);
      setDisableToken("");
    } finally {
      setDisableLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-quantum-light-text dark:text-quantum-text text-2xl font-bold mb-8">
        Settings
      </h1>

      {/* Security section */}
      <div className="bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border rounded-2xl p-6 mb-6">
        <h2 className="text-quantum-light-text dark:text-quantum-text font-bold text-lg mb-1">
          Security
        </h2>
        <p className="text-quantum-light-muted dark:text-quantum-muted text-sm mb-6">
          Manage your account security settings
        </p>

        {/* 2FA toggle row */}
        <div className="flex items-center justify-between py-4 border-t border-quantum-light-border dark:border-quantum-border">
          <div>
            <p className="text-quantum-light-text dark:text-quantum-text text-sm font-semibold">
              Two-factor authentication
            </p>
            <p className="text-quantum-light-muted dark:text-quantum-muted text-xs mt-0.5">
              {twoFactorEnabled
                ? "Your account is protected with 2FA"
                : "Add an extra layer of security to your account"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                twoFactorEnabled
                  ? "bg-status-complete-bg text-status-complete"
                  : "bg-quantum-light-border dark:bg-quantum-surface2 text-quantum-light-muted dark:text-quantum-muted"
              }`}
            >
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
            {/* Enable/disable button */}
            <button
              onClick={() =>
                twoFactorEnabled ? setShowDisable2FA(!showDisable2FA) : setShowSetup2FA(true)
              }
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                twoFactorEnabled
                  ? "text-quantum-crimson hover:text-red-400"
                  : "bg-quantum-accent hover:bg-quantum-accent-hover text-white"
              }`}
            >
              {twoFactorEnabled ? "Disable" : "Enable 2FA"}
            </button>
          </div>
        </div>

        {/* Inline disable confirmation form */}
        {showDisable2FA && (
          <motion.div
            className="mt-4 p-4 bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-xl"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-quantum-light-text dark:text-quantum-text text-sm font-semibold mb-1">
              Confirm disable
            </p>
            <p className="text-quantum-light-muted dark:text-quantum-muted text-xs mb-3">
              Enter your authenticator code to disable 2FA
            </p>
            {disableError && <p className="text-red-400 text-xs mb-2">{disableError}</p>}
            <form onSubmit={handleDisable2FA} className="flex flex-col gap-3">
              <OTPInput
                value={disableToken}
                onChange={setDisableToken}
                onComplete={(completedValue) => {
                  setDisableToken(completedValue);
                  setTimeout(() => {
                    const form = document.querySelector("form");
                    form?.requestSubmit();
                  }, 50);
                }}
              />
              <button
                type="submit"
                disabled={disableLoading || disableToken.length !== 6}
                className="bg-quantum-crimson hover:text-red-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {disableLoading ? "Disabling..." : "Confirm"}
              </button>
            </form>
          </motion.div>
        )}
      </div>

      {/* Placeholder for future settings sections */}
      <div className="bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border rounded-2xl p-6 opacity-50">
        <h2 className="text-quantum-light-text dark:text-quantum-text font-bold text-lg mb-1">
          Profile
        </h2>
        <p className="text-quantum-light-muted dark:text-quantum-muted text-sm">
          Profile settings coming soon
        </p>
      </div>

      {/* setup 2FA modal */}
      {showSetup2FA && (
        <TwoFactorSetupModal
          onClose={() => setShowSetup2FA(false)}
          onEnabled={() => {
            setTwoFactorEnabled(true);
            setShowSetup2FA(false);
            // Update stored user so refresh reflects correct 2FA state
            if (user) login({ ...user, twoFactorEnabled: true });
          }}
        />
      )}
    </motion.div>
  );
}
