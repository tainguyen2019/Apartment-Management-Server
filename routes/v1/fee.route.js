// TODO to be change to user
const express = require('express');
const router = express.Router();

const feeController = require('../../controllers/fee.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_FEE'),
  feeController.getFees,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_FEE'),
  feeController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_FEE'),
  feeController.update,
);

module.exports = router;
