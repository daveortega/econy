import healthService from "../../services/healthService";
import { healthModel } from "@ecny/model";

jest.mock("@ecny/model", () => ({
  healthModel: {
    checkDatabaseConnection: jest.fn(),
  },
}));

describe("HealthService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should check the database connection successfully", async () => {
    (healthModel.checkDatabaseConnection as jest.Mock).mockResolvedValueOnce(
      {}
    );

    await healthService.checkDatabaseConnection();

    expect(healthModel.checkDatabaseConnection).toHaveBeenCalled();
  });

  it("should throw an error if the database connection fails", async () => {
    const error = new Error("Database connection failed");
    (healthModel.checkDatabaseConnection as jest.Mock).mockRejectedValueOnce(
      error
    );

    await expect(healthService.checkDatabaseConnection()).rejects.toThrow(
      error
    );

    expect(healthModel.checkDatabaseConnection).toHaveBeenCalled();
  });
});
