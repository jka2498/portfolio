import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (!code) {
      console.error('No authorization code found in callback URL.')
      return
    }

    const exchangeCode = async () => {
      const domain = import.meta.env.VITE_COGNITO_DOMAIN
      const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID
      const redirectUri = import.meta.env.VITE_REDIRECT_URI

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        redirect_uri: redirectUri,
      })

      try {
        const response = await fetch(`${domain}/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Token exchange failed: ${response.status} ${errorText}`)
        }

        const data = await response.json()
        sessionStorage.setItem('id_token', data.id_token)
        sessionStorage.setItem('access_token', data.access_token)
        if (data.refresh_token) {
          sessionStorage.setItem('refresh_token', data.refresh_token)
        }

        navigate('/', { replace: true })
      } catch (error) {
        console.error('Failed to exchange authorization code for tokens.', error)
      }
    }

    void exchangeCode()
  }, [navigate])

  return <p>Signing you in…</p>
}
