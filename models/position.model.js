const dbService = require('../services/db.service');
const TABLE_NAMES = require('../constants/tables');

class Position {
  constructor() {
    this.tableName = TABLE_NAMES.position;
  }

  async getPositions() {
    const queryString = `select * from ${this.tableName}`;
    const { rows: positions } = await dbService.query(queryString, []);

    return positions;
  }
}

const positionModel = new Position();

module.exports = positionModel;
