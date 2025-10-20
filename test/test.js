import { computeRoot, generateProof, getLeafs, getSiblings, insertItem, insertMultipleItems, verifyProof } from "../proofs/tree/merkle-tree.js";

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
function testTree(){
    insertMultipleItems(["A", "B", "C", "D", "E", "F", "G", "H"]);
    console.log("\n\nleafs: ", printArray(getLeafs()), "\n");
    console.log("root: ", computeRoot(), "\n\n");

    const len = getLeafs().length;
    for (let i = 0; i < len; i ++){
        const value = getLeafs()[i];
        const proof = generateProof(value);
        const success =  verifyProof(proof);
        console.log(`verified ${value}: `, success);
        if (success == false)
            break;
    }
}

testTree();
