import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, UserIdentity } from "../types";
import EditTaskModal from "./modals/EditTaskModal";

interface TaskCardProps {
  task: Task;
  members: UserIdentity[];
  onUpdated: (task: Task) => void;
  onDeleted: (taskId: string) => void;
}

const statusColors: Record<Task["status"], string> = {
  "To Do": "!border-l-status-todo !border-t-status-todo",
  "In Progress": "!border-l-status-progress !border-t-status-progress",
  Complete: "!border-l-status-complete !border-t-status-complete",
};

// Draggable task card with status indicator and edit modal
const TaskCard = ({ task, members, onUpdated, onDeleted }: TaskCardProps) => {
  const [showEdit, setShowEdit] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border border-l-4 ${statusColors[task.status]} rounded-lg p-3 cursor-pointer hover:border-quantum-accent transition-colors`}
        onClick={() => setShowEdit(true)}
        {...attributes}
        {...listeners}
      >
        <p className="text-quantum-light-text dark:text-quantum-text text-sm font-semibold mb-1">
          {task.title}
        </p>
        {task.description && (
          <p className="text-quantum-light-muted dark:text-quantum-muted text-xs line-clamp-2 mb-1">
            {task.description}
          </p>
        )}
        {/* Assigned user — avatar initial and name */}
        {task.assignedTo && (
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-4 h-4 rounded-full bg-quantum-accent flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {task.assignedTo.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-quantum-light-muted dark:text-quantum-muted text-xs">
              {task.assignedTo.name}
            </span>
          </div>
        )}
        {/* Due date indicator — color and pulse dot shift based on urgency */}
        {task.dueDate &&
          (() => {
            const due = new Date(task.dueDate);
            const now = new Date();
            const daysRemaining = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            const isComplete = task.status === "Complete";
            const isOverdue = !isComplete && due < now;
            const isDueSoon = !isOverdue && !isComplete && daysRemaining <= 3;

            return (
              <div className="flex items-center gap-1 mt-1">
                {/* Status dot — green complete, pulsing crimson overdue, gold due soon, blue upcoming */}
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    isComplete
                      ? "bg-status-complete"
                      : isOverdue
                        ? "bg-quantum-crimson animate-pulse"
                        : isDueSoon
                          ? "bg-quantum-gold"
                          : "bg-status-todo"
                  }`}
                />
                <p
                  className={`text-xs ${
                    isComplete
                      ? "text-status-complete"
                      : isOverdue
                        ? "text-quantum-crimson"
                        : isDueSoon
                          ? "text-quantum-gold"
                          : "text-status-todo"
                  }`}
                >
                  {isComplete
                    ? `Completed · ${due.toLocaleDateString()}`
                    : isOverdue
                      ? `Overdue · ${due.toLocaleDateString()}`
                      : `Due ${due.toLocaleDateString()}`}
                </p>
              </div>
            );
          })()}
      </div>
      {showEdit && (
        <EditTaskModal
          task={task}
          members={members}
          onClose={() => setShowEdit(false)}
          onUpdated={(updated) => {
            onUpdated(updated);
            setShowEdit(false);
          }}
          onDeleted={(id) => {
            onDeleted(id);
            setShowEdit(false);
          }}
        />
      )}
    </>
  );
};

export default TaskCard;
