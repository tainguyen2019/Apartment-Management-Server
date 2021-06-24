const path = require('path');
const roleService = require('../services/role.service');
const csvParser = require('../utils/csv_parser');
const logger = require('../utils/logger');

const accessRightsFile = path.resolve(
  __dirname,
  '../data',
  'access_rights.csv',
);

const grantAccessRights = async (filePath) => {
  try {
    // Parse csv file
    const parsedData = await csvParser(filePath);

    // Parse access rights from 0,1 to boolean
    const accessRightData = parsedData.map((row) => ({
      roleCode: row.role_code,
      tableName: row.table_name,
      read: Boolean(Number(row.read)),
      create: Boolean(Number(row.create)),
      write: Boolean(Number(row.write)),
      delete: Boolean(Number(row.delete)),
      approve: Boolean(Number(row.approve)),
    }));

    // Grant access rights using roleService
    await roleService.grantAccessRights(accessRightData);
  } catch (error) {
    logger.error(error);
  }
};

grantAccessRights(accessRightsFile);
