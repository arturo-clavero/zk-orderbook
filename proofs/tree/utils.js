import { Barretenberg} from "@aztec/bb.js";

export async function hash(inputs){
    const bb = await Barretenberg.new();
    const fr =  await bb.poseidon2Hash(inputs);
    const bytes = Buffer.from(fr.value);
    const big = BigInt('0x' + Buffer.from(bytes.reverse()).toString('hex'));
    return big.toString(); 
}


