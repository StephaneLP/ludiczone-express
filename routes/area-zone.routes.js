const express = require('express');
const router = express.Router();
const AreaZoneController = require('../controllers/area-zone.controller')
const AuthController = require('../controllers/auth.controller')

//////////////////////////////////////////////////////////////////////////
// PAGES VISITEURS
//////////////////////////////////////////////////////////////////////////

router
    .route('/')
    .get(AreaZoneController.findAllAreaZone)

//////////////////////////////////////////////////////////////////////////
// PAGES ADMINISTRATEURS
//////////////////////////////////////////////////////////////////////////

router
    .route('/')
    // .get(AreaZoneController.findAllAreaZone)
    .post(AuthController.protect, AuthController.restrictTo(["admin"]), AreaZoneController.createAreaZone)

router
    .route('/:id')
    .get(AuthController.protect, AuthController.restrictTo(["admin"]), AreaZoneController.findAreaZoneById)
    .put(AuthController.protect, AuthController.restrictTo(["admin"]), AreaZoneController.updateAreaZone)
    .delete(AuthController.protect, AuthController.restrictTo(["admin"]), AreaZoneController.deleteAreaZone)

module.exports = router;