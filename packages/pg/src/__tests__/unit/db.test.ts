import { db } from '../../db';
import { PoolClient } from 'pg';

let client: PoolClient;

// Setup before each test to start a transaction
beforeEach(async () => {
  client = await db.beginTransaction();
});

// Cleanup after each test by rolling back the transaction
afterEach(async () => {
  await db.rollbackTransaction(client);
});

// Close the database pool after all tests
afterAll(async () => {
  await db.closePool();
});

describe('Database CRUD operations with rollback', () => {
  it('should create and read a record within a transaction', async () => {
    const newUser = await db.create('users', { name: 'john doe' }, client);
    expect(newUser).toHaveProperty('name', 'john doe');

    const users = await db.read('users', { name: 'john doe' }, client);
    expect(users.length).toBe(1);
    expect(users[0]).toHaveProperty('id');
  });

  it('should update a record within a transaction', async () => {
    await db.create('users', { name: 'john doe' }, client);
    const updatedUser = await db.update('users', { name: 'john doel' }, { name: 'john doe' }, client);
    expect(updatedUser).toHaveProperty('name', 'john doel');
  });

  it('should delete a record within a transaction', async () => {
    await db.create('users', { name: 'john doe' }, client);
    await db.delete('users', { name: 'john doe' }, client);

    const users = await db.read('users', { name: 'john doe' }, client);
    expect(users.length).toBe(0);
  });
});
