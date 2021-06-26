const CustomError = require('../constants/CustomError');
const staffModel = require('../models/staff.model');
const logger = require('../utils/logger');
const { failChange } = require('../constants/errors');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const totalRecords = await staffModel.count(queryParams);
    const offset = (page - 1) * pageSize;
    const { rows: staffs } = await staffModel.search(
      queryParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        staffs,
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
    const data = req.body;
    const { rowCount } = await staffModel.create(data);

    res.json({
      message: 'Thêm thông tin nhân viên thành công',
      data: { rowCount },
    });
  } catch (err) {
    logger.error(err);
    next(
      new CustomError(
        'Lưu thông tin thất bại. Vui lòng kiểm tra và thử lại',
        400,
      ),
    );
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { rowCount } = await staffModel.update(id, data);

    res.json({
      message: 'Thay đổi thông tin thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    logger.error(err);
    next(failChange);
  }
};

const getShiftStaff = async (req, res, next) => {
  try {
    const { rows: staffs } = await staffModel.getShiftStaff(req.department_id);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        staffs,
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getTechniqueStaff = async (_req, res, next) => {
  try {
    const { rows: staffs } = await staffModel.getTechniqueStaff();

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        staffs,
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

module.exports = {
  search,
  create,
  update,
  getShiftStaff,
  getTechniqueStaff,
};
