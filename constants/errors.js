const CustomError = require('./CustomError');

const unauthorizedError = new CustomError(
  'Thông tin đăng nhập không hợp lệ.',
  401,
);
const accessError = new CustomError('Không có quyền truy cập.', 403);
const requireTokenError = new CustomError('Thiếu token.', 401);
const invalidTokenError = new CustomError('Token không hợp lệ.', 401);
const expiredTokenError = new CustomError('Phiên đăng nhập hết hạn.', 401);
const failChange = new CustomError('Thay đổi thất bại. Vui lòng thử lại.', 400);

module.exports = {
  accessError,
  unauthorizedError,
  requireTokenError,
  invalidTokenError,
  expiredTokenError,
  failChange,
};
