const User = require('../models/User');

const sanitizeInput = async (body) => {
    const entries = Object.entries(body);

    for (const [key, value] of entries) {
        if (typeof value === 'string') {
            body[key] = value.trim();
        }
    }

    return body;
};

const validateInputLengths = (body) => {
    if (body.username.length < 6 || body.username.length > 16) {
        return { isValid: false, message: 'Sorry, your username must be between 6 and 16 characters long.' };
    }
    else if (body.password.length < 8 || body.password.length > 16) {
        return { isValid: false, message: 'Sorry, your password must be between 8 and 16 characters long.' };
    }
};

const validateUsername = (body) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if (!usernameRegex.test(body.username)) {
        return { isValid: false, message: 'Username must contain only letters and numbers' };
    }
};

const validateEmail = (body) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(body.email)) {
        return { isValid: false, message: 'Invalid email address' };
    }
};

const validatePassword = (body) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[@#$%^&+=!]*.*$/;

    if (!passwordRegex.test(body.password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
    }
};

const validateInput = async (body) => {
    const existingUser = await User.findOne({ username: body.username });

    if (existingUser) {
        return { isValid: false, message: 'Username already exists' };
    }
    else {
        const inputLengthValidation = validateInputLengths(body);

        if (inputLengthValidation) {
            return inputLengthValidation;
        }

        const usernameValidation = validateUsername(body);
        if (usernameValidation) {
            return usernameValidation;
        }

        const emailValidation = validateEmail(body);
        if (emailValidation) {
            return emailValidation;
        }

        const passwordValidation = validatePassword(body);
        if (passwordValidation) {
            return passwordValidation;
        }

        return { isValid: true, message: '' };
    }
};

module.exports = { sanitizeInput, validateInput };
