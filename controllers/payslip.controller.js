const CustomError = require('../constants/CustomError');
const payslipModel = require('../models/payslip.model');
const logger = require('../utils/logger');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const totalRecords = await payslipModel.count(queryParams);
    const offset = (page - 1) * pageSize;
    const { rows: payslips } = await payslipModel.search(
      queryParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        payslips,
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
    const { rowCount } = await payslipModel.create({
      ...data,
    });

    res.json({
      message: 'Thông tin đã được lưu lại.',
      data: { rowCount },
    });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Có lỗi xảy ra. Vui lòng thử lại.', 400));
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { rowCount } = await payslipModel.update(id, data);

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
