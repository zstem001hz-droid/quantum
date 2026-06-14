import { useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import type { Task, UserIdentity } from "../../types";

interface CreateTaskModalProps {
  projectId: string;
  members: UserIdentity[];
  onClose: () => void;
  onCreated: (task: Task) => void;
}

// Modal form for creating a new task — title and description required, due date optional
const CreateTaskModal = ({ projectId, members, onClose, onCreated }: CreateTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(`/api/projects/${projectId}/tasks`, {
        title,
        description,
        status: "To Do",
        dueDate: dueDate || null,
        assignedTo: assignedTo || null,
      });
      onCreated(data);
      onClose();
    } catch {
      setError("Failed to create task");
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
          <h2 className="text-quantum-text font-bold text-lg mb-4">New Task</h2>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
            <div className="flex flex-col gap-1">
              <label className="text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 text-quantum-light-text dark:text-quantum-text text-sm outline-none focus:border-quantum-accent transition-colors"
              />
            </div>
            {/* Assigned to — select a collaborator to assign this task to */}
            <div className="flex flex-col gap-1">
              <label className="text-quantum-muted text-xs font-semibold uppercase tracking-wider">
                Assign To
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg px-3 py-2 text-quantum-gold text-sm outline-none focus:border-quantum-accent transition-colors"
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} (@{member.username})
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons — Cancel/Create on left */}
            <div className="flex items-center gap-3">
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
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateTaskModal;
