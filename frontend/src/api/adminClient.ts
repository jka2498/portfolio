import { buildAdminApiUrl } from './apiConfig'

export async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const idToken = sessionStorage.getItem('id_token')

  if (!idToken) {
    throw new Error('Not authenticated: missing id_token')
  }

  const response = await fetch(buildAdminApiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Admin API request failed: ${response.status} ${errorText}`)
  }

  return (await response.json()) as T
}
