const logger = require('../utils/logger');

const errorHandling = (error, _, res, __) => {
  logger.error(error);
  const message = error.message || 'Có lỗi xảy ra.';
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message,
  });
};

module.exports = errorHandling;
