const TABLE_NAMES = require('../constants/tables');
const VIEWS = require('../constants/views');
const dbService = require('../services/db.service');
const { generateWhereParams } = require('../utils/db');

class RolePrivilege {
  constructor() {
    this.tableName = TABLE_NAMES.rolePrivilege;
    this.viewName = VIEWS.rolePrivilege;
  }

  /**
   * Create a role_privilege record
   * @param {string} roleId Role ID
   * @param {string} privilegeId Privilege ID
   */
  create(roleId, privilegeId) {
    return dbService.insertInto(this.tableName, {
      role_id: roleId,
      privilege_id: privilegeId,
    });
  }

  /**
   * Create a batch of role privileges
   * @param {{role_id: string; privilege_id: string}} recordsParams
   */
  createBatch(recordsParams) {
    return dbService.insertInto(this.tableName, recordsParams);
  }

  /**
   * Get Role Privileges by Role ID
   * @param {string} roleId Role ID
   */
  async getByRoleId(roleId) {
    const whereParams = generateWhereParams({ role_id: roleId });
    const result = await dbService.search(this.viewName, '*', whereParams);
    return result.rows;
  }

  /**
   * Revoke granted actions for specific roleId
   * @param {string} roleId RoleId
   */
  async revokeGrantedPrivileges(roleId) {
    const whereParams = generateWhereParams({
      role_id: roleId,
    });
    const result = await dbService.delete(this.tableName, whereParams);

    return result;
  }
}

const rolePrivilegeModel = new RolePrivilege();

module.exports = rolePrivilegeModel;
