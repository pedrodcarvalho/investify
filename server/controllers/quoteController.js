const axios = require('axios');

const trimQuote = (quote) => {
    const symbol = quote.symbol;
    const trimmedSymbol = quote.symbol.slice(0, 8);

    if (symbol !== trimmedSymbol) {
        quote.symbol = `${trimmedSymbol}...`;
    }
};

const sanitizeQuoteName = (quote) => {
    quote.longname = quote.longname === undefined ? (quote.shortname === undefined ? '' : quote.shortname) : quote.longname;
};

const getQuoteCards = async (req, res) => {
    try {
        const ticker = req.params.ticker;

        axios.get(`https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}`)
            .then((response) => {
                quotes = response.data.quotes;

                quotes.map((quote) => {
                    trimQuote(quote);
                    sanitizeQuoteName(quote);
                });

                res.status(200).render('quoteCards', { quotes: quotes });
            })
            .catch((err) => {
                res.status(500).json(err.message);
            });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    getQuoteCards,
};
