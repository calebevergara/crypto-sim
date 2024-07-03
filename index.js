// Constants
const apiUrl = 'https://api.coingecko.com/api/v3';
const coinsEndpoint = '/coins/markets';
const params = {
    vs_currency: 'usd', // Change currency if needed
    ids: 'bitcoin,ethereum,ripple', // IDs of cryptocurrencies to fetch
    order: 'market_cap_desc',
    per_page: 3,
    page: 1,
    sparkline: false,
    price_change_percentage: '1h,24h,7d'
};

// Fetch data from CoinGecko API
async function fetchData() {
    try {
        const response = await fetch(`${apiUrl}${coinsEndpoint}?${new URLSearchParams(params)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Update HTML with fetched data
async function updateMarketData() {
    const marketDataElement = document.getElementById('marketData');
    const data = await fetchData();
    if (!data) return;

    marketDataElement.innerHTML = ''; // Clear previous data

    data.forEach(coin => {
        const { name, current_price, price_change_percentage_24h } = coin;
        const cryptoHtml = `
            <div class="crypto">
                <h3>${name}</h3>
                <p>Price: $${current_price.toFixed(2)}</p>
                <p>Change (24h): ${price_change_percentage_24h.toFixed(2)}%</p>
            </div>
        `;
        marketDataElement.insertAdjacentHTML('beforeend', cryptoHtml);
    });
}

// Call function to update market data on page load
document.addEventListener('DOMContentLoaded', () => {
    updateMarketData();
    // Optionally, update every minute or as needed
    setInterval(updateMarketData, 60000); // Update every 1 minute (60000 milliseconds)
});
