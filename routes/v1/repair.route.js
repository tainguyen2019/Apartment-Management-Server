// TODO to be change to user
const express = require('express');
const router = express.Router();

const repairController = require('../../controllers/repair.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_REPAIR_INFO'),
  repairController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_REPAIR_INFO'),
  repairController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_REPAIR_INFO'),
  repairController.update,
);
router.put(
  '/:id/assignment',
  createAccessRightsMiddleware('APPROVE_REPAIR_INFO'),
  repairController.assignment,
);
router.put(
  '/:id/rate',
  createAccessRightsMiddleware('WRITE_REPAIR_INFO'),
  repairController.rate,
);
router.put(
  '/:id/complete',
  createAccessRightsMiddleware('WRITE_REPAIR_INFO'),
  repairController.complete,
);

module.exports = router;
