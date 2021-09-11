const { Client } = require('pg');

const logger = require('../utils/logger');
const { toArray } = require('../utils/common');
const {
  generateRecordArguments,
  generateReturningClause,
  generateSelectClause,
  generateUpdateValueStatements,
  generateValuesStatements,
  generateWhereArguments,
  generateWhereClause,
} = require('../utils/db');

class DBService {
  constructor({ host, port, database, user, password, connectionString }) {
    if (connectionString) {
      this.config = { connectionString, ssl: { rejectUnauthorized: false } };
    } else {
      this.config = {
        host,
        port,
        database,
        user,
        password,
        dialect: 'postgres',
      };
    }
  }

  async disconnect() {
    logger.log('Close db connection');
  }

  async query(query, params) {
    try {
      this.client = new Client(this.config);

      await this.client.connect();

      const result = await this.client.query(query, params);

      await this.client.end();

      return result;
    } catch (error) {
      logger.error(error.message);
      return Promise.reject(error);
    }
  }

  /**
   * Search query
   * NOTE: not work for SET data. Just work with primitive data types
   * @param {string} tableName Table Name
   * @param {string | string[]} columns Array of columns to get
   * @param {{[columnName: string]: {value: any; operator: string} | {value: any; operator: string}[]}[]} whereParams Params and operator
   * @param {number} limit Limit
   * @param {number} offset Offset
   */
  search(tableName, columns, whereParams = {}, limit = 0, offset = 0) {
    const selectClause = generateSelectClause(columns);
    const fromClause = `from ${tableName}`;

    const whereClause = generateWhereClause(whereParams);
    const whereArgs = generateWhereArguments(whereParams);

    const limitClause = limit ? `limit ${limit}` : '';
    const offsetClause = offset ? `offset ${offset}` : '';

    const query = `
    ${selectClause}
    ${fromClause}
    ${whereClause}
    ${limitClause}
    ${offsetClause}
    `;

    logger.log(`search query:\n`, query);
    logger.log(`with params:\n`, JSON.stringify(whereArgs, null, 2));

    return this.query(query, whereArgs);
  }

  /**
   * Insert into $tableName with $records and $returningColumns
   * @param {string} tableName Table Name
   * @param {Record<string, any>| Array<Record<string, any>>} records Records
   * @param {string | string[]} returningColumns Returning columns
   */
  insertInto(tableName, records, returningColumns) {
    const parsedRecords = toArray(records);
    const schemaColumns = Object.keys(parsedRecords[0]);
    const recordsArgs = generateRecordArguments(records);
    const valuesStatements = generateValuesStatements(records);
    const returningClause = generateReturningClause(returningColumns);

    const query = `
    insert into ${JSON.stringify(tableName)}(${schemaColumns.join(',')})
    values
    ${valuesStatements.join(',')}
    ${returningClause}
    `;

    logger.log('insert query\n', query);
    logger.log(`with params\n`, JSON.stringify(recordsArgs, null, 2));

    return this.query(query, recordsArgs);
  }

  /**
   * Update table
   * @param {string} tableName Table name
   * @param {Record<string, any>} updateValues Values to update {col: value, col2: value}
   * @param {{[colName: string]: {value: any; operator: string} | {value: any; operator: string}[]}} whereParams
   */
  update(tableName, updateValues, whereParams = {}) {
    const valueStatements = generateUpdateValueStatements(updateValues);
    const valuesLength = valueStatements.length;

    const whereClause = generateWhereClause(whereParams, valuesLength);
    const whereArgs = generateWhereArguments(whereParams);

    const query = `
    update ${JSON.stringify(tableName)}
    set ${valueStatements.join(', ')}
    ${whereClause}
    `;

    const updatedArgs = generateRecordArguments(updateValues);
    const queryArgs = updatedArgs.concat(whereArgs);

    logger.log('update query\n', query);
    logger.log(`with params\n`, JSON.stringify(queryArgs, null, 2));

    return this.query(query, queryArgs);
  }

  /**
   * Delete records
   * @param {string} tableName Table name
   * @param {{[colName: string]: {value: any; operator: string} | {value: any; operator: string}[]}} whereParams
   */
  delete(tableName, whereParams = {}) {
    const whereClause = generateWhereClause(whereParams);
    const whereArgs = generateWhereArguments(whereParams);

    const query = `
    delete from ${JSON.stringify(tableName)}
    ${whereClause}
    `;

    logger.log('delete query\n', query);
    logger.log(`with params\n`, JSON.stringify(whereArgs, null, 2));

    return this.query(query, whereArgs);
  }

  /**
   * Count table record
   * @param {string} tableName Table name
   * @param {{[colName: string]: { value: any; operator: string;}|{ value: any; operator: string;}[]}} whereParams Where params
   */
  count(tableName, whereParams = {}) {
    return this.search(tableName, 'count(*)', whereParams);
  }

  updateTable(tableName, params, id) {
    const columns = Object.keys(params);
    const queryParams = columns.map((column) => params[column]);

    const query = `
    update ${tableName}
    set ${columns.map((col, index) => `${col}=$${index + 1}`).join(',')}
    where id=$${columns.length + 1}`;

    logger.log('updateTable query\n', query);
    logger.log(`with params\n`, JSON.stringify([...queryParams, id], null, 2));

    return this.query(query, [...queryParams, id]);
  }
}

module.exports = DBService;
