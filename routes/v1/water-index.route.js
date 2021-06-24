const express = require('express');
const router = express.Router();

const waterIndexController = require('../../controllers/water-index.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_WATER_INDEX'),
  waterIndexController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_WATER_INDEX'),
  waterIndexController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_WATER_INDEX'),
  waterIndexController.update,
);
router.post(
  '/:id/confirm',
  createAccessRightsMiddleware('APPROVE_WATER_INDEX'),
  waterIndexController.confirm,
);

module.exports = router;
