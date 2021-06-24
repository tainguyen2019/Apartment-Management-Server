// TODO to be change to user
const express = require('express');
const router = express.Router();

const areaController = require('../../controllers/area.controller');

router.get('/', areaController.getAreas);

module.exports = router;
