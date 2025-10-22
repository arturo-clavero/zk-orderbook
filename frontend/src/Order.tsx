'use client';

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

declare var window: any;

export default function OrderForm() {
  const navigate = useNavigate();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // ===== Form data =====
  const [formData, setFormData] = useState({
    traderId: '',
    side: 'buy', // buy or sell
    baseCurrency: 'ETH', // what user wants to trade
    quoteCurrency: 'USDT', // what it's priced in
    amount: '',
    price: '',
  });

  // ===== Connect Wallet =====
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);
      setWalletConnected(true);
      setFormData(prev => ({ ...prev, traderId: address }));
      console.log('🦊 Connected wallet:', address);
    } catch (err) {
      console.error('❌ Wallet connection failed:', err);
      setError('Failed to connect wallet');
    }
  };

  // ===== Check Wallet =====
  const checkWallet = async () => {
    if (!walletAddress) {
      alert('Please connect wallet first!');
      return false;
    }
    try {
      const response = await axios.post('http://localhost:4000/account/check', {
        address: walletAddress,
        token: formData.quoteCurrency,
      });
      if (!response.data.exists) {
        alert('New account created, please verify KYC before actions');
        return false;
      }
      console.log('Account exists, continue using');
      return true;
    } catch (err) {
      console.error('Verification failed', err);
      setError('Backend failed');
      return false;
    }
  };

  // ===== Handle Submit =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) {
      setError('Please connect your wallet first!');
      return;
    }

    const accountExists = await checkWallet();
    if (!accountExists) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Map side → sell_currency / buy_currency
      let sell_currency = '';
      let buy_currency = '';
      const side = formData.side;
      if (side === 'buy') {
        // e.g. "Buy ETH with USDT"
        sell_currency = formData.quoteCurrency;
        buy_currency = formData.baseCurrency;
      } else {
        // e.g. "Sell ETH for USDT"
        sell_currency = formData.baseCurrency;
        buy_currency = formData.quoteCurrency;
      }

      const payload = {
        side,
        walletAddress,
        buy_currency,
        sell_currency,
        amount: parseFloat(formData.amount),
        price: parseFloat(formData.price),
      };

      const response = await axios.post('http://localhost:4000/order/create', payload);

      console.log('✅ Order created:', response.data);
      setResult(response.data);
      setFormData(prev => ({ ...prev, amount: '', price: '' }));
    } catch (err: any) {
      console.error('❌ Order creation failed:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ===== Handle Input Change =====
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===== UI =====
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Order</h2>

      {!walletConnected ? (
        <button
          onClick={connectWallet}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
        >
          Connect MetaMask
        </button>
      ) : (
        <div className="mb-4 p-3 border border-green-200 bg-green-50 rounded-lg text-sm text-green-800">
          ✅ Connected: <span className="font-mono">{walletAddress}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Side */}
        <div>
          <label className="block text-sm font-medium mb-2">Side</label>
          <select
            name="side"
            value={formData.side}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg ${
              formData.side === 'buy' ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        {/* Base Currency (token user trades) */}
        <div>
          <label className="block text-sm font-medium mb-2">Token</label>
          <select
            name="baseCurrency"
            value={formData.baseCurrency}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="ETH">ETH</option>
            <option value="PYUSD">PYUSD</option>
            <option value="USDT">USDT</option>
          </select>
        </div>

        {/* Quote Currency (always USDT in this example) */}
        <div>
          <label className="block text-sm font-medium mb-2">Pair With</label>
          <select
            name="quoteCurrency"
            value={formData.quoteCurrency}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="USDT">USDT</option>
            <option value="PYUSD">PYUSD</option>
            <option value="ETH">ETH</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount to trade"
            step="0.0001"
            min="0"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Price per unit</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            step="0.0001"
            min="0"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !walletConnected}
          className={`w-full ${
            formData.side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          } text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {loading ? 'Submitting...' : `${formData.side === 'buy' ? 'Buy' : 'Sell'}`}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ Order Created!</h3>
          <p className="text-sm text-green-700">Order ID: {result.orderId || 'N/A'}</p>
          <p className="text-xs text-gray-600 mt-1">Status: {result.status || 'Pending match'}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">❌ Error</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 text-sm underline"
        >
          ← Back to Deposit
        </button>
      </div>
    </div>
  );
}
