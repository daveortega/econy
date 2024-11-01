import Fastify from 'fastify';
import config from 'config';
import { logger } from '@ecny/logger';
import userRoutes from './routes/userRoutes';

const log = logger('API Server');
const fastify = Fastify({ logger: log });

const port = config.get<number>('server.port');

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