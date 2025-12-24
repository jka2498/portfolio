import { buildPublicApiUrl } from './apiConfig'

export type ProjectLifecycle = 'ACTIVE' | 'ARCHIVED'

export interface Project {
  id: string
  name: string
  description?: string
  organization?: string
  region?: string
  lifecycle: ProjectLifecycle
  createdYear?: number
  technologies?: string[]
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(buildPublicApiUrl('/projects'))
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }
  return res.json()
}
