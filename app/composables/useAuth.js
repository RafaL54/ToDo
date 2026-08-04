export function useAuth() {
  const user = useState('auth-user', () => null)
  const token = useCookie('token')

  async function login(email, password) {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email,
        password
      }
    })

    token.value = data.token
    user.value = data.user
  }

  async function fetchUser() {
    if (!token.value) {
      return
    }

    try {
      user.value = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
    } catch {
      token.value = null
      user.value = null
    }
  }

  async function logout() {
    if (token.value) {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
    }

    token.value = null
    user.value = null
  }

  return {
    user,
    token,
    login,
    fetchUser,
    logout
  }
}
