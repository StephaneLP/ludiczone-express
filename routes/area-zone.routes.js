const express = require('express');
const router = express.Router();
const AreaZoneController = require('../controllers/area-zone.controller')
const UserController = require('../controllers/user.controller')

router
    .route('/')
    .get(AreaZoneController.findAllAreaZone)
    .post(UserController.protect, UserController.restrictTo(["admin"]), AreaZoneController.createAreaZone)

router
    .route('/:id')
    .get(UserController.protect, UserController.restrictTo(["admin"]), AreaZoneController.findAreaZoneById)
    .put(UserController.protect, UserController.restrictTo(["admin"]), AreaZoneController.updateAreaZone)
    .delete(UserController.protect, UserController.restrictTo(["admin"]), AreaZoneController.deleteAreaZone)

module.exports = router;