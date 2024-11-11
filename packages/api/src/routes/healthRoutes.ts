import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { healthService } from '@ecny/service';

async function healthRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Use the health service to check the database connection
      await healthService.checkDatabaseConnection();
      reply.send({ status: 'ok' });
    } catch (error) {
      reply.status(500).send({ status: 'error', message: 'Database connection failed' });
    }
  });
}

export default healthRoutes;