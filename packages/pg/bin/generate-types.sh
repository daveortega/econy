#!/bin/bash

# Step 1: Set NODE_CONFIG_DIR using LEVELS_TO_ROOT
export NODE_CONFIG_DIR="${LEVELS_TO_ROOT}config"

# Step 2: Create a temporary Node.js script for loading YAML config using the config package
node_script="parse-yaml.js"  # Create in the current directory

cat << 'EOF' > "$node_script"
const path = require('path');
const config = require('config');

// Load the database configurations
const applicationDbConfig = config.get('db.application');

// Create the output JSON structure
const outputConfig = {
  client: 'pg',
  connection: {
    user: applicationDbConfig.user,
    password: applicationDbConfig.password,
    host: applicationDbConfig.host,
    port: applicationDbConfig.port,
    database: applicationDbConfig.database,
  },
  filename: 'src/generated/types',
  excludedTables: [
    'public.knex_migrations', 
    'public.knex_migrations_lock' 
  ],
  interfaceNameFormat: '${table}'
};

// Write the output JSON to a file in the initial directory as dbconfig.json
const fs = require('fs');
const outputFilePath = path.join(__dirname, 'dbconfig.json');
fs.writeFileSync(outputFilePath, JSON.stringify(outputConfig, null, 2));
console.log(`JSON content saved to ${outputFilePath}`);
EOF

# Step 3: Run the Node.js script to generate JSON, passing the initial directory as an argument
node "$node_script"

# Step 4: Execute the Node.js command directly from the pg directory
node_command="../../node_modules/@rmp135/sql-ts/dist/cli.js"
node "$node_command" -c ./dbconfig.json

echo "Node command executed from $(pwd)."

# Cleanup: Remove the temporary Node.js script
rm "$node_script"