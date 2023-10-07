const express = require('express');
const router = express.Router();

const database = require('./config/database');
const loginVerification = require('./middleware/loginVerification');
const pageController = require('./controllers/pageController');
const componentsController = require('./controllers/componentsController');
const userController = require('./controllers/userController');
const userSettingsController = require('./controllers/userSettingsController');
const quoteController = require('./controllers/quoteController');
const operationController = require('./controllers/operationController');
const walletController = require('./controllers/walletController')

router.use(database.connect);
router.use(loginVerification.verifyLogin);

router.get('/', pageController.getLoginPage);
router.get('/register', pageController.getRegisterPage);
router.get('/home', pageController.getHomePage);
router.get('/settings', pageController.getSettingsPage);
router.get('/quote', pageController.getQuotePage);
router.get('/operation', pageController.getOperationPage);
router.get('/wallet', pageController.getWalletPage);

router.get('/sidebar', componentsController.getSidebar);
router.get('/toast-message', componentsController.getToastMessage);

router.get('/logout', userController.logOutUser);
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);

router.get('/theme', userSettingsController.getUserTheme);
router.put('/theme', userSettingsController.updateUserTheme);

router.get('/quote/:ticker', quoteController.getQuoteCards);
router.get('/quoted', quoteController.quotedTicker);
router.get('/quoted/chart', quoteController.quotedChart);

router.get('/operation/buy', operationController.buyOperation);
router.get('/operation/sell', operationController.sellOperation);

router.get('/wallet/assets', walletController.getAssets)
router.get('/wallet/assets/quantity', walletController.getNumberOfAssets)

module.exports = router;
