const {
  generateWhereParams,
  stringOperatorGenerator,
  rangeOperatorGenerator,
  generateWhereParamsWithDateRange,
} = require('../utils/db');
const VIEW_NAMES = require('../constants/views');
const dbService = require('../services/db.service');
const TABLE_NAMES = require('../constants/tables');

const operatorMapping = {
  apartment_number: stringOperatorGenerator,
  block_number: stringOperatorGenerator,
  title: stringOperatorGenerator,
  content: stringOperatorGenerator,
  answer: stringOperatorGenerator,
  date: rangeOperatorGenerator,
};

const customGenerateWhereParams = (params) =>
  generateWhereParamsWithDateRange(params, operatorMapping);

class Reflect {
  constructor() {
    this.viewName = VIEW_NAMES.reflect;
    this.tableName = TABLE_NAMES.reflect;
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

  answer(id, answerValue) {
    return this.update(id, {
      answer: answerValue,
      status: 'Đã trả lời',
    });
  }
}

const reflectModel = new Reflect();

module.exports = reflectModel;
