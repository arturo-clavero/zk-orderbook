import { Barretenberg} from "@aztec/bb.js";
import crypto from "crypto";


const FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

export async function hash(inputs){
    const bb = await Barretenberg.new();
    const arr = inputs.map((x) => {
        try {
            return BigInt(x);
        } catch {
            return BigInt(x.charCodeAt(0));
        }
    });
    const fr = await bb.poseidon2Hash(arr);
    const field = BigInt(fr.toString());
    return field;
}

export function expandArray(arr, len, fill) {
  // console.log("len: ",len);
  // console.log("arr.len: ", arr.length);
  // console.log("error-> ", len - arr.length);
    return [...arr, ...Array(len - arr.length).fill(fill)];
}

export function membersToStrings(obj, DEPTH) {
  // console.log('obj @members to strinng: ', obj, "\n");
     if (Array.isArray(obj)) {
    return Array.from(expandArray(obj.map(x => x.toString(10)), DEPTH, '0'));
  }
  const out = {};
  for (let key of Object.keys(obj)) {
    const val = obj[key];
    if (Array.isArray(val)) {
      out[key] = Array.from(expandArray(val.map(x => x.toString(10)), DEPTH, '0'));
    } else if (typeof val === "boolean") {
      out[key] = val;
    } else {
      out[key] = val.toString(10);
    }
  }
  return out;
}


export function randomSalt() {
  return "0x" + crypto.randomBytes(16).toString("hex");
}
