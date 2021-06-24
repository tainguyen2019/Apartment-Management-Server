// TODO to be change to user
const express = require('express');
const router = express.Router();

const arrangeController = require('../../controllers/arrange.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_DEVICE_ARRANGE'),
  arrangeController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_DEVICE_ARRANGE'),
  arrangeController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_DEVICE_ARRANGE'),
  arrangeController.update,
);

module.exports = router;
