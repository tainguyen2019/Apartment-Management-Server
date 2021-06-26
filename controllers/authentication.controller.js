const jwt = require('jsonwebtoken');
const { unauthorizedError } = require('../constants/errors');
const accountModel = require('../models/account.model');
const logger = require('../utils/logger');
const encryption = require('../utils/encryption');
const CustomError = require('../constants/CustomError');
const { getAccountAccessRights } = require('../utils/auth');

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

    const accessRights = await getAccountAccessRights({
      account_id: account.id,
      role_id: account.role_id,
      type: account.type,
    });

    const data = {
      ...accessRights,
      account,
      role: account.role_id,
    };

    jwt.sign(data, secretKey, { expiresIn }, (err, token) => {
      if (err) {
        throw err;
      }
      res.json({
        data: {
          token,
          account,
          staff_id: accessRights.staff_id,
          apartment_id: accessRights.apartment_id,
          department_id: accessRights.department_id,
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
