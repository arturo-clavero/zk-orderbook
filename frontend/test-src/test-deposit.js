import { sendMessage } from "./test-websocket";

export default function deposit(walletAddress, amount, token){
    console.log("deposit: ", amount, token, " by ", walletAddress);
    const tx = 1;
    const msg = {
        type: "deposit",
        user: walletAddress,
        amount,
        token,
        tx: tx,
    }
    sendMessage(msg);
}