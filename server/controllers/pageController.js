const getHomePage = async (req, res) => {
    try {
        res.status(200).sendFile('index.html', { root: '../client/public' });
    } catch (err) {
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

module.exports = {
    getHomePage,
    getRegisterPage,
};
