import { buildPublicApiUrl } from './apiConfig'

export type ProjectLifecycle = 'ACTIVE' | 'ARCHIVED'
export type ProjectServiceType = 'S3' | 'DynamoDB' | 'Lambda' | (string & {})

export interface Project {
  id: string
  name: string
  serviceType?: ProjectServiceType
  description?: string
  organization?: string
  region?: string
  lifecycle: ProjectLifecycle
  createdYear?: number
  technologies?: string[]
}

export function describeServiceType(serviceType?: ProjectServiceType) {
  const normalized = serviceType?.toUpperCase()
  const label =
    normalized === 'S3'
      ? 'Object Storage'
      : normalized === 'DYNAMODB'
      ? 'NoSQL Database'
      : normalized === 'LAMBDA'
      ? 'Serverless Compute'
      : serviceType ?? 'Workload'

  return { label }
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(buildPublicApiUrl('/projects'))
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }
  return res.json()
}
