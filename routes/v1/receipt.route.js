// TODO to be change to user
const express = require('express');
const router = express.Router();

const receiptController = require('../../controllers/receipt.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_RECEIPT'),
  receiptController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_RECEIPT'),
  receiptController.create,
);
router.get('/:id', receiptController.getDetails);
router.post(
  '/:id/approve',
  createAccessRightsMiddleware('APPROVE_RECEIPT'),
  receiptController.approve,
);
router.post(
  '/generate',
  createAccessRightsMiddleware('CREATE_RECEIPT'),
  receiptController.generate,
);
router.delete(
  '/:id',
  createAccessRightsMiddleware('DELETE_RECEIPT'),
  receiptController.deleteReceipt,
);

module.exports = router;
