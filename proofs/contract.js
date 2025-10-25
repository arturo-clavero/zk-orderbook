import { readFileSync } from "fs";
import { JsonRpcProvider, Wallet, Contract } from "ethers";


const DarkPool = JSON.parse(
  readFileSync(new URL("../contracts/out/DarkPool.sol/DarkPool.json", import.meta.url))
);

export async function callSmartContract(id, proof, publicInputs, nullifiers, withdrawals) {
  const RPC_URL = "http://127.0.0.1:8545";
  const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const DARKPOOL_ADDRESS = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";

  const provider = new JsonRpcProvider(RPC_URL);
  const wallet = new Wallet(PRIVATE_KEY, provider);
  const darkPool = new Contract(DARKPOOL_ADDRESS, DarkPool.abi, wallet);

  const tx = await darkPool.verifyAndWithdraw(id, nullifiers, proof, publicInputs, []);
  const receipt = await tx.wait();


  console.log("Events:", receipt.logs);
  console.log(" Submitted tx:", tx.hash);
  if (receipt.status === 1) {
    console.log("Transaction succeeded!");
  } else {
    console.log("Transaction failed or reverted!");
  }

  for (let i = 0; i < nullifiers.length; i++){
    const key = ethers.keccak256(ethers.toUtf8Bytes(nullifiers[i]));
    const isNullified = await darkPool.s_nullifiers(key);
    console.log("Nullifier status:", isNullified); 
  }
  return receipt.status === 1;
}
