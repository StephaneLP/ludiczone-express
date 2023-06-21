const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller')

router
    .route('/login')
    .post(AuthController.login)

router
    .route('/checkisadmin')
    .get(AuthController.checkIsAdmin)

module.exports = router;