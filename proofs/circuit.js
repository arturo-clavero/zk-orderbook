import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { compile, createFileManager } from '@noir-lang/noir_wasm';
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import os from 'node:os';

const PREPATH = '../circuits/';

let backend;

export async function callCircuit(inputs, path){
  try {
    const compiledCircuit = await compile(createFileManager(
      resolve(dirname(fileURLToPath(import.meta.url)), `${PREPATH}${path}`)
    ));

    const noir = new Noir(compiledCircuit.program);
    backend = new UltraHonkBackend(compiledCircuit.program.bytecode, { threads: os.cpus().length });
    // const backend = new UltraHonkBackend(compiledCircuit.program.bytecode, { threads: 1});
    const { witness } = await noir.execute(inputs, { showOutputs: true });
    const { proof, publicInputs } = await backend.generateProof(witness);
    return {proof, publicInputs};
  } catch(error){
    console.error("Verification failed:", error);
    return false;
  }
}

export async function verifyLatestProof(proof, publicInputs){
  return await backend.verifyProof({ proof, publicInputs });
}
