const { verify, TokenExpiredError } = require('jsonwebtoken');
const { invalidTokenError, expiredTokenError } = require('../constants/errors');
const apartmentModel = require('../models/apartment.model');
const departmentModel = require('../models/department.model');
const rolePrivilegeModel = require('../models/role_privilege.model');
const staffModel = require('../models/staff.model');

const verifyToken = (token, secretKey, options = {}) => {
  return new Promise((resolve, reject) => {
    verify(token, secretKey, options, (err, data) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          reject(expiredTokenError);
        }

        reject(invalidTokenError);
      }

      resolve(data);
    });
  });
};

const getAccountAccessRights = async ({
  account_id: accountId,
  role_id: roleId,
  type,
}) => {
  const userPrivileges = await rolePrivilegeModel.getByRoleId(roleId);

  const userPrivilegeCodes = userPrivileges.map((item) => item.privilege_code);

  let staffId = '';
  let apartmentId = '';
  let departmentId = '';

  if (type === 'internal') {
    const staff = await staffModel.getStaffByAccount(accountId);
    staffId = staff.id;
    const department = await departmentModel.getDepartment(staffId);
    departmentId = department.id;
  } else {
    const apartment = await apartmentModel.getApartmentByAccount(accountId);
    apartmentId = apartment.id;
  }

  const accessRights = {
    privileges: userPrivilegeCodes,
    staff_id: staffId,
    apartment_id: apartmentId,
    department_id: departmentId,
  };

  return accessRights;
};

module.exports = {
  verifyToken,
  getAccountAccessRights,
};
