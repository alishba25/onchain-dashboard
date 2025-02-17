// src/App.js
import React, { useState } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js
import { format } from 'date-fns'; // Import date-fns for date formatting

const API_URL = "https://onchain-dashboard.onrender.com";  // Updated API URL

const App = () => {
    const [balanceInEth, setBalanceInEth] = useState(0);
    const [balanceInUSD, setBalanceInUSD] = useState(0);
    const [balanceInINR, setBalanceInINR] = useState(0);
    const [currency, setCurrency] = useState('USD');
    const [transactions, setTransactions] = useState([]);

    const fetchData = async () => {
        const addressInput = document.getElementById('walletAddress');
        if (!addressInput || !addressInput.value) {
            alert("Please enter a valid Ethereum wallet address.");
            return;
        }
        const address = addressInput.value;

        try {
            const response = await fetch(`${API_URL}/api/wallet/${address}`);  // Updated API call
            const data = await response.json();

            if (response.ok) {
                const balance = data.balance / 1e18; // Convert Wei to Ether
                setBalanceInEth(balance);
                await fetchConversionRates(balance);
                setTransactions(data.transactions || []); // Ensure transactions is always an array
                document.getElementById('walletBalance').style.display = 'block';

                // Call functions to render charts
                renderCandlestickChart(data.transactions || []);
                renderPieChart(data.transactions || []);
            } else {
                alert('Error fetching wallet data: ' + data.error);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch wallet data. Please try again later.");
        }
    };

    const fetchConversionRates = async (balance) => {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr');
            const data = await response.json();
            const ethToUSD = data?.ethereum?.usd || 0;
            const ethToINR = data?.ethereum?.inr || 0;

            setBalanceInUSD((balance * ethToUSD).toFixed(2));
            setBalanceInINR((balance * ethToINR).toFixed(2));
        } catch (error) {
            console.error('Error fetching conversion rates:', error);
        }
    };

    const renderCandlestickChart = (transactions) => {
        const ctx = document.getElementById('candlestickChart').getContext('2d');
        const labels = transactions.map(tx => new Date(tx.timeStamp * 1000).toLocaleDateString());
        const prices = transactions.map(tx => parseFloat(tx.value) / 1e18); // Convert Wei to Ether

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price Action',
                    data: prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    const renderPieChart = (transactions) => {
        const categories = {
            DEX: 0,
            Staking: 0,
            Mining: 0,
            Others: 0
        };

        transactions.forEach(tx => {
            // Dummy categorization logic
            if (tx.to === '0xYourDexAddress') {
                categories.DEX += parseFloat(tx.value) / 1e18;
            } else if (tx.to === '0xYourStakingAddress') {
                categories.Staking += parseFloat(tx.value) / 1e18;
            } else if (tx.to === '0xYourMiningAddress') {
                categories.Mining += parseFloat(tx.value) / 1e18;
            } else {
                categories.Others += parseFloat(tx.value) / 1e18;
            }
        });

        const ctx = document.getElementById('pieChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    return (
        <div className="container">
            <h1 className="text-center">Ethereum Wallet Dashboard</h1>
            <div className="form-group">
                <label htmlFor="walletAddress">Enter Ethereum Wallet Address:</label>
                <input type="text" id="walletAddress" className="form-control" placeholder="0x..." />
            </div>
            <button id="fetchData" className="btn btn-primary" onClick={fetchData}>
                Fetch Wallet Data
            </button>

            <div id="walletBalance" className="card" style={{ display: 'none', marginTop: '20px' }}>
                <div className="card-body">
                    <h5 className="card-title">Wallet Balance:</h5>
                    <p>
                        {currency === 'USD' ? `$${balanceInUSD}` : `₹${balanceInINR}`}
                    </p>
                    <select id="currency" className="form-control" onChange={(e) => setCurrency(e.target.value)} value={currency}>
                        <option value="USD">USD</option>
                        <option value="INR">INR</option>
                    </select>
                    <p style={{ marginTop: '10px' }}>Balance in Ether: {balanceInEth} ETH</p>
                </div>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '300px', marginTop: '20px' }}>
                <canvas id="candlestickChart" style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
            </div>
            <div style={{ position: 'relative', width: '100%', height: '200px', marginTop: '20px' }}>
                <canvas id="pieChart" style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-body">
                <h5 className="card-title">Transaction History</h5>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Transaction Hash</th>
                                <th>Amount (ETH)</th>
                                <th>To</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.hash}>
                                    <td>{tx.hash}</td>
                                    <td>{(parseFloat(tx.value) / 1e18).toFixed(4)}</td>
                                    <td>{tx.to}</td>
                                    <td>{format(new Date(tx.timeStamp * 1000), 'dd/MM/yyyy')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default App; // Ensure to export the App component