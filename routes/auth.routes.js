const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller')

router
    .route('/login')
    .post(AuthController.login)

router
    .route('/role')
    .get(AuthController.getRoleByToken)

module.exports = router;