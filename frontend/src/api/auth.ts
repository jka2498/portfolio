export function isLoggedIn(): boolean {
  return Boolean(sessionStorage.getItem('id_token'))
}

export function logout() {
  sessionStorage.clear()
  window.location.href = '/'
}
