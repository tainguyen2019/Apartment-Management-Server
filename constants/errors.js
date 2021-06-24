const CustomError = require('./CustomError');

const unauthorizedError = new CustomError(
  'Thông tin đăng nhập không hợp lệ',
  401,
);
const accessError = new CustomError('Forbidden', 403);
const requireTokenError = new CustomError('Missing token', 401);
const invalidTokenError = new CustomError('Invalid token', 401);
const expiredTokenError = new CustomError('Phiên đăng nhập hết hạn', 401);

module.exports = {
  accessError,
  unauthorizedError,
  requireTokenError,
  invalidTokenError,
  expiredTokenError,
};
