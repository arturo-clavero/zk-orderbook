import { MerkleTree } from './merkle-tree.js';

class ProofTree {
    constructor(){
        this.mainTree = new MerkleTree();
        this.shadowTrees = new Map();
    }
    async insertInShadow(newCommitments, batchId){
        if (newCommitments.length == 0)
            return;
        const shadow = this._ensureShadowTree(batchId);
        const proof = await shadow.insertNewSubtree(newCommitments);
        return (proof);
    }
    async verifyShadowTree(batchId) {
        const shadow = this.shadowTrees.get(batchId);
        if (!shadow) 
        {
            console.log(`No shadow tree found for batch ${batchId}`);
            return;
        }
        this.mainTree = shadow.clone();
        this.shadowTrees.delete(batchId);
        return await this.mainTree.getRoot();
    }
    async shadowProof(id, note){
        const tree = this._ensureShadowTree(id);
        return await tree.generateProof(note);
    }
    _ensureShadowTree(batchId){
        if (!this.shadowTrees.has(batchId)) {
            const cloned = this.mainTree.clone();
            this.shadowTrees.set(batchId, cloned);
        }
        return this.shadowTrees.get(batchId);
    }
}

export const tree = new ProofTree();
