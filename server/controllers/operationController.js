const axios = require('axios');

const User = require('../models/User');

const { convertToUSD } = require('../helpers/currencyConverter');

const addSharesToWallet = async (username, ticker, shares, operationType, operationPrice) => {
    const user = await User.findOne({ username: username });

    if (user) {
        const existingShare = user.wallet.shares.find((share) => share.ticker === ticker);

        if (existingShare) {
            if (operationType === 'sell') {
                if (Number(existingShare.shares) < Number(shares)) {
                    throw new Error('You don\'t have enough shares to sell');
                }
                else if (Number(existingShare.shares) === Number(shares)) {
                    user.wallet.shares = user.wallet.shares.filter((share) => share.ticker !== ticker);
                }
                else {
                    existingShare.shares = Number(existingShare.shares) - Number(shares);
                }
            }
            else {
                if (Number(user.wallet.balance) < Number(shares)) {
                    throw new Error('You don\'t have enough balance to buy');
                }

                existingShare.shares = Number(existingShare.shares) + Number(shares);
            }
        }
        else {
            if (operationType === 'sell') {
                throw new Error('You don\'t have any shares to sell');
            }
            else {
                if (Number(user.wallet.balance) < Number(operationPrice)) {
                    throw new Error('You don\'t have enough balance to buy');
                }

                user.wallet.shares.push({ ticker: ticker, shares: shares });
            }
        }

        await user.save();
    }
};

const updateBalance = async (username, operationPrice, operationType) => {
    const user = await User.findOne({ username: username });

    if (user) {
        if (operationType === 'sell') {
            user.wallet.balance = Number(user.wallet.balance) + Number(operationPrice);
        }
        else {
            user.wallet.balance = Number(user.wallet.balance) - Number(operationPrice);
        }

        await user.save();
    }
};

const operationTemplate = async (req, res, operationType) => {
    try {
        const ticker = req.query.ticker;
        const shares = req.query.shares;

        const data = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`)
            .then((response) => response.data);

        let marketPrice = data.chart.result[0].meta.regularMarketPrice;
        const operationCurrency = data.chart.result[0].meta.currency;

        if (operationCurrency !== 'USD') {
            marketPrice = await convertToUSD(operationCurrency, marketPrice);
        }

        const operationPrice = marketPrice * shares;

        await addSharesToWallet(req.session.user.username, ticker, shares, operationType, operationPrice)
            .then(async () => {
                await updateBalance(req.session.user.username, operationPrice, operationType);

                if (operationType === 'buy') {
                    res.status(200).json({ message: 'Buy operation successful!', operationPrice: operationPrice });
                }
                else {
                    res.status(200).json({ message: 'Sell operation successful!', operationPrice: operationPrice });
                }
            })
            .catch((err) => {
                res.status(400).json({ err: err.message });
            });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const buyOperation = async (req, res) => {
    operationTemplate(req, res, 'buy');
};

const sellOperation = async (req, res) => {
    operationTemplate(req, res, 'sell');
};

module.exports = {
    buyOperation,
    sellOperation,
};
