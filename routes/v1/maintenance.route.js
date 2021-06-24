// TODO to be change to user
const express = require('express');
const router = express.Router();

const maintenanceController = require('../../controllers/maintenance.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_MAINTENANCE'),
  maintenanceController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_MAINTENANCE'),
  maintenanceController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_MAINTENANCE'),
  maintenanceController.update,
);

module.exports = router;
