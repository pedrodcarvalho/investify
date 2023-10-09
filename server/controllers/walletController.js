const User = require('../models/User');

const getAssets = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.session.user.username });

        if (user) {
            res.render('assets', { assets: user.wallet.shares }, (err, html) => {
                if (err) {
                    res.status(500).json({ err: err.message });
                }
                else {
                    const assetsArray = html.split('\n\n').filter((asset) => asset !== '' && asset !== '\n');
                    res.status(200).json(assetsArray);
                }
            });
        }
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getNumberOfAssets = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.session.user.username });

        if (user) {
            res.status(200).json(user.wallet.shares.length);
        }
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};


module.exports = {
    getAssets,
    getNumberOfAssets,
};
