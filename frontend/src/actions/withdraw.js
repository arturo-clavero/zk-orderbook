import { Wallet } from "ethers";
import axios from "axios";
import { useMyContext } from "../UI/components/utils/context";

export default function useWithdraw() {
  const { dwStatus, setDwStatus } = useMyContext();

  const withdraw = async (type, amount, token, user) => {
    console.log("this is withdraw ft....");

    if (dwStatus !== "OPEN") return;

    try {
      setDwStatus("LOADING");
      const tx = {
        // type,
        amount : Number(amount),
        token,
        user,
      };

      console.log("tx: ", tx);

      //proof gen!
      setDwStatus("PROOF_GEN");
      const proof = await new Promise((res) => setTimeout(res, 1500));
      // const proof = await backend.send("new_deposit", { tx });

      setDwStatus("SIGN");
      setTimeout(() => {
        setDwStatus((prev) => (prev === "SIGN" ? "OPEN_METAMASK" : prev));
      }, 5000);
      await Call_contract();

      setDwStatus("VERIFY_TX");
      await new Promise((res) => setTimeout(res, 1500));
      //backend send notification of approved;

      setDwStatus("SUCCESS");
      setTimeout(() => setDwStatus("OPEN"), 2500);
    } catch (error) {}
  };
  return withdraw;
}

async function Call_contract() {
  await new Promise((res) => setTimeout(res, 1500));
}
