//2 inputs
//1 output
//delta
//old amount

struct OutputUtxoWithdrawal {
    salt: Field,
    note: Field,
    amount: u32,
}

struct OutputUtxoPubWithdrawal{
    token: Field,
}
fn main(
    inputs : [merkle::InputUtxo; 2],
    inputsPub: [merkle::InputUtxoPublic; 2],
    output:  OutputUtxoWithdrawal,
    outputPub: pub OutputUtxoPubWithdrawal,
    userSecret: Field,
    oldRoot: pub Field,
    target: pub u32,

){
    merkle::verifyInputUTXO(
        inputs[0],
        inputsPub[0],
        userSecret,
        oldRoot
    );

    let zero = 0 as Field;
    //optional...
    if (inputs[1].note != zero){
         merkle::verifyInputUTXO(
            inputs[1],
            inputsPub[1],
            userSecret,
            oldRoot
        );
    }

    //optional...
    if (output.note != zero){
        merkle::verifyOutputUTXO(
            output.note,
            output.amount,
            outputPub.token,
            output.salt
        );
    }

    assert_eq((inputs[0].amount + inputs[1].amount - target), output.amount);

}