// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import { ethers } from 'ethers';
// import vaultAbi from './contracts/deposit.json';
// import { useNavigate } from "react-router-dom";

// declare var window: any;

// export default function DepositForm() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     traderId: '',
//     token: 'PYUSD',
//     amount: '',
//   }); 
//   const [loading, setLoading] = useState(false);
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [walletAddress, setWalletAddress] = useState<string | null>(null);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   // ===== MetaMask Connect =====
//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       alert('Please install MetaMask!');
//       return;
//     }

//     try {
//       const accounts = await window.ethereum.request({
//         method: 'eth_requestAccounts',
//       });
//       const address = accounts[0];
//       setWalletAddress(address);
//       setWalletConnected(true);
//       setFormData(prev => ({ ...prev, traderId: address }));
//       console.log('🦊 Connected wallet:', address);
//     } catch (err) {
//       console.error('❌ Wallet connection failed:', err);
//       setError('Failed to connect wallet');
//     }
//   };

//   // ===== Account Check =====
//   const checkWallet = async () => {
//     if (!walletAddress){
//       alert("Please connect wallet first!");
//       return false;
//     }
//     try {
//       const response = await axios.post('http://localhost:4000/account/check', {
//         address: walletAddress,
//         token: formData.token,
//       });
//       if (!response.data.exists){
//         alert("New account created, please verify KYC before actions");
//         return false;
//       } else {
//         console.log("Account exists, continue using");
//         return true;
//       }
//     } catch (err){
//       console.error("Verification failed", err);
//       setError("Backend failed");
//       return false;
//     }
//   };

//   // ===== Handle Deposit =====
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!walletConnected) {
//       setError('Please connect your MetaMask wallet first!');
//       return;
//     }
//     const accountExists = await checkWallet();
//     if (!accountExists){
//       setError("Please verify your account before trading");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setResult(null);

//     try {
//       const vaultAddress = process.env.REACT_APP_VAULT_ADDRESS!;
//       const pyusd = process.env.REACT_APP_PYUSD_ADDRESS!;
//       const usdt = process.env.REACT_APP_USDT_ADDRESS!;
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(vaultAddress, vaultAbi, signer);
//       const token = formData.token;
//       const tokenAddress = token === "PYUSD" ? pyusd : usdt;
//       const erc20Abi = ["function approve(address spender, uint256 amount) public returns(bool)"];
//       const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

//       const amount = ethers.parseUnits(formData.amount, token === 'ETH' ? 18 : 6);
//       const approveTx = token !== 'ETH' ? await tokenContract.approve(vaultAddress, amount) : null;
//       if (approveTx) await approveTx.wait();

//       let tx;
//       if (token === "ETH"){
//         tx = await contract.depositEth({ value: ethers.parseUnits(formData.amount, 18) });
//       } else {
//         tx = await contract.depositErc(tokenAddress, amount);
//       }
//       await tx.wait();

//       setResult({
//         txHash: tx.hash,
//         message: 'Deposit confirmed on-chain',
//       });
//       setFormData({ traderId: walletAddress || '', token: 'PYUSD', amount: '' });
//     } catch (err: any) {
//       console.error('❌ Deposit failed:', err);
//       setError(err.reason || err.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===== Handle Form Change =====
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ===== UI =====
//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6">Deposit Funds</h2>

//       {!walletConnected ? (
//         <button
//           onClick={connectWallet}
//           className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
//         >
//           Connect MetaMask
//         </button>
//       ) : (
//         <div className="mb-4 p-3 border border-green-200 bg-green-50 rounded-lg text-sm text-green-800">
//           ✅ Connected: <span className="font-mono">{walletAddress}</span>
//         </div>
//       )}

//       {walletConnected && (
//         <div className="mb-4 p-3 border border-gray-200 bg-gray-50 rounded-lg text-sm">
//           💰 <strong>{formData.token}</strong> Balance: from redis
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Token */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Token</label>
//           <select
//             name="token"
//             value={formData.token}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="PYUSD">PYUSD</option>
//             <option value="USDT">USDT</option>
//             <option value="ETH">ETH</option>
//           </select>
//         </div>

//         {/* Amount */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Amount</label>
//           <input
//             type="number"
//             name="amount"
//             value={formData.amount}
//             onChange={handleChange}
//             placeholder="0.00"
//             step="0.0001"
//             min="0"
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading || !walletConnected}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           {loading ? 'Processing...' : 'Deposit'}
//         </button>
//       </form>

//       {/* Go to Order Page Button */}
//       <div className="mt-6">
//         <button
//           onClick={() => navigate("/order")}
//           className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
//         >
//           🧾 Go to Order Page
//         </button>
//       </div>

//       {/* Success */}
//       {result && (
//         <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//           <h3 className="font-semibold text-green-800 mb-2">✅ Deposit Successful!</h3>
//           <p className="text-sm text-green-700">Transaction: {result.txHash}</p>
//           <p className="text-xs text-gray-600 mt-1">{result.message}</p>
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <h3 className="font-semibold text-red-800 mb-2">❌ Error</h3>
//           <p className="text-sm text-red-700">{error}</p>
//         </div>
//       )}
//     </div>
//   );
// }
