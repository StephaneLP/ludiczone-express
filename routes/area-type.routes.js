const express = require('express');
const router = express.Router();
const AreaTypeController = require('../controllers/area-type.controller')
const RouteController = require('../controllers/user.controller')

router
    .route('/')
    .get(AreaTypeController.findAllAreaType)
    .post(RouteController.protect, AreaTypeController.createAreaType)

router
    .route('/:id')
    .get(AreaTypeController.findAreaTypeById)
    .put(RouteController.protect, AreaTypeController.updateAreaType)
    .delete(RouteController.protect, AreaTypeController.deleteAreaType)

module.exports = router;