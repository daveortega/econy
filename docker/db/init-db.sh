#!/bin/bash
set -e

# Create the first database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER ecny_app WITH PASSWORD 'asupersecretpassword';
  GRANT ALL PRIVILEGES ON DATABASE ecny TO ecny_app;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ecny_app;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ecny_app;
EOSQL

# Create the test database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE ecny_test;
  CREATE USER ecny_test_app WITH PASSWORD 'asupersecretpassword';
  GRANT ALL PRIVILEGES ON DATABASE ecny_test TO ecny_test_app;
EOSQL

# Connect to the test database and set default privileges
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "ecny_test" <<-EOSQL
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ecny_test_app;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ecny_test_app;
EOSQL