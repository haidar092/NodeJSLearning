const express = require('express');
const { signup } = require('./../controller/authController');
//user function
const { GetUsers } = require('./../controller/userController');

const router = express.Router();

router.post('/signup', signup);

router.route('/').get(GetUsers);

module.exports = router;
