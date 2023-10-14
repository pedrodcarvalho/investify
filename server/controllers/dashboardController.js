const axios = require('axios');

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

module.exports = {
    getFinanceApplets,
};
