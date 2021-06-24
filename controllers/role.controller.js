const roleModel = require('../models/role.model');
const logger = require('../utils/logger');

const search = async (req, res, next) => {
  try {
    const { pageSize = 10, page = 1, ...queryParams } = req.query;
    const totalRecords = await roleModel.count(queryParams);
    const offset = (page - 1) * pageSize;
    const { rows: roles } = await roleModel.search(
      queryParams,
      pageSize,
      offset,
    );
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      message: 'Yêu cầu thực hiện thành công.',
      data: {
        roles,
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

module.exports = {
  search,
};
