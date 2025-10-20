import { Barretenberg} from "@aztec/bb.js";

const FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

export async function hash(inputs){
    const bb = await Barretenberg.new();
    // console.log("inputs: ", inputs);
    const arr = inputs.map((x) => {
    try {
      return BigInt(x); // try number / hex
    } catch {
      return BigInt(x.charCodeAt(0)); // fallback to ASCII code
    }
  });
     const fr = await bb.poseidon2Hash(arr);

    // fr is already a field element, just convert to BigInt
    const field = BigInt(fr.toString());

    // Modulo is technically redundant since fr is already in the field
    return field;
}

export function expandArray(arr, len, fill) {
  return [...arr, ...Array(len - arr.length).fill(fill)];
}

export function membersToStrings(obj, DEPTH) {
  const out = {};
  for(let key of Object.keys(obj)) {
    if(obj[key] instanceof Array) {
      out[key] = expandArray(obj[key].map(x => x.toString(10)), DEPTH, '0');
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


