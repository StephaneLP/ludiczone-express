const express = require('express');
const router = express.Router();
const AreaZoneController = require('../controllers/area-zone.controller')
const AuthController = require('../controllers/auth.controller')

/*********************************************************
Pages visiteurs
*********************************************************/

router
    .route('/')
    .get(AreaZoneController.findAllAreaZone)

/*********************************************************
Pages administrateurs
*********************************************************/
 * 
router
    .route('/admin/')
    .get(AuthController.protect, AuthController.restrictTo(["admin"]), AreaZoneController.findAllAreaZone)
    .post(AuthController.protect, AuthController.restrictTo(["admin"]), AreaZoneController.createAreaZone)

router
    .route('/admin/:id')
    .get(AuthController.protect, AuthController.restrictTo(["admin"]), AreaZoneController.findAreaZoneById)
    .put(AuthController.protect, AuthController.restrictTo(["admin"]), AreaZoneController.updateAreaZone)
    .delete(AuthController.protect, AuthController.restrictTo(["admin"]), AreaZoneController.deleteAreaZone)

module.exports = router;