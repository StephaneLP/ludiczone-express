const express = require('express');
const router = express.Router();
const AreaTypeController = require('../controllers/area-type.controller')

router
    .route('/')
    .get(AreaTypeController.findAllAreaType)

router
    .route('/:id')
    .delete(AreaTypeController.deleteAreaType) 

module.exports = router;