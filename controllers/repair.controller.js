const repairModel = require('../models/repair.model');
const logger = require('../utils/logger');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const searchParams = {
      ...queryParams,
    };

    if (req.apartment_id) {
      searchParams.apartment_id = req.apartment_id;
    }

    const totalRecords = await repairModel.count(searchParams);
    const offset = (page - 1) * pageSize;
    const { rows: repairs } = await repairModel.search(
      searchParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        repairs,
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
    const { rowCount } = await repairModel.create({
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
    const { rowCount } = await repairModel.update(id, data);

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

const assignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { staff_id: staffID } = req.body;
    const { rowCount } = await repairModel.assignment(id, staffID);

    res.json({
      message: 'Phân công thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const complete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await repairModel.complete(id);

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

const rate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rate } = req.body;
    const { rowCount } = await repairModel.rate(id, rate);

    res.json({
      message: 'Cảm ơn bạn đã thực hiện đánh giá.',
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
  assignment,
  rate,
  complete,
};
