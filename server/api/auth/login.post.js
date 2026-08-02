export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const user = users.find(u => u.email === body.email && u.password === body.password)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const token = createSession(user.id)

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name }
  }
})
