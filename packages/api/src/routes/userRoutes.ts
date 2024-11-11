import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { userService } from '@ecny/service';
import { logger } from '@ecny/logger';

const log = logger('UserRoutes');

async function userRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  fastify.post('/', async (request, reply) => {
    try {
      const user = await userService.createUser(request.body);
      reply.status(201).send(user);
    } catch (error) {
      log.error(`Error creating user: ${(error as Error).message}`);
      reply.status(500).send({ error: (error as Error).message });
    }
  });

  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      const user = await userService.getUserById(request.params.id);
      if (user) {
        reply.status(200).send(user);
      } else {
        reply.status(404).send({ error: 'User not found' });
      }
    } catch (error) {
      log.error(`Error getting user: ${(error as Error).message}`);
      reply.status(500).send({ error: (error as Error).message });
    }
  });

  fastify.put<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      const user = await userService.updateUser(request.params.id, request.body);
      if (user) {
        reply.status(200).send(user);
      } else {
        reply.status(404).send({ error: 'User not found' });
      }
    } catch (error) {
      log.error(`Error updating user: ${(error as Error).message}`);
      reply.status(500).send({ error: (error as Error).message });
    }
  });

  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      await userService.deleteUser(request.params.id);
      reply.status(204).send();
    } catch (error) {
      log.error(`Error deleting user: ${(error as Error).message}`);
      reply.status(500).send({ error: (error as Error).message });
    }
  });
}

export default userRoutes;