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

  return {
    user,
    token,
    login
  }
}
