const TABLE_NAMES = require('../constants/tables');
const dbService = require('../services/db.service');
const {
  convertToSetValues,
  generateWhereParams,
  stringOperatorGenerator,
} = require('../utils/db');

const operatorMapping = {
  name: stringOperatorGenerator,
};

class Role {
  constructor() {
    this.tableName = TABLE_NAMES.role;
  }

  /**
   * Get roles by codes
   * @param {string[]} codes Role codes
   */
  async getByCodes(codes) {
    const query = `
    select *
    from ${this.tableName}
    where code in ${convertToSetValues(codes)}
    `;
    const rolesResult = await dbService.query(query);
    return rolesResult.rows;
  }

  /**
   * Get role by code
   * @param {string} codes Role code
   */
  async getByCode(code) {
    const query = `
    select *
    from ${this.tableName}
    where code = $1
    limit 1
    `;
    const rolesResult = await dbService.query(query, [code]);
    return rolesResult.rows[0];
  }

  async count(params = {}) {
    const whereParams = generateWhereParams(params, operatorMapping);
    const result = await dbService.count(this.tableName, whereParams);

    return result.rows[0].count;
  }

  search(params, limit, offset) {
    const whereParams = generateWhereParams(params, operatorMapping);
    return dbService.search(this.tableName, '*', whereParams, limit, offset);
  }
}

const roleModel = new Role();

module.exports = roleModel;
