# Define the default target
.PHONY: all
all: start

##### Clean section #####

.PHONY: clean
clean: db-clean-local docker-down clean-node-modules clean-coverage clean-dist clean-tsbuildinfo

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

.PHONY: clean-node-modules
clean-node-modules:
	@echo "Removing node_modules in all subdirectories"
	find . -type d -name 'node_modules' -exec rm -rf {} +

.PHONY: clean-coverage
clean-coverage:
	@echo "Removing coverage folders in all subdirectories"
	find . -type d -name 'coverage' -exec rm -rf {} +

.PHONY: clean-dist
clean-dist:
	@echo "Removing dist folders in all subdirectories"
	find . -type d -name 'dist' -exec rm -rf {} +

.PHONY: clean-tsbuildinfo
clean-tsbuildinfo:
	@echo "Removing tsconfig.tsbuildinfo files in all subdirectories"
	find . -type f -name 'tsconfig.tsbuildinfo' -exec rm -f {} +

##### Test enablers section #####

.PHONY: test
test: db-migrate-local db-test

.PHONY: db-migrate-local
db-migrate-local:
	@echo "Running migrations in test database for local development"
	yarn workspace @ecny/migrations run migrate:test:latest

.PHONY: db-test
db-test:
	@echo "Executing unit tests"
	yarn workspaces run test:unit

##### Start section #####

.PHONY: start
start: docker-start yarn-install db-migrate yarn-build

.PHONY: docker-start
docker-start:
	@echo "Starting Docker Compose services..."
	docker-compose up -d

.PHONY: yarn-install
yarn-install:
	@echo "Installing npm packages"
	yarn install

.PHONY: db-migrate
db-migrate:
	@echo "Running migrations in main database"
	yarn workspace @ecny/migrations run migrate:latest

.PHONY: yarn-build
yarn-build:
	@echo "Building all workspaces"
	yarn workspace @ecny/masker run build
	yarn workspace @ecny/pg run build
	yarn workspaces run build