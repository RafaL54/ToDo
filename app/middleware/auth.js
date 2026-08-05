export default defineNuxtRouteMiddleware(async () => {
  const { user, token, fetchUser } = useAuth()

  if (!user.value && token.value) {
    await fetchUser()
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
