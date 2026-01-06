import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const PREFIX = 'transactions'

const app = fastify()

app.register(cookie)
app.register(transactionsRoutes, {
  prefix: PREFIX,
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('http server running')
  })
