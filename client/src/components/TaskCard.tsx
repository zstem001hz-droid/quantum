import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types";
import EditTaskModal from "./modals/EditTaskModal";

interface TaskCardProps {
  task: Task;
  onUpdated: (task: Task) => void;
  onDeleted: (taskId: string) => void;
}

const statusColors: Record<Task["status"], string> = {
  "To Do": "border-l-status-todo",
  "In Progress": "border-l-status-progress",
  Complete: "border-l-status-complete",
};

// Draggable task card with status indicator and edit modal
const TaskCard = ({ task, onUpdated, onDeleted }: TaskCardProps) => {
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
          <p className="text-quantum-light-muted dark:text-quantum-muted text-xs line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
      {showEdit && (
        <EditTaskModal
          task={task}
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
