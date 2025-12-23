export const PUBLIC_API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL

export const buildPublicApiUrl = (path: string) => `${PUBLIC_API_BASE_URL}${path}`
export const buildAdminApiUrl = (path: string) => `${ADMIN_API_BASE_URL}${path}`
