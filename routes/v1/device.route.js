// TODO to be change to user
const express = require('express');
const router = express.Router();

const deviceController = require('../../controllers/device.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_DEVICE'),
  deviceController.getDevices,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_DEVICE'),
  deviceController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_DEVICE'),
  deviceController.update,
);

module.exports = router;
