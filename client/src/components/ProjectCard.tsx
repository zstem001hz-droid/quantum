import { Link } from "react-router-dom";
import type { Project, Task } from "../types";

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
}

// Displays a project summary card with task status counts
const ProjectCard = ({ project, tasks }: ProjectCardProps) => {
  const todo = tasks.filter((t) => t.status === "To Do").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const complete = tasks.filter((t) => t.status === "Complete").length;

  return (
    <Link to={`/projects/${project._id}`}>
      <div className="bg-quantum-surface border border-quantum-border rounded-xl p-4 hover:border-quantum-accent transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-quantum-text font-semibold text-sm">
            {project.name}
          </h3>
          <span className="text-xs bg-quantum-surface2 text-quantum-muted px-2 py-0.5 rounded-full">
            {project.status}
          </span>
        </div>
        {project.description && (
          <p className="text-quantum-muted text-xs mb-3 line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="flex gap-2 flex-wrap">
          {todo > 0 && (
            <span className="text-xs bg-status-todo-bg text-status-todo px-2 py-0.5 rounded-full">
              {todo} to do
            </span>
          )}
          {inProgress > 0 && (
            <span className="text-xs bg-status-progress-bg text-status-progress px-2 py-0.5 rounded-full">
              {inProgress} in progress
            </span>
          )}
          {complete > 0 && (
            <span className="text-xs bg-status-complete-bg text-status-complete px-2 py-0.5 rounded-full">
              {complete} done
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
