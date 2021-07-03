// TODO to be change to user
const express = require('express');
const router = express.Router();

const areaController = require('../../controllers/area.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_AREA'),
  areaController.getAreas,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_AREA'),
  areaController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_AREA'),
  areaController.update,
);

module.exports = router;
