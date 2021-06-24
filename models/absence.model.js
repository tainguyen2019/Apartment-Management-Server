const TABLE_NAMES = require('../constants/tables');
const VIEW_NAMES = require('../constants/views');
const dbService = require('../services/db.service');
const {
  generateWhereParams,
  stringOperatorGenerator,
  rangeOperatorGenerator,
  generateWhereParamsWithDateRange,
} = require('../utils/db');

const operatorMapping = {
  staff_name: stringOperatorGenerator,
  department_name: stringOperatorGenerator,
  approver_name: stringOperatorGenerator,
  reason: stringOperatorGenerator,
  date: rangeOperatorGenerator,
};

// Split from_date, to_date and push to date column condition
const customGenerateWhereParams = (params) =>
  generateWhereParamsWithDateRange(params, operatorMapping);

class Absence {
  constructor() {
    this.tableName = TABLE_NAMES.absence;
    this.viewName = VIEW_NAMES.absence;
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

  approve(id, values) {
    return this.update(id, {
      approver_id: values.approver_id,
      status: 'Đã phê duyệt',
    });
  }
}

const absenceModel = new Absence();

module.exports = absenceModel;
