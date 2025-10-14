import {ok} from 'node:assert';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { compile, createFileManager } from '@noir-lang/noir_wasm';
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import { Barretenberg, Fr } from "@aztec/bb.js";

export const MAX_DEPTH = 32;

export async function callCircuit(path, inputs){
  try {
    console.log("compiling...")
    const compiledCircuit = await compile(createFileManager(
  resolve(dirname(fileURLToPath(import.meta.url)), 
  'test/circuits/verifyInsertionProof')
));

    const noir = new Noir(compiledCircuit.program);
    // const backend = new UltraHonkBackend(compiledCircuit.program.bytecode, { threads: os.cpus().length });
      const backend = new UltraHonkBackend(compiledCircuit.program.bytecode, { threads: 1});

    console.log("executing...")

    const { witness } = await noir.execute(inputs);
      console.log("generating...")

    const { proof, publicInputs } = await backend.generateProof(witness);
    console.log("verifying...");
    await backend.verifyProof({ proof, publicInputs });
    return true;
  }
  catch(error){
    console.error("Verification failed:", error);
    return false;
  }
}

function expandArray(arr, len, fill) {
  return [...arr, ...Array(len - arr.length).fill(fill)];
}

export function membersToStrings(obj) {
  const out = {};
  for(let key of Object.keys(obj)) {
    if(obj[key] instanceof Array) {
      out[key] = expandArray(obj[key].map(x => x.toString(10)), MAX_DEPTH, '0');
    } else {
      out[key] = obj[key].toString(10);
    }
  }
  return out;
}

export function bufferToBigInt(buf) {
  return BigInt('0x' + buf.toString('hex'));
}

export async function poseidonToU64(inputs){
    const bb = await Barretenberg.new();
  
    const hash = await  bb.poseidon2Hash(inputs);   
    const hashBig = BigInt('0x' + Buffer.from(hash.value).toString('hex'));
    console.log("hash: ", hashBig);
    const keyU64 = hashBig % (2n ** 64n);
    return keyU64;
}