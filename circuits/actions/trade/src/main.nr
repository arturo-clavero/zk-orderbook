//2 inputs
//1 output
//delta
//old amount

fn main(
    //[in Alice, in Alice, in Bob, in Bob]
    //[in Bob, in Bob, our Alice, change Alice]

    inputsX : [merkle::InputUtxo; 2],
    inputsY : [merkle::InputUtxo; 2],
    inputsPubX: pub [merkle::InputUtxoPublic; 2],
    inputsPubY: pub [merkle::InputUtxoPublic; 2],
    outputsX:  [merkle::OutputUtxo; 2],
    outputsY:  [merkle::OutputUtxo; 2],
    userSecretX: Field,
    userSecretY: Field,
    oldRoot: pub Field,
){
        let zero: Field = 0 as Field;

        //[in Alice, in Alice, out Bob, change Bob]
        merkle::verifyOutputUTXO(
            outputsX[0].note,
            outputsX[0].amount,
            outputsX[0].token,
            outputsX[0].salt
        );
        merkle::verifyOutputUTXO(
            outputsY[0].note,
            outputsY[0].amount,
            outputsY[0].token,
            outputsY[0].salt
        );
        if (outputsX[1].note != zero){
            merkle::verifyOutputUTXO(
                outputsX[1].note,
                outputsX[1].amount,
                outputsX[1].token,
                outputsX[1].salt
            );
        }
        if (outputsY[1].note != zero){
            merkle::verifyOutputUTXO(
                outputsY[1].note,
                outputsY[1].amount,
                outputsY[1].token,
                outputsY[1].salt
            );
        }
        merkle::verifyInputUTXO(
            inputsX[0],
            inputsPubX[0],
            userSecretX,
            oldRoot
        );
        merkle::verifyInputUTXO(
            inputsY[0],
            inputsPubY[0],
            userSecretY,
            oldRoot
        );
        if (inputsX[1].note != zero){
         merkle::verifyInputUTXO(
            inputsX[1],
            inputsPubX[1],
            userSecretX,
            oldRoot
        );
        }
        if (inputsY[1].note != zero){
            merkle::verifyInputUTXO(
                inputsY[1],
                inputsPubY[1],
                userSecretY,
                oldRoot
            );
        }

    // //in alice - change = out bob
    assert_eq(inputsX[0].amount + inputsX[1].amount- outputsX[1].amount, outputsY[0].amount);
    // //in bob - change = out alice
    assert_eq(inputsY[0].amount + inputsY[1].amount- outputsY[1].amount, outputsX[0].amount);
}

    // assert_eq(inputs[0].token, inputs[1].token);
    // assert_eq(inputs[0].token, outputs[1].token);
    // assert_eq(outputs[1].token, outputs[2].token);


    // assert_eq(inputs[1].token, inputs[2].token);
    // assert_eq(inputs[2].token, outputs[0].token);
    // assert_eq(outputs[0].token, outputs[3].token);

    // //in alice - change = out bob
    // assert_eq(inputs[0].amount + inputs[1].amount- outputs[2].amount, outputs[1].amount);
    // //in bob - change = out alice
    // assert_eq(inputs[2].amount + inputs[3].amount- outputs[3].amount, outputs[0].amount);
