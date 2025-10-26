import { Wallet } from "ethers";
import axios from "axios";
import { useMyContext } from "../UI/components/utils/context";
import { getChainId } from "./action-utils";

export default function useWithdraw() {
  const { dwStatus, setDwStatus, walletAddress } = useMyContext();

  const withdraw = async (amount, token) => {
    console.log("this is withdraw ft....");

    if (dwStatus !== "OPEN") return;

    try {
      // setDwStatus("LOADING");
      setDwStatus("LOADING");

      const wdFloat = {
        amount: parseFloat(amount),
        token,
        user: walletAddress,
      };
      const wdStr = {
        amount,
        token,
        user: walletAddress
      };
      setDwStatus("SIGN");
      setTimeout(() => {
        setDwStatus((prev) => (prev === "SIGN" ? "OPEN_METAMASK" : prev));
      }, 5000);
      const signature = await signWd(wdStr, walletAddress);
      console.log("signature: ", signature);

      setDwStatus("SUCCESS");
      setTimeout(() => setDwStatus("OPEN"), 2500);
      // await backend.send("new_withdraw", { wdFloat, signature });

    } catch (err) {
        console.error("Withdraw creation failed:", err);
        setDwStatus("ERROR");
        setTimeout(() => setDwStatus("OPEN"), 2500);

    }
  };
  return withdraw;
}

async function signWd(wd, userAddress){
    try {
      // Make sure the wallet is actually connected
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (!accounts || accounts.length === 0) {
        console.log("Wallet not authorized. Ask user to connect first.");
        throw new Error("Wallet not connected");
      }
      // Build EIP712 typed data dynamically
      const wdFields = [
        { name: "amount", type: "string" },
        { name: "token", type: "string"},
        { name: "user", type: "address" },
      ];
  
      const msgParams = {
        domain: {
          chainId: await getChainId(),
          name: "MyDapp",
          version: "1",
        },
        message: wd,
        primaryType: "Withdraw",
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
          ],
          Withdraw: wdFields,
        },
      };
  
      const signature = await ethereum.request({
        method: "eth_signTypedData_v4",
        params: [userAddress, JSON.stringify(msgParams)],
      });
  
      return signature;
    } catch (err) {
      console.error("Signature failed:", err);
      throw err;
    }
}



