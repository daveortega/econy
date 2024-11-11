import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import authRoutes from '../../routes/authRoutes';

describe('authRoutes', () => {
  let fastify: ReturnType<typeof Fastify>;

  beforeAll(() => {
    fastify = Fastify();
    fastify.register(fastifyJwt, { secret: 'supersecret' });
    fastify.register(authRoutes, { prefix: "/auth" });
  });

  afterAll(() => {
    fastify.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should return a token for valid credentials', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { username: 'testuser', password: 'password' },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { username: 'invaliduser', password: 'wrongpassword' },
      });

      expect(response.statusCode).toBe(401);
      const body = response.json();
      expect(body).toEqual({ error: 'Invalid username or password' });
    });
  });
});