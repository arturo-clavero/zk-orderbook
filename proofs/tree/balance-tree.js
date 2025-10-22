import crypto from 'crypto';
import { hash } from './utils.js';
import { MerkleTree } from './merkle-tree.js';

const balanceTree = new MerkleTree();

function getUserSecret(user){

}

function newSalt(user, token){
    const salt = crypto.randomBytes(31);
    //pending salt += salt
    return salt;
}

export async function get_nullifier(note){
    return await hash(getUserSecret(user), note);
}

export async function create_note(user, amount, token){
    const salt = newSalt(user, token);
    const note = await hash([BigInt(amount), token, salt]);
    const nullifier = await get_nullifier(note);
    //pending note += note;
    return {
        note,
        salt,
        nullifier,
    }
}

export async function create_deposit(user, amount, token){
    const {i_note, i_amount, i_nullifier, i_salt} = get_latest_note(user, token);
    ///if nullifier is pending... go back to queue ????????????
    const input_note_proof = await balanceTree.generateProof(i_note);
    const {o_note, o_salt} = create_new_note(user, token);
    const proof_inputs = {
        input_root: input_note_proof.root,
        input_siblings: input_note_proof.siblings,
        input_path: input_note_proof.path,
        input_note: i_note,
        input_token: token,
        input_amount: i_amount,
        input_salt: i_salt,
        input_nullifier: i_nullifier,
        output_note: o_note,
        output_salt: o_salt,
        delta: amount,
        user_secret: getUserSecret(user),

    }
}

