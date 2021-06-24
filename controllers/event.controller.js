const eventModel = require('../models/event.model');
const logger = require('../utils/logger');
const CustomError = require('../constants/CustomError');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const searchParams = {
      ...queryParams,
    };

    if (req.apartment_id) {
      searchParams.apartment_id = req.apartment_id;
    }
    const totalRecords = await eventModel.count(searchParams);
    const offset = (page - 1) * pageSize;
    const { rows: events } = await eventModel.search(
      searchParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      data: {
        events,
        totalPages,
        page: Number(page),
        pageSize: Number(pageSize),
      },
      message: 'Yêu cầu thực hiện thành công',
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = req.body;
    const { name, ...rest } = data;

    const isOverlap = await eventModel.isOverlapDateTime(rest);
    if (isOverlap) throw new CustomError('Trùng khung thời gian ', 400);

    const { rowCount } = await eventModel.create({
      ...data,
      status: 'Chờ xử lý',
    });

    res.json({
      message: 'Yêu cầu đã được lưu lại. Chờ xử lý',
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
    const { name, ...rest } = data;

    const isOverlap = await eventModel.isOverlapDateTime(rest, id);
    if (isOverlap) throw new CustomError('Trùng khung thời gian ', 400);

    const { rowCount } = await eventModel.update(id, data);

    res.json({
      message: 'Thay đổi thông tin thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const approve = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approver_id: approverID } = req.body;
    const { rowCount } = await eventModel.approve(id, approverID);

    res.json({
      message: 'Thao tác thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const { rowCount } = await eventModel.cancel(id, note);

    res.json({
      message: 'Thao tác thành công.',
      data: {
        rowCount,
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
  approve,
  cancel,
};
