const defaultConfig = {
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "dialect": "mysql",
  "migrationStorageTableName": "migrations"
}

module.exports = {
  "development": defaultConfig,
  "test": defaultConfig,
  "production": Object.assign(defaultConfig, {"operatorsAliases": false})
}
