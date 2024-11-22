import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from '@/use-cases/validate-check-in'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { afterEach } from 'node:test'
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-id',
      user_id: 'user-id',
    })

    const { checkIn } = await sut.execute({
      check_id: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate the check-in', async () => {
    await expect(
      sut.execute({
        check_id: 'InexistentCheckId',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) // utc

    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-id',
      user_id: 'user-id',
    })

    const twentyMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyMinutesInMs)

    await expect(
      sut.execute({
        check_id: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
