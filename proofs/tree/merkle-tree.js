import { callCircuit } from "../circuit.js";
import { hash, membersToStrings } from "./tree-utils.js";

//we are storing leaf values already hashed ... 
//depth depends per tree, default is at 3
//please await computeRoot() after tree creation...
const maxSubtreeDepth = 3;
export const maxSubtreeSize = 2 ** maxSubtreeDepth;

export class MerkleTree{
    #root;

    constructor(_depth = 4){
        this.DEPTH = _depth;
        this.TOTAL_LEAFS = 2  ** _depth; 
        this.leafs = new Array(this.TOTAL_LEAFS).fill(0n);
        this.#root = -1;
        this.maxIndex = 0;
        this.valueToIndexObj = {};
    }
    async getRoot(){
        if (this.#root == -1)
            return this.computeRoot();
        return this.#root;
    }
    async verifyProof({value, siblings, path}){
        console.log("valu: ", value);
        console.log("siblings: ", siblings);
        console.log('length: ', path);
        let prevHash = value;
        for (let i = 0; i < siblings.length; i++){
            const isRight = path[i];
            const left = isRight ? siblings[i] : prevHash;
            const right = isRight ? prevHash : siblings[i];
            prevHash = await hash([left, right]);
        }
        if (value == 0n)
        {
            console.log('prevhash: ', prevHash);
            return prevHash == 1088245306496891736480479238854411717682655977115122900648625220369346708864n;
        }
        return this.#root == prevHash;
    }

    async generateProof(value){
        return {
            root: await this.getRoot(),
            value,
            siblings: await this.getSiblings(value),
            path: this.getPath(value)
        }
    }

    generateEmptyProof(format = false){
        const proof = {
            root: 1088245306496891736480479238854411717682655977115122900648625220369346708864n,
            value: 0n,
            siblings: new Array(this.DEPTH).fill(0n),
            path: new Array(this.DEPTH).fill(0),
        };
        if (format){
            proof = membersToStrings(proof, this.DEPTH);
        }
        return proof;
    }

    async getSiblings(value, levelLeafs = this.leafs, _siblings = [], index = -1){//STORE LEAF VALUES HASHED
        if (index == -1) index = this.valueToIndexObj[value];
        index = index % 2 == 0 ? index + 1 : index -1;
        _siblings.push(levelLeafs[index]);
        const result = [];
        for(let i = 0; i < levelLeafs.length; i+=2){
            const _hash = await hash([levelLeafs[i], levelLeafs[i+ 1]]);
            result.push(_hash);
        }
        if (result.length > 1) return await this.getSiblings(value, result, _siblings, Math.floor(index / 2));
        else return _siblings
    }

    getPath(value){
        let index = this.valueToIndexObj[value];
        let path = [];
        for (let i = 0; i < this.DEPTH; i++) {
            const isRight = index % 2;
            path.push(isRight);
            index = Math.floor(index/2);
        }
        return path;
    }
    async computeRoot(levelLeafs = this.leafs){
        let result = [];
        for(let i = 0; i < levelLeafs.length; i+=2){
            result.push(await hash([levelLeafs[i], levelLeafs[i+ 1]]));
        }
        if (result.length > 1)
            return await this.computeRoot(result);
        else
            return result[0];
    }

    async  insertItem(value){//value is hashed already
        if (this.maxIndex >= this.TOTAL_LEAFS)
            return;
        this.leafs[this.maxIndex] = value;
        this.valueToIndexObj[value] = this.maxIndex;
        this.maxIndex+=1;
        this.root = await this.computeRoot();
        return this.root;
    }

    async  insertMultipleItems(values){//each value is hashed already
        for (let i = 0; i < values.length; i++){
            if (this.maxIndex >= this.TOTAL_LEAFS)
                break;
            this.leafs[this.maxIndex] = values[i];
            this.valueToIndexObj[values[i]] = this.maxIndex;
            this.maxIndex += 1;
        }
        this.root = await this.computeRoot();
        return this.root;
    }

    clone() {
        const copy = new MerkleTree(this.DEPTH);
        copy.TOTAL_LEAFS = this.TOTAL_LEAFS;
        copy.leafs = [...this.leafs];
        copy.root = this.root;
        copy.maxIndex = this.maxIndex;
        copy.valueToIndexObj ={...this.valueToIndexObj};
        return copy;
    }

    //for testing only:
    async verifyAll(circuits = false){
        let success;
        for (let i = 0; i < this.TOTAL_LEAFS; i ++){
            const value = this.leafs[i];
            if (value == 0)
                break;
            const proof = await this.generateProof(value);
            if (!circuits){
                success =  await this.verifyProof(proof);
            }
            else {
                success = await callCircuit(membersToStrings(proof, this.DEPTH), "merkle");
            }
            console.log(success);
            if (success == false)
                break;
        }
    }
    async insertNewSubtree(subtreeLeaves) {
        if (subtreeLeaves.length < maxSubtreeSize){
            while (subtreeLeaves.length < maxSubtreeSize) {
                subtreeLeaves.push(0n);
            }
        }
        
        const subtreeSize = subtreeLeaves.length;
        const subtreeHeight = Math.log2(subtreeSize);

        const startIndex = this.maxIndex;

        for (let i = 0; i < subtreeLeaves.length; i++) {
            const leafIndex = startIndex + i;
            this.leafs[leafIndex] = subtreeLeaves[i];
            this.valueToIndexObj[subtreeLeaves[i]] = leafIndex;
        }
        this.maxIndex += subtreeLeaves.length;

        const subtreeRoot = await computeSubtreeRoot(subtreeLeaves);

        const subtreeIndex = Math.floor(startIndex / subtreeSize);

        const siblingPathLength = this.DEPTH - subtreeHeight;
        const siblingPath = [];
        let index = subtreeIndex;
        let levelLeaves = this.leafs;

        for (let i = 0; i < siblingPathLength; i++) {
            const pairIndex = index % 2 === 0 ? index + 1 : index - 1;
            const leftIndexStart = pairIndex * subtreeSize;
            const rightIndexStart = index * subtreeSize;
            const leftLeaves = levelLeaves.slice(leftIndexStart, leftIndexStart + subtreeSize);
            const rightLeaves = levelLeaves.slice(rightIndexStart, rightIndexStart + subtreeSize);
            const leftHash = await computeSubtreeRoot(leftLeaves);
            const rightHash = await computeSubtreeRoot(rightLeaves);
            siblingPath.push(index % 2 === 0 ? rightHash : leftHash);

            const nextLevel = [];
            for (let j = 0; j < levelLeaves.length; j += 2) {
                nextLevel.push(await hash([levelLeaves[j], levelLeaves[j + 1]]));
            }
            levelLeaves = nextLevel;
            index = Math.floor(index / 2);
        }

        const newRoot = await computeNewRootFromSubtree(subtreeRoot, siblingPath, subtreeIndex);
        this.#root = newRoot;
        const proof = {
            inputs : {
                subtreeNotes: membersToStrings(subtreeLeaves, maxSubtreeSize),//subtree length
                siblings: membersToStrings(siblingPath, maxSubtreeDepth),//subtree depth
                path: getPathFromIndex(subtreeIndex, this.DEPTH - maxSubtreeDepth),
                newRoot: newRoot.toString(10),
            },
            newRoot: newRoot
        }
        return proof;
    }

    async verifySubtree(subtreeLeaves, siblings, path) {
        const subtreeRoot = await computeSubtreeRoot(subtreeLeaves);
        let prevHash = subtreeRoot;

        for (let i = 0; i < siblings.length; i++) {
            const isRight = path[i];
            if (isRight) {
            prevHash = await hash([siblings[i], prevHash]);
            } else {
            prevHash = await hash([prevHash, siblings[i]]);
            }
        }

        return prevHash === await this.getRoot();
    }

    // async verifySubtreeInsertion(subtreeLeaves, siblingPath, subtreeIndex) {
    //     const subtreeRoot = await computeSubtreeRoot(subtreeLeaves);
    //     const computedRoot = await computeNewRootFromSubtree(subtreeRoot, siblingPath, subtreeIndex);
    //     return computedRoot === await this.getRoot();
    // }

}

function getPathFromIndex(index, depth) {
  const path = [];
  for (let i = 0; i < depth; i++) {
    path.push(index % 2 === 1);
    index = Math.floor(index / 2);
  }
  return path;
}

async function computeSubtreeRoot(values) {
    let level = [...values];
    while (level.length > 1) {
        const next = [];
        for (let i = 0; i < level.length; i += 2) {
            next.push(await hash([level[i], level[i+1]]));
        }
        level = next;
    }
    return level[0];
}

async function computeNewRootFromSubtree(subtreeRoot, siblingPath, subtreeIndex) {
    let current = subtreeRoot;
    let index = subtreeIndex;

    for (let i = 0; i < siblingPath.length; i++) {
        const sibling = siblingPath[i];
        const isRight = index % 2 === 1;
        const left = isRight ? sibling : current;
        const right = isRight ? current : sibling;
        current = await hash([left, right]);
        index = Math.floor(index / 2);
    }

    return current; 
}
