const dbService = require('../services/db.service');
const TABLE_NAMES = require('../constants/tables');
const VIEW_NAMES = require('../constants/views');
const { generateWhereParams } = require('../utils/db');

class Position {
  constructor() {
    this.tableName = TABLE_NAMES.position;
  }

  async getPositions() {
    const { rows: positions } = await dbService.search(this.tableName, '*');

    return positions;
  }

  async isManager(staffID) {
    const whereParams = generateWhereParams({ id: staffID });
    const { rows } = await dbService.search(
      VIEW_NAMES.manager,
      '*',
      whereParams,
    );

    if (rows.length > 0) return true;

    return false;
  }
}

const positionModel = new Position();

module.exports = positionModel;
