const getUserTheme = async (req, res) => {
    try {
        res.status(200).json({ theme: req.cookies.theme });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const updateUserTheme = async (req, res) => {
    try {
        res.cookie('theme', req.body.theme, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
        res.status(200).json({ theme: req.cookies.theme });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    getUserTheme,
    updateUserTheme,
};
