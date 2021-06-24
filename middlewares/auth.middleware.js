const { verify, TokenExpiredError } = require('jsonwebtoken');
const {
  requireTokenError,
  invalidTokenError,
  expiredTokenError,
} = require('../constants/errors');
const secretKey = process.env.SECRET_KEY;

const auth = (req, res, next) => {
  const token = req.header('x-access-token');

  if (req.path.includes('/authentication')) {
    return next();
  }

  if (!token) {
    return next(requireTokenError);
  }

  verify(token, secretKey, (err, data) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return next(expiredTokenError);
      }

      return next(invalidTokenError);
    }

    req.token = token;
    req.privileges = data.privileges;
    req.staff_id = data.staff_id;
    req.apartment_id = data.apartment_id;
    req.department_id = data.department_id;
    next();
  });
};

module.exports = auth;
