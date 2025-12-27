import { useEffect, useState } from "react";
import { fetchProjects } from "../api/services";
import { Project } from "../types";

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchProjects();
        setProjects(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return { projects, loading, error };
}