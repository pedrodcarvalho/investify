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
        res.status(200).render('settings', { username: req.session.user.username, email: req.session.user.email });
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

module.exports = {
    getLoginPage,
    getRegisterPage,
    getHomePage,
    getSettingsPage,
    getQuotePage,
};
