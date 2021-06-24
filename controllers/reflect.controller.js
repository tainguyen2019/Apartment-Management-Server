const CustomError = require('../constants/CustomError');
const reflectModel = require('../models/reflect.model');
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
    const totalRecords = await reflectModel.count(searchParams);
    const offset = (page - 1) * pageSize;
    const { rows: reflects } = await reflectModel.search(
      searchParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện hành công',
      data: {
        reflects,
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
    const { rowCount } = await reflectModel.create({
      ...data,
      status: 'Chờ trả lời',
    });

    res.json({
      message: 'Thông tin phản ánh đã được gửi đi. Chờ trả lời',
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
    const { rowCount } = await reflectModel.update(id, data);

    res.json({
      message: 'Thay đổi thông tin thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Thay đổi thất bại. Vui lòng thử lại!', 400));
  }
};

const answer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!data || !data.answer) {
      throw new CustomError('Thiếu câu trả lời phản ánh.', 400);
    }

    const { rowCount } = await reflectModel.answer(id, data.answer);

    res.json({
      message: 'Thực hiện thành công.',
      data: {
        rowCount,
      },
    });
  } catch (err) {
    logger.error(err);
    next(new CustomError('Có lôi xảy ra. Vui lòng thử lại!', 400));
  }
};

module.exports = {
  search,
  create,
  update,
  answer,
};
