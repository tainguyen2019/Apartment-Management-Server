const TABLE_NAMES = require('../constants/tables');
const { generateWhereParams, stringOperatorGenerator } = require('../utils/db');
const dbService = require('../services/db.service');
const VIEW_NAMES = require('../constants/views');

const operatorMapping = {
  apartment_number: stringOperatorGenerator,
  block_number: stringOperatorGenerator,
  host: stringOperatorGenerator,
  email: stringOperatorGenerator,
  phone: stringOperatorGenerator,
};

class Apartment {
  constructor() {
    this.tableName = TABLE_NAMES.apartment;
    this.viewName = VIEW_NAMES.apartment;
  }

  async getApartmentByAccount(accountId) {
    const whereParams = generateWhereParams(
      { account_id: accountId },
      operatorMapping,
    );
    const { rows: apartments } = await dbService.search(
      this.tableName,
      '*',
      whereParams,
      1,
    );

    return apartments[0];
  }

  search(params, limit, offset) {
    const whereParams = generateWhereParams(params, operatorMapping);
    return dbService.search(this.viewName, '*', whereParams, limit, offset);
  }

  create(data) {
    const { account_id: accountId, ...values } = data;
    return dbService.insertInto(this.tableName, {
      ...values,
      account_id: accountId || null,
    });
  }

  async count(params = {}) {
    const whereParams = generateWhereParams(params, operatorMapping);
    const result = await dbService.count(this.viewName, whereParams);

    return result.rows[0].count;
  }

  update(id, data) {
    const { account_id: accountId, ...values } = data;
    const whereParams = generateWhereParams({ id }, operatorMapping);
    return dbService.update(
      this.tableName,
      { ...values, account_id: accountId || null },
      whereParams,
    );
  }
}

const apartmentModel = new Apartment();

module.exports = apartmentModel;
