const passwordEye = () => {
    const eye = document.querySelector('.eye')

    eye.addEventListener('click', () => {
        if (eye.classList.contains('fa-eye')) {
            eye.classList.remove('fa-eye');
            eye.classList.add('fa-eye-slash');
            eye.parentNode.querySelector('input').type = 'text';
        }
        else {
            eye.classList.remove('fa-eye-slash');
            eye.classList.add('fa-eye');
            eye.parentNode.querySelector('input').type = 'password';
        }

        eye.parentNode.querySelector('input').focus();
    });
};

const loadLoginForm = () => {
    const loginForm = document.querySelector('#login-form-component');

    fetch('../components/LoginForm.html')
        .then(response => response.text())
        .then(data => {
            loginForm.innerHTML = data;
        }).then(() => {
            passwordEye();
        });
};

const loadRegisterForm = () => {
    const registerForm = document.querySelector('#register-form-component');

    fetch('../components/RegisterForm.html')
        .then(response => response.text())
        .then(data => {
            registerForm.innerHTML = data;
        }).then(() => {
            passwordEye();
        });
};

const loadFooter = () => {
    const footer = document.querySelector('#footer-component');

    fetch('../components/Footer.html')
        .then(response => response.text())
        .then(data => {
            footer.innerHTML = data;
        });
};

const loadSidebar = () => {
    const sidebar = document.querySelector('#sidebar-component');

    fetch('/sidebar')
        .then(response => response.text())
        .then(data => {
            sidebar.innerHTML = data;
        })
        .then(async () => {
            const popper = await fetch('https://unpkg.com/@popperjs/core@2');
            const popperScript = document.createElement('script');
            popperScript.innerHTML = await popper.text();
            document.head.appendChild(popperScript);

        })
        .then(() => {
            const sidebarScript = document.createElement('script');
            sidebarScript.src = '../utils/sidebar.js';
            document.head.appendChild(sidebarScript);
        });
};

export { loadLoginForm, loadRegisterForm, loadFooter, loadSidebar };
