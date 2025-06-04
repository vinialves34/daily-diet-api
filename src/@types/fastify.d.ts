// eslint-disable-next-line
import { FastifyRequest } from 'fastify/types/request'

declare module 'fastify/types/request' {
  export interface FastifyRequest {
    session: {
      user: {
        sessionId: string
        email: string
      } | null
    }
  }
}
