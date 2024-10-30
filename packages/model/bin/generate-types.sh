#!/bin/bash

# Step 1: Set NODE_CONFIG_DIR using LEVELS_TO_ROOT
export NODE_CONFIG_DIR="${LEVELS_TO_ROOT}config"

# Step 3: Run the Node.js script to generate JSON, passing the initial directory as an argument
node dbconfig-create.js

# Step 4: Execute the Node.js command directly from the pg directory
node_command="../../node_modules/@rmp135/sql-ts/dist/cli.js"
node "$node_command" -c ./dbconfig.json