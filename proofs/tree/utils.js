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

export function randomSalt() {
  return "0x" + crypto.randomBytes(16).toString("hex");
}
