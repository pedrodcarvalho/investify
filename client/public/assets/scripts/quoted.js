import { loadSidebar, loadFooter } from '../../../utils/loadComponents.js';

await loadSidebar();
await loadFooter();

const setRangeBtns = async () => {
    const rangesBtns = document.getElementById('ranges');
    const ranges = ['1D', '5D', '1MO', '6MO', 'YTD', '1Y', '5Y', 'Max'];

    ranges.map((range, i) => {
        rangesBtns.innerHTML += `
        <div class="mdc-form-field">
          <div class="mdc-radio">
            <input class="mdc-radio__native-control" type="radio" id="radio-${i}" name="radios" value="${range}" ${i === 0 ? 'checked' : ''}>
              <div class="mdc-radio__background">
                <div class="mdc-radio__outer-circle"></div>
                <div class="mdc-radio__inner-circle"></div>
              </div>
            <div class="mdc-radio__ripple"></div>
          </div>
          <label for="radio-${i}">${range}</label>
        </div>
        `;
    });

    const MDCRadio = mdc.radio.MDCRadio;
    const radios = document.querySelectorAll('.mdc-radio');

    (new Array(...radios)).map((radio) => {
        new MDCRadio(radio);

        radio.addEventListener('click', () => {
            const existingChart = Chart.getChart('quote-chart');

            if (existingChart) {
                existingChart.destroy();
            }

            quoteChart();
        });
    });
}

await setRangeBtns();

const getLabels = (timestamp, range) => {
    if (range === '1d' || range === '5d') {
        return timestamp.map((timestamp) => {
            const date = new Date(timestamp * 1000);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });
    }
    else if (range === '1mo' || range === '6mo' || range === 'ytd') {
        return timestamp.map((timestamp) => {
            const date = new Date(timestamp * 1000);
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        });
    }
    else if (range === '1y' || range === '5y' || range === 'max') {
        return timestamp.map((timestamp) => {
            const date = new Date(timestamp * 1000);
            return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
        });
    }
};

const getPrices = (prices) => {
    return prices.map((price) => {
        return price.toFixed(2);
    });
};

const drawChart = (ctx, labels, prices, accentColor, chartOptions) => {
    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
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

const quoteChart = async () => {
    try {
        const ctx = document.getElementById('quote-chart');
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accentColor');

        const ticker = window.location.search;
        const range = document.querySelector('input[name="radios"]:checked').value.toLowerCase();

        let interval = '';
        switch (range) {
            case '1d':
                interval = '2m';
                break;
            case '5d':
                interval = '15m';
                break;
            case '1mo':
                interval = '30m';
                break;
            case '6mo':
                interval = '1d';
                break;
            case 'ytd':
                interval = '1d';
                break;
            case '1y':
                interval = '1d';
                break;
            case '5y':
                interval = '1wk';
                break;
            case 'max':
                interval = '1mo';
        }

        fetch(`/quoted/chart${ticker}&range=${range}&interval=${interval}`).then((res) => res.json()).then(async (chart) => {
            if (chart.indicators.length === 0) {
                const rangesBtns = document.getElementById('ranges');
                rangesBtns.innerHTML = '';

                return;
            }

            const labels = await getLabels(chart.timestamp, range);
            const prices = await getPrices(chart.indicators);

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
        });
    }
    catch (err) {
        console.log(err);
    }
};

await quoteChart();
