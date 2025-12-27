export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL;

export function buildPublicApiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}