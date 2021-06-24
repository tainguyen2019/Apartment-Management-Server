const express = require('express');
const router = express.Router();

const createAccessRightsMiddleware = require('../../middlewares/access.middleware');
const absenceController = require('../../controllers/absence.controller');

router.get(
  '/',
  createAccessRightsMiddleware('READ_ABSENCE'),
  absenceController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_ABSENCE'),
  absenceController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_ABSENCE'),
  absenceController.update,
);
router.post(
  '/:id/approve',
  createAccessRightsMiddleware('APPROVE_ABSENCE'),
  absenceController.approve,
);
router.post(
  '/:id/reject',
  createAccessRightsMiddleware('APPROVE_ABSENCE'),
  absenceController.reject,
);

module.exports = router;
