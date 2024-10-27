import { db } from '@ecny/pg';
import { users } from '../generated/types';
import { logger } from '@ecny/logger';

const myLogger = logger('Users model');

class usersModel {
  private tableName = 'users';

  async create(user: users): Promise<users> {
    const client = await db.beginTransaction();
    try {
      const newUser = await db.create<users>(this.tableName, user, client);
      await db.commitTransaction(client);
      myLogger.info(`User created: ${newUser.id}`);
      return newUser;
    } catch (error) {
      await db.rollbackTransaction(client);
      myLogger.error(`Error creating user`);
      throw error;
    }
  }

  async read(id: string): Promise<users | null> {
    const client = await db.beginTransaction();
    try {
      const users = await db.read<users>(this.tableName, { id }, client);
      return users.length ? users[0] : null;
    } catch (error) {
      myLogger.error(`Error reading user: ${error}`);
      throw error;
    }
  }

  async update(id: string, user: Partial<users>): Promise<users | null> {
    const client = await db.beginTransaction();
    try {
      const updatedUser = await db.update<users>(this.tableName, { id }, user, client);
      await db.commitTransaction(client);
      myLogger.info(`User updated: ${updatedUser.id}`);
      return updatedUser;
    } catch (error) {
      await db.rollbackTransaction(client);
      myLogger.error(`Error updating user: ${error}`);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const client = await db.beginTransaction();
    try {
      await db.delete(this.tableName, { id }, client);
      await db.commitTransaction(client);
      myLogger.info(`User deleted: ${id}`);
    } catch (error) {
      await db.rollbackTransaction(client);
      myLogger.error(`Error deleting user: ${error}`);
      throw error;
    }
  }

  async findByCreatedDate(createdDate: string): Promise<users[]> {
    const client = await db.beginTransaction();
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE created_at = $1`;
      const result = await client.query(query, [createdDate]);
      return result.rows;
    } catch (error) {
      myLogger.error(`Error finding users by created date: ${error}`);
      throw error;
    }
  }
}

export default new usersModel();