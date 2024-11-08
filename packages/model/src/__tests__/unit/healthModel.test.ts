import healthModel from '../../models/healthModel';
import { db } from '@ecny/pg';

jest.mock('@ecny/pg', () => ({
  db: {
    beginTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
  },
}));

jest.mock("@ecny/logger", () => {
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
  const { __mockLoggerInstance: mockLogger } = jest.requireMock("@ecny/logger");

describe('HealthModel', () => {
  let client: any;

  beforeEach(() => {
    client = {
      query: jest.fn(),
    };
    (db.beginTransaction as jest.Mock).mockResolvedValue(client);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log success message if database connection is healthy', async () => {
    client.query.mockResolvedValueOnce({});

    await healthModel.checkDatabaseConnection();

    expect(client.query).toHaveBeenCalledWith('SELECT 1');
    expect(mockLogger.info).toHaveBeenCalledWith('Database connection is healthy');
    expect(db.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('should log error message and rollback transaction if database connection fails', async () => {
    const error = new Error('Database connection failed');
    client.query.mockRejectedValueOnce(error);

    await expect(healthModel.checkDatabaseConnection()).rejects.toThrow(error);

    expect(client.query).toHaveBeenCalledWith('SELECT 1');
    expect(mockLogger.error).toHaveBeenCalledWith('Database connection failed');
    expect(db.rollbackTransaction).toHaveBeenCalledWith(client);
  });
});