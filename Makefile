# Define the default target
.PHONY: all
all: start

##### Clean section #####

.PHONY: clean
clean: db-clean-local docker-down

.PHONY: db-clean
db-clean:
	@echo "Removing migrations in main database"
	yarn workspace @ecny/migrations run migrate:rollback

.PHONY: db-clean-local
db-clean-local:
	@echo "Removing migrations in test database for local development"
	yarn workspace @ecny/migrations run migrate:test:rollback

.PHONY: docker-down
docker-down:
	@echo "Stopping Docker Compose services..."
	docker-compose down -v

##### Test enablers section #####

.PHONY: test
test: db-migrate-local db-test

.PHONY: db-migrate-local
db-migrate-local:
	@echo "Running migrations in test database for local development"
	yarn workspace @ecny/migrations run migrate:test:latest

.PHONY: db-test
db-test:
	@echo "Executing unit tests on the test database"
	yarn workspace @ecny/pg run test:unit

##### Start section #####

.PHONY: start
start: docker-start db-migrate

.PHONY: db-migrate
db-migrate:
	@echo "Running migrations in main database"
	yarn workspace @ecny/migrations run migrate:latest

.PHONY: docker-start
docker-start:
	@echo "Starting Docker Compose services..."
	docker-compose up -d