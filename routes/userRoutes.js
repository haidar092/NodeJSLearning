const express = require('express');
const { signup ,login} = require('./../controller/authController');
//user function
const { GetUsers } = require('./../controller/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.route('/').get(GetUsers);

module.exports = router;
