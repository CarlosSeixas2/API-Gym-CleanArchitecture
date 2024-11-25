import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Check-in History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Academia do Zé',
        description: 'Academia do Zé, a melhor academia do Brasil',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gymId: gym.id,
          user_id: user.id,
        },
        {
          gymId: gym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gymId: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gymId: gym.id,
        user_id: user.id,
      }),
    ])
  })
})
