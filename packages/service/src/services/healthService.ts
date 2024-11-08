import { healthModel } from '@ecny/model';

class HealthService {
  async checkDatabaseConnection(): Promise<void> {
    await healthModel.checkDatabaseConnection();
  }
}

export default new HealthService();