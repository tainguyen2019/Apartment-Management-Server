const CustomError = require('../constants/CustomError');
const absenceModel = require('../models/absence.model');
const positionModel = require('../models/position.model');
const logger = require('../utils/logger');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;

    // if staff is not manager--> show his own absence
    if (req.staff_id) {
      const isManager = await positionModel.isManager(req.staff_id);
      if (!isManager) {
        queryParams.staff_id = req.staff_id;
      }
    }
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

    const isDuplicate = await absenceModel.isDuplicate(
      data.staff_id,
      data.date,
    );
    if (isDuplicate)
      throw new CustomError('Bạn đã có đơn nghỉ phép vào ngày này rồi.');

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
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const isDuplicate = await absenceModel.isDuplicate(req.staff_id, data.date);
    if (isDuplicate)
      throw new CustomError('Bạn đã có đơn nghỉ phép vào ngày này rồi.');

    const { rowCount } = await absenceModel.update(id, data);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: { rowCount },
    });
  } catch (err) {
    logger.error(err);
    next(err);
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
    next(err);
  }
};

const reject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approver_id: approverId, note } = req.body;
    const { rowCount } = await absenceModel.reject(id, {
      note,
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
  reject,
};
