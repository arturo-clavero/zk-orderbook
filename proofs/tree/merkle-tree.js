import { callCircuit } from "../circuit.js";
import { hash, membersToStrings } from "./utils.js";

//we are storing leaf values already hashed ... 
//depth depends per tree, default is at 3
//please await computeRoot() after tree creation...

export class MerkleTree{

    constructor(_depth = 3){
        this.DEPTH = _depth;
        this.TOTAL_LEAFS = 2  ** _depth; 
        this.leafs = new Array(this.TOTAL_LEAFS).fill(0);
        this.root = -1;
        this.maxIndex = 0;
        this.valueToIndexMap = new Map();
    }

    async verifyProof({value, siblings, path}){
        let prevHash = value;
        for (let i = 0; i < siblings.length; i++){
            const isRight = path[i];
            const left = isRight ? siblings[i] : prevHash;
            const right = isRight ? prevHash : siblings[i];
            prevHash = await hash([left, right]);
        }
        return this.root == prevHash;
    }

    async generateProof(value){
        if (this.root == -1)
            await this.computeRoot();
        return {
            root: this.root,
            value,
            siblings: await this.getSiblings(value),
            path: this.getPath(value)
        }
    }

    generateEmptyProof(format = false){
        const proof = {
            root: 0,
            value: 0,
            siblings: new Array(this.DEPTH).fill(0),
            path: new Array(this.DEPTH).fill(0),
        };
        if (format){
            proof = membersToStrings(proof, this.DEPTH);
        }
        return proof;
    }

    async getSiblings(value, levelLeafs = this.leafs, _siblings = [], index = -1){//STORE LEAF VALUES HASHED
        if (index == -1) index = this.valueToIndexMap[value];
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
        let index = this.valueToIndexMap[value];
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
        this.valueToIndexMap[value] = this.maxIndex;
        this.maxIndex+=1;
        this.root = await this.computeRoot();
        return this.root;
    }

    async  insertMultipleItems(values){//each value is hashed already
        for (let i = 0; i < values.length; i++){
            if (this.maxIndex >= this.TOTAL_LEAFS)
                break;
            this.leafs[this.maxIndex] = values[i];
            this.valueToIndexMap[values[i]] = this.maxIndex;
            this.maxIndex += 1;
        }
        this.root = await this.computeRoot();
        return this.root;
    }

    //for testing only:
    async verifyAll(circuits = false){
        let success;
        for (let i = 0; i < this.TOTAL_LEAFS; i ++){
            const value = this.leafs[i];
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

}
