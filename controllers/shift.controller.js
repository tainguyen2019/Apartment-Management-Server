const CustomError = require('../constants/CustomError');
const shiftModel = require('../models/shift.model');
const logger = require('../utils/logger');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const totalRecords = await shiftModel.count(queryParams);
    const offset = (page - 1) * pageSize;
    const { rows: shifts } = await shiftModel.search(
      queryParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        shifts,
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
    const { rowCount } = await shiftModel.create(data);

    res.json({
      message: 'Thông tin đã lưu lại',
      data: { rowCount },
    });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Thông tin chưa lưu lại. Vui lòng thử lại.', 400));
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { rowCount } = await shiftModel.update(id, data);

    res.json({
      message: 'Thay đổi thông tin thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Thay đổi thất bại. Vui lòng thử lại.', 400));
  }
};

module.exports = {
  search,
  create,
  update,
};
