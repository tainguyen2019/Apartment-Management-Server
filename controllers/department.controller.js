const departmentModel = require('../models/department.model');
const logger = require('../utils/logger');

const getAll = async (_req, res, next) => {
  try {
    const departments = await departmentModel.getAll();

    res.json({
      message: 'Yêu cầu thực hiện hành công',
      data: {
        departments,
      },
    });
  } catch (err) {
    logger.log(err);
    next(err);
  }
};

module.exports = {
  getAll,
};
