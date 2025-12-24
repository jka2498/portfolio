import { buildPublicApiUrl } from './apiConfig'

type CvDownloadResponse = {
  url: string
}

export async function fetchCvDownloadUrl(): Promise<string> {
  const res = await fetch(buildPublicApiUrl('/cv/download'))
  if (!res.ok) {
    throw new Error('Failed to fetch CV download URL')
  }
  const data = (await res.json()) as CvDownloadResponse
  return data.url
}
