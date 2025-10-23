import { MerkleTree } from "../proofs/tree/merkle-tree.js";
import { hash } from "../proofs/tree/tree-utils.js";

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
    await tree.insertMultipleItems([
        await hash(["A"]),
        await hash(["B"]),
        await hash(["C"]),
    ]);
    await tree.verifyAll();
    console.log("SHADOW!");
    const shadow = tree.clone();
    await shadow.verifyAll();
    const newItem = await hash(["D"]);
    console.log("new item: ", newItem);
    await shadow.insertItem(newItem);
    console.log('shadow 2nd:');
    await shadow.verifyAll();
    console.log("tree...");
    await tree.verifyAll();

}

await testTree();
