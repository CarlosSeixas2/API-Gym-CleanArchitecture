import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from '@/use-cases/check-in'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      title: 'any_title',
      description: null,
      phone: null,
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    vi.setSystemTime(new Date('2021-01-01 10:00:00'))

    gymsRepository.items.push({
      id: 'gym-id',
      title: 'Academia 1',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      user_id: 'user-id',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date('2021-02-01 10:00:00'))

    gymsRepository.items.push({
      id: 'gym-id',
      title: 'Academia 1',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await sut.execute({
      gymId: 'gym-id',
      user_id: 'user-id',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-id',
        user_id: 'user-id',
        userLatitude: -27.0747279,
        userLongitude: -49.4889672,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check-in twice but different days', async () => {
    vi.setSystemTime(new Date('2021-02-01 10:00:00'))

    gymsRepository.items.push({
      id: 'gym-id',
      title: 'Academia 1',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await sut.execute({
      gymId: 'gym-id',
      user_id: 'user-id',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    vi.setSystemTime(new Date('2021-05-01 10:00:00'))

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      user_id: 'user-id',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-id',
      title: 'Academia 1',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-id',
        user_id: 'user-id',
        userLatitude: -2.9097984,
        userLongitude: -41.7700434,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('should be able to check-in', async () => {
    vi.setSystemTime(new Date('2021-01-01 10:00:00'))

    gymsRepository.items.push({
      id: 'gym-id',
      title: 'Academia 1',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      user_id: 'user-id',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check-in', async () => {
    vi.setSystemTime(new Date('2021-01-01 10:00:00'))

    gymsRepository.items.push({
      id: 'gym-id',
      title: 'Academia 1',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      user_id: 'user-id',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
