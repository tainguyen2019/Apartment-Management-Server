// TODO to be change to user
const express = require('express');
const router = express.Router();

const eventController = require('../../controllers/event.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_EVENT'),
  eventController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_EVENT'),
  eventController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_EVENT'),
  eventController.update,
);
router.post(
  '/:id/approve',
  createAccessRightsMiddleware('APPROVE_EVENT'),
  eventController.approve,
);
router.post(
  '/:id/cancel',
  createAccessRightsMiddleware('APPROVE_EVENT'),
  eventController.cancel,
);

module.exports = router;
