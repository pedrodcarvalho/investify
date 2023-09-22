const express = require('express');
const router = express.Router();

const database = require('./config/database');
const loginVerification = require('./middleware/loginVerification');
const pageController = require('./controllers/pageController');
const componentsController = require('./controllers/componentsController');
const userController = require('./controllers/userController');
const userSettingsController = require('./controllers/userSettingsController');
const quoteController = require('./controllers/quoteController');

router.use(database.connect);
router.use(loginVerification.verifyLogin);

router.get('/', pageController.getLoginPage);
router.get('/register', pageController.getRegisterPage);
router.get('/home', pageController.getHomePage);
router.get('/settings', pageController.getSettingsPage);
router.get('/quote', pageController.getQuotePage);

router.get('/sidebar', componentsController.getSidebar);

router.get('/logout', userController.logOutUser);
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);

router.get('/theme', userSettingsController.getUserTheme);
router.put('/theme', userSettingsController.updateUserTheme);

router.get('/quote/:ticker', quoteController.getQuoteCards);

module.exports = router;
