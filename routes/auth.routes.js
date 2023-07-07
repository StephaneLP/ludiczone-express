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
    .route('/checkroles')
    .get(AuthController.checkRoles)

/*********************************************************
Pages d'administration
*********************************************************/
router
    .route('/checkadmin')
    .get(AuthController.checkIfUserAdmin)

module.exports = router;