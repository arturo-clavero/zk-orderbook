import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { compile, createFileManager } from '@noir-lang/noir_wasm';
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import { verifyDeposits, verifyFirstDeposits } from './actions/deposit.js';
import os from 'node:os';

const PREPATH = '../circuits/';
const MAX_ACTIONS = 3;
export async function verifyBatch(){
  const fd = await verifyFirstDeposits(MAX_ACTIONS);
  const d = await verifyDeposits(MAX_ACTIONS);

  //if there is nothing to verify return...
  if (fd.newRoot == '-1' && d.rootAfter == '-1')
    return;
  
  const oldRoot = fd.newRoot == '-1' ? d.oldRoot : fd.oldRoot;
  const newRoot = d.newRoot == '-1' ? fd.newRoot : d.newRoot;
  console.log("d: ", fd);
  // console.log("first deposits: ", fd);
  // console.log("deposits: ", d);
  // console.log("big old root: ", oldRoot);
  // console.log("big new root: ", newRoot);
  
  const inputs = {
    oldRoot: oldRoot.toString(),
    newRoot: newRoot.toString(),
    firstDeposits: fd.firstDeposits,
    totalFirstDeposits: fd.totalFirstDeposits,
    deposits: d.deposits,
    totalDeposits: d.totalDeposits,
    //withdraw: w.withdraws,
    //totalWithdraw: w.totalWithdraws;
  }
  console.log("final inputs: ", inputs);
  return await callCircuit(inputs, 'batch');
}

export async function callCircuit(inputs, path){
  try {
    const compiledCircuit = await compile(createFileManager(
      resolve(dirname(fileURLToPath(import.meta.url)), `${PREPATH}${path}`)
    ));

    const noir = new Noir(compiledCircuit.program);
    const backend = new UltraHonkBackend(compiledCircuit.program.bytecode, { threads: os.cpus().length });
    // const backend = new UltraHonkBackend(compiledCircuit.program.bytecode, { threads: 1});
    const { witness } = await noir.execute(inputs);
    const { proof, publicInputs } = await backend.generateProof(witness);
    console.log("verifying...");
    return await backend.verifyProof({ proof, publicInputs });
  } catch(error){
    console.error("Verification failed:", error);
    return false;
  }
}
