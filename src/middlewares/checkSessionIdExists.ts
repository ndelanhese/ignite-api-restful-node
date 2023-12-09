import type { FastifyRequest, FastifyReply } from 'fastify'

export const checkSessionIdExists = async (
  request: FastifyRequest,
  response: FastifyReply,
) => {
  const sessionId = request?.cookies?.session_id

  if (!sessionId) {
    return response.status(401).send({
      message: 'Unauthorized Access!',
    })
  }
}
