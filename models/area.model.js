const dbService = require('../services/db.service');
const TABLE_NAMES = require('../constants/tables');
const VIEW_NAMES = require('../constants/views');

class Area {
  constructor() {
    this.tableName = TABLE_NAMES.area;
    this.viewName = VIEW_NAMES.area;
  }

  async getAreas() {
    const queryString = `select * from ${this.tableName}`;
    const { rows: areas } = await dbService.query(queryString, []);

    return areas;
  }

  create(params) {
    return dbService.insertInto(this.tableName, params);
  }

  update(params, id) {
    return dbService.updateTable(this.tableName, params, id);
  }
}

const areaModel = new Area();

module.exports = areaModel;
