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
  staff_name: stringOperatorGenerator,
  device_name: stringOperatorGenerator,
  date: rangeOperatorGenerator,
};

const customGenerateWhereParams = (params) =>
  generateWhereParamsWithDateRange(params, operatorMapping);

class Maintenance {
  constructor() {
    this.viewName = VIEW_NAMES.maintenance;
    this.tableName = TABLE_NAMES.maintenance;
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
}

const maintenanceModel = new Maintenance();

module.exports = maintenanceModel;
