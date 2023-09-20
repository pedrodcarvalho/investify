const passwordEye = async () => {
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

const loadLoginForm = async () => {
    const loginForm = document.querySelector('#login-form-component');

    await fetch('../components/LoginForm.html')
        .then(response => response.text())
        .then(data => {
            loginForm.innerHTML = data;
        }).then(() => {
            passwordEye();
        });
};

const loadRegisterForm = async () => {
    const registerForm = document.querySelector('#register-form-component');

    await fetch('../components/RegisterForm.html')
        .then(response => response.text())
        .then(data => {
            registerForm.innerHTML = data;
        }).then(() => {
            passwordEye();
        });
};

const loadFooter = async () => {
    const footer = document.querySelector('#footer-component');

    await fetch('../components/Footer.html')
        .then(response => response.text())
        .then(data => {
            footer.innerHTML = data;
        });
};

const loadSidebar = async () => {
    const sidebar = document.querySelector('#sidebar-component');

    await fetch('/sidebar')
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
