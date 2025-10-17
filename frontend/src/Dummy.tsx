'use client';

import { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import  vaultAbi  from './contracts/deposit.json';

declare var window: any

export default function DepositForm() {
  const [formData, setFormData] = useState({
    traderId: '',
    token: 'PYUSD',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
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

  // Handle Deposit Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletConnected) {
      setError('Please connect your MetaMask wallet first!');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      //ADDRESSES for the token contracts are in .env
      const address = process.env.REACT_APP_VAULT_ADDRESS!;
      const pyusd = process.env.REACT_APP_PYUSD_ADDRESS!;
      const usdt = process.env.REACT_APP_USDT_ADDRESS!;
      console.log("the address is ", address);
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(address, vaultAbi, signer);
      const token = formData.token;
      const tokenAddress = token === "PYUSD" ? pyusd : usdt;
      const erc20Abi = [
        "function approve(address spender, uint256 amount) public returns(bool)"
      ];
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

      const amount = ethers.parseUnits(formData.amount, 18);
      const approveTx = await tokenContract.approve(address, amount);
      await approveTx.wait();
      let tx;

      if (token === "ETH"){
        console.log("tx is ", tx);
        tx = await contract.depositEth({value: ethers.parseUnits(formData.amount, 18)});
      }
      else if (token === "PYUSD") {
        tx = await contract.depositErc(pyusd, ethers.parseUnits(formData.amount, 18));
        console.log("tx is ", tx);
      } else if (token === "USDT") {
        tx = await contract.depositErc(usdt, ethers.parseUnits(formData.amount, 6));
        console.log("tx is ", tx);
      }
      if (!tx) throw new Error("transaction was not created");
      await tx.wait();

      setResult(`if deposit successful you will see the hash: ${tx.hash}`, );
      setFormData({ traderId: walletAddress || '', token: 'PYUSD', amount: '' });
    }catch (err: any) {
      console.error('❌ Deposit failed:', err);
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Deposit Funds</h2>

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
        {/* Token */}
        <div>
          <label className="block text-sm font-medium mb-2">Token</label>
          <select
            name="token"
            value={formData.token}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="PYUSD">PYUSD</option>
            <option value="USDT">USDT</option>
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
            placeholder="0.00"
            step="0.0001"
            min="0"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !walletConnected}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Deposit'}
        </button>
      </form>

      {/*  Success */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ Deposit Successful!</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Deposit ID:</strong> {result.depositId}</p>
            <p><strong>Transaction Hash:</strong> {result.txHash}</p>
            <p><strong>Status:</strong> {result.status}</p>
            <p className="text-xs mt-2 text-gray-600">{result.message}</p>
          </div>
        </div>
      )}

      {/*  Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">❌ Error</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
