import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gym', async () => {
    const { token } = await createAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: null,
        phone: null,
        latitude: -27.0747279,
        longitude: -49.4889672,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: null,
        phone: null,
        latitude: -27.0610928,
        longitude: -49.641091,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: -27.0747279,
        longitude: -49.4889672,
      })

    expect(response.status).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    // expect(response.body.gyms).toEqual([
    //   expect.objectContaining({ title: 'Javascript Gym' }),
    // ])
  })
})
