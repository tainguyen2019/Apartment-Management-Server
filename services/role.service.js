const roleModel = require('../models/role.model');
const privilegeModel = require('../models/privilege.model');
const rolePrivilegeModel = require('../models/role_privilege.model');

class RoleService {
  /**
   * Grant access for $role on $tableName with privileges
   * including read, write, create, delete, and approve
   * @param {string} roleCode Role Code
   * @param {string} tableName Table Name
   * @param {{read: boolean; write: boolean; create: boolean; delete: boolean; approve: boolean}[]} accessRights
   * @returns {Promise<void>} result
   */
  async grantAccess(roleId, tableName, accessRights) {
    const enabledAccessRights = Object.entries(accessRights)
      .filter(([_action, value]) => value)
      .map(([action]) => action.toUpperCase());

    if (!enabledAccessRights.length) return;

    await rolePrivilegeModel.revokeGrantedPrivileges(roleId);
    const privileges = await privilegeModel.getByTableNameAndActions(
      tableName,
      enabledAccessRights,
    );
    const privilegeIds = privileges.map((row) => row.id);

    const recordsParams = privilegeIds.map((privilegeId) => ({
      role_id: roleId,
      privilege_id: privilegeId,
    }));

    await rolePrivilegeModel.createBatch(recordsParams);
  }

  /**
   * Grant access rights
   * @param {{
      roleCode: string;
      tableName: string;
      read: boolean;
      create: boolean;
      write: boolean;
      delete: boolean;
      approve: boolean;
    }[]} accessRightsData 
   */
  async grantAccessRights(accessRightsData) {
    const roleCodes = accessRightsData.map(({ roleCode }) => roleCode);
    const roles = await roleModel.getByCodes(roleCodes);

    const roleCodeMapping = roles.reduce(
      (prev, { id, code }) => ({ ...prev, [code]: id }),
      {},
    );

    await Promise.all(
      accessRightsData.map(({ tableName, roleCode, ...accessRights }) => {
        const roleId = roleCodeMapping[roleCode];
        return this.grantAccess(roleId, tableName, accessRights);
      }),
    );
  }
}

const roleService = new RoleService();

module.exports = roleService;
