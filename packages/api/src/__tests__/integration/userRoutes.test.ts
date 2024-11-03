import Fastify from 'fastify';
import userRoutes from '../../routes/userRoutes';
import authRoutes from '../../routes/authRoutes';
import config from 'config';

const serverConfig = config.get<{ port: number }>('server');

const fastify = Fastify();

let token: string;

beforeAll(async () => {
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(userRoutes, { prefix: '/users' });
  await fastify.listen(serverConfig.port);

  // Get a valid token for authentication
  const response = await fastify.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { username: 'testuser', password: 'password' },
  });

  token = response.json().token;
});

afterAll(() => {
  fastify.close();
});

describe('User Routes Integration Tests', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/users',
        payload: { name: 'testuser' },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(201);
      const user = response.json();
      expect(user).toHaveProperty('id');
      expect(user.name).toBe('testuser');
    });
  });

  describe('GET /users/:id', () => {
    it('should get a user by id', async () => {
      const createResponse = await fastify.inject({
        method: 'POST',
        url: '/users',
        payload: { name: 'testuser' },
      });

      const user = createResponse.json();

      const getResponse = await fastify.inject({
        method: 'GET',
        url: `/users/${user.id}`,
      });

      expect(getResponse.statusCode).toBe(200);
      const fetchedUser = getResponse.json();
      expect(fetchedUser.id).toBe(user.id);
      expect(fetchedUser.name).toBe('testuser');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user by id', async () => {
      const createResponse = await fastify.inject({
        method: 'POST',
        url: '/users',
        payload: { name: 'testuser' },
      });

      const user = createResponse.json();

      const deleteResponse = await fastify.inject({
        method: 'DELETE',
        url: `/users/${user.id}`,
      });

      expect(deleteResponse.statusCode).toBe(204);

      const getResponse = await fastify.inject({
        method: 'GET',
        url: `/users/${user.id}`,
      });

      expect(getResponse.statusCode).toBe(404);
    });
  });
});