import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { compare, hash } from 'bcrypt'
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

  app.post('/login', async (request, reply) => {
    const loginUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = loginUserBodySchema.parse(request.body)

    const user = await knex('users').where('email', email).first()

    if (!user)
      return reply.status(401).send({ message: 'Email or password incorrect!' })

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch)
      return reply.status(401).send({ message: 'Email or password incorrect!' })

    request.session.user = { sessionId: crypto.randomUUID(), email }

    return reply.send({
      message: 'Login successful!',
      user: { email: user.email, name: user.name },
    })
  })

  app.post('/logout', async (request, reply) => {
    request.session.user = null

    reply.send({ message: 'Logout successful!' })
  })
}
