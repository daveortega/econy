import { logger } from '@ecny/logger';
import authenticate from './plugins/authenticate';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import healthRoutes from './routes/healthRoutes';
import fastifyJwt from '@fastify/jwt';
import config from 'config';
import Fastify from 'fastify';

const log = logger('API Server');
const fastify = Fastify({ logger: log });

const port = config.get<number>('server.port');
const jwtSecret = config.get<string>('jwt.secret');

fastify.register(fastifyJwt, {
  secret: jwtSecret,
});

// Register health check route without authentication
fastify.register(healthRoutes);

// Register auth routes without authentication
fastify.register(authRoutes, { prefix: '/auth' });

// Register user routes with authentication
fastify.register(authenticate);
fastify.register(userRoutes, { prefix: '/users' });

const start = async () => {
  try {
    await fastify.listen({ port });
    log.info(`Server listening on port ${port}`);
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
};

start();