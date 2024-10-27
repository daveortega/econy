import { Pool, PoolClient, PoolConfig, QueryResultRow } from 'pg';
import config from 'config';
import { logger } from '@ecny/logger';

const myLogger = logger('db operations');

interface DbConfig extends PoolConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

// Get the database config from the config package
const dbConfig: DbConfig = config.get('db.application');

// Create a new PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Define a type for query results
type QueryResult<T> = T[];

// Database wrapper with CRUD methods and transaction support
export const db = {
  /**
   * Executes a query and returns the result
   * @param text - SQL query string
   * @param params - Query parameters
   * @param client - Optional PoolClient for transaction
   * @returns Promise<QueryResult<T>> - Query result as an array of rows
   */
  async query<T extends QueryResultRow>(text: string, params?: any[], client?: PoolClient): Promise<QueryResult<T>> {
    const queryClient = client || (await pool.connect());
    try {
      const result = await queryClient.query<T>(text, params);
      if (!client) queryClient.release();
      return result.rows;
    } catch (err) {
      myLogger.error('Database query error', err);
      if (!client) queryClient.release();
      throw err;
    }
  },

  /**
   * Starts a transaction
   * @returns Promise<PoolClient> - A client that is in a transaction
   */
  async beginTransaction(): Promise<PoolClient> {
    const client = await pool.connect();
    await client.query('BEGIN');
    return client;
  },

  /**
   * Commits a transaction
   * @param client - The client involved in the transaction
   * @returns Promise<void>
   */
  async commitTransaction(client: PoolClient): Promise<void> {
    try {
      await client.query('COMMIT');
    } finally {
      client.release();
    }
  },

  /**
   * Rolls back a transaction
   * @param client - The client involved in the transaction
   * @returns Promise<void>
   */
  async rollbackTransaction(client: PoolClient): Promise<void> {
    try {
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  },

  // CRUD operations remain unchanged, but will use transactions in tests
  async create<T extends QueryResultRow>(table: string, data: Record<string, any>, client?: PoolClient): Promise<T> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, idx) => `$${idx + 1}`).join(', ');

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.query<T>(query, values, client);
    return result[0];
  },

  async read<T extends QueryResultRow>(table: string, where: Record<string, any> = {}, client?: PoolClient): Promise<QueryResult<T>> {
    const whereClause = Object.keys(where).length
      ? 'WHERE ' + Object.keys(where).map((key, idx) => `${key} = $${idx + 1}`).join(' AND ')
      : '';

    const values = Object.values(where);
    const query = `SELECT * FROM ${table} ${whereClause}`;
    return this.query<T>(query, values, client);
  },

  async update<T extends QueryResultRow>(table: string, data: Record<string, any>, where: Record<string, any>, client?: PoolClient): Promise<T> {
    const setClause = Object.keys(data).map((key, idx) => `${key} = $${idx + 1}`).join(', ');
    const whereClause = Object.keys(where)
      .map((key, idx) => `${key} = $${idx + 1 + Object.keys(data).length}`)
      .join(' AND ');

    const values = [...Object.values(data), ...Object.values(where)];
    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    const result = await this.query<T>(query, values, client);
    return result[0];
  },

  async delete(table: string, where: Record<string, any>, client?: PoolClient): Promise<void> {
    const whereClause = Object.keys(where).map((key, idx) => `${key} = $${idx + 1}`).join(' AND ');
    const values = Object.values(where);

    const query = `DELETE FROM ${table} WHERE ${whereClause}`;
    await this.query(query, values, client);
  },

  async closePool(): Promise<void> {
    await pool.end();
  }
};
