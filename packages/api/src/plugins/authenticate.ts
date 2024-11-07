import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      rep9ly: FastifyReply
    ) => Promise<void>;
  }
}

async function authenticate(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.addHook('preHandler', fastify.authenticate);
}

export default fp(authenticate);