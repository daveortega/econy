import type { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  
  await knex.schema
    .createTable('users', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name', 1000).notNullable()
      table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}

