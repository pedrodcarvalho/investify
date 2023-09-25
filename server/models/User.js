const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    wallet: {
        balance: Number,
        shares: [{
            ticker: String,
            shares: Number,
        }],
    },
});

module.exports = mongoose.model('User', userSchema);
