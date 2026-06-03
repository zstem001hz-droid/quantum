import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import api from "../services/api";
import type { Task } from "../types";
import TaskColumn from "./TaskColumn";

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const STATUSES: Task["status"][] = ["To Do", "In Progress", "Complete"];

// Kanban board — manages drag-and-drop across three status columns
const TaskBoard = ({ tasks, setTasks }: TaskBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeTask = tasks.find((t) => t._id === active.id);
      if (!activeTask) return;

      const newStatus = STATUSES.includes(over.id as Task["status"])
        ? (over.id as Task["status"])
        : tasks.find((t) => t._id === over.id)?.status;

      if (!newStatus) return;

      if (activeTask.status !== newStatus) {
        // Optimistic update — update UI immediately before API confirms
        setTasks((prev) =>
          prev.map((t) =>
            t._id === activeTask._id ? { ...t, status: newStatus } : t,
          ),
        );
        try {
          await api.put(
            `/api/projects/${activeTask.project}/tasks/${activeTask._id}`,
            { status: newStatus },
          );
        } catch {
          // Revert on failure
          setTasks((prev) =>
            prev.map((t) =>
              t._id === activeTask._id
                ? { ...t, status: activeTask.status }
                : t,
            ),
          );
        }
      } else {
        // Same column reorder
        const columnTasks = tasks.filter((t) => t.status === newStatus);
        const oldIndex = columnTasks.findIndex((t) => t._id === active.id);
        const newIndex = columnTasks.findIndex((t) => t._id === over.id);
        if (oldIndex !== newIndex) {
          const reordered = arrayMove(columnTasks, oldIndex, newIndex);
          setTasks((prev) => [
            ...prev.filter((t) => t.status !== newStatus),
            ...reordered,
          ]);
        }
      }
    },
    [tasks, setTasks],
  );

  const handleUpdated = useCallback(
    (updated: Task) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );
    },
    [setTasks],
  );

  const handleDeleted = useCallback(
    (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    },
    [setTasks],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default TaskBoard;
