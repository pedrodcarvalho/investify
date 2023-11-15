const getLoginPage = async (req, res) => {
    try {
        res.status(200).sendFile('index.html', { root: '../client/public' });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getRegisterPage = async (req, res) => {
    try {
        res.status(200).sendFile('register.html', { root: '../client/public/pages' });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getHomePage = async (req, res) => {
    try {
        res.status(200).render('home', { username: req.session.user.username });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getSettingsPage = async (req, res) => {
    try {
        req.session.toast = undefined;
        res.status(200).render('settings', { username: req.session.user.username, email: req.session.user.email, password: req.session.user.password, toast: req.session?.toast });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getQuotePage = async (req, res) => {
    try {
        res.status(200).render('quote', { username: req.session.user.username });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getOperationPage = async (req, res) => {
    try {
        res.status(200).render('operation', { username: req.session.user.username });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getWalletPage = async (req, res) => {
    try {
        res.status(200).render('wallet', { username: req.session.user.username, category: req.query.category });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    getLoginPage,
    getRegisterPage,
    getHomePage,
    getSettingsPage,
    getQuotePage,
    getOperationPage,
    getWalletPage,
};
