// backend/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/wallet/:address', async (req, res) => {
    const address = req.params.address;
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

    try {
        // Fetch wallet balance
        const balanceResponse = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`);
        const balance = balanceResponse.data.result;

        // Fetch transaction history
        const txResponse = await axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${etherscanApiKey}`);
        const transactions = txResponse.data.result;

        res.json({ balance, transactions });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching wallet data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});