fn main(
    inputsA: merkle::InputUtxo,
    inputsApub: pub merkle::InputUtxoPublic,
    inputsB: merkle::InputUtxo,
    inputsBpub: pub merkle::InputUtxoPublic,
    inputsC: merkle::InputUtxo,
    inputsCpub: pub merkle::InputUtxoPublic,
    output: merkle::OutputUtxo,
    userSecret: Field,
    oldRoot: pub Field,
){
    let zero: Field = 0 as Field;

    merkle::verifyInputUTXO(
        inputsA,
        inputsApub,
        userSecret,
        oldRoot
    );

    if (inputsB.note != zero){
        merkle::verifyInputUTXO(
            inputsB,
            inputsBpub,
            userSecret,
            oldRoot
        );
    }

    if (inputsC.note != zero){
        merkle::verifyInputUTXO(
            inputsC,
            inputsCpub,
            userSecret,
            oldRoot
        );
    }

    merkle::verifyOutputUTXO(
        output.note,
        output.amount,
        output.token,
        output.salt
    );
    assert_eq(inputsA.amount + inputsB.amount + inputsC.amount, output.amount);
}