// Initiate dotenv for running scripts purpose
const dotenv = require('dotenv');
const DBClientService = require('./DBService');
const DBPoolService = require('./DBPoolService');

dotenv.config();

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_URL,
  IS_SUPPORT_POOLING,
} = process.env;

const DBService =
  IS_SUPPORT_POOLING === 'true' ? DBPoolService : DBClientService;

const dbService = new DBService({
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  database: DATABASE_NAME,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  connectionString: DATABASE_URL,
});

module.exports = dbService;
