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
            res.status(200).json({ message: 'Login successful' });
        }
        else {
            res.status(400).json({ message: 'Invalid username or password' });
        }
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const registerUser = async (req, res) => {
    try {
        req.body = sanitizeInput(req.body);
        validateInput(res, req.body);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        await newUser.save();

        res.status(200).json({ message: 'Registration successful' });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    getAllUsers,
    loginUser,
    registerUser,
};
