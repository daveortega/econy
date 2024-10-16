// packages/migrations/src/migrate.ts
import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: 'postgres',
    user: 'ecny',
    password: 'asupersecretpassword',
    database: 'ecny'
  }
});

// Example migration: create a table
db.schema.createTable('example', table => {
  table.increments('id');
  table.string('name');
}).then(() => {
  console.log('Table created');
  process.exit(0);
}).catch(err => {
  console.error('Error creating table:', err);
  process.exit(1);
});