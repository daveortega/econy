import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { logger } from '@ecny/logger';

const log = logger('AuthRoutes');

async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body as { username: string; password: string };

    // Replace this with your actual user authentication logic
    if (username === 'testuser' && password === 'password') {
      const token = fastify.jwt.sign({ username });
      reply.send({ token });
    } else {
      reply.status(401).send({ error: 'Invalid username or password' });
    }
  });
}

export default authRoutes;