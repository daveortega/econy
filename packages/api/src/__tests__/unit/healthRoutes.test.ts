import Fastify from 'fastify';
import healthRoutes from '../../routes/healthRoutes';

describe('healthRoutes', () => {
  let fastify: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    fastify = Fastify();
    fastify.register(healthRoutes);
    await fastify.ready();
  });

  afterAll(() => {
    fastify.close();
  });

  it('should return status ok', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });
});