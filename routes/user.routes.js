const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller')


router
    .route('/')
    // .get(UserController.findAllUser)
    // .post(UserController.createUser)

// router
//     .route('/:id')
//     .get(UserController.findUserById)
//     .put(UserController.updateUser)
//     .delete(UserController.deleteUser)

router
    .route('/login')
    .post(UserController.login)

module.exports = router;