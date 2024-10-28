import userService from '../../userService';
import { userModel } from '@ecny/model';
import { logger } from '@ecny/logger';

jest.mock('@ecny/model');

// Mock the logger factory function
jest.mock('@ecny/logger', () => {
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
  };

  return {
    logger: jest.fn(() => mockLogger),
    __mockLoggerInstance: mockLogger, // Expose mockLogger for test access
  };
});

// Access the exposed mock logger instance for testing
const { __mockLoggerInstance: mockLogger } = jest.requireMock('@ecny/logger');


describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = { id: '1', name: 'testuser' };
      (userModel.create as jest.Mock).mockResolvedValue(user);

      const result = await userService.createUser(user);

      expect(userModel.create).toHaveBeenCalledWith(user);
      expect(mockLogger.info).toHaveBeenCalledWith(`User created: ${JSON.stringify(user)}`);
      expect(result).toEqual(user);

    });

    it('should log and throw an error if create fails', async () => {
      const user = { id: '1', name: 'testuser', email: 'test@example.com' };
      const error = new Error('Create failed');
      (userModel.create as jest.Mock).mockRejectedValue(error);

      await expect(userService.createUser(user)).rejects.toThrow('Create failed');

      expect(logger('UserService').error).toHaveBeenCalledWith(`Error creating user: ${error.message}`);
    });
  });

  describe('getUserById', () => {
    it('should get a user by id', async () => {
      const user = { id: '1', name: 'testuser', email: 'test@example.com' };
      (userModel.read as jest.Mock).mockResolvedValue(user);

      const result = await userService.getUserById('1');

      expect(userModel.read).toHaveBeenCalledWith('1');
      expect(logger('UserService').info).toHaveBeenCalledWith(`User read: ${JSON.stringify(user)}`);
      expect(result).toEqual(user);
    });

    it('should log and throw an error if read fails', async () => {
      const error = new Error('Read failed');
      (userModel.read as jest.Mock).mockRejectedValue(error);

      await expect(userService.getUserById('1')).rejects.toThrow('Read failed');

      expect(logger('UserService').error).toHaveBeenCalledWith(`Error reading user: ${error.message}`);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const user = { id: '1', name: 'updateduser', email: 'updated@example.com' };
      (userModel.update as jest.Mock).mockResolvedValue(user);

      const result = await userService.updateUser('1', user);

      expect(userModel.update).toHaveBeenCalledWith('1', user);
      expect(logger('UserService').info).toHaveBeenCalledWith(`User updated: ${JSON.stringify(user)}`);
      expect(result).toEqual(user);
    });

    it('should log and throw an error if update fails', async () => {
      const user = { id: '1', name: 'updateduser', email: 'updated@example.com' };
      const error = new Error('Update failed');
      (userModel.update as jest.Mock).mockRejectedValue(error);

      await expect(userService.updateUser('1', user)).rejects.toThrow('Update failed');

      expect(logger('UserService').error).toHaveBeenCalledWith(`Error updating user: ${error.message}`);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      (userModel.delete as jest.Mock).mockResolvedValue(undefined);

      await userService.deleteUser('1');

      expect(userModel.delete).toHaveBeenCalledWith('1');
      expect(logger('UserService').info).toHaveBeenCalledWith(`User deleted: 1`);
    });

    it('should log and throw an error if delete fails', async () => {
      const error = new Error('Delete failed');
      (userModel.delete as jest.Mock).mockRejectedValue(error);

      await expect(userService.deleteUser('1')).rejects.toThrow('Delete failed');

      expect(logger('UserService').error).toHaveBeenCalledWith(`Error deleting user: ${error.message}`);
    });
  });

  describe('findUsersByCreatedDate', () => {
    it('should find users by created date', async () => {
      const user = { id: '1', name: 'testuser', email: 'test@example.com', created_at: '2023-10-01' };
      (userModel.findByCreatedDate as jest.Mock).mockResolvedValue([user]);

      const result = await userService.findUsersByCreatedDate('2023-10-01');

      expect(userModel.findByCreatedDate).toHaveBeenCalledWith('2023-10-01');
      expect(logger('UserService').info).toHaveBeenCalledWith(`Users found by created date: ${JSON.stringify([user])}`);
      expect(result).toEqual([user]);
    });

    it('should log and throw an error if findByCreatedDate fails', async () => {
      const error = new Error('Query failed');
      (userModel.findByCreatedDate as jest.Mock).mockRejectedValue(error);

      await expect(userService.findUsersByCreatedDate('2023-10-01')).rejects.toThrow('Query failed');

      expect(logger('UserService').error).toHaveBeenCalledWith(`Error finding users by created date: ${error.message}`);
    });
  });
});