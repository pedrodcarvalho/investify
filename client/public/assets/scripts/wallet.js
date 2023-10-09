import { loadSidebar, loadFooter } from '../../../utils/loadComponents.js';

await loadSidebar();
await loadFooter();

const assetsArray = await fetch('/wallet/assets').then((res) => res.json()).then((data) => data);
const walletCategory = document.getElementById('wallet-category').textContent.split(' ')[0];

let assetsInfoArray = await Promise.all(Array.from(assetsArray).map(async (asset, index) => {
    const assetTicker = asset.split('ticker=')[1].split('\"')[0];
    const assetInfo = await fetch(`/quoted?ticker=${assetTicker}&rawData=true`).then((res) => res.json()).then((data) => data);

    switch (walletCategory) {
        case 'Cryptocurrencies':
            if (assetInfo.type === 'CRYPTOCURRENCY') {
                return assetInfo;
            }
            else {
                assetsArray.splice(index, 1);
            }

            break;
        case 'Stocks':
            if (assetInfo.type !== 'CRYPTOCURRENCY') {
                return assetInfo;
            }
            else {
                assetsArray.splice(index, 1);
            }

            break;
        default:
            return assetInfo;
    }
}));

assetsInfoArray = assetsInfoArray.filter((asset) => asset !== undefined);

const initializeMDC = async () => {
    const MDCdataTable = mdc.dataTable.MDCDataTable;
    const dataTable = new MDCdataTable(document.querySelector('.mdc-data-table'));
    const MDCselect = mdc.select.MDCSelect;
    const select = new MDCselect(document.querySelector('.mdc-data-table__pagination-rows-per-page-select'));
    const MDCripple = mdc.ripple.MDCRipple;
    const buttons = document.querySelectorAll('.mdc-icon-button');
    buttons.forEach((button) => new MDCripple(button));

    return {
        dataTable,
        select,
    };
};

const tableBody = document.querySelector('.mdc-data-table__content');
const paginationTotal = document.querySelector('.mdc-data-table__pagination-total');
const paginationButtons = document.querySelectorAll('.mdc-data-table__pagination-button');

let assetsQuantity = 0;
let startValue = 0;
let endValue = 0;

const updateTable = (assetsArray, startValue, endValue) => {
    tableBody.innerHTML = '';

    let assetsArraySliced = assetsArray.slice(startValue, endValue);

    if (startValue === endValue) {
        assetsArraySliced = assetsArray.slice(startValue, endValue + assetsArray.length);
    }

    assetsArraySliced.map((asset) => {
        tableBody.innerHTML += asset;
    });

    loadAssetsInfo();
};

const updatePaginationTotal = (startValue, endValue) => {
    if (assetsArray.length === 0) {
        paginationTotal.innerHTML = '0-0 of 0';
        return;
    }

    startValue += 1;

    paginationTotal.innerHTML = `${startValue}-${endValue > assetsQuantity ? assetsQuantity : endValue} of ${assetsQuantity}`;
};

const setPaginationTotal = async () => {
    await fetch('/wallet/assets/quantity').then((res) => res.text()).then((data) => {
        assetsQuantity = data;

        updatePaginationTotal(0, 5);
    });
};

const sortTable = (columnIndex, sortValue) => {
    const sortedColumnIndex = columnIndex;
    const sortedDirection = sortValue;

    const tableRows = document.querySelectorAll('.mdc-data-table__row');

    const sortedRows = Array.from(tableRows).sort((rowA, rowB, id) => {
        const rowDataA = rowA.children[sortedColumnIndex].textContent.trim();
        const rowDataB = rowB.children[sortedColumnIndex].textContent.trim();

        const comparison = rowDataA.localeCompare(rowDataB, undefined, { numeric: true });

        return sortedDirection === 'ascending' ? comparison : -comparison;
    });

    sortedRows.map((row, index) => row.id = index + startValue);

    tableRows.forEach((row) => row.remove());
    tableBody.append(...sortedRows);
};

const rowsPerPage = (endValue) => {
    updateTable(assetsArray, startValue, endValue);

    updatePaginationTotal(startValue, endValue);
}

const loadAssetsInfo = () => {
    Array.from(tableBody.children).map((asset, index) => {
        const indexValue = index + startValue;

        asset.querySelector('.type').textContent = assetsInfoArray[indexValue].type;
        asset.querySelector('.price').textContent = `${assetsInfoArray[indexValue].marketPrice} ${assetsInfoArray[indexValue].currency}$`;
    });
};

const updatePaginationButtonsState = () => {
    if (assetsArray.length === 0) {
        paginationButtons[0].setAttribute('disabled', '');
        paginationButtons[1].setAttribute('disabled', '');
        paginationButtons[2].setAttribute('disabled', '');
        paginationButtons[3].setAttribute('disabled', '');

        return;
    }

    const firstRowValue = Number(document.querySelectorAll('.mdc-data-table__row')[0].id);
    const lastRowValue = Number(document.querySelectorAll('.mdc-data-table__row')[document.querySelectorAll('.mdc-data-table__row').length - 1].id);

    if (firstRowValue === 0) {
        paginationButtons[0].setAttribute('disabled', '');
        paginationButtons[1].setAttribute('disabled', '');
    }
    else {
        paginationButtons[0].removeAttribute('disabled');
        paginationButtons[1].removeAttribute('disabled');
    }

    if (lastRowValue === Number(assetsQuantity) - 1) {
        paginationButtons[2].setAttribute('disabled', '');
        paginationButtons[3].setAttribute('disabled', '');
    }
    else {
        paginationButtons[2].removeAttribute('disabled');
        paginationButtons[3].removeAttribute('disabled');
    }
};

const mountWallet = async () => {
    const { dataTable, select } = await initializeMDC();

    select.listen('MDCSelect:change', async (event) => {
        rowsPerPage(Number(event.detail.value));
    });

    rowsPerPage(5);

    dataTable.listen('MDCDataTable:sorted', (event) => {
        sortTable(event.detail.columnIndex, event.detail.sortValue);
    });

    setPaginationTotal();

    updatePaginationButtonsState();

    paginationButtons[0].addEventListener('click', () => {
        startValue = 0;
        endValue = Number(select.value);

        updateTable(assetsArray, startValue, endValue);
        updatePaginationTotal(startValue, endValue);

        updatePaginationButtonsState();
    });

    paginationButtons[1].addEventListener('click', () => {
        const firstRowValue = Number(document.querySelectorAll('.mdc-data-table__row')[0].id);
        const lastRowValue = Number(document.querySelectorAll('.mdc-data-table__row')[document.querySelectorAll('.mdc-data-table__row').length - 1].id);

        if (firstRowValue > 0) {
            startValue = firstRowValue - Number(select.value);
            endValue = lastRowValue - Number(select.value) + 1;

            if (endValue < Number(select.value)) {
                endValue = Number(select.value);
            }

            if (endValue % Number(select.value) !== 0) {
                endValue = endValue + (Number(select.value) - (endValue % Number(select.value)));
            }

            updateTable(assetsArray, startValue, endValue);
            updatePaginationTotal(startValue, endValue);

            updatePaginationButtonsState();
        }
    });

    paginationButtons[2].addEventListener('click', () => {
        const firstRowValue = Number(document.querySelectorAll('.mdc-data-table__row')[0].id);
        const lastRowValue = Number(document.querySelectorAll('.mdc-data-table__row')[document.querySelectorAll('.mdc-data-table__row').length - 1].id);

        if (lastRowValue < Number(assetsQuantity)) {
            startValue = firstRowValue + Number(select.value);
            endValue = lastRowValue + Number(select.value) + 1;

            if (endValue > Number(assetsQuantity)) {
                endValue = Number(assetsQuantity);
            }

            updateTable(assetsArray, startValue, endValue);
            updatePaginationTotal(startValue, endValue);

            updatePaginationButtonsState();
        }
    });

    paginationButtons[3].addEventListener('click', () => {
        let rowsOverFlow = Number(assetsQuantity) % Number(select.value);
        rowsOverFlow === 0 ? startValue = Number(assetsQuantity) - Number(select.value) : startValue = Number(assetsQuantity) - rowsOverFlow;

        endValue = Number(assetsQuantity);

        updateTable(assetsArray, startValue, endValue);
        updatePaginationTotal(startValue, endValue);

        updatePaginationButtonsState();
    });
};

await mountWallet();
