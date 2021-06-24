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
  title: stringOperatorGenerator,
  content: stringOperatorGenerator,
  date: rangeOperatorGenerator,
};

// Split from_date, to_date and push to date column condition
const customGenerateWhereParams = (params) =>
  generateWhereParamsWithDateRange(params, operatorMapping);

class Notification {
  constructor() {
    this.tableName = TABLE_NAMES.notification;
    this.viewName = VIEW_NAMES.notification;
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

  publish(id, staffID) {
    return this.update(id, {
      staff_id: staffID,
      status: 'Đã đăng',
      date: new Date(),
    });
  }
}

const notificationModel = new Notification();

module.exports = notificationModel;
