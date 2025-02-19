# Onchain Dashboard

## Overview
The Onchain Dashboard is a web application designed to provide real-time insights and visualizations for Ethereum wallet activities. It allows users to input an Ethereum wallet address and view detailed information such as wallet balance in multiple currencies (ETH, USD, and INR), transaction history, and graphical representations of price action and transaction categories. This project is split into a frontend built with React.js and a backend powered by Node.js and Express.js, utilizing external APIs like Etherscan for blockchain data and CoinGecko for currency conversion.

## Features
- Fetch and display Ethereum wallet balance in ETH, USD, and INR.
- Visualize transaction history in a table format with details like transaction hash, amount, recipient, and date.
- Render a line chart (candlestick-style) to show price action over time based on transactions.
- Display a pie chart to categorize transactions (e.g., DEX, Staking, Mining, Others).
- User-friendly interface with currency selection (USD/INR) for balance display.
- Secure and efficient API calls to external services for up-to-date blockchain and conversion data.

## Technologies Used
**Frontend:**
- React.js
- Chart.js for charting
- date-fns for date formatting
- Tailwind CSS for styling
- Flowbite for UI components

**Backend:**
- Node.js
- Express.js for API server
- axios for HTTP requests
- cors for cross-origin resource sharing

**APIs:**
- Etherscan API for Ethereum wallet data
- CoinGecko API for currency conversion rates

**Environment:**
- dotenv for managing environment variables

## Installation
To set up and run the Onchain Dashboard locally, follow these steps:

### Prerequisites
- Node.js (version 14.x or later)
- npm or yarn
- Git
- An Etherscan API key (sign up at [Etherscan.io](https://etherscan.io/) to get one)

### Cloning the Repository
```bash
git clone https://github.com/alishba25/onchain-dashboard.git
cd onchain-dashboard
```

### Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create a `.env` file in the backend directory and add your Etherscan API key:
```bash
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```
(Replace `your_etherscan_api_key_here` with the API key you obtained from Etherscan.)

Install backend dependencies:
```bash
npm install
# or
yarn install
```

Start the backend server:
```bash
node server.js
```
The backend will run on `http://localhost:5000` by default.

### Frontend Setup
Return to the root directory and navigate to the frontend directory:
```bash
cd ../frontend
```

Install frontend dependencies:
```bash
npm install
# or
yarn install
```

Update the API_URL in `src/App.js` to point to your local backend:
```javascript
const API_URL = "http://localhost:5000";
```

Start the frontend development server:
```bash
npm run dev
# or
yarn dev
```

Open your browser and go to `http://localhost:3000` to view the dashboard.

## Usage
1. Enter an Ethereum wallet address in the input field on the dashboard.
2. Click "Fetch Wallet Data" to retrieve and display the wallet's balance, transactions, and charts.
3. Use the currency dropdown to switch between USD and INR for balance display.
4. Explore the candlestick chart for price action and the pie chart for transaction category distribution.
5. Review the transaction history table for detailed transaction information.

## File Structure
### Frontend
- `src/App.js`: Main React component handling state, API calls, chart rendering, and UI rendering. Includes logic for fetching wallet data, converting currencies, and displaying charts and tables.

### Backend
- `backend/server.js`: Express.js server that handles API requests. Fetches wallet balance and transaction history from Etherscan API and returns data to the frontend.
- `.env`: Environment file storing the Etherscan API key.

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes and commit them with clear messages.
4. Push to your fork and submit a pull request.

Please ensure your code adheres to the existing style and includes tests if applicable.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For questions or suggestions, contact:
- **Email:** alishba25ansari@gmail.com
- **Twitter:** [@___alishba___](https://twitter.com/___alishba___)

## Acknowledgments
- Thanks to Etherscan and CoinGecko for their APIs that power this dashboard.
- Credit to Chart.js, React, and other open-source libraries for enabling robust visualization and development.

