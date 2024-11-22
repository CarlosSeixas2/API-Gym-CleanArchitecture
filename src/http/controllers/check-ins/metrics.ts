import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metrics(req: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsGymUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await getUserMetricsGymUseCase.execute({
    user_id: req.user.sub,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
