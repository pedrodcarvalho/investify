import { loadRegisterForm, loadFooter, loadToastMessage } from '../../../utils/loadComponents.js';

await loadRegisterForm();
await loadFooter();
await loadToastMessage();

const registerUsername = document.getElementById('login__username');
const email = document.getElementById('login__email');
const password = document.getElementById('login__password');

const formRequirements = document.querySelectorAll('.form__requirements p');

const setFields = () => {
    registerUsername.value = sessionStorage.getItem('registerUsername');
    email.value = sessionStorage.getItem('email');
};

setFields();

const cacheInputs = () => {
    sessionStorage.setItem('registerUsername', registerUsername.value);
    sessionStorage.setItem('email', email.value);
};

const changeRequirementsState = (isValid, index) => {
    if (isValid) {
        formRequirements[index].querySelector('i').classList.remove('fa-times');
        formRequirements[index].querySelector('i').classList.add('fa-check');
        formRequirements[index].classList.remove('invalid');
        formRequirements[index].classList.add('valid');
    }
    else {
        formRequirements[index].querySelector('i').classList.remove('fa-check');
        formRequirements[index].querySelector('i').classList.add('fa-times');
        formRequirements[index].classList.remove('valid');
        formRequirements[index].classList.add('invalid');
    }
};

const validateUsername = () => {
    if (registerUsername.value.length >= 6 && registerUsername.value.length <= 16) {
        changeRequirementsState(true, 0);
    }
    else {
        changeRequirementsState(false, 0);
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if (usernameRegex.test(registerUsername.value)) {
        changeRequirementsState(true, 1);
    }
    else {
        changeRequirementsState(false, 1);
    }
}

const validateEmail = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (emailRegex.test(email.value)) {
        changeRequirementsState(true, 2);
    }
    else {
        changeRequirementsState(false, 2);
    }
}

const validatePassword = () => {
    if (password.value.length >= 8 && password.value.length <= 16) {
        changeRequirementsState(true, 3);
    }
    else {
        changeRequirementsState(false, 3);
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[@#$%^&+=!]*.*$/;

    if (passwordRegex.test(password.value)) {
        changeRequirementsState(true, 4);
    }
    else {
        changeRequirementsState(false, 4);
    }
}

document.querySelector('.form').addEventListener('submit', (e) => {
    cacheInputs();
});

registerUsername.addEventListener('input', () => {
    validateUsername();
});

email.addEventListener('input', () => {
    validateEmail();
});

password.addEventListener('input', () => {
    validatePassword();
});

validateUsername();
validateEmail();
validatePassword();
