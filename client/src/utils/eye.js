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
