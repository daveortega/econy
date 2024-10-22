import type { Knex } from "knex";
import config from "config";

// Get the user and password from the configuration
const appUser = config.get<string>("db.application.user");
const appPassword = config.get<string>("db.application.password");
const database = config.get<string>("db.application.database");

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE USER ${appUser} WITH PASSWORD '${appPassword}';
    GRANT CONNECT ON DATABASE ${database} TO ${appUser};
    GRANT USAGE ON SCHEMA public TO ${appUser};
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${appUser};
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${appUser};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${appUser};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ${appUser};
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM ${appUser};
    REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM ${appUser};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM ${appUser};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM ${appUser};
    DROP OWNED BY ${appUser};
    DROP USER IF EXISTS ${appUser};
  `);
}