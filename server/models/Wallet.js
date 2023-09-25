const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    username: String,
    balance: Number,
    shares: [{
        ticker: String,
        shares: Number,
    }],
});

module.exports = mongoose.model('Wallet', walletSchema);
