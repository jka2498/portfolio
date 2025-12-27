import { useEffect, useState } from "react";
import { fetchCvDownloadUrl } from "../api/services";

export function useCv() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const url = await fetchCvDownloadUrl();
        setCvUrl(url);
      } catch (err) {
        console.error("Failed to load CV URL", err);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return { cvUrl, loading };
}