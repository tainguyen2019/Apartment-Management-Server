const CustomError = require('../constants/CustomError');
const absenceModel = require('../models/absence.model');
const logger = require('../utils/logger');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const totalRecords = await absenceModel.count(queryParams);
    const offset = (page - 1) * pageSize;
    const { rows: absences } = await absenceModel.search(
      queryParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        absences,
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
    const { rowCount } = await absenceModel.create({
      ...data,
      status: 'Chờ xử lý',
    });

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: { rowCount },
    });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Có lỗi xảy ra. Vui lòng thử lại', 400));
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { rowCount } = await absenceModel.update(id, data);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: { rowCount },
    });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Thay đổi thất bại. Vui lòng thử lại.', 400));
  }
};

const approve = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approver_id: approverId } = req.body;
    const { rowCount } = await absenceModel.approve(id, {
      approver_id: approverId,
    });

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: { rowCount },
    });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Duyệt thất bại. Vui lòng thử lại.', 400));
  }
};

module.exports = {
  search,
  create,
  update,
  approve,
};
