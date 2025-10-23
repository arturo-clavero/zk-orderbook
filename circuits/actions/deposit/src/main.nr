use std::hash::poseidon2::{self, Poseidon2};

global DEPTH: u32 = 3;
// global MAX_LEAFS: u32 = 8;

struct OutputUtxo {
    salt: Field,
    token: Field,
    amount: u32,
    siblings: [Field; DEPTH],
    path: [bool; DEPTH],
}

struct OutputUtxoPub{
    note: Field,
}

fn main(
    //outputs
    newRoot: pub Field,
    outputUtxo: OutputUtxo,
    outputUtxoPub: pub OutputUtxoPub,
){
    merkle::verifyOutputUTXO(
        outputUtxoPub.note, 
        outputUtxo.amount, 
        outputUtxo.token, 
        outputUtxo.salt,
        newRoot,
        outputUtxo.siblings,
        outputUtxo.path,
    );

}
