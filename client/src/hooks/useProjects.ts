import { useState, useEffect } from "react";
import type { Project } from "../types";
import api from "../services/api";

// Fetches and manages all projects for the logged-in user
const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/api/projects");
        setProjects(data);
      } catch {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, setProjects, loading, error };
};

export default useProjects;
