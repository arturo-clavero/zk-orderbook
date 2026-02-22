import { readFileSync } from "fs";
import { JsonRpcProvider, Wallet, Contract, ethers } from "ethers";


const DarkPool = JSON.parse(
  readFileSync(new URL("../contracts/out/DarkPool.sol/DarkPool.json", import.meta.url))
);


export function getSmartContract(print = false) {
  //TO CHANGE:
  const RPC_URL = "http://127.0.0.1:8545";
  const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const DARKPOOL_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const provider = new JsonRpcProvider(RPC_URL);
  const wallet = new Wallet(PRIVATE_KEY, provider);
  const darkPool = new Contract(DARKPOOL_ADDRESS, DarkPool.abi, wallet);
 
  if (print){
    const selector5 = ethers.id("ProofLengthWrong()").slice(0,10);
    console.log("5: ", selector5); 
    const selector4 = ethers.id("PublicInputsLengthWrong()").slice(0,10);
    console.log("4: ", selector4); 
      const selector3 = ethers.id("SumcheckFailed()").slice(0,10);
    console.log("3: ", selector3); 
      const selector2 = ethers.id("ShpleminiFailed()").slice(0,10);
    console.log("2: ", selector2); 
    const selector1 = ethers.id("DarkPool__InvalidWithdrawProof()").slice(0, 10);
    console.log("1: ", selector1);
    const selector0 = ethers.id("DarkPool__InvaildCurrentRoot()").slice(0, 10);
    console.log("0: ", selector0);
    const selector_1 = ethers.id("DarkPool__NullifierAlreadySpent()").slice(0, 10);
    console.log("-1: ", selector_1);
    const selector_2 = ethers.id("DarkPool__TransferFailed()").slice(0, 10);
    console.log("-2: ", selector_2);
    const selector_3 = ethers.id("DarkPool__InvalidAmount()").slice(0, 10);
    console.log("-3: ", selector_3);
  }

  return darkPool;
}

async function txResult(tx, printEvents = false){
  const receipt = await tx.wait();

  if (printEvents)
      console.log("Events:", receipt.logs);
  console.log(" Submitted tx:", tx.hash);
  if (receipt.status === 1) {
    console.log("Transaction succeeded!");
  } else {
    console.log("Transaction failed or reverted!");
  }

  return receipt.status === 1;

}

export async function verifyAndWithdraw(id, nullifiers, proof, publicInputs, withdrawal){
  const darkPool = getSmartContract(true);
  const rootBefore = await darkPool.root();

  const tx = await darkPool.verifyAndWithdraw(id, nullifiers, proof, publicInputs, []);
  const status = await txResult(tx, true);

  const root = await darkPool.root();
  console.log("root before: ", rootBefore);
  console.log("root after: ", root);

  return status;
}

export async function resetSC(){  
  return await txResult(await getSmartContract(true).testReset());
}