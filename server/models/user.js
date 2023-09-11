const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    settings: {
        theme: String
    },
});

module.exports = mongoose.model('User', userSchema);
