// token -> userId. In-memory, so sessions are lost on server restart.
const sessions = new Map()

export function createSession(userId) {
  const token = crypto.randomUUID()
  sessions.set(token, userId)
  return token
}

export function getUserIdFromToken(token) {
  if (!token) return null
  return sessions.get(token) ?? null
}

export function destroySession(token) {
  if (token) sessions.delete(token)
}
