const User = require('../models/user');

const sanitizeInput = async (body) => {
    const entries = Object.entries(body);

    for (const [key, value] of entries) {
        if (typeof value === 'string') {
            body[key] = value.trim();
        }
    }

    return body;
};

const validateInputLengths = (res, body) => {
    if (body.username.length < 6 || body.username.length > 16) {
        res.status(400).json({ message: 'Sorry, your username must be between 6 and 16 characters long.' });
    }
    else if (body.password.length < 8 || body.password.length > 16) {
        res.status(400).json({ message: 'Password must be between 8 and 16 characters long' });
    }
};

const validateUsername = (res, body) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if (!usernameRegex.test(body.username)) {
        res.status(400).json({ message: 'Username must only contain letters and numbers' });
    }
};

const validatePassword = (res, body) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!passwordRegex.test(body.password)) {
        res.status(400).json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' });
    }
};

const validateEmail = (res, body) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(body.email)) {
        res.status(400).json({ message: 'Invalid email address' });
    }
};

const validateInput = async (res, body) => {
    const existingUser = await User.findOne({ username: body.username });

    if (existingUser) {
        res.status(400).json({ message: 'Username already exists' });
    }
    else {
        validateInputLengths(res, body);
        validateUsername(res, body);
        validatePassword(res, body);
        validateEmail(res, body);
    }
};

module.exports = { sanitizeInput, validateInput };
