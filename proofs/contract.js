import { readFileSync } from "fs";
import { ethers } from "ethers";

const DarkPool = JSON.parse(
  readFileSync(new URL("../contracts/out/DarkPool.sol/DarkPool.json", import.meta.url))
);

export async function callSmartContract(proof, publicInputs, nullifiers, withdrawals) {
  const RPC_URL = "http://127.0.0.1:8545";
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const DARKPOOL_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const darkPool = new ethers.Contract(DARKPOOL_ADDRESS, DarkPool.abi, wallet);

  console.log("Connected to DarkPool at", DARKPOOL_ADDRESS);

  const tx = await darkPool.submitBatchProof(proof, publicInputs, nullifiers, withdrawals);
  console.log("Submitted batch proof, tx:", tx.hash);

  const receipt = await tx.wait();
  console.log("Batch proof verified on-chain");

  // Print emitted events
  console.log("Events:", receipt.logs);
}
