fn main(
    subtreeNotes: [Field; merkle::SUBTREE_LEAFS],
    siblings: [Field; merkle::SUBTREE_SIB_LEN],
    path: [bool; merkle::SUBTREE_SIB_LEN],
    newRoot: pub Field,
    oldSubtreeNotes: [Field; merkle::SUBTREE_LEAFS],
    oldSiblings: [Field; merkle::SUBTREE_SIB_LEN],
    oldPath: [bool; merkle::SUBTREE_SIB_LEN],
    oldRoot: pub Field,
){
    merkle::verifySubTree(
        subtreeNotes, 
        siblings,
        path,
        newRoot
    );

    merkle::verifySubTree(
        oldSubtreeNotes,
        oldSiblings,
        oldPath,
        oldRoot,
    );
}