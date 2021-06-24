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
}

const areaModel = new Area();

module.exports = areaModel;
