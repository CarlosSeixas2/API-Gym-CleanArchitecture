import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gymId: 'gym-id',
      user_id: 'user-id',
    })

    await checkInsRepository.create({
      gymId: 'gym-id2',
      user_id: 'user-id',
    })

    const { checkInsCount } = await sut.execute({
      user_id: 'user-id',
    })

    expect(checkInsCount).toEqual(2)
  })
})
