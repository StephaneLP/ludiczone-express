const express = require('express');
const router = express.Router();
const AreaTypeController = require('../controllers/area-type.controller')
const UserController = require('../controllers/user.controller')
const AreaTypeDataCheck = require('../datacontrol/area-type.datacontrol')

router
    .route('/')
    .get(AreaTypeController.findAllAreaType)
    .post(AreaTypeDataCheck.control, UserController.protect, UserController.restrictTo(["admin"]), AreaTypeController.createAreaType)

router
    .route('/:id')
    .get(UserController.protect, UserController.restrictTo(["admin"]), AreaTypeController.findAreaTypeById)
    .put(UserController.protect, UserController.restrictTo(["admin"]), AreaTypeController.updateAreaType)
    .delete(UserController.protect, UserController.restrictTo(["admin"]), AreaTypeController.deleteAreaType)

module.exports = router;