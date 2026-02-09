// backend/server.js
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers'); // Ensure ethers is installed: npm install ethers
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Provider (Connects to Ethereum Mainnet)
// It will use keys from your .env file automatically if named correctly (e.g., ETHERSCAN_API_KEY)
const provider = ethers.getDefaultProvider("mainnet", {
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
    alchemy: process.env.ALCHEMY_API_KEY,
});

// Route: Get Wallet Details
app.get('/api/wallet/:address', async (req, res) => {
    const { address } = req.params;

    try {
        // 1. Validate Address
        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: "Invalid Ethereum address format." });
        }

        // 2. Fetch Data in Parallel for Speed
        const [balanceBigInt, txCount, network] = await Promise.all([
            provider.getBalance(address),
            provider.getTransactionCount(address),
            provider.getNetwork()
        ]);

        // 3. Format Data
        const balanceEth = ethers.formatEther(balanceBigInt);

        res.json({
            success: true,
            data: {
                address,
                balance: balanceEth,
                transactionCount: txCount,
                network: network.name,
                currency: "ETH"
            }
        });

    } catch (error) {
        console.error("Error fetching wallet data:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch on-chain data. Please check the address or try again later." 
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
