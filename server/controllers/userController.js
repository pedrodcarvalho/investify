const User = require('../models/user');
const { sanitizeInput, validateInput } = require('../helpers/registerHelpers');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username, password: req.body.password });

        if (user) {
            req.session.user = user;

            res.status(200).redirect('/home');
        }
        else {
            res.status(400).render('index', { message: 'Invalid username or password' });
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
            });

            await newUser.save();

            req.session.user = newUser;

            res.status(200).redirect('/home');
        }
        else {
            res.status(400).render('register', { message: registration.message, username: req.body.username, email: req.body.email });
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

module.exports = {
    getAllUsers,
    loginUser,
    registerUser,
    logOutUser,
};
