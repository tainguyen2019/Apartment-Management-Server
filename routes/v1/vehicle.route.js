const express = require('express');
const router = express.Router();

const vehicleController = require('../../controllers/vehicle.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_VEHICLE_PARKING_REGISTRATION'),
  vehicleController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_VEHICLE_PARKING_REGISTRATION'),
  vehicleController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_VEHICLE_PARKING_REGISTRATION'),
  vehicleController.update,
);
router.post(
  '/:id/approve',
  createAccessRightsMiddleware('APPROVE_VEHICLE_PARKING_REGISTRATION'),
  vehicleController.approve,
);
router.post(
  '/:id/cancel',
  createAccessRightsMiddleware('APPROVE_VEHICLE_PARKING_REGISTRATION'),
  vehicleController.cancel,
);

module.exports = router;
