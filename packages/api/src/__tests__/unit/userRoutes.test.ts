import Fastify from "fastify";
import userRoutes from "../../routes/userRoutes";
import { userService } from "@ecny/service";

jest.mock("@ecny/service");
// Mock the logger factory function
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

describe("userRoutes", () => {
  let fastify: ReturnType<typeof Fastify>;

  beforeAll(() => {
    fastify = Fastify();
    fastify.register(userRoutes, { prefix: "/users" });
  });

  afterAll(() => {
    fastify.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const user = { name: "testuser" };
      (userService.createUser as jest.Mock).mockResolvedValue(user);

      const response = await fastify.inject({
        method: "POST",
        url: "/users",
        payload: user,
      });

      expect(response.statusCode).toBe(201);
      expect(response.json().name).toEqual(user.name);
      expect(userService.createUser).toHaveBeenCalledWith(user);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it("should return 500 if createUser fails", async () => {
      const error = new Error("Create failed");
      (userService.createUser as jest.Mock).mockRejectedValue(error);

      const response = await fastify.inject({
        method: "POST",
        url: "/users",
        payload: { name: "testuser" },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ error: "Create failed" });
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error creating user: ${error.message}`
      );
    });
  });

  describe("GET /users/:id", () => {
    it("should get a user by id", async () => {
      const user = { id: "1", name: "testuser" };
      (userService.getUserById as jest.Mock).mockResolvedValue(user);

      const response = await fastify.inject({
        method: "GET",
        url: "/users/1",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(user);
      expect(userService.getUserById).toHaveBeenCalledWith("1");
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(null);

      const response = await fastify.inject({
        method: "GET",
        url: "/users/1",
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ error: "User not found" });
      expect(userService.getUserById).toHaveBeenCalledWith("1");
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it("should return 500 if getUserById fails", async () => {
      const error = new Error("Read failed");
      (userService.getUserById as jest.Mock).mockRejectedValue(error);

      const response = await fastify.inject({
        method: "GET",
        url: "/users/1",
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ error: "Read failed" });
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error getting user: ${error.message}`
      );
    });
  });

  describe("UPDATE /update/:id", () => {
    it("should update a user by id", async () => {
      const user = { id: "1", name: "testingUser" };
      (userService.updateUser as jest.Mock).mockResolvedValue(user);

      const response = await fastify.inject({
        method: "PUT",
        url: "/users/1",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(user);
      expect(response.payload).toContain("testingUser");
      expect(userService.updateUser).toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      (userService.updateUser as jest.Mock).mockResolvedValue(null);

      const response = await fastify.inject({
        method: "PUT",
        url: "/users/1",
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ error: "User not found" });
      expect(userService.updateUser).toHaveBeenCalled();
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it("should return 500 if update fails", async () => {
      const error = new Error("Error updating");
      (userService.updateUser as jest.Mock).mockRejectedValue(error);

      const response = await fastify.inject({
        method: "PUT",
        url: "/users/1",
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ error: "Error updating" });
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error updating user: ${error.message}`
      );
    });
  });

  describe("DELETE /delete/:id", () => {
    it("should delete a user by id", async () => {
      const user = { id: "1", name: "testingUser" };
      (userService.deleteUser as jest.Mock).mockResolvedValue(user);

      const response = await fastify.inject({
        method: "DELETE",
        url: "/users/1",
      });

      expect(response.statusCode).toBe(204);
      expect(response.payload).toBe("");
      expect(userService.deleteUser).toHaveBeenCalledWith("1");
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it("should return 500 if delete fails", async () => {
      const error = new Error("Error deleting");
      (userService.deleteUser as jest.Mock).mockRejectedValue(error);

      const response = await fastify.inject({
        method: "delete",
        url: "/users/1",
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ error: "Error deleting" });
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error deleting user: ${error.message}`
      );
    });
  });
});
