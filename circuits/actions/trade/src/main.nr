//2 inputs
//1 output
//delta
//old amount



fn main(
    //[in Alice, in Alice, in Bob, in Bob]
    //[in Bob, in Bob, our Alice, change Alice]
    inputs : [merkle::InputUtxo; 4],
    inputsPub: pub [merkle::InputUtxoPublic; 4],
    outputs:  [merkle::OutputUtxo; 4],
    userSecret: Field,
    oldRoot: pub Field,
){
    for i in 0..4{
        //[in Alice, in Alice, out Bob, change Bob]
        merkle::verifyOutputUTXO(
            outputs[i].note,
            outputs[i].amount,
            outputs[i].token,
            outputs[i].salt
        );
        merkle::verifyInputUTXO(
            inputs[i],
            inputsPub[i],
            userSecret,
            oldRoot
        );
    }
    
    assert_eq(inputs[0].token, inputs[1].token);
    assert_eq(inputs[0].token, outputs[0].token);
    assert_eq(outputs[0].token, outputs[1].token);


    assert_eq(inputs[2].token, inputs[3].token);
    assert_eq(inputs[2].token, outputs[2].token);
    assert_eq(outputs[2].token, outputs[3].token);

    //in alice + in alice = out bob - change bob
    assert_eq(inputs[0].amount + inputs[1].amount, outputs[2].amount - outputs[3].amount);
    //in bob + in bob = out alice - change alice
    assert_eq(inputs[2].amount + inputs[3].amount, outputs[0].amount - outputs[1].amount);


}