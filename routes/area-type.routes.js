const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller')
const AreaTypeController = require('../controllers/area-type.controller')

/*********************************************************
Pages visiteurs
*********************************************************/

router
    .route('/')
    .get(AreaTypeController.findAreaTypeForHomePage)

/*********************************************************
Pages administrateurs
*********************************************************/

router
    .route("/admin/")
    .get(AuthController.protect, AuthController.restrictTo(["admin"]), AreaTypeController.findAllAreaType)
    .post(AuthController.protect, AuthController.restrictTo(["admin"]), AreaTypeController.createAreaType)

router
    .route("/admin/:id")
    .get(AuthController.protect, AuthController.restrictTo(["admin"]), AreaTypeController.findAreaTypeById)
    .put(AuthController.protect, AuthController.restrictTo(["admin"]), AreaTypeController.updateAreaType)
    .delete(AuthController.protect, AuthController.restrictTo(["admin"]), AreaTypeController.deleteAreaType)

module.exports = router;