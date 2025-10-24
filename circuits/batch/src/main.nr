fn main(
    subtreeNotes: [Field; merkle::SUBTREE_LEAFS],
    siblings: [Field; merkle::SUBTREE_DEPTH],
    path: [bool; merkle::SUBTREE_DEPTH],
    newRoot: pub Field,   
){
    merkle::verifySubTree(
        subtreeNotes, 
        siblings,
        path,
        newRoot
    );
}