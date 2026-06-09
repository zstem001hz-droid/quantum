import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import type { Project, Task } from "../types";
import TaskBoard from "../components/TaskBoard";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import EditProjectModal from "../components/modals/EditProjectModal";
import InviteModal from "../components/modals/InviteModal";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

// Project detail page — displays project info and full Kanban task board
export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/api/projects/${id}`),
          api.get(`/api/projects/${id}/tasks`),
        ]);
        setProject(projectRes.data);
        setTasks(tasksRes.data);
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!project) return <ErrorMessage message="Project not found" />;

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Project header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-quantum-light-muted dark:text-quantum-muted hover:text-quantum-accent text-sm mb-2 transition-colors"
          >
            ← Back to Project Dashboard
          </button>
          <h1 className="text-quantum-light-text dark:text-quantum-text text-2xl font-bold">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-quantum-light-muted dark:text-quantum-muted text-sm mt-1">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowCreateTask(true)}
            className="bg-quantum-accent hover:bg-quantum-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Add Task
          </button>
          <button
            onClick={() => setShowInvite(true)}
            className="bg-quantum-surface2 hover:bg-quantum-border text-quantum-text text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Invite
          </button>
          <button
            onClick={() => setShowEditProject(true)}
            className="bg-quantum-surface2 hover:bg-quantum-border text-quantum-muted hover:text-quantum-text text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Edit Project
          </button>
        </div>
      </div>

      {/* Kanban board */}
      <TaskBoard tasks={tasks} setTasks={setTasks} />

      {/* Modals */}
      {showCreateTask && (
        <CreateTaskModal
          projectId={project._id}
          onClose={() => setShowCreateTask(false)}
          onCreated={(task) => {
            setTasks((prev) => [...prev, task]);
            setShowCreateTask(false);
          }}
        />
      )}
      {showEditProject && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditProject(false)}
          onUpdated={(updated) => {
            setProject(updated);
            setShowEditProject(false);
          }}
          onDeleted={() => navigate("/dashboard")}
        />
      )}
      {showInvite && (
        <InviteModal
          projectId={project._id}
          onClose={() => setShowInvite(false)}
          onInvited={() => setShowInvite(false)}
        />
      )}
    </motion.div>
  );
}
