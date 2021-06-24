const express = require('express');
const router = express.Router();

const accountController = require('../../controllers/account.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_ACCOUNT'),
  accountController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_ACCOUNT'),
  accountController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_ACCOUNT'),
  accountController.update,
);

module.exports = router;
