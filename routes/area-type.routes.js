const express = require('express');
const router = express.Router();
const AreaTypeController = require('../controllers/area-type.controller')
const UserController = require('../controllers/user.controller')
const DataController = require('../controllers/data.controller')

router
    .route('/')
    .get(AreaTypeController.findAllAreaType)

router
    .route('/admin')
    .get(UserController.protect, UserController.restrictTo(["admin"]), AreaTypeController.findAllAreaType)
    .post(UserController.protect, UserController.restrictTo(["admin"]), AreaTypeController.createAreaType)

router
    .route('/admin/:id')
    .get(UserController.protect, UserController.restrictTo(["admin"]), AreaTypeController.findAreaTypeById)
    .put(UserController.protect, UserController.restrictTo(["admin"]), AreaTypeController.updateAreaType)
    .delete(UserController.protect, UserController.restrictTo(["admin"]), AreaTypeController.deleteAreaType)

module.exports = router;