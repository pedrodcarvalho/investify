const axios = require('axios');
const puppeteer = require('puppeteer');

const User = require('../models/User');

const { convertToUSD } = require('../helpers/currencyConverter');

const getFinanceApplets = async (req, res) => {
    try {
        await axios.get(`https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=${req.query.category}&formatted=true&count=5`)
            .then(async (response) => {
                const quotes = await Promise.all(response.data.finance.result[0].quotes.map(async (quote) => {
                    return {
                        symbol: quote.symbol,
                        shortName: quote.shortName,
                        regularMarketPrice: quote.regularMarketPrice,
                        regularMarketChange: quote.regularMarketChange,
                        regularMarketChangePercent: quote.regularMarketChangePercent,
                    };
                }));

                res.render('financeApplet', { quotes: quotes, title: response.data.finance.result[0].title });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getLiveNews = async (req, res) => {
    try {
        const browser = await puppeteer.launch(headless = 'new');
        const page = await browser.newPage();

        await page.goto('https://www.youtube.com/results?search_query=yahoo+news+bloomberg+news&sp=EgJAAQ%253D%253D');

        await page.waitForSelector('ytd-video-renderer #video-title');

        const liveVideosJSON = await page.evaluate(() => {
            const liveVideosArray = document.querySelectorAll('ytd-video-renderer #video-title');

            return Array.from(liveVideosArray).map((liveVideo) => {
                return {
                    title: liveVideo.title,
                    id: liveVideo.href?.split('=')[1].split('&')[0],
                };
            });
        });

        await browser.close();

        res.status(200).json(liveVideosJSON);
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getBalanceHistory = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.session.user.username });

        const balanceHistory = user.balance_history.map((balance) => {
            return {
                date: balance.date,
                balance: balance.balance,
            };
        });

        res.status(200).json(balanceHistory);
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getWalletSummary = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.session.user.username });

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

        const investedMoney = tickersArray.reduce((accumulator, currentValue) => accumulator + currentValue);

        res.render('walletSummary', { wallet: wallet, investedMoney: investedMoney });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    getFinanceApplets,
    getLiveNews,
    getBalanceHistory,
    getWalletSummary,
};
