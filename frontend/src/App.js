// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './App.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = "http://localhost:5000/api/wallet";

function App() {
  const [address, setAddress] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWalletData = async (e) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    setError(null);
    setWalletData(null);

    try {
      const response = await axios.get(`${API_URL}/${address}`);
      setWalletData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Chart Data Configuration
  const chartData = {
    labels: ['Balance (ETH)', 'Transaction Fees (Est)', 'Other Assets'],
    datasets: [
      {
        label: 'Portfolio Distribution',
        data: walletData ? [parseFloat(walletData.balance), parseFloat(walletData.balance) * 0.05, 0] : [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Onchain Dashboard</h1>
        <p className="subtitle">Visualize Ethereum Wallet Data</p>
      </header>

      <main className="dashboard-container">
        <form onSubmit={fetchWalletData} className="search-form">
          <input
            type="text"
            placeholder="Enter Ethereum Address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="address-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Scanning...' : 'Analyze Wallet'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {walletData && (
          <div className="results-grid">
            <div className="card overview-card">
              <h3>Overview</h3>
              <div className="stat-item">
                <span className="label">Network</span>
                <span className="value">{walletData.network}</span>
              </div>
              <div className="stat-item">
                <span className="label">Transactions</span>
                <span className="value">{walletData.transactionCount}</span>
              </div>
              <div className="stat-item highlight">
                <span className="label">Balance</span>
                <span className="value">{parseFloat(walletData.balance).toFixed(4)} ETH</span>
              </div>
            </div>

            <div className="card chart-card">
              <h3>Asset Allocation</h3>
              <div className="chart-container">
                <Doughnut data={chartData} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
