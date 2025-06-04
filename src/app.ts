import fastify from 'fastify'
import cookie from '@fastify/cookie'
import session from '@fastify/session'
import { usersRoutes } from './routes/usersRoutes'
import { env } from './env'

export const app = fastify()

app.register(cookie)
app.register(session, {
  secret: env.SECRET_KEY_SESSION,
  cookie: { secure: false, httpOnly: true },
  saveUninitialized: false,
})

app.register(usersRoutes, {
  prefix: 'users',
})
