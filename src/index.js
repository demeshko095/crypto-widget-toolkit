require('dotenv').config();
const axios = require('axios');
const _ = require('lodash');
const Big = require('big.js');
const moment = require('moment');

// Placeholder for the real API URL and key
const API_URL = 'https://api.crypto.com/v1/prices';
const API_KEY = process.env.API_KEY; // Assume this is defined in your .env file

class CryptoWidgetToolkit {
  constructor(containerId, options) {
    this.containerId = containerId;
    this.options = _.defaultsDeep({}, options, {
      refreshInterval: 60000, // Default: 60 seconds
      currencies: ['BTC', 'ETH'], // Default currencies
    });
    this.init();
  }

  async init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error('Container not found');
      return;
    }

    this.updateData();
    setInterval(() => this.updateData(), this.options.refreshInterval);
  }

  async fetchPrices() {
    try {
      const response = await axios.get(API_URL, {
        headers: { 'X-API-KEY': API_KEY },
        params: { symbols: this.options.currencies.join(',') },
      });
      return response.data.prices;
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      return null;
    }
  }

  async updateData() {
    const prices = await this.fetchPrices();
    if (!prices) return;

    this.container.innerHTML = ''; // Clear previous content
    prices.forEach(priceInfo => {
      const price = new Big(priceInfo.price).toFixed(2);
      const updatedTime = moment(priceInfo.timestamp).format('LLL');
      this.container.innerHTML += `<div>${priceInfo.symbol}: $${price} (Updated: ${updatedTime})</div>`;
    });
  }
}

// Exporting the class for usage
module.exports = CryptoWidgetToolkit;
