const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/user');

router.post('/user/signup', userController.userSignup);
router.post('/user/login', userController.login);
router.patch('/user/modifyPW', auth, userController.modifyPassword);
router.post('/user/find', userController.sendEmail);

module.exports = router;
