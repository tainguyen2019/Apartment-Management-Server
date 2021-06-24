const express = require('express');
const router = express.Router();

const apartmentController = require('../../controllers/apartment.controller');
const createAccessRightsMiddleware = require('../../middlewares/access.middleware');

router.get('/', apartmentController.searchApartments);
router.post(
  '/',
  createAccessRightsMiddleware('CREATE_APARTMENT'),
  apartmentController.createApartment,
);
router.put(
  '/:id',
  createAccessRightsMiddleware('WRITE_APARTMENT'),
  apartmentController.updateApartment,
);

module.exports = router;
