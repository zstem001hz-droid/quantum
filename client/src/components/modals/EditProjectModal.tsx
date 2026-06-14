import { useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import type { Project } from "../../types";

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onUpdated: (project: Project) => void;
  onDeleted: (projectId: string) => void;
}

// Modal form for editing or deleting an existing project
const EditProjectModal = ({ project, onClose, onUpdated, onDeleted }: EditProjectModalProps) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.put(`/api/projects/${project._id}`, {
        name,
        description,
      });
      onUpdated(data);
      onClose();
    } catch {
      setError("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await api.delete(`/api/projects/${project._id}`);
      onDeleted(project._id);
      onClose();
    } catch {
      setError("Failed to delete project");
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
          <h2 className="text-quantum-text font-bold text-lg mb-4">Edit Project</h2>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                Project Name
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
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 text-quantum-gold text-sm outline-none focus:border-quantum-accent transition-colors"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleDelete}
                className="text-quantum-crimson hover:text-red-400 text-sm transition-colors"
              >
                Delete Project
              </button>
              <div className="flex gap-3">
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
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProjectModal;
