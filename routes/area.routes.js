const express = require('express');
const router = express.Router();
const AreaController = require('../controllers/area.controller')

router
    .route('/')
    .get(AreaController.findAllArea)
    .post(AreaController.createArea)

module.exports = router;