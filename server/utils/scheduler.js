const User = require('../models/User');
const cron = require('node-cron');

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

                    if (hoursDifference >= 12) {
                        balanceHistory.push({
                            balance: user.wallet.balance,
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
