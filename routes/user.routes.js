const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller')

/*********************************************************
Composant Inscription
*********************************************************/
router
    .route('/signup')
    .post(UserController.signUp)

router
    .route('/signup/:token')
    .put(UserController.signUpConfirm)

module.exports = router;