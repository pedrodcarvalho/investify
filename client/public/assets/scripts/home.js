import { loadSidebar, loadFooter } from '../../../utils/loadComponents.js';

await loadSidebar();
await loadFooter();

const loadFinanceApplets = async () => {
    const financeCategories = ['all_cryptocurrencies_us', 'most_actives', 'day_gainers', 'day_losers', 'top_mutual_funds', 'top_etfs_us'];
    const financeApplets = await Promise.all(financeCategories.map(async (category) => {
        return await fetch(`/dashboard/applets?category=${category}`).then((response) => response.text());
    }));

    const dashboard = document.querySelector('.dashboard');

    financeApplets.map((applet, i) => {
        if (i === 0) {
            dashboard.innerHTML = '';
            dashboard.style.justifyContent = 'start';
            dashboard.style.marginTop = '0';
            dashboard.style.marginLeft = '20px';
        }

        dashboard.innerHTML += applet;
    });
};

const loadLiveNews = async () => {
    await fetch('/dashboard/live-news').then((response) => response.json()).then((data) => {
        const iFrame = document.querySelector('#live-news');
        iFrame.src = `https://www.youtube-nocookie.com/embed/${data[1].id}?autoplay=1&mute=1&disablekb=1&loop=1&rel=0`;

        iFrame.addEventListener('load', () => {
            const iFrameSpinner = document.querySelector('.iframe-spinner');
            iFrameSpinner.style.display = 'none';
        });
    });
};

loadFinanceApplets();
loadLiveNews();
