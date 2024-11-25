import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '55498798daw@',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@gmail.com',
      password: '55498798daw@',
    })

    const cookies = authResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('No cookies were set in the response')
    }

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.header['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('refreshToken')]),
    )
  })
})
