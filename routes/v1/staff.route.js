// TODO to be change to user
const express = require('express');
const router = express.Router();

const staffController = require('../../controllers/staff.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_STAFF'),
  staffController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_STAFF'),
  staffController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_STAFF'),
  staffController.update,
);
router.get(
  '/shift-staff',
  createAccessRightsMiddleware('READ_STAFF'),
  staffController.getShiftStaff,
);
router.get(
  '/technique-staff',
  createAccessRightsMiddleware('READ_STAFF'),
  staffController.getTechniqueStaff,
);

module.exports = router;
