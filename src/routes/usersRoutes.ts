import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { hash } from 'bcrypt'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const registerUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    const { name, password, email } = registerUserBodySchema.parse(request.body)

    const emailAlreadyExists = await knex('users').where('email', email).first()

    if (emailAlreadyExists) {
      return reply.status(400).send({ message: 'Email already exists!' })
    }

    const passwordHash = await hash(password, 8)

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
      password: passwordHash,
    })

    return reply.status(201).send()
  })
}
