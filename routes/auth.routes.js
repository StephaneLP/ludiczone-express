const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller')

/*********************************************************
Composant Connexion
*********************************************************/

router
    .route('/login')
    .post(AuthController.login)

/*********************************************************
Composant Menu
*********************************************************/

router
    .route('/checkrole')
    .get(AuthController.checkRoleReturnBooleans)

/*********************************************************
Pages d'administration
*********************************************************/

router
    .route('/checkrole/:role')
    .get(AuthController.checkRoleReturnStatus)

module.exports = router;