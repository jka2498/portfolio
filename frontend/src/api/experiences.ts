export interface Experience {
  id: string;
  role: string;
  company: string;
  state?: string;
  startYear?: number;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchExperiences(): Promise<Experience[]> {

  const res = await fetch(`${API_BASE}/experiences`);
  if (!res.ok) {
    throw new Error("Failed to fetch experiences");
  }
  return res.json();
}
