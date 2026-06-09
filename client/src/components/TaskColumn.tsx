import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task } from "../types";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  status: Task["status"];
  tasks: Task[];
  onUpdated: (task: Task) => void;
  onDeleted: (taskId: string) => void;
}

const columnStyles: Record<Task["status"], { border: string; label: string }> = {
  "To Do": { border: "border-t-status-todo", label: "text-status-todo" },
  "In Progress": {
    border: "border-t-status-progress",
    label: "text-status-progress",
  },
  Complete: {
    border: "border-t-status-complete",
    label: "text-status-complete",
  },
};

// Droppable column containing sortable task cards for one status lane
const TaskColumn = ({ status, tasks, onUpdated, onDeleted }: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({ id: status });
  const style = columnStyles[status];

  return (
    <div
      ref={setNodeRef}
      className={`bg-quantum-light-surface dark:bg-quantum-surface border border-quantum-light-border dark:border-quantum-border border-t-4 ${style.border} rounded-xl p-4 flex flex-col gap-3 min-h-[400px]`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${style.label}`}>{status}</h3>
        <span className="text-quantum-light-muted dark:text-quantum-muted text-xs bg-quantum-light-border dark:bg-quantum-surface2 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onUpdated={onUpdated} onDeleted={onDeleted} />
        ))}
      </SortableContext>
    </div>
  );
};

export default TaskColumn;
