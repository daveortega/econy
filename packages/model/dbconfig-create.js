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
