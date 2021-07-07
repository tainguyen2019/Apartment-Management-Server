const { generateWhereParams, stringOperatorGenerator } = require('../utils/db');
const dbService = require('../services/db.service');
const VIEW_NAMES = require('../constants/views');
const TABLE_NAMES = require('../constants/tables');

const operatorMapping = {
  name: stringOperatorGenerator,
  position_name: stringOperatorGenerator,
  email: stringOperatorGenerator,
  phone: stringOperatorGenerator,
};

class Staff {
  constructor() {
    this.tableName = TABLE_NAMES.staff;
    this.viewName = VIEW_NAMES.staff;
  }

  async getStaffByAccount(accountID) {
    const queryString = `select * from ${this.tableName} where account_id=$1`;
    const { rows: staffs } = await dbService.query(queryString, [accountID]);

    return staffs[0];
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
      {
        ...values,
        account_id: accountId || null,
      },
      whereParams,
    );
  }

  getShiftStaff(departmentID = '') {
    if (departmentID) {
      const whereParams = generateWhereParams({ department_id: departmentID });
      return dbService.search(
        VIEW_NAMES.shiftStaff,
        ['id', 'name'],
        whereParams,
      );
    }
    return dbService.search(VIEW_NAMES.shiftStaff, ['id', 'name']);
  }

  getTechniqueStaff() {
    return dbService.search(VIEW_NAMES.techniqueStaff, '*');
  }
}

const staffModel = new Staff();

module.exports = staffModel;
