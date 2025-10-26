import axios from "axios";
import { useMyContext } from "../UI/components/utils/context";
import { parseUnits, Result } from "ethers";
// import { uniswapMarketSwap } from "./amm";

const TOKEN_DECIMALS = {
  ETH: 18,
  USDT: 6, 
  PYUSD: 6,
}
export function getMarketPrice(mainToken, quoteToken) {
  const maxSlippage = 0.2;
  const marketPrice = mainToken.price / quoteToken.price;
  return marketPrice * (1 + maxSlippage);
}

export function useCreateOrder() {
  const { tradeStatus, setTradeStatus, walletAddress } = useMyContext();

  const createOrder = async (
    side,
    price,
    amount,
    chartPair,
    mainToken,
    quoteToken,
    tradeType,
    slippage,
    ammFallback
  ) => {
    if (tradeStatus !== "OPEN") return;

    try {
      // === Wallet check ===
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (!accounts || accounts.length === 0) {
        alert("Please connect your wallet first!");
        return;
      }
      const smallUnitAmmount = parseUnits(amount.toString(),
      TOKEN_DECIMALS[mainToken] || 18 ).toString();
      const smallUnitPrice = parseUnits(price.toString(),
      TOKEN_DECIMALS[quoteToken] || 18 ).toString();
      console.log("prcie before float", smallUnitPrice);
      console.log("amount before float", smallUnitAmmount);
      // === Construct Order Objects ===
      const orderFloatPriority = {
        tradeType, // spot | market
        side, // buy | sell
        price: smallUnitPrice,
        amount: smallUnitAmmount,
        chartPair,
        mainToken,
        quoteToken,
        ...(tradeType === "market" && {
          slippage: parseFloat(slippage),
          ammFallback,
        }),
        filled: 0,
        timestamp: Date.now(),
        user: walletAddress,
      };

      const orderStringPriority = {
        tradeType,
        side,
        price: Number(price).toString(),
        amount: Number(amount).toString(),
        chartPair,
        mainToken,
        quoteToken,
        ...(tradeType === "market" && {
          slippage: slippage.toString(),
          ammFallback,
        }),
        timestamp: Date.now(),
        user: walletAddress,
      };

      console.log(" Order (backend):", orderFloatPriority);
      console.log(" Order (to sign):", orderStringPriority);


      // === Sign Order ===
      setTradeStatus("SIGN");
      setTimeout(() => {
        setTradeStatus((prev) => (prev === "SIGN" ? "OPEN_METAMASK" : prev));
      }, 5000);
      const signature = await signOrder(orderStringPriority, walletAddress);
      const payload = {
        ...orderFloatPriority,
        signature,
      };
       // ==Send to backend ==
      setTradeStatus("PROOF_GEN");
      await new Promise((res) => setTimeout(res, 1500));
      // await backend.send("new_order", { orderFloatPiority, signature });
      const response = await axios.post("http://localhost:4000/order/create", payload);

      console.log("Order created:", response.data);

      //===backend check if need fill form uniswap==//
      if (response.data.status === "FILLED"){
        console.log("Everything is fien no need for uniswap", response.data);
      } else if ((response.data.status === "PENDING" || response.data.status === "PARTIAL")  && ammFallback ) {
        console.log("Not enough liquidity need amm", response.data);
        // const receipt = await uniswapMarketSwap(
        //   side, 
        //   mainToken.address,
        //   quoteToken.address,
        //   amount,
        //   slippage
        // );

        //norify backend
      //   await axios.post("http://localhost:4000/order/market"), {
      //     side,
      //     tradeType: "market",
      //     chartPair,
      //     mainToken,
      //     quoteToken,
      //     amount,
      //     txHash: receipt.transactionHash,
      //     wallet: walletAddress,
      //     timestamp: Date.now(),
      //   };
      //   console.log("uniswap executed", receipt.transactionHash);
      }

      setTradeStatus("ORDER_OPEN");
      setTimeout(() => setTradeStatus("OPEN"), 2000);

      return response.data;
    } catch (err) {
      console.error("❌ Order creation failed:", err);
      setTradeStatus("ERROR");
      setTimeout(() => setTradeStatus("OPEN"), 2500);
      throw err;
    }
  };

  return createOrder;
}

// ===Signing ===
async function signOrder(order, userAddress) {
  try {
    const orderFields = [
      { name: "tradeType", type: "string" },
      { name: "side", type: "string" },
      { name: "price", type: "string" },
      { name: "amount", type: "string" },
      { name: "mainToken", type: "string" },
      { name: "quoteToken", type: "string" },
      { name: "timestamp", type: "uint256" },
      { name: "user", type: "address" },
    ];

    if (order.tradeType === "market") {
      orderFields.push({ name: "slippage", type: "string" });
      orderFields.push({ name: "ammFallback", type: "bool" });
    }

    const msgParams = {
      domain: {
        chainId: 11155111,
        name: "MyDapp",
        version: "1",
      },
      message: order,
      primaryType: "Order",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
        ],
        Order: orderFields,
      },
    };

    const signature = await window.ethereum.request({
      method: "eth_signTypedData_v4",
      params: [userAddress, JSON.stringify(msgParams)],
    });

    return signature;
  } catch (err) {
    console.error("❌ Signature failed:", err);
    throw err;
  }
}

























// import { useMyContext } from "../UI/components/utils/context";
// import axios from "axios";

// export function getMarketPrice(mainToken, quoteToken) {
//   const maxSlippage = 0.2;
//   const marketPrice = mainToken.price / quoteToken.price;
//   return marketPrice * (1 + maxSlippage);
// }

// export function useCreateOrder() {
//   const { tradeStatus, setTradeStatus, walletAddress } = useMyContext();

//   const createOrder = async (
//     side,
//     price,
//     amount,
//     chartPair,
//     mainToken,
//     quoteToken,
//     tradeType,
//     slippage,
//     ammFallback
//   ) => {
//     if (tradeStatus !== "OPEN") return;

    // try {
    //   setTradeStatus("LOADING");
    //   const orderFloatPriority = {
    //     tradeType, // spot | market
    //     side, // buy | sell
    //     price: parseFloat(price), // price per 1 token
    //     amount: parseFloat(amount), // n of tokens
    //     chartPair, // remains ETH/PYUSD (if eth/pyusd or pyusd/eth)
    //     mainToken, //1s token, (if eth/pyusd -> eth, if pyusd/eth -> pyusd)
    //     quoteToken, //2nd token, (if eth/pyusd -> pyusd, if pyusd/eth -> eth)
    //     ...(tradeType === "market" && {
    //       //market trades
    //       slippage: parseFloat(slippage), // percent (0.05)-> 5 %; user is willing to have a max price = market price * 1.05% (1 + slippage); market price is calc with oracles in real time
    //       ammFallback, // true or false -> if true we will use a relayer and swap with uniswap if no matching orders on the dex book, market orders should be settled inmediately
    //     }),
//         filled: 0, //how much money was filled for partials
//         timestamp: Date.now(),
//         user: walletAddress,
//       };

//       const orderStringPriority = {
//         tradeType,

//         side,
//         price: Number(price).toString(),
//         amount: Number(amount).toString(),
//         chartPair,
//         mainToken,
//         quoteToken,
//         ...(tradeType === "market" && {
//           slippage: slippage.toString(),
//           ammFallback,
//         }),
//         timestamp: Date.now(),
//         user: walletAddress,
//       };

//       console.log("order backend: ", orderFloatPriority);
//       console.log("order for sign: ", orderStringPriority);

//       //sign!
//       setTradeStatus("SIGN");
//       setTimeout(() => {
//         setTradeStatus((prev) => (prev === "SIGN" ? "OPEN_METAMASK" : prev));
//       }, 5000);
//       const signature = await signOrder(orderStringPriority, walletAddress);

//       //proof gen!
//       setTradeStatus("PROOF_GEN");
//       await new Promise((res) => setTimeout(res, 1500));
//       // await backend.send("new_order", { orderFloatPiority, signature });

//       //new order!
//       console.log(
//         "Order created:",
//         orderFloatPriority,
//         "Signature:",
//         signature
//       );
//       setTradeStatus("ORDER_OPEN");
//       setTimeout(() => setTradeStatus("OPEN"), 2500);
//     } catch (err) {
//       console.error("Order creation failed:", err);
//       setTradeStatus("ERROR");
//       setTimeout(() => setTradeStatus("OPEN"), 2500);
//     }
//   };

//   return createOrder;
// }

// async function signOrder(order, userAddress) {
//   try {
//     // Make sure the wallet is actually connected
//     const accounts = await window.ethereum.request({ method: "eth_accounts" });
//     if (!accounts || accounts.length === 0) {
//       console.log("Wallet not authorized. Ask user to connect first.");
//       throw new Error("Wallet not connected");
//     }
//     // Build EIP712 typed data dynamically
//     const orderFields = [
//       { name: "tradeType", type: "string" },
//       { name: "side", type: "string" },
//       { name: "price", type: "string" },
//       { name: "amount", type: "string" },
//       { name: "mainToken", type: "string" },
//       { name: "quoteToken", type: "string" },
//       { name: "timestamp", type: "uint256" },
//       { name: "user", type: "address" },
//     ];

//     if (order.tradeType === "market") {
//       orderFields.push({ name: "slippage", type: "string" });
//       orderFields.push({ name: "ammFallback", type: "bool" });
//     }

//     const msgParams = {
//       domain: {
//         chainId: 1,
//         name: "MyDapp",
//         version: "1",
//       },
//       message: order,
//       primaryType: "Order",
//       types: {
//         EIP712Domain: [
//           { name: "name", type: "string" },
//           { name: "version", type: "string" },
//           { name: "chainId", type: "uint256" },
//         ],
//         Order: orderFields,
//       },
//     };

//     const signature = await ethereum.request({
//       method: "eth_signTypedData_v4",
//       params: [userAddress, JSON.stringify(msgParams)],
//     });

//     return signature;
//   } catch (err) {
//     console.error("Signature failed:", err);
//     throw err;
//   }
// }
