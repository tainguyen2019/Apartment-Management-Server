const path = require('path');
const CustomError = require('../constants/CustomError');
const notificationModel = require('../models/notification.model');
const logger = require('../utils/logger');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    if (req.apartment_id) {
      queryParams.status = 'Đã đăng';
    }
    const totalRecords = await notificationModel.count(queryParams);
    const offset = (page - 1) * pageSize;
    const { rows: notifications } = await notificationModel.search(
      queryParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        notifications,
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
    if (!req.file) {
      throw new CustomError('Thiếu file đính kèm.', 400);
    }

    const filePath = path.basename(req.file.path);

    const { rowCount } = await notificationModel.create({
      ...data,
      status: 'Chưa đăng',
      attachment: filePath,
    });

    res.json({
      message: 'Thông báo đã được lưu lại',
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
    const { rowCount } = await notificationModel.update(id, data);

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

const publish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { staff_id: staffID } = req.body;
    const { rowCount } = await notificationModel.publish(id, staffID);

    res.json({
      message: 'Thông báo đã được đăng thành công.',
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
  publish,
};
