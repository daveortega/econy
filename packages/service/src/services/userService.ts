import { logger } from '@ecny/logger';
import { userModel } from '@ecny/model';
import { types } from '@ecny/model';

const myLogger = logger('UserService');

class UserService {
  async createUser(input: any): Promise<any> {
    try {
      const user: types.users = this.castToUser(input);
      const newUser = await userModel.create(user);
      myLogger.info(`User created: ${JSON.stringify(newUser)}`);
      return newUser;
    } catch (error) {
      myLogger.error(`Error creating user: ${(error as Error).message}`);
      throw error;
    }
  }

  async getUserById(id: string): Promise<any> {
    try {
      const user = await userModel.read(id);
      myLogger.info(`User read: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      myLogger.error(`Error reading user: ${(error as Error).message}`);
      throw error;
    }
  }

  async updateUser(id: string, input: any): Promise<any> {
    try {
      const user: Partial<types.users> = this.castToUser(input);
      const updatedUser = await userModel.update(id, user);
      myLogger.info(`User updated: ${JSON.stringify(updatedUser)}`);
      return updatedUser;
    } catch (error) {
      myLogger.error(`Error updating user: ${(error as Error).message}`);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      await userModel.delete(id);
      myLogger.info(`User deleted: ${id}`);
      return { message: 'User deleted successfully' };
    } catch (error) {
      myLogger.error(`Error deleting user: ${(error as Error).message}`);
      throw error;
    }
  }

  async findUsersByCreatedDate(createdDate: string): Promise<any[]> {
    try {
      const users = await userModel.findByCreatedDate(createdDate);
      myLogger.info(`Users found by created date: ${JSON.stringify(users)}`);
      return users;
    } catch (error) {
      myLogger.error(`Error finding users by created date: ${(error as Error).message}`);
      throw error;
    }
  }

  private castToUser(input: any): types.users {
    // Perform necessary validation and transformation here
    return input as types.users;
  }
}

export default new UserService();