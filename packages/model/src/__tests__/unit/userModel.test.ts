import usersModel from '../../models/userModel';
import { db } from '@ecny/pg';
import { users } from '../../generated/types';

jest.mock('@ecny/pg');

describe('userModel', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    (db.beginTransaction as jest.Mock).mockResolvedValue(mockClient);
    (db.commitTransaction as jest.Mock).mockResolvedValue(undefined);
    (db.rollbackTransaction as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user: users = { id: '1', name: 'testuser'};
      (db.create as jest.Mock).mockResolvedValue(user);

      const result = await usersModel.create(user);

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.create).toHaveBeenCalledWith('users', user, mockClient);
      expect(db.commitTransaction).toHaveBeenCalledWith(mockClient);
      expect(result).toEqual(user);
    });

    it('should rollback transaction if create fails', async () => {
      const user: users = { id: '1', name: 'testuser' };
      (db.create as jest.Mock).mockRejectedValue(new Error('Create failed'));

      await expect(usersModel.create(user)).rejects.toThrow('Create failed');

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.create).toHaveBeenCalledWith('users', user, mockClient);
      expect(db.rollbackTransaction).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('read', () => {
    it('should read a user by id', async () => {
      const user: users = { id: '1', name: 'testuser' };
      (db.read as jest.Mock).mockResolvedValue([user]);

      const result = await usersModel.read('1');

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.read).toHaveBeenCalledWith('users', { id: '1' }, mockClient);
      expect(db.commitTransaction).toHaveBeenCalledWith(mockClient);
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      (db.read as jest.Mock).mockResolvedValue([]);

      const result = await usersModel.read('1');

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.read).toHaveBeenCalledWith('users', { id: '1' }, mockClient);
      expect(db.commitTransaction).toHaveBeenCalledWith(mockClient);
      expect(result).toBeNull();
    });

    it('should rollback transaction if read fails', async () => {
      (db.read as jest.Mock).mockRejectedValue(new Error('Read failed'));

      await expect(usersModel.read('1')).rejects.toThrow('Read failed');

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.read).toHaveBeenCalledWith('users', { id: '1' }, mockClient);
      expect(db.rollbackTransaction).toHaveBeenCalledWith(mockClient);
    });
  });
});