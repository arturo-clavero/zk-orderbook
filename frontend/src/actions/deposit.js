import { ethers } from "ethers";
import axios from "axios";
import vaultAbi from "../contracts/deposit.json";
import { useMyContext } from "../UI/components/utils/context";


export default function useDeposit() {
  const { dwStatus, setDwStatus } = useMyContext();

  const deposit = async (type, amount, token, user) => {
    if (dwStatus !== "OPEN") return;
    console.log("Starting deposit flow...");

    try {
      setDwStatus("LOADING");

      // === CONNECT WALLET ===
      if (!window.ethereum) throw new Error("Please install MetaMask");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      console.log("🦊 Connected wallet:", walletAddress);

      // === BACKEND ACCOUNT CHECK ===
      setDwStatus("VERIFY_ACCOUNT");
      const checkRes = await axios.post("http://localhost:4000/account/check", {
        address: walletAddress,
        token,
      });

      if (!checkRes.data.exists) {
        throw new Error("Account not verified — please complete KYC before deposit.");
      }

      // === PROOF GENERATION (simulated for now) ===
      setDwStatus("PROOF_GEN");
      await new Promise((res) => setTimeout(res, 1200));

      // === SIGN TRANSACTION ===
      setDwStatus("SIGN");

      // Simulate short delay before prompting user in MetaMask
      setTimeout(() => {
        setDwStatus((prev) => (prev === "SIGN" ? "OPEN_METAMASK" : prev));
      }, 1000);

      // === CALL SMART CONTRACT ===
      const vaultAddress = import.meta.env.VITE_VAULT_ADDRESS;
      const pyusd = import.meta.env.VITE_PYUSD_ADDRESS;
      const usdt = import.meta.env.VITE_USDT_ADDRESS;
      const eth = import.meta.env.VITE_ETH_ADDRESS;
      const contract = new ethers.Contract(vaultAddress, vaultAbi, signer);
      const tokenAddress = token === "PYUSD" ? pyusd : token === "USDT" ? usdt : token === "ETH" ? eth : undefined;
      
      const erc20Abi = ["function approve(address spender, uint256 amount) public returns(bool)"];
      let tx;
      console.log("on calling smart");
      console.log("token", token);
      console.log("tokenAdd", tokenAddress);
      if (token === "ETH") {
        const value = ethers.parseUnits(amount, 18);
        tx = await contract.depositEth({ value });
      } else {
        const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
        console.log("on calling smart");
        const decimals = token === "PYUSD" ? 6 : 6; // adjust decimals per token
        const value = ethers.parseUnits(amount, decimals);

        const approveTx = await tokenContract.approve(vaultAddress, value);
        await approveTx.wait();

        tx = await contract.depositErc(tokenAddress, value);
        console.log("what is tx", tx);
      }

      setDwStatus("VERIFY_TX");
      await tx.wait();

      // ===SUCCESS ===
      console.log("✅ Deposit confirmed:", tx.hash);
      setDwStatus("SUCCESS");


      // Reset after a moment
      setTimeout(() => setDwStatus("OPEN"), 3000);
    } catch (err) {
      console.error("❌ Deposit error:", err);
      setDwStatus("ERROR");
      setTimeout(() => setDwStatus("OPEN"), 3000);
    }
  };

  return deposit;
}










// import { Wallet } from "ethers";
// import axios from "axios";
// import { useMyContext } from "../UI/components/utils/context";

// export default function useDeposit() {
//   const { dwStatus, setDwStatus } = useMyContext();

//   const deposit = async (
//     type, 
//     amount,
//     token,
//     user
//   )=> {
//     console.log("this is deposit ft....");
//     if (dwStatus !== "OPEN") return;

//     try {
//       setDwStatus("LOADING");
//       const tx = {
//         // type,
//         amount: Number(amount),
//         token,
//         user,
//       }

//       //proof gen!
//       setDwStatus("PROOF_GEN");
//       const proof = await new Promise((res) => setTimeout(res, 1500));
//       // const proof = await backend.send("new_deposit", { tx });

//       setDwStatus("SIGN");
//        setTimeout(() => {
//         setDwStatus((prev) => (prev === "SIGN" ? "OPEN_METAMASK" : prev));
//       }, 5000);
//       await Call_contract();

//       setDwStatus("VERIFY_TX");
//       await new Promise((res) => setTimeout(res, 1500));
//       //backend send notification of approved;

//       setDwStatus("SUCCESS");
//       setTimeout(() => setDwStatus("OPEN"), 2500);


//     }catch(error){

//     }

//   };
//   return deposit;
// }


// async function Call_contract() {
// await new Promise((res) => setTimeout(res, 1500));
// }