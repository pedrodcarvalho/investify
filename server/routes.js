const express = require('express');
const router = express.Router();

const database = require('./config/database');

const loginVerification = require('./middleware/loginVerification');

const pageController = require('./controllers/pageController');

const userController = require('./controllers/userController');

router.use(database.connect);
router.use(loginVerification.verifyLogin);

router.get('/', pageController.getLoginPage);
router.get('/users', userController.getAllUsers);
router.get('/register', pageController.getRegisterPage);
router.get('/home', pageController.getHomePage);

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);

module.exports = router;
