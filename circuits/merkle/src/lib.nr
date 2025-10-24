use std::hash::poseidon2::{self, Poseidon2};

global DEPTH: u32 = 4;
// global MAX_LEAFS: u32 = 16;
global SUBTREE_DEPTH:u32 = 2;
global SUBTREE_LEAFS:u32 = 4;
//depth ^ 2 = total

struct InputUtxo {
    siblings: [Field; DEPTH],
    path: [bool; DEPTH],
    note: Field,
    token: Field,
    amount: u32,
    salt: Field,
}

struct InputUtxoPublic{
    nullifier: Field,
}

struct OutputUtxo {
    note: Field,
    salt: Field,
    amount: u32,
    token: Field
}


fn verifyOutputUTXO(
    output_note: Field,
    output_amount: u32,
    output_token: Field,
    output_salt: Field,
){
    let output_amount_field: Field = output_amount as Field;
    assert_eq(output_note, poseidon2::Poseidon2::hash([output_amount_field, output_token, output_salt], 3));
}

fn verifyInputUTXO(
    inputUtxo: InputUtxo,
    inputUtxoPub: InputUtxoPublic,
    userSecret: Field,
    oldRoot: Field,
){
    //1. verify old input (proof);
    verifyProof(
        oldRoot, 
        inputUtxo.note, 
        inputUtxo.siblings, 
        inputUtxo.path
    );

    //2. verify nullifier
    assert_eq(inputUtxoPub.nullifier, poseidon2::Poseidon2::hash([userSecret, inputUtxo.note], 2));
    
    //3. verify old amount (reconstruct old commitment); //is it necessary?
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

fn verifySubTree(
    subtreeNotes: [Field; SUBTREE_LEAFS],
    siblings: [Field; SUBTREE_DEPTH],
    path: [bool; SUBTREE_DEPTH],
    newRoot: Field,
) {
    let subtreeRoot = computeSubtreeRoot(subtreeNotes);
    let mut prevHash = subtreeRoot;

    for i in 0..SUBTREE_DEPTH {
        let isRight = path[i];
        if (isRight) {
            prevHash = poseidon2::Poseidon2::hash([siblings[i], prevHash], 2);
        } else {
            prevHash = poseidon2::Poseidon2::hash([prevHash, siblings[i]], 2);
        }
    }

    assert_eq(prevHash, newRoot);
}

fn computeSubtreeRoot(subtreeNotes: [Field; SUBTREE_LEAFS]) -> Field {
    let mut level: [Field; SUBTREE_LEAFS] = subtreeNotes;
    let mut next_level: [Field; SUBTREE_LEAFS] = [0; SUBTREE_LEAFS];

    for d in 0..SUBTREE_DEPTH {
        let num_pairs = SUBTREE_LEAFS >> ((d + 1) as u8);
        for i in 0..num_pairs {
            let left = level[i * 2];
            let right = level[i * 2 + 1];
            next_level[i] = poseidon2::Poseidon2::hash([left, right], 2);
        }

        for j in 0..num_pairs {
            level[j] = next_level[j];
        }
    }

    level[0]
}

