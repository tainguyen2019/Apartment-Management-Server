const express = require('express');
const router = express.Router();
const accountController = require('../../controllers/authentication.controller');

// login
router.post('/login', accountController.login);

// change password
router.post('/change-password', accountController.changePassword);

module.exports = router;
