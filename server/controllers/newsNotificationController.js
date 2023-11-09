const puppeteer = require('puppeteer');

const getNewsNotification = async (req, res) => {
    try {
        const browser = await puppeteer.launch(headless = 'new');
        const page = await browser.newPage();

        await page.goto('https://finance.yahoo.com/topic/stock-market-news/');

        await page.waitForSelector('div #Fin-Stream');

        const notificationNewsJSON = await page.evaluate(() => {
            const notificationNewsArray = document.querySelectorAll('div #Fin-Stream li');

            return Array.from(notificationNewsArray).map((notificationNews) => {
                return {
                    thumbnail: notificationNews.querySelector('img')?.src,
                    category: notificationNews?.innerText.split('\n')[0],
                    title: notificationNews.querySelector('h3')?.innerText,
                    description: notificationNews.querySelector('p')?.innerText,
                    url: notificationNews.querySelector('a')?.href,
                };
            });
        });

        await browser.close();

        res.status(200).json(notificationNewsJSON);
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    getNewsNotification,
};
