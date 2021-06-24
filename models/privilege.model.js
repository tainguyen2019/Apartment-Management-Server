const TABLE_NAMES = require('../constants/tables');
const dbService = require('../services/db.service');
const { convertToSetValues } = require('../utils/db');

class Privilege {
  constructor() {
    this.name = TABLE_NAMES.privilege;
  }

  async getByTableNameAndActions(tableName, actions) {
    const query = `
    select *
    from ${this.name}
    where table_name = $1 and action in ${convertToSetValues(actions)}
    order by table_name, action
    `;
    const privilegesResult = await dbService.query(query, [tableName]);
    return privilegesResult.rows;
  }
}

const privilegeModel = new Privilege();

module.exports = privilegeModel;
