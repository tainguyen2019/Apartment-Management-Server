const { generateWhereParams, stringOperatorGenerator } = require('../utils/db');
const dbService = require('../services/db.service');
const VIEW_NAMES = require('../constants/views');
const TABLE_NAMES = require('../constants/tables');

const operatorMapping = {
  device_name: stringOperatorGenerator,
};

class Arrange {
  constructor() {
    this.viewName = VIEW_NAMES.arrange;
    this.tableName = TABLE_NAMES.arrange;
  }

  search(params, limit, offset) {
    const whereParams = generateWhereParams(params, operatorMapping);
    return dbService.search(this.viewName, '*', whereParams, limit, offset);
  }

  create(params) {
    return dbService.insertInto(this.tableName, params);
  }

  async count(params = {}) {
    const whereParams = generateWhereParams(params, operatorMapping);
    const result = await dbService.count(this.viewName, whereParams);

    return result.rows[0].count;
  }

  update(id, values) {
    const whereParams = generateWhereParams({ id }, operatorMapping);
    return dbService.update(this.tableName, values, whereParams);
  }
}

const arrangeModel = new Arrange();

module.exports = arrangeModel;
