// TODO to be change to user
const express = require('express');
const router = express.Router();

const positionController = require('../../controllers/position.controller');

router.get('/', positionController.getPositions);

module.exports = router;
