import { useEffect, useState } from 'react'

const scopes = ['openid', 'email', 'profile']

function buildAuthUrl() {
  const domain = import.meta.env.VITE_COGNITO_DOMAIN
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID
  const redirectUri = import.meta.env.VITE_REDIRECT_URI

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
  })

  return {
    url: `${domain}/oauth2/authorize?${params.toString()}`,
    missing: {
      domain: domain ? undefined : 'VITE_COGNITO_DOMAIN',
      clientId: clientId ? undefined : 'VITE_COGNITO_CLIENT_ID',
      redirectUri: redirectUri ? undefined : 'VITE_REDIRECT_URI',
    },
  }
}

export function Login() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { url, missing } = buildAuthUrl()
    const missingKeys = Object.values(missing).filter(Boolean) as string[]

    if (missingKeys.length > 0) {
      const message = `Missing required environment variables: ${missingKeys.join(', ')}`
      console.error(message)
      setError(message)
      return
    }

    window.location.href = url
  }, [])

  if (error) {
    return <p>{error}</p>
  }

  return <p>Redirecting to login…</p>
}
