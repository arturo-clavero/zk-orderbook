import { writeBalanceProofInputs, getBalance, getUserSecret } from "./tree/balanceTree.js";
import { callCircuit } from "./utils.js";

//balance and user secret should be in database somewhere or im not sure
export async function deposit(userId, amountInput, verify = true){
    const amount = Number(amountInput);
    const currBalance = getBalance(userId);

    const inputsProof = await writeBalanceProofInputs(userId, amount);
    const inputs = {
            ...inputsProof,
        oldAmount: currBalance,
        delta: amount,
        userSecret: getUserSecret(userId).toString(),
        }
    if (!verify)
        return true;
    let success = await callCircuit(inputs, "deposit");
    return success;
}