import { MerkleTree } from "../proofs/tree/merkle-tree.js";
import { hash, membersToStrings } from "../proofs/tree/utils.js";

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
    await tree.insertMultipleItems([
        await hash(["A"]),
        await hash(["B"]),
        await hash(["C"]),
        await hash(["D"]),
        await hash(["E"]),
        await hash(["F"]),
        await hash(["G"]),
        await hash(["H"]),
    ]);
    console.log("\n\nleafs: ", tree.leafs, "\n");
    console.log("root: ", await tree.computeRoot(), "\n\n");
    const proof = await tree.generateProof(await hash(["A"]));
    console.log("proof: ", membersToStrings(proof, tree.DEPTH));
    console.log("verify: ", await tree.verifyProof(proof));
    tree.verifyAll(true);

}

await testTree();
