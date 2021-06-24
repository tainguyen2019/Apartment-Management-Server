const { accessError } = require('../constants/errors');
const { toArray } = require('../utils/common');

/**
 * Create access rights middleware
 * @param {string[]} requiredPrivileges Required privilege
 */
const createAccessRightsMiddleware =
  (...requiredPrivileges) =>
  async (req, _, next) => {
    const userPrivileges = toArray(req.privileges);

    // case table has no required privileges
    if (requiredPrivileges.length === 0) {
      return next();
    }

    // case table requires privileges but no userPrivileges provided
    if (requiredPrivileges.length && !userPrivileges.length) {
      return next(accessError);
    }

    // case user has some missing privileges to access
    const isNotAccess = requiredPrivileges.some(
      (privilege) => !userPrivileges.includes(privilege),
    );
    if (isNotAccess) return next(accessError);

    // case user has enough privileges to access
    next();
  };

module.exports = createAccessRightsMiddleware;
