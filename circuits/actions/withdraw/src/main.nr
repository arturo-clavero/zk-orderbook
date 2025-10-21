fn main(
    //inputs
    inputUtxo1: merkle::InputUtxo,
    inputUtxoPub1: merkle::InputUtxoPublic,
    inputUtxo2: merkle::InputUtxo,
    inputUtxoPub2: merkle::InputUtxoPublic,

    //outputs 
    outputUtxo: merkle::OutputUtxoWithdrawal,
    outputUtxoPub: merkle::OutputUtxoPubWithdrawal,

    userSecret: Field,
    delta: u32
){
    //1. proof double inputs
    merkle::verifyInputUTXO(
        inputUtxo1, 
        inputUtxoPub1, 
        userSecret
    );
    if (inputUtxo2.note != 0){
        merkle::verifyInputUTXO(
            inputUtxo2, 
            inputUtxoPub2, 
            userSecret
        );
    }

    //2. proof single output
    let inputAmounts = inputUtxo1.amount + inputUtxo2.amount;
    // assert(delta + 1 > inputAmounts);
    let recomp_output_amount = inputAmounts - delta;

    merkle::verifyOutputUTXO(
        outputUtxoPub.note, 
        recomp_output_amount, 
        outputUtxoPub.token,
        outputUtxo.salt
        );
}
