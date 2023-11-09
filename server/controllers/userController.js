const User = require('../models/User');
const { sanitizeInput, validateInput, validatePassword } = require('../helpers/registerHelpers');

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username, password: req.body.password });

        if (user) {
            req.session.user = user;

            res.status(200).redirect('/home');
        }
        else {
            req.session.toast = { title: 'Error', message: 'Invalid username or password' };
            res.status(400).render('index', { toast: req.session.toast });

            req.session.toast = null;
        }
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const registerUser = async (req, res) => {
    try {
        req.body = await sanitizeInput(req.body);
        const registration = await validateInput(req.body);

        if (registration.isValid) {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                wallet: {
                    shares: [],
                    balance: 10000,
                },
                balance_history: [],
            });

            await newUser.save();

            req.session.user = newUser;

            res.status(200).redirect('/home');
        }
        else {
            req.session.toast = { title: 'Error', message: registration.message };
            res.status(400).render('register', { toast: req.session.toast });

            req.session.toast = null;
        }
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const logOutUser = (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        req.body = await sanitizeInput(req.body);

        if (req.body.password.length < 8 || req.body.password.length > 16) {
            req.session.toast = { title: 'Error', message: 'Sorry, your password must be between 8 and 16 characters long.' };
            return res.status(200).render('settings', { username: req.session.user.username, email: req.session.user.email, password: req.session.user.password, toast: req.session?.toast });
        }

        const isValidPassword = validatePassword(req.body);

        if (isValidPassword) {
            req.session.toast = { title: 'Error', message: isValidPassword.message };
            res.status(200).render('settings', { username: req.session.user.username, email: req.session.user.email, password: req.session.user.password, toast: req.session?.toast });

            req.session.toast = null;
        }
        else {
            await User.findOneAndUpdate({ username: req.session.user.username }, { password: req.body.password });

            req.session.user.password = req.body.password;

            req.session.toast = { title: 'Success', message: 'Password changed successfully' };
            res.status(200).render('settings', { username: req.session.user.username, email: req.session.user.email, password: req.session.user.password, toast: req.session?.toast });

            req.session.toast = null;
        }
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    loginUser,
    registerUser,
    logOutUser,
    resetPassword,
};
