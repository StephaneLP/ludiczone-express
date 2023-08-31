const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller')

/*********************************************************
Composant Inscription
*********************************************************/
router
    .route('/signup')
    .post(UserController.signUp)
    .put(UserController.signUpConfirm)

router
    .route('/sendnewmail')
    .post(UserController.sendNewMail)

module.exports = router;