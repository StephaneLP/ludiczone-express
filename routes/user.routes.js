const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller')
const SignUpController = require('../controllers/signup.controller')

/*********************************************************
Composant Inscription (SignUp)
*********************************************************/
router
    .route('/signup')
    .post(SignUpController.signUp)
    .put(SignUpController.signUpConfirm)

router
    .route('/sendmail/confirmemail')
    .post(SignUpController.confirmEmail)

/*********************************************************
Composant User
*********************************************************/
router
    .route('/forgotpassword')
    .put(UserController.changeForgottenPassword)

router
    .route('/sendmail/forgotpassword')
    .post(UserController.forgotPassword)

module.exports = router;