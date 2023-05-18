const express = require('express');
const router = express.Router();
const AreaController = require('../controllers/area.controller')

router
    .route('/')
    // .get(AreaTypeController.findAllAreaType)
    .post(AreaController.createArea)

// router
//     .route('/:id')
//     .delete(AreaTypeController.deleteAreaType) 

module.exports = router;