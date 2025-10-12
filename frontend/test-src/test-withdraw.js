import { sendMessage } from "./test-websocket";

export default function withdraw(walletAddress, amount, token){
    console.log("withdraw: ", amount, token, " by ", walletAddress);
    const signature = 1;
    const msg = {
        type: "withdraw",
        user: walletAddress,
        amount,
        token,
        signature: signature,
    }
    sendMessage(msg);}