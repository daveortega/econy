import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import config from 'config';
import { logger } from '@ecny/logger';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import fastifyJwt from '@fastify/jwt';

const log = logger('API Server');
const fastify = Fastify({ logger: log });

const port = config.get<number>('server.port');
const jwtSecret = config.get<string>('jwt.secret');

fastify.register(fastifyJwt, {
  secret: jwtSecret,
});

fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(userRoutes, { prefix: '/users' });

const start = async () => {
  try {
    await fastify.listen(port);
    log.info(`Server listening on port ${port}`);
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
};

start();