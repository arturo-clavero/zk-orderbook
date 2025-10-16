import { Wallet } from "ethers";
import axios from "axios";
import { useMyContext } from "../UI/components/utils/context";

export default async function deposit(token, amount) {
  const { depositWithdrawalLoad, setDepositWithdrawalLoad } = useMyContext();
  if (depositWithdrawalLoad == true) return;
  setDepositWithdrawalLoad(true);

  try {
    const res = await axios.post("/api/createDepositSession", {
      token: token.symbol,
      amount,
    });
    // Backend:
    // Looks up the user’s KYC record.
    // Derives a new unique deposit address from an HD wallet (or creates a new sub-account / custodial wallet).
    // Saves in DB: { depositSessionId, userId, depositAddress, createdAt, status }.
    // Returns JSON:
    // {
    //   "depositSessionId": "abc123",
    //   "depositAddress": "0x1234abcd...ef",
    //   "chain": "Ethereum",
    //   "expiresAt": "2025-10-06T12:00:00Z"
    // }

    const { depositAddress } = res.data;

    // // Build EIP-681 link

    // let link = "";
    // if (tokenSymbol === "ETH") {
    //   const amountInWei = BigInt(amount * 1e18).toString();
    //   link = `ethereum:${depositAddress}?value=${amountInWei}`;
    // } else {
    //   const tokenContract = token.tokenContract;
    //   const decimals = token.decimals || 18;
    //   const amountInUnits = BigInt(amount * 10 ** decimals).toString();
    //   link = `ethereum:${tokenContract}/transfer?address=${depositAddress}&uint256=${amountInUnits}`;
    // }
    // /// Open MetaMask
    // window.location.href = link;

    const txHash = await window.ethereum.request({
  method: "eth_sendTransaction",
  params: [{
    from: userAddress,
    to: depositAddress,
    value: amountInWei,  // hex
  }],
})
await axios.post("/api/submitDepositTx", {
  depositSessionId,
  txHash
});

//backedn verifies tx ...
// import { ethers } from "ethers";

// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// async function verifyTx(txHash, depositAddress, expectedAmount, decimals = 18) {
//   const receipt = await provider.waitForTransaction(txHash, 2); // wait for 2 confs
//   if (!receipt || receipt.status !== 1) return false;

//   const tx = await provider.getTransaction(txHash);

//   // ETH deposit
//   if (tx.to?.toLowerCase() === depositAddress.toLowerCase()) {
//     return BigInt(tx.value) >= BigInt(expectedAmount * 10n ** BigInt(decimals));
//   }

//   // ERC-20 deposit
//   const logs = receipt.logs;
//   const transferSig = ethers.id("Transfer(address,address,uint256)");

//   for (let log of logs) {
//     if (log.topics[0] === transferSig && 
//         "0x" + log.topics[2].slice(26).toLowerCase() === depositAddress.toLowerCase()) {
//       const amount = BigInt(log.data);
//       return amount >= BigInt(expectedAmount * 10n ** BigInt(decimals));
//     }
//   }

//   return false;
// }


  } catch (err) {
    console.error("Deposit failed:", err);
  } finally {
    setDepositWithdrawalLoad(false);
  }

  // Backend chain-watcher monitors blockchain for incoming transactions to depositAddress.
  // When it sees a deposit, it updates DB → marks that session as confirmed and credits the user’s internal balance.
}
