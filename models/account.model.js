const TABLE_NAMES = require('../constants/tables');
const VIEW_NAMES = require('../constants/views');
const dbService = require('../services/db.service');
const { isNullable } = require('../utils/common');
const {
  stringOperatorGenerator,
  generateWhereParamsWithDateRange,
  rangeOperatorGenerator,
  generateWhereParams,
} = require('../utils/db');

const operatorMapping = {
  username: stringOperatorGenerator,
  updated_at: rangeOperatorGenerator,
};

// Split from_date, to_date and push to updated_at column condition
const customGenerateWhereParams = (params) => {
  const convertedParams = Object.entries(params).reduce(
    (prev, [key, value]) => {
      let convertedValue = value;

      // set to_date to 23:59:59
      if (key === 'to_date' && !isNullable(value)) {
        convertedValue = `${value} 23:59:59`;
      }
      return {
        ...prev,
        [key]: convertedValue,
      };
    },
    [],
  );
  return generateWhereParamsWithDateRange(
    convertedParams,
    operatorMapping,
    'updated_at',
  );
};

class Account {
  constructor() {
    this.tableName = TABLE_NAMES.account;
    this.viewName = VIEW_NAMES.account;
  }

  async count(params = {}) {
    const { available = false, ...restParams } = params;
    const viewName = available ? VIEW_NAMES.availableAccount : this.viewName;
    const whereParams = customGenerateWhereParams(restParams);
    const result = await dbService.count(viewName, whereParams);

    return result.rows[0].count;
  }

  async get(id) {
    const whereParams = generateWhereParams({ id });
    const result = await dbService.search(this.tableName, '*', whereParams);

    return result.rows[0];
  }

  search(params, limit, offset) {
    const { available = false, ...restParams } = params;
    const viewName = available ? VIEW_NAMES.availableAccount : this.viewName;
    const whereParams = customGenerateWhereParams(restParams);
    return dbService.search(viewName, '*', whereParams, limit, offset);
  }

  create(params) {
    return dbService.insertInto(this.tableName, params);
  }

  update(id, params) {
    const whereParams = customGenerateWhereParams({
      id,
    });
    return dbService.update(this.tableName, params, whereParams);
  }

  async getLoginAccount(username) {
    const selectedColumns = ['id', 'username', 'password', 'role_id', 'type'];
    const params = generateWhereParams({ username });
    const { rows: accounts } = await dbService.search(
      this.tableName,
      selectedColumns,
      params,
      1,
    );
    return accounts[0];
  }
}

const accountModel = new Account();

module.exports = accountModel;
