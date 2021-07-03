const express = require('express');
const router = express.Router();

const uploader = require('../../middlewares/uploader.middleware');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');
const notificationController = require('../../controllers/notification.controller');

const fileFieldName = 'file';

router.get(
  '/',
  createAccessRightsMiddleware('READ_NOTIFICATION'),
  notificationController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_NOTIFICATION'),
  uploader.single(fileFieldName),
  notificationController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_NOTIFICATION'),
  notificationController.update,
);
router.put(
  '/:id/publish',
  createAccessRightsMiddleware('APPROVE_NOTIFICATION'),
  notificationController.publish,
);
router.put(
  '/:id/unpublish',
  createAccessRightsMiddleware('APPROVE_NOTIFICATION'),
  notificationController.unpublish,
);

module.exports = router;
