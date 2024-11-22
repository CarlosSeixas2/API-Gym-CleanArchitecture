import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '55498798daw@',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@gmail.com',
      password: '55498798daw@',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
