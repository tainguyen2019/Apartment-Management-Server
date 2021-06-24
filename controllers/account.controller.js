const accountModel = require('../models/account.model');
const logger = require('../utils/logger');
const encryption = require('../utils/encryption');
const { validateUsername } = require('../utils/common');
const CustomError = require('../constants/CustomError');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const totalRecords = await accountModel.count(queryParams);
    const offset = (page - 1) * pageSize;
    const { rows: accounts } = await accountModel.search(
      queryParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        accounts,
        totalPages,
        page: Number(page),
        pageSize: Number(pageSize),
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { username, password, rePassword, role_id: roleId, type } = req.body;

    // validation
    if (!validateUsername(username)) {
      throw new CustomError(
        `Tên tài khoản sai định dạng. 
        Tên tài khoản phải chứa tối thiếu 4 ký tự, bắt đầu bằng chữ cái và chỉ bao gồm chữ cái, số, dấu chấm, và dấu xếp gạch.`,
        400,
      );
    }

    if (password !== rePassword) {
      throw new CustomError('Mật khẩu không khớp.', 400);
    }

    const hash = await encryption.encrypt(password);
    const { rowCount } = await accountModel.create({
      username,
      type,
      password: hash,
      role_id: roleId,
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

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_id: roleId, type } = req.body;
    const { rowCount } = await accountModel.update(id, {
      type,
      role_id: roleId,
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
  search,
  create,
  update,
};
