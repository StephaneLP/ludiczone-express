const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller')

router
    .route('/login')
    .post(AuthController.login)

router
    .route('/checkrole/:role')
    .get(AuthController.checkRole)

module.exports = router;