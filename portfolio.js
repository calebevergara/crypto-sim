// portfolio.js (continued)
import CryptoPortfolio from './portfolio.js';

document.addEventListener("DOMContentLoaded", async () => {
    const portfolioDataContainer = document.getElementById('portfolioData');
    const portfolio = new CryptoPortfolio();

    await portfolio.initialize();

    const fetchCryptoData = async (ids) => {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    ids: ids.join(','),
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            return [];
        }
    };

    const createPortfolioElement = (crypto, portfolioItem) => {
        const container = document.createElement('div');
        container.classList.add('crypto');

        const title = document.createElement('h3');
        title.textContent = `${crypto.name} (${crypto.symbol.toUpperCase()})`;
        container.appendChild(title);

        const amount = document.createElement('p');
        amount.textContent = `Amount: ${portfolioItem.quantity}`;
        container.appendChild(amount);

        const value = document.createElement('p');
        value.textContent = `Value: $${(crypto.current_price * portfolioItem.quantity).toLocaleString()}`;
        container.appendChild(value);

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        // Create the chart
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: Array(crypto.sparkline_in_7d.price.length).fill(''),
                datasets: [{
                    label: `${crypto.name} Price`,
                    data: crypto.sparkline_in_7d.price,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: false // Hide x-axis labels
                    }
                }
            }
        });

        return container;
    };

    const renderPortfolioData = async () => {
        const ids = Object.keys(portfolio.holdings);
        const data = await fetchCryptoData(ids);
        portfolioDataContainer.innerHTML = ''; // Clear existing data
        if (data.length === 0) {
            portfolioDataContainer.textContent = 'No data available';
            return;
        }
        data.forEach(crypto => {
            const portfolioItem = portfolio.holdings[crypto.id];
            const portfolioElement = createPortfolioElement(crypto, portfolioItem);
            portfolioDataContainer.appendChild(portfolioElement);
        });
    };

    renderPortfolioData();

    // Periodically update portfolio prices and re-render
    setInterval(async () => {
        await portfolio.updatePrices();
        renderPortfolioData();
    }, 3600000); // Update every hour
});
