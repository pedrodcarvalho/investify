exports.verifyLogin = (req, res, next) => {
    try {
        return next();
        // if (req.isAuthenticated()) {
        //     return next();
        // }

        // res.redirect('/login');
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
