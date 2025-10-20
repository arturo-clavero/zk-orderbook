use std::hash::poseidon2;

global DEPTH: u32 = 3;
// global MAX_LEAFS: u32 = 8;

fn main(
    root: pub Field,
    value: Field,
    siblings: [Field; DEPTH],
    path: [bool; DEPTH],
){
    verifyProof(root, value, siblings, path);
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