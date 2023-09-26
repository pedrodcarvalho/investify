const puppeteer = require('puppeteer');

const convertToUSD = async (operationCurrency, marketPrice) => {
    const browser = await puppeteer.launch(headless = 'new');
    const page = await browser.newPage();

    await page.goto(`https://www.google.com/finance/quote/${operationCurrency}-USD`);

    await page.waitForSelector('.YMlKec.fxKbKc');

    const rate = await page.evaluate(() => document.querySelector('.YMlKec.fxKbKc').innerText);

    await browser.close();

    return Number(rate) * Number(marketPrice);
};

module.exports = {
    convertToUSD,
};
