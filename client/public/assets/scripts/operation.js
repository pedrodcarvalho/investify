import { loadSidebar, loadFooter } from '../../../utils/loadComponents.js';
import { toastMessage } from '../../../utils/toast.js';

await loadSidebar();
await loadFooter();

const changeToastType = (type, icon, color) => {
    const toastType = document.querySelector('.type');
    const toastProgress = document.querySelector('.progress');

    toastType.classList.remove('success');
    toastType.classList.remove('error');
    toastType.classList.add(type);

    toastType.classList.remove('fa-check');
    toastType.classList.remove('fa-exclamation');
    toastType.classList.add(icon);

    toastProgress.classList.remove('green');
    toastProgress.classList.remove('red');
    toastProgress.classList.add(color);
};

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
                                const toastType = document.querySelector('.type');

                                if (data.message) {
                                    if (toastType.classList.contains('error')) {
                                        changeToastType('success', 'fa-check', 'green');
                                    }

                                    toastTitle.innerHTML = `${buyBtns[index].dataset.ticker} (${shares[index].innerHTML}x) | ${data.operationPrice} USD$`;
                                    toastText.innerHTML = data.message;
                                }
                                else {
                                    if (toastType.classList.contains('success')) {
                                        changeToastType('error', 'fa-exclamation', 'red');
                                    }

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
                                const toastType = document.querySelector('.type');
                                const toastProgress = document.querySelector('.progress');

                                if (data.message) {
                                    if (toastType.classList.contains('error')) {
                                        toastType.classList.remove('error');
                                        toastType.classList.add('success');
                                        toastType.classList.remove('fa-exclamation');
                                        toastType.classList.add('fa-check');

                                        toastProgress.classList.remove('red');
                                        toastProgress.classList.add('green');
                                    }

                                    toastTitle.innerHTML = `${buyBtns[index].dataset.ticker} (${shares[index].innerHTML}x) | ${data.operationPrice} USD$`;
                                    toastText.innerHTML = data.message;
                                }
                                else {
                                    if (toastType.classList.contains('success')) {
                                        toastType.classList.remove('success');
                                        toastType.classList.add('error');
                                        toastType.classList.remove('fa-check');
                                        toastType.classList.add('fa-exclamation');

                                        toastProgress.classList.remove('green');
                                        toastProgress.classList.add('red');
                                    }

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
