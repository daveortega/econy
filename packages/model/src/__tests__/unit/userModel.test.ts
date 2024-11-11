import usersModel from "../../models/userModel";
import { db } from "@ecny/pg";
import { users } from "../../generated/types";

jest.mock("@ecny/pg");

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

describe("userModel", () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (db.beginTransaction as jest.Mock).mockResolvedValue(mockClient);
    (db.commitTransaction as jest.Mock).mockResolvedValue(undefined);
    (db.rollbackTransaction as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const user: users = { id: "1", name: "testuser" };
      (db.create as jest.Mock).mockResolvedValue(user);

      const result = await usersModel.create(user);

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.create).toHaveBeenCalledWith("users", user, mockClient);
      expect(db.commitTransaction).toHaveBeenCalledWith(mockClient);
      expect(result).toEqual(user);
    });

    it("should rollback transaction if create fails", async () => {
      const user: users = { id: "1", name: "testuser" };
      (db.create as jest.Mock).mockRejectedValue(new Error("Create failed"));

      await expect(usersModel.create(user)).rejects.toThrow("Create failed");

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.create).toHaveBeenCalledWith("users", user, mockClient);
      expect(db.rollbackTransaction).toHaveBeenCalledWith(mockClient);
    });
  });

  describe("read", () => {
    it("should read a user by id", async () => {
      const user: users = { id: "1", name: "testuser" };
      (db.read as jest.Mock).mockResolvedValue([user]);

      const result = await usersModel.read("1");

      expect(db.read).toHaveBeenCalledWith("users", { id: "1" }, mockClient);
      expect(result).toEqual(user);
    });

    it('should handle error when reading a user', async () => {
      const user = { id: '1', name: 'testuser' };
      const error = new Error('Read failed');
      (db.read as jest.Mock).mockRejectedValue(error);
  
      await expect(usersModel.read(user.id)).rejects.toThrow(error);
  
      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.read).toHaveBeenCalledWith('users', { "id": user.id }, mockClient);
      expect(mockLogger.error).toHaveBeenCalledWith( `Error reading user: ${error}` );
    });  
  });

  it("should return null if user not found", async () => {
    (db.read as jest.Mock).mockResolvedValue([]);

    const result = await usersModel.read("1");

    expect(db.read).toHaveBeenCalledWith("users", { id: "1" }, mockClient);
    expect(result).toBeNull();
  });

  describe("update", () => {
    it("should update a user", async () => {
      const user: users = { id: "1", name: "updateduser" };
      (db.update as jest.Mock).mockResolvedValue(user);

      const result = await usersModel.update("1", user);

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.update).toHaveBeenCalledWith(
        "users",
        { id: "1" },
        user,
        mockClient
      );
      expect(db.commitTransaction).toHaveBeenCalledWith(mockClient);
      expect(result).toEqual(user);
    });

    it("should rollback transaction if update fails", async () => {
      const user: users = { id: "1", name: "updateduser" };
      (db.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

      await expect(usersModel.update("1", user)).rejects.toThrow(
        "Update failed"
      );

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.update).toHaveBeenCalledWith(
        "users",
        { id: "1" },
        user,
        mockClient
      );
      expect(db.rollbackTransaction).toHaveBeenCalledWith(mockClient);
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      (db.delete as jest.Mock).mockResolvedValue(undefined);

      await usersModel.delete("1");

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.delete).toHaveBeenCalledWith("users", { id: "1" }, mockClient);
      expect(db.commitTransaction).toHaveBeenCalledWith(mockClient);
    });

    it("should rollback transaction if delete fails", async () => {
      (db.delete as jest.Mock).mockRejectedValue(new Error("Delete failed"));

      await expect(usersModel.delete("1")).rejects.toThrow("Delete failed");

      expect(db.beginTransaction).toHaveBeenCalled();
      expect(db.delete).toHaveBeenCalledWith("users", { id: "1" }, mockClient);
      expect(db.rollbackTransaction).toHaveBeenCalledWith(mockClient);
    });
  });

  describe("findByCreatedDate", () => {
    it("should find users by created date", async () => {
      const user: users = {
        id: "1",
        name: "testuser",
        createdAt: new Date("2023-10-01"),
      };
      (mockClient.query as jest.Mock).mockResolvedValue({ rows: [user] });

      const result = await usersModel.findByCreatedDate("2023-10-01");

      expect(mockClient.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE created_at = $1",
        ["2023-10-01"]
      );
      expect(result).toEqual([user]);
    });

    it('should handle error when selecting a user by date', async () => {
      const error = new Error('Read failed');
      (mockClient.query as jest.Mock).mockRejectedValue(error);
  
      await expect(usersModel.findByCreatedDate("2023-10-01")).rejects.toThrow(error);
  
      expect(db.beginTransaction).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith( "SELECT * FROM users WHERE created_at = $1", ["2023-10-01"]);
      expect(mockLogger.error).toHaveBeenCalledWith( `Error finding users by created date: ${error}` );
    }); 
  });
});
