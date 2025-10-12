'use client';

import { useState } from 'react';
import axios from 'axios';

export default function DepositForm() {
  const [formData, setFormData] = useState({
    traderId: '',
    token: 'USDC',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:4000/deposit', formData);
      
      console.log('✅ Deposit successful:', response.data);
      setResult(response.data);
      
      // Reset form
      setFormData({ traderId: '', token: 'USDC', amount: '' });
      
    } catch (err: any) {
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User ID */}
        <div>
          <label className="block text-sm font-medium mb-2">
            User ID
          </label>
          <input
            type="text"
            name="traderId"
            value={formData.traderId}
            onChange={handleChange}
            placeholder="Enter user ID"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Token */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Token
          </label>
          <select
            name="token"
            value={formData.token}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
            <option value="ETH">ETH</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Deposit'}
        </button>
      </form>

      {/* Success Message */}
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

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">❌ Error</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}







































// import React, { useState } from "react";
// import axios from "axios";


// export default function Dummy() {

//   const [value, setValue] = useState({traderId: "", token: "", ammount: ""});

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/api/deposit", value);
//       console.log("this value will go to the backend", res.data);
//     } catch(err) {
//       console.error("Error occured: ", err);
//     }
// } 
  

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         placeholder="User ID"
//         value={value.traderId}
//         onChange={(e) => setValue({ ...value, traderId: e.target.value })}
//       />
//       <input
//         placeholder="Token"
//         value={value.token}
//         onChange={(e) => setValue({ ...value, token: e.target.value })}
//       />
//       <input
//         placeholder="Ammount"
//         value={value.ammount}
//         onChange={(e) => setValue({ ...value, ammount: e.target.value })}
//       />
//       <button type="submit">Deposit</button>
//     </form>
//   );
// };

// // export default Dummy;
