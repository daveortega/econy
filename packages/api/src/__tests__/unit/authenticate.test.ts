import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import authenticate from '../../plugins/authenticate';

describe('authenticate plugin', () => {
  let fastify: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    fastify = Fastify();
    fastify.register(fastifyJwt, { secret: 'supersecret' });
    fastify.register(authenticate);
    await fastify.ready();
  });

  afterAll(() => {
    fastify.close();
  });

  it('should add the authenticate method to the Fastify instance', () => {
    expect(typeof fastify.authenticate).toBe('function');
  });

  it('should verify JWT token and call next', async () => {
    const token = fastify.jwt.sign({ username: 'testuser' });

    const request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      jwtVerify: jest.fn().mockResolvedValue({ username: 'testuser' }),
    };

    const reply = {
      send: jest.fn(),
    };

    await fastify.authenticate(request as any, reply as any);

    expect(request.jwtVerify).toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
  });

  it('should send error if JWT verification fails', async () => {
    const request = {
      headers: {
        authorization: 'Bearer invalidtoken',
      },
      jwtVerify: jest.fn().mockRejectedValue(new Error('Invalid token')),
    };

    const reply = {
      send: jest.fn(),
    };

    await fastify.authenticate(request as any, reply as any);

    expect(request.jwtVerify).toHaveBeenCalled();
    expect(reply.send).toHaveBeenCalledWith(new Error('Invalid token'));
  });
});