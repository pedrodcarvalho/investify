const toastMessage = () => {
    const toast = document.querySelector('.toast');
    const closeIcon = document.querySelector('.close');
    const progress = document.querySelector('.progress');

    const toastText = document.querySelector('.text-2').textContent;

    let timer1, timer2;

    if (toastText) {
        toast.style.display = 'flex';

        setTimeout(() => {
            toast.classList.add('active');
            progress.classList.add('active');

            timer1 = setTimeout(() => {
                toast.classList.remove('active');
            }, 5000);

            timer2 = setTimeout(() => {
                progress.classList.remove('active');
            }, 5300);
        }, 500);
    }

    closeIcon.addEventListener('click', () => {
        toast.style.display = 'none';

        toast.classList.remove('active');

        setTimeout(() => {
            progress.classList.remove('active');
        }, 300);

        clearTimeout(timer1);
        clearTimeout(timer2);
    });
};

toastMessage();

export { toastMessage };
