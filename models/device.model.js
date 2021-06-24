const dbService = require('../services/db.service');
const TABLE_NAMES = require('../constants/tables');

class Device {
  constructor() {
    this.tableName = TABLE_NAMES.device;
  }

  async getDevices() {
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

const deviceModel = new Device();

module.exports = deviceModel;
