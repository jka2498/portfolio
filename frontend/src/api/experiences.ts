import { buildPublicApiUrl } from './apiConfig'

export interface Experience {
  id: string
  role: string
  company: string
  state?: string
  startYear?: number
}

export async function fetchExperiences(): Promise<Experience[]> {
  const res = await fetch(buildPublicApiUrl('/experiences'))
  if (!res.ok) {
    throw new Error('Failed to fetch experiences')
  }
  return res.json()
}
