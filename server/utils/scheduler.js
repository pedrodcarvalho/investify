const User = require('../models/User');
const cron = require('node-cron');

const storeUserBalance = async () => {
    cron.schedule('* */12 * * *', async () => {
        try {
            const users = await User.find();

            users.map(async (user) => {
                const balanceHistory = user.balance_history;

                balanceHistory.push({
                    balance: user.wallet.balance,
                    date: new Date(),
                });

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
