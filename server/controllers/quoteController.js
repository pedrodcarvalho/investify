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
                const quotes = response.data.quotes;

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

const quotedTicker = async (req, res) => {
    try {
        const ticker = req.query.ticker;

        axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`)
            .then((response) => {
                const chart = response.data.chart.result[0];

                const data = {
                    symbol: chart.meta.symbol,
                    type: chart.meta.instrumentType,
                    marketPrice: chart.meta.regularMarketPrice,
                    currency: chart.meta.currency,
                    variation: (chart.meta.regularMarketPrice - chart.meta.previousClose).toFixed(2),
                    variationPercent: ((chart.meta.regularMarketPrice - chart.meta.previousClose) / chart.meta.previousClose * 100).toFixed(2),
                    previousClose: chart.meta.previousClose,
                    open: chart.indicators.quote[0].open[0].toFixed(2),
                    volume: String(chart.indicators.quote[0].volume.reduce((cur, acc) => acc += cur)),
                };

                data.variationColor = '#cc3e33';

                if (data.variation > 0) {
                    data.variation = `+${data.variation}`;
                    data.variationPercent = `+${data.variationPercent}`;
                    data.variationColor = '#31c38c';
                }

                res.status(200).render('quotedTicker', { username: req.session.user.username, data: data });
            })
            .catch((err) => {
                res.status(500).json(err.message);
            });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const sanitizePrices = async (indicators) => {
    return indicators.quote[0].close.filter((price) => {
        if (price !== null) {
            return price;
        }
    });
}

const quotedChart = async (req, res) => {
    try {
        const ticker = req.query.ticker;
        const range = req.query.range;
        const interval = req.query.interval;

        axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=${interval}`)
            .then(async (response) => {
                const chart = response.data.chart.result[0];
                chart.indicators = await sanitizePrices(chart.indicators);

                res.status(200).json(chart);
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
    quotedTicker,
    quotedChart,
};