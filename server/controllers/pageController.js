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
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    getLoginPage,
    getRegisterPage,
    getHomePage,
};
