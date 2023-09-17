exports.verifyLogin = (req, res, next) => {
    try {
        // if (req.session.user) {
        //     return res.status(200).render('home', { username: req.session.user.username });
        // }

        return next();
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};
