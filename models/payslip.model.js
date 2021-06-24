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
  staff_name: stringOperatorGenerator,
  content: stringOperatorGenerator,
  date: rangeOperatorGenerator,
};

const customGenerateWhereParams = (params) =>
  generateWhereParamsWithDateRange(params, operatorMapping);

class Payslip {
  constructor() {
    this.viewName = VIEW_NAMES.payslip;
    this.tableName = TABLE_NAMES.payslip;
  }

  search(params, limit, offset) {
    const whereParams = customGenerateWhereParams(params, operatorMapping);
    return dbService.search(this.viewName, '*', whereParams, limit, offset);
  }

  create(params) {
    return dbService.insertInto(this.tableName, params);
  }

  async count(params = {}) {
    const whereParams = customGenerateWhereParams(params, operatorMapping);
    const result = await dbService.count(this.viewName, whereParams);

    return result.rows[0].count;
  }

  update(id, values) {
    const whereParams = generateWhereParams({ id }, operatorMapping);
    return dbService.update(this.tableName, values, whereParams);
  }
}

const payslipModel = new Payslip();

module.exports = payslipModel;
