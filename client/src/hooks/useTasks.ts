import { useState, useEffect } from "react";
import type { Task } from "../types";
import api from "../services/api";

// Fetches and manages tasks for a specific project
const useTasks = (projectId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      try {
        const { data } = await api.get(`/api/projects/${projectId}/tasks`);
        setTasks(data);
      } catch {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  return { tasks, setTasks, loading, error };
};

export default useTasks;
