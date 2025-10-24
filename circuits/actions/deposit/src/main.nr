fn main(
    outputUtxo: merkle::OutputUtxo,
    target: pub u32,
){
    merkle::verifyOutputUTXO(
        outputUtxo.note, 
        outputUtxo.amount, 
        outputUtxo.token, 
        outputUtxo.salt,
    );
    assert_eq(target, outputUtxo.amount);
}
