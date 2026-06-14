import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import api from "../services/api";
import type { Task, UserIdentity } from "../types";
import TaskColumn from "./TaskColumn";

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  members: UserIdentity[];
}

const STATUSES: Task["status"][] = ["To Do", "In Progress", "Complete"];

// Kanban board — manages drag-and-drop across three status columns
const TaskBoard = ({ tasks, setTasks, members }: TaskBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t._id === event.active.id);
      if (task) setActiveTask(task);
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
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
          prev.map((t) => (t._id === activeTask._id ? { ...t, status: newStatus } : t)),
        );
        try {
          await api.put(`/api/projects/${activeTask.project}/tasks/${activeTask._id}`, {
            status: newStatus,
          });
        } catch {
          // Revert on failure
          setTasks((prev) =>
            prev.map((t) => (t._id === activeTask._id ? { ...t, status: activeTask.status } : t)),
          );
        }
      } else {
        // Same column reorder
        const columnTasks = tasks.filter((t) => t.status === newStatus);
        const oldIndex = columnTasks.findIndex((t) => t._id === active.id);
        const newIndex = columnTasks.findIndex((t) => t._id === over.id);
        if (oldIndex !== newIndex) {
          const reordered = arrayMove(columnTasks, oldIndex, newIndex);
          setTasks((prev) => [...prev.filter((t) => t.status !== newStatus), ...reordered]);
        }
      }
    },
    [tasks, setTasks],
  );

  const handleUpdated = useCallback(
    (updated: Task) => {
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
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
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            members={members}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="bg-quantum-surface border border-quantum-accent rounded-lg p-3 shadow-lg shadow-quantum-accent/20 rotate-2 cursor-grabbing">
            <p className="text-quantum-text text-sm font-semibold">{activeTask.title}</p>
            {activeTask.description && (
              <p className="text-quantum-muted text-xs line-clamp-2">{activeTask.description}</p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;
