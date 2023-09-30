import { loadSidebar, loadFooter } from '../../../utils/loadComponents.js';
import { toastMessage } from '../../../utils/toast.js';

await loadSidebar();
await loadFooter();

const operationTicker = async () => {
    const MDCtextField = mdc.textField.MDCTextField;
    new MDCtextField(document.querySelector('.mdc-text-field'));

    const quoteTicker = document.querySelector('#quote-ticker');
    const quoteResult = document.querySelector('#quote-result');

    quoteTicker.addEventListener('input', async (e) => {
        const ticker = quoteTicker.value;

        try {
            if (ticker === '' || /\s+/.test(ticker)) return quoteResult.innerHTML = '';

            fetch(`/quote/${ticker}?type=operationCards`).then((res) => res.text()).then((data) => {
                quoteResult.innerHTML = data;
            }).then(() => {
                const operationCards = document.querySelector('#quote-result').children;
                const buyBtns = document.querySelectorAll('.buy-button');
                const sellBtns = document.querySelectorAll('.sell-button');
                const addShareBtns = document.querySelectorAll('.add-share');
                const removeShareBtns = document.querySelectorAll('.remove-share');
                const shares = document.querySelectorAll('.stock-shares');

                (new Array(...operationCards)).forEach((card, index) => {
                    buyBtns[index].addEventListener('click', async () => {
                        await fetch(`/operation/buy?ticker=${buyBtns[index].dataset.ticker}&shares=${shares[index].innerHTML}`)
                            .then((res) => res.json()).then((data) => {
                                const toastTitle = document.querySelector('.text-1');
                                const toastText = document.querySelector('.text-2');

                                if (data.message) {
                                    toastTitle.innerHTML = `${buyBtns[index].dataset.ticker} (${shares[index].innerHTML}x) | ${data.operationPrice} USD$`;
                                    toastText.innerHTML = data.message;
                                }
                                else {
                                    const toastSuccess = document.querySelector('.success');
                                    toastSuccess.classList.remove('success');
                                    toastSuccess.classList.add('error');
                                    toastSuccess.classList.remove('fa-check');
                                    toastSuccess.classList.add('fa-exclamation');

                                    const toastProgress = document.querySelector('.progress');
                                    toastProgress.classList.remove('green');
                                    toastProgress.classList.add('red');

                                    toastTitle.innerHTML = '';
                                    toastText.innerHTML = data.err;
                                }

                                toastMessage();
                            });
                    });

                    sellBtns[index].addEventListener('click', async () => {
                        await fetch(`/operation/sell?ticker=${buyBtns[index].dataset.ticker}&shares=${shares[index].innerHTML}`)
                            .then((res) => res.json()).then((data) => {
                                const toastTitle = document.querySelector('.text-1');
                                const toastText = document.querySelector('.text-2');

                                if (data.message) {
                                    toastTitle.innerHTML = `${buyBtns[index].dataset.ticker} (${shares[index].innerHTML}x) | ${data.operationPrice} USD$`;
                                    toastText.innerHTML = data.message;
                                }
                                else {
                                    const toastSuccess = document.querySelector('.success');
                                    toastSuccess.classList.remove('success');
                                    toastSuccess.classList.add('error');
                                    toastSuccess.classList.remove('fa-check');
                                    toastSuccess.classList.add('fa-exclamation');

                                    const toastProgress = document.querySelector('.progress');
                                    toastProgress.classList.remove('green');
                                    toastProgress.classList.add('red');

                                    toastTitle.innerHTML = '';
                                    toastText.innerHTML = data.err;
                                }

                                toastMessage();
                            });
                    });

                    addShareBtns[index].addEventListener('click', () => {
                        if (Number(shares[index].innerHTML) < 99) {
                            shares[index].innerHTML = Number(shares[index].innerHTML) + 1;
                        }
                    });

                    removeShareBtns[index].addEventListener('click', () => {
                        if (Number(shares[index].innerHTML) > 1) {
                            shares[index].innerHTML = Number(shares[index].innerHTML) - 1;
                        }
                    });
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    });
};

await operationTicker();
