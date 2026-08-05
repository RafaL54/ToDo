export default defineEventHandler((event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

  destroySession(token)

  return { success: true }
})
