import { readFileSync } from "fs";
import { JsonRpcProvider, Wallet, Contract, ethers } from "ethers";


const DarkPool = JSON.parse(
  readFileSync(new URL("../contracts/out/DarkPool.sol/DarkPool.json", import.meta.url))
);

export async function callSmartContract(id, proof, publicInputs, nullifiers, withdrawals) {
  //TO CHANGE:
  const RPC_URL = "http://127.0.0.1:8545";
  const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";


  const DARKPOOL_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";


  const provider = new JsonRpcProvider(RPC_URL);
  const wallet = new Wallet(PRIVATE_KEY, provider);
  const darkPool = new Contract(DARKPOOL_ADDRESS, DarkPool.abi, wallet);
  
    const selector5 = ethers.id("ProofLengthWrong()").slice(0,10);
  console.log("5: ", selector5); 

  const rootBefore = await darkPool.root();
  
  const tx = await darkPool.verifyAndWithdraw(id, nullifiers, proof, publicInputs, []);
  const receipt = await tx.wait();

  const root = await darkPool.root();

  console.log("Events:", receipt.logs);
  console.log(" Submitted tx:", tx.hash);
  if (receipt.status === 1) {
    console.log("Transaction succeeded!");
  } else {
    console.log("Transaction failed or reverted!");
  }
  console.log("pub inputs: ", publicInputs);
  console.log("root before: ", rootBefore);
  console.log("root after: ", root);
  return receipt.status === 1;
}
