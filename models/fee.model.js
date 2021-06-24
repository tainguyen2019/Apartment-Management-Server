const dbService = require('../services/db.service');
const TABLE_NAMES = require('../constants/tables');

class Fee {
  constructor() {
    this.tableName = TABLE_NAMES.fee;
  }

  async getFees() {
    const queryString = `select * from ${this.tableName}`;
    const { rows } = await dbService.query(queryString, []);

    return rows;
  }

  create(params) {
    return dbService.insertInto(this.tableName, params);
  }

  update(params, id) {
    return dbService.updateTable(this.tableName, params, id);
  }
}

const feeModel = new Fee();

module.exports = feeModel;
