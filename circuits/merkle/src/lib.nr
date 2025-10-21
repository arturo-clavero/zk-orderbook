use std::hash::poseidon2::{self, Poseidon2};

// global MAX_LEAFS: u32 = 8;
global DEPTH: u32 = 3;

struct InputUtxo {
    siblings: [Field; DEPTH],
    path: [bool; DEPTH],
    note: Field,
    token: Field,
    amount: u32,
    salt: Field,
}

struct InputUtxoPublic{
    root: Field,
    nullifier: Field,
}

struct OutputUtxo {
    salt: Field,
    token: Field,
    amount: u32,
}

struct OutputUtxoPub{
    note: Field,
}

struct OutputUtxoWithdrawal {
    salt: Field,
}

struct OutputUtxoPubWithdrawal{
    note: Field,
    token: Field,
    amount: u32,
}


fn verifyOutputUTXO(
    output_note: Field,
    output_amount: u32,
    output_token: Field,
    output_salt: Field
){
    let output_amount_field: Field = output_amount as Field;
    //verify new output (reconstruct old commitment);
    assert_eq(output_note, poseidon2::Poseidon2::hash([output_amount_field, output_token, output_salt], 3));
}

fn verifyInputUTXO(
    inputUtxo: InputUtxo,
    inputUtxoPub: InputUtxoPublic,
    userSecret: Field,
){
    //1. verify old input (proof);
    verifyProof(
        inputUtxoPub.root, 
        inputUtxo.note, 
        inputUtxo.siblings, 
        inputUtxo.path
    );

    //2. verify nullifier
    assert_eq(inputUtxoPub.nullifier, poseidon2::Poseidon2::hash([userSecret, inputUtxo.note], 2));
    
    //3. verify old amount (reconstruct old commitment);
    let input_amount_field: Field = inputUtxo.amount as Field; 
    assert_eq(inputUtxo.note, poseidon2::Poseidon2::hash([input_amount_field, inputUtxo.token, inputUtxo.salt], 3));
}

fn verifyProof(
    root: Field,
    value: Field,
    siblings: [Field; DEPTH],
    path: [bool; DEPTH],
){
    let mut prevHash: Field = value;
    for i in 0..DEPTH {
        let isRight = path[i];
        if (isRight){
            prevHash = poseidon2::Poseidon2::hash([siblings[i], prevHash], 2); 
        }
        else {
            prevHash = poseidon2::Poseidon2::hash([ prevHash, siblings[i]], 2); 
        }
    }
    assert_eq(prevHash, root);
}