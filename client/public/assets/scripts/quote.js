import { loadSidebar, loadFooter } from '../../../utils/loadComponents.js';

await loadSidebar();
await loadFooter();

const quoteTicker = async () => {
    const MDCtextField = mdc.textField.MDCTextField;
    new MDCtextField(document.querySelector('.mdc-text-field'));

    const quoteTicker = document.querySelector('#quote-ticker');
    const quoteResult = document.querySelector('#quote-result');
    const searchQuoteBtn = document.querySelector('#search-quote');

    quoteTicker.addEventListener('input', async (e) => {
        const ticker = quoteTicker.value;

        try {
            if (ticker === '' || /\s+/.test(ticker)) return quoteResult.innerHTML = '';

            fetch(`/quote/${ticker}`).then((res) => res.text()).then((data) => {
                quoteResult.innerHTML = data;
                searchQuoteBtn.href = quoteResult.children[0].children[0].href;
            });
        }
        catch (err) {
            console.log(err);
        }
    });
};

await quoteTicker();
