export async function getChainId() {
  if (!window.ethereum) throw new Error("Wallet not found");

  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
  return parseInt(chainIdHex, 16); 
}
