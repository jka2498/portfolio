import { useEffect, useState } from "react";
import { fetchExperiences } from "../api/services";
import { Experience } from "../types";

interface UseExperiencesResult {
  experiences: Experience[];
  loading: boolean;
  error: string | null;
}

export function useExperiences(): UseExperiencesResult {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchExperiences();
        setExperiences(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load experiences");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return { experiences, loading, error };
}