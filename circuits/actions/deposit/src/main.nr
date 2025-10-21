use std::hash::poseidon2::{self, Poseidon2};

global DEPTH: u32 = 3;
// global MAX_LEAFS: u32 = 8;

fn main(
    //outputs
    outputUtxo: merkle::OutputUtxo,
    outputUtxoPub: merkle::OutputUtxoPub,
){
    merkle::verifyOutputUTXO(outputUtxoPub.note, outputUtxo.amount, outputUtxo.token, outputUtxo.salt);
}