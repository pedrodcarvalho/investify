import { loadSidebar, loadFooter, passwordEye, loadToastMessage } from '../../../utils/loadComponents.js';

await loadSidebar();
await loadFooter();
await passwordEye();
await loadToastMessage();

const changeToastType = async (type, icon, color) => {
    const toastType = document.querySelector('.toast-content').children[0];
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

if (document.querySelector('.text-1').textContent === 'Error') {
    changeToastType('error', 'fa-exclamation', 'red');
}
else {
    await changeToastType('success', 'fa-check', 'green');
}
