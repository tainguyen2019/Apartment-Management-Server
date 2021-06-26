const { requireTokenError } = require('../constants/errors');
const { verifyToken, getAccountAccessRights } = require('../utils/auth');
const logger = require('../utils/logger');
const secretKey = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
  const token = req.header('x-access-token');

  if (req.path.includes('/authentication')) {
    return next();
  }

  if (!token) {
    return next(requireTokenError);
  }

  try {
    const data = await verifyToken(token, secretKey);
    const { account } = data;

    const accessRights = await getAccountAccessRights({
      account_id: account.id,
      role_id: account.role_id,
      type: account.type,
    });

    req.token = token;
    req.privileges = accessRights.privileges;
    req.staff_id = accessRights.staff_id;
    req.apartment_id = accessRights.apartment_id;
    req.department_id = accessRights.department_id;

    logger.log(accessRights);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
