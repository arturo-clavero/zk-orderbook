import { MerkleTree } from "../proofs/tree/merkle-tree.js";

function printArray(array){
    let string = "";
    for(let i = 0; i < array.length; i++){
        if (i + 1 < array.length)
            string += `${array[i]}, `;
        else
            string+= array[i];
    }
    return string;
}

const DEPTH = 3;

async function testTree(){
    const tree = new MerkleTree(DEPTH);
    console.log("root at 0",await tree.computeRoot());
    await tree.insertMultipleItems(["A", "B", "C", "D", "E", "F", "G", "H"]);
    console.log("\n\nleafs: ", printArray(tree.leafs), "\n");
    console.log("root: ", await tree.computeRoot(), "\n\n");

    tree.verifyAll();

}

await testTree();
