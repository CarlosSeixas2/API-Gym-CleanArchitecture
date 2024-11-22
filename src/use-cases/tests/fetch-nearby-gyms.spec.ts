import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms'
import { expect, describe, it, beforeEach } from 'vitest'

let gymsRepository: InMemoryGymRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    await gymsRepository.create({
      title: 'Typescript Gym',
      description: null,
      phone: null,
      latitude: -27.0610928,
      longitude: -49.641091,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.0610928,
      userLongitude: -49.641091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Typescript Gym' })])
  })
})
