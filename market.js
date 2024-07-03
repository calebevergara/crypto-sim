// market.js

const apiUrl = 'https://api.coingecko.com/api/v3/';
const apiKey = 'CG-FHStL9Tr4ek74ww5h88Brrwm'; // Replace with your actual API key

const fetchMarketData = async () => {
    try {
        const response = await axios.get(`${apiUrl}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h',
                key: apiKey,
            }
        });

        const marketData = response.data;
        displayMarketData(marketData);
    } catch (error) {
        console.error('Error fetching market data:', error);
    }
};

const displayMarketData = (marketData) => {
    const marketDataContainer = document.getElementById('marketData');
    marketDataContainer.innerHTML = ''; // Clear previous data

    marketData.forEach(crypto => {
        const cryptoElement = document.createElement('div');
        cryptoElement.classList.add('crypto');

        cryptoElement.innerHTML = `
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>Price: $${crypto.current_price.toFixed(2)}</p>
            <p>Change (24h): ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
        `;

        marketDataContainer.appendChild(cryptoElement);
    });
};

// Fetch market data when the page loads
window.addEventListener('load', fetchMarketData);
