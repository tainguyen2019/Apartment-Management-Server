// TODO to be change to user
const express = require('express');
const router = express.Router();

const shiftController = require('../../controllers/shift.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_SHIFT'),
  shiftController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_SHIFT'),
  shiftController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_SHIFT'),
  shiftController.update,
);

module.exports = router;
