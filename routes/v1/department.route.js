// TODO to be change to user
const express = require('express');
const router = express.Router();

const departmentController = require('../../controllers/department.controller');

router.get('/getAll', departmentController.getAll);

module.exports = router;
