const {
  generateWhereParams,
  stringOperatorGenerator,
  rangeOperatorGenerator,
  generateWhereParamsWithDateRange,
} = require('../utils/db');
const dbService = require('../services/db.service');
const VIEW_NAMES = require('../constants/views');
const TABLE_NAMES = require('../constants/tables');

const operatorMapping = {
  apartment_number: stringOperatorGenerator,
  block_number: stringOperatorGenerator,
  content: stringOperatorGenerator,
  staff_name: stringOperatorGenerator,
  date: rangeOperatorGenerator,
};

const customGenerateWhereParams = (params) =>
  generateWhereParamsWithDateRange(params, operatorMapping);

class Repair {
  constructor() {
    this.viewName = VIEW_NAMES.repair;
    this.tableName = TABLE_NAMES.repair;
  }

  search(params, limit, offset) {
    const whereParams = customGenerateWhereParams(params);
    return dbService.search(this.viewName, '*', whereParams, limit, offset);
  }

  create(params) {
    return dbService.insertInto(this.tableName, params);
  }

  async count(params = {}) {
    const whereParams = customGenerateWhereParams(params);
    const result = await dbService.count(this.viewName, whereParams);

    return result.rows[0].count;
  }

  update(id, values) {
    const whereParams = generateWhereParams({ id }, operatorMapping);
    return dbService.update(this.tableName, values, whereParams);
  }

  assignment(id, staffID) {
    return this.update(id, {
      staff_id: staffID,
      status: 'Đã phân công',
    });
  }

  rate(id, rateLevel) {
    return this.update(id, {
      rate: rateLevel,
      status: 'Đã đánh giá',
    });
  }

  complete(id) {
    return this.update(id, {
      status: 'Đã xử lý',
    });
  }
}

const repairModel = new Repair();

module.exports = repairModel;
