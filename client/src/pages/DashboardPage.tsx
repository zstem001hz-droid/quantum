import { useState, useEffect } from "react";
import useProjects from "../hooks/useProjects";
import type { Task } from "../types";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import CreateProjectModal from "../components/modals/CreateProjectModal";

// Dashboard page — project list with aggregate task stats
export default function DashboardPage() {
  const { projects, loading, error } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (projects.length === 0) return;
    const fetchAllTasks = async () => {
      try {
        const results = await Promise.all(
          projects.map((p) => api.get(`/api/projects/${p._id}/tasks`)),
        );
        setAllTasks(results.flatMap((r) => r.data));
      } catch {
        // silently fail
      }
    };
    fetchAllTasks();
  }, [projects]);

  const todo = allTasks.filter((t) => t.status === "To Do").length;
  const inProgress = allTasks.filter((t) => t.status === "In Progress").length;
  const complete = allTasks.filter((t) => t.status === "Complete").length;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-quantum-surface border border-quantum-border rounded-xl p-4">
          <p className="text-quantum-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Projects
          </p>
          <p className="text-quantum-text text-2xl font-bold">
            {projects.length}
          </p>
        </div>
        <div className="bg-quantum-surface border border-quantum-border rounded-xl p-4">
          <p className="text-quantum-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Open Tasks
          </p>
          <p className="text-quantum-accent text-2xl font-bold">{todo}</p>
        </div>
        <div className="bg-quantum-surface border border-quantum-border rounded-xl p-4">
          <p className="text-quantum-muted text-xs font-semibold uppercase tracking-wider mb-1">
            In Progress
          </p>
          <p className="text-status-progress text-2xl font-bold">
            {inProgress}
          </p>
        </div>
        <div className="bg-quantum-surface border border-quantum-border rounded-xl p-4">
          <p className="text-quantum-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Completed
          </p>
          <p className="text-status-complete text-2xl font-bold">{complete}</p>
        </div>
        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onCreated={(project) => {
              setShowCreateModal(false);
            }}
          />
        )}
      </div>

      {/* Projects header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-quantum-text text-lg font-bold">My Projects</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-quantum-accent hover:bg-quantum-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + New Project
        </button>
      </div>

      {/* Project list */}
      {projects.length === 0 ? (
        <EmptyState
          message="No projects yet. Create your first one."
          action="+ New Project"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              tasks={allTasks.filter((t) => t.project === project._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
