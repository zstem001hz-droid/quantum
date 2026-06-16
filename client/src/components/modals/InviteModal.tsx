import { useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import type { Project } from "../../types";

interface InviteModalProps {
  projectId: string;
  onClose: () => void;
  onInvited: (updated: Project) => void;
}

// Modal form for inviting a collaborator to a project by email
const InviteModal = ({ projectId, onClose, onInvited }: InviteModalProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.put(`/api/projects/${projectId}/invite`, { email });
      setSuccess(`${email} has been added as a collaborator`);
      setEmail("");
      onInvited(res.data);
    } catch {
      setError("User not found or already a collaborator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border rounded-2xl p-6 w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-quantum-light-text dark:text-quantum-text font-bold text-lg mb-1">
            Invite Collaborator
          </h2>
          <p className="text-quantum-light-muted dark:text-quantum-muted text-xs mb-4">
            Enter the email address of a registered Quantum user
          </p>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          {success && <p className="text-status-complete text-sm mb-3">{success}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-quantum-light-muted dark:text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 text-quantum-gold text-sm outline-none focus:border-quantum-accent transition-colors"
              />
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
                type="submit"
                disabled={loading}
                className="bg-quantum-accent hover:bg-quantum-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Inviting..." : "Send Invite"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InviteModal;
