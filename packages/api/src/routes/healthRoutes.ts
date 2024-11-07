import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';

async function healthRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ status: 'ok' });
  });
}

export default healthRoutes;