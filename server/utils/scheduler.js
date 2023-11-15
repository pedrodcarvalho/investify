const cron = require('node-cron');
const axios = require('axios');

const User = require('../models/User');

const { convertToUSD } = require('../helpers/currencyConverter');

const getInvestedMoney = async (user) => {
    const wallet = user.wallet;

    const tickersArray = await Promise.all(wallet.shares.map(async (asset) => {
        return await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${asset.ticker}`)
            .then((response) => {
                if (response.data.chart.result[0].meta.currency !== 'USD') {
                    return convertToUSD(response.data.chart.result[0].meta.currency, response.data.chart.result[0].meta.regularMarketPrice * asset.shares)
                        .then((convertedPrice) => {
                            return convertedPrice * asset.shares;
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }

                return response.data.chart.result[0].meta.regularMarketPrice * asset.shares
            })
            .catch((err) => {
                console.log(err);
            });
    }));

    return tickersArray.reduce((accumulator, currentValue) => accumulator + currentValue);
};

const storeUserBalance = async () => {
    cron.schedule('* */12 * * *', async () => {
        try {
            const users = await User.find();

            users.map(async (user) => {
                const balanceHistory = user.balance_history;

                if (balanceHistory.length > 0) {
                    const lastBalance = balanceHistory[balanceHistory.length - 1];

                    const lastBalanceDate = new Date(lastBalance.date);
                    const currentDate = new Date();

                    const difference = currentDate.getTime() - lastBalanceDate.getTime();
                    const hoursDifference = difference / (1000 * 3600);

                    const investments = await getInvestedMoney(user);

                    if (hoursDifference >= 12) {
                        balanceHistory.push({
                            balance: user.wallet.balance + investments,
                            date: new Date(),
                        });
                    }
                }

                await user.updateOne({ balance_history: balanceHistory });
            });
        }
        catch (err) {
            console.log(err);
        }
    });
};

module.exports = {
    storeUserBalance,
};
