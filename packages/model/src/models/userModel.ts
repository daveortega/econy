import { db } from '@ecny/pg';
import { PoolClient } from 'pg';
import { users } from '../generated/types';

class usersModel {
  private tableName = 'users';

  async create(user: users): Promise<users> {
    const client = await db.beginTransaction();
    try {
      const newusers = await db.create<users>(this.tableName, user, client);
      await db.commitTransaction(client);
      return newusers;
    } catch (error) {
      await db.rollbackTransaction(client);
      throw error;
    }
  }

  async read(id: string): Promise<users | null> {
    const client = await db.beginTransaction();
    try {
      const users = await db.read<users>(this.tableName, { id }, client);
      await db.commitTransaction(client);
      return users.length ? users[0] : null;
    } catch (error) {
      await db.rollbackTransaction(client);
      throw error;
    }
  }

  async update(id: string, user: Partial<users>): Promise<users | null> {
    const client = await db.beginTransaction();
    try {
      const updatedusers = await db.update<users>(this.tableName, { id }, user, client);
      await db.commitTransaction(client);
      return updatedusers;
    } catch (error) {
      await db.rollbackTransaction(client);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const client = await db.beginTransaction();
    try {
      await db.delete(this.tableName, { id }, client);
      await db.commitTransaction(client);
    } catch (error) {
      await db.rollbackTransaction(client);
      throw error;
    }
  }
}

export default new usersModel();