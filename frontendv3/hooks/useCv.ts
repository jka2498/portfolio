import { useState } from "react";
import { fetchCvDownloadUrl } from "../api/services";

export function useCv() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCvUrl = async () => {
    setLoading(true);
    try {
      const url = await fetchCvDownloadUrl();
      setCvUrl(url);
      return url;
    } catch (err) {
      console.error("Failed to load CV URL", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { cvUrl, loading, loadCvUrl };
}
