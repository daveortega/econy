import { logger } from '@ecny/logger';
import { userModel } from '@ecny/model';
import { users } from '@ecny/model/dist/generated/types';

const myLogger = logger('UserService');

class UserService {
  async createUser(user: users): Promise<users> {
    try {
      const newUser = await userModel.create(user);
      myLogger.info(`User created: ${JSON.stringify(newUser)}`);
      return newUser;
    } catch (error) {
      myLogger.error(`Error creating user: ${(error as Error).message}`);
      throw error;
    }
  }

  async getUserById(id: string): Promise<users | null> {
    try {
      const user = await userModel.read(id);
      myLogger.info(`User read: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      myLogger.error(`Error reading user: ${(error as Error).message}`);
      throw error;
    }
  }

  async updateUser(id: string, user: Partial<users>): Promise<users | null> {
    try {
      const updatedUser = await userModel.update(id, user);
      myLogger.info(`User updated: ${JSON.stringify(updatedUser)}`);
      return updatedUser;
    } catch (error) {
      myLogger.error(`Error updating user: ${(error as Error).message}`);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await userModel.delete(id);
      myLogger.info(`User deleted: ${id}`);
    } catch (error) {
      myLogger.error(`Error deleting user: ${(error as Error).message}`);
      throw error;
    }
  }

  async findUsersByCreatedDate(createdDate: string): Promise<users[]> {
    try {
      const users = await userModel.findByCreatedDate(createdDate);
      myLogger.info(`Users found by created date: ${JSON.stringify(users)}`);
      return users;
    } catch (error) {
      myLogger.error(`Error finding users by created date: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default new UserService();