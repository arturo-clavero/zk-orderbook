fn main(
    inputs: [merkle::InputUtxo; 4],
    inputsPub: pub [merkle::InputUtxoPublic; 4],
    output: merkle::OutputUtxo,
    userSecret: Field,
    oldRoot: pub Field,
){
    for i in 0..4 {
        merkle::verifyInputUTXO(
            inputs[i],
            inputsPub[i],
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
    assert_eq(inputs[0].amount + inputs[1].amount + inputs[2].amount + inputs[3].amount, output.amount);
}