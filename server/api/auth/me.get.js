export default defineEventHandler((event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  const userId = getUserIdFromToken(token)
  const user = userId ? users.find(u => u.id === userId) : undefined

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  return { user: { id: user.id, email: user.email, name: user.name } }
})
