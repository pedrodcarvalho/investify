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

loadFinanceApplets();
