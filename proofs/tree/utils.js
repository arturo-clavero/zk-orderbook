import { Barretenberg, Fr } from "@aztec/bb.js";

export const MAX_DEPTH = 32;

export function expandArray(arr, len, fill) {
  return [...arr, ...Array(len - arr.length).fill(fill)];
}

export function membersToStrings(obj) {
  const out = {};
  for(let key of Object.keys(obj)) {
    if(obj[key] instanceof Array) {
      out[key] = expandArray(obj[key].map(x => x.toString(10)), MAX_DEPTH, '0');
    } 
    else if (typeof obj[key] === "boolean") {
      out[key] = obj[key];
    }
      else{
      out[key] = obj[key].toString(10);
    }
  }
  return out;
}

export function bufferToBigInt(buf) {
  return BigInt('0x' + buf.toString('hex'));
}

export async function poseidonToBN(inputs, shouldTruncate = false){
    const bb = await Barretenberg.new();
    const hash = await bb.poseidon2Hash(inputs);
    const hashBig = BigInt('0x' + Buffer.from(hash.value).toString('hex'));
    if (shouldTruncate == false)
      return hashBig;
    const keyU64 = hashBig % (2n ** 64n);
    return keyU64;
}
