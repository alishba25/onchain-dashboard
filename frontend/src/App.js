// src/App.js
import React, { useState } from 'react';

const API_URL = "https://onchain-dashboard.onrender.com";  // ✅ Updated API URL

const App = () => {
    const [balanceInEth, setBalanceInEth] = useState(0);
    const [balanceInUSD, setBalanceInUSD] = useState(0);
    const [balanceInINR, setBalanceInINR] = useState(0);
    const [currency, setCurrency] = useState('USD');
    const [, setTransactions] = useState([]);

    const fetchData = async () => {
        const addressInput = document.getElementById('walletAddress');
        if (!addressInput || !addressInput.value) {
            alert("Please enter a valid Ethereum wallet address.");
            return;
        }
        const address = addressInput.value;

        try {
            const response = await fetch(`${API_URL}/api/wallet/${address}`);  // ✅ Updated API call
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
        console.log("Rendering candlestick chart...", transactions);
        // Chart rendering logic will go here
    };

    const renderPieChart = (transactions) => {
        console.log("Rendering pie chart...", transactions);
        // Chart rendering logic will go here
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
        </div>
    );
};

export default App; // Ensure to export the App component
