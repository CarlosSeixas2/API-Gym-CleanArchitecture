import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '55498798daw@',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@gmail.com',
    password: '55498798daw@',
  })

  const { token } = authResponse.body

  return { token }
}
