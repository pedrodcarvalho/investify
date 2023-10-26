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

    dashboard.style.justifyContent = 'space-between';
};

const loadVideo = (videoId, iFrame) => {
    iFrame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&disablekb=1&loop=1&rel=0`;
};

const setControlsWidth = () => {
    const controls = document.querySelector('.controls');
    controls.style.display = 'flex';

    const frameWidth = document.querySelector('.video-container').offsetWidth - 30;
    controls.style.width = frameWidth + 'px';

    window.addEventListener('resize', () => {
        const frameWidth = document.querySelector('.video-container').offsetWidth - 30;
        controls.style.width = frameWidth + 'px';
    });
};

const loadLiveNews = async () => {
    setControlsWidth();

    await fetch('/dashboard/live-news').then((response) => response.json()).then((data) => {
        data = data.slice(0, 3);

        let videoIndex = 0;

        const iFrame = document.querySelector('#live-news');
        const iFrameNextVideoBtn = document.querySelector('.next-video');
        const iFramePrevVideoBtn = document.querySelector('.previous-video');

        loadVideo(data[videoIndex].id, iFrame);

        const iFrameSpinner = document.querySelector('.iframe-spinner');
        iFrameSpinner.style.display = 'none';

        iFrameNextVideoBtn.addEventListener('click', () => {
            videoIndex = videoIndex === data.length - 1 ? 0 : videoIndex + 1;
            loadVideo(data[videoIndex].id, iFrame);
        });

        iFramePrevVideoBtn.addEventListener('click', () => {
            videoIndex = videoIndex === 0 ? data.length - 1 : videoIndex - 1;
            loadVideo(data[videoIndex].id, iFrame);
        });
    });
};

const drawChart = (ctx, labels, prices, accentColor, chartOptions) => {
    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Balance',
                data: prices,
                backgroundColor: [`${accentColor}44`],
                borderColor: [`${accentColor}`],
                borderWidth: 1,
                pointStyle: false,
                fill: true
            }]
        },
        options: {
            chartOptions
        }
    });
}

const loadBalanceHistory = async () => {
    const data = await fetch('/dashboard/balance-history').then((response) => response.json()).then((data) => data);

    const labels = data.map((balance) => {
        const date = new Date(balance.date);
        return date.toLocaleDateString(navigator.language, { month: 'short', day: 'numeric' });
    });
    const prices = data.map((balance) => balance.balance);

    const ctx = document.getElementById('balance-history-chart');
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accentColor');

    const chartOptions = {
        animation: {
            delay: (context) => {
                let delay = 0;
                if (context.type === 'chart' && context.mode === 'default') {
                    delay = context.dataIndex * 2 + context.datasetIndex * 100;
                }
                return delay;
            }
        }
    };

    drawChart(ctx, labels, prices, accentColor, chartOptions);
};

const loadWalletSummary = async () => {
    await fetch('/dashboard/wallet-summary').then((response) => response.text()).then((data) => {
        const walletSummary = document.getElementById('wallet-summary');
        walletSummary.innerHTML = data;
    });
};

loadWalletSummary();
loadFinanceApplets();
loadBalanceHistory();
// loadLiveNews();
