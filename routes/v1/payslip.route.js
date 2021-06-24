// TODO to be change to user
const express = require('express');
const router = express.Router();

const payslipController = require('../../controllers/payslip.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_PAYSLIP'),
  payslipController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_PAYSLIP'),
  payslipController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_PAYSLIP'),
  payslipController.update,
);

module.exports = router;
