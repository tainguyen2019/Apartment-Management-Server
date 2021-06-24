const express = require('express');
const router = express.Router();

const reflectController = require('../../controllers/reflect.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get(
  '/',
  createAccessRightsMiddleware('READ_REFLECT_INFO'),
  reflectController.search,
);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_REFLECT_INFO'),
  reflectController.create,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_REFLECT_INFO'),
  reflectController.update,
);
router.post(
  '/:id/answer',
  createAccessRightsMiddleware('APPROVE_REFLECT_INFO'),
  reflectController.answer,
);

module.exports = router;
