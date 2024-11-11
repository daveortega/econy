import { db } from "@ecny/pg";
import { logger } from "@ecny/logger";

const myLogger = logger("Health model");

class HealthModel {
  async checkDatabaseConnection(): Promise<void> {
    const client = await db.beginTransaction();
    try {
      const query = "SELECT 1";
      await client.query(query);
      myLogger.info("Database connection is healthy");
    } catch (error) {
      await db.rollbackTransaction(client);
      myLogger.error("Database connection failed");
      throw error;
    }
  }
}

export default new HealthModel();
