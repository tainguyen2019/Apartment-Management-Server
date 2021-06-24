const jwt = require('jsonwebtoken');
const { unauthorizedError } = require('../constants/errors');
const accountModel = require('../models/account.model');
const staffModel = require('../models/staff.model');
const departmentModel = require('../models/department.model');
const apartmentModel = require('../models/apartment.model');
const rolePrivilegeModel = require('../models/role_privilege.model');
const logger = require('../utils/logger');
const encryption = require('../utils/encryption');
const CustomError = require('../constants/CustomError');

const secretKey = process.env.SECRET_KEY;
const expiresIn = process.env.EXPIRES_IN;

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const account = await accountModel.getLoginAccount(username);
    if (!account) {
      return next(unauthorizedError);
    }

    const isMatchedPassword = await encryption.verify(
      password,
      account.password,
    );
    if (!isMatchedPassword) {
      return next(unauthorizedError);
    }

    const userPrivileges = await rolePrivilegeModel.getByRoleId(
      account.role_id,
    );

    const userPrivilegeCodes = userPrivileges.map(
      (item) => item.privilege_code,
    );

    let staffId = '';
    let apartmentId = '';
    let departmentId = '';

    if (account.type === 'internal') {
      const staff = await staffModel.getStaffByAccount(account.id);
      staffId = staff.id;
      const department = await departmentModel.getDepartment(staffId);
      departmentId = department.id;
    } else {
      const apartment = await apartmentModel.getApartmentByAccount(account.id);
      apartmentId = apartment.id;
    }

    const data = {
      account,
      role: account.role_id,
      privileges: userPrivilegeCodes,
      staff_id: staffId,
      apartment_id: apartmentId,
      department_id: departmentId,
    };

    jwt.sign(data, secretKey, { expiresIn }, (err, token) => {
      if (err) {
        throw err;
      }
      res.json({
        data: {
          token,
          account,
          staff_id: staffId,
          apartment_id: apartmentId,
          department_id: departmentId,
        },
      });
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { id, oldPassword, newPassword, rePassword } = req.body;

    if (newPassword !== rePassword) {
      throw new CustomError('Mật khẩu mới không khớp.', 400);
    }

    // Check oldPassword
    const account = await accountModel.get(id);

    if (!account) {
      throw new CustomError('Tài khoản không tồn tại', 404);
    }

    const isMatchedPassword = await encryption.verify(
      oldPassword,
      account.password,
    );

    if (!isMatchedPassword) {
      throw new CustomError('Mật khẩu cũ vừa nhập không đúng.', 400);
    }

    const hash = await encryption.encrypt(newPassword);
    const { rowCount } = await accountModel.update(id, {
      password: hash,
    });

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: { rowCount },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = {
  login,
  changePassword,
};
