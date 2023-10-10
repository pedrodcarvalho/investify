import { loadLoginForm, loadFooter, loadToastMessage } from '../../../utils/loadComponents.js';

await loadLoginForm();
await loadFooter();
await loadToastMessage();

const setFields = () => {
    const loginUsername = document.getElementById('login__username');

    loginUsername.value = sessionStorage.getItem('loginUsername');
};

setFields();

const cacheInputs = () => {
    const loginUsername = document.getElementById('login__username');

    sessionStorage.setItem('loginUsername', loginUsername.value);
};

document.querySelector('.form').addEventListener('submit', cacheInputs);
