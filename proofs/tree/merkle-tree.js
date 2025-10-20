const DEPTH = 3;
const TOTAL_LEAFS = 2 ** DEPTH;

let leafs = new Array(TOTAL_LEAFS).fill(0);
// let hashedLeafs = new Array(TOTAL_LEAFS).fill(hash("X"));
//STORE LEAF VALUES HASHED
let root = computeRoot();
let maxIndex = 0;
const valueToIndexMap = new Map();

function hash(v1, v2 = '`'){
    return `${v1}${v2}`;
}

export function getLeafs(){
    return leafs;
}
//PROOF
export function verifyProof({root, value, siblings, path}){
    // let prevHash = hash(value);
    let prevHash = value; //STORE LEAF VALUE ALREADY HASHED
    for (let i = 0; i < siblings.length; i++){
        const isRight = (path >> i) & 1;
        const left = isRight ? siblings[i] : prevHash;
        const right = isRight ? prevHash : siblings[i];
        prevHash = hash(left, right);
    }
    return root == prevHash;
}

export function getSiblings(value,levelLeafs = leafs, _siblings = [],index = -1){//STORE LEAF VALUES HASHED
    if (index == -1)
        index = valueToIndexMap[value];
     if (index % 2 == 0)
        index += 1;
    else
        index -=1;
    _siblings.push(levelLeafs[index]);
    const result = [];
    for(let i = 0; i < levelLeafs.length; i+=2){
        const _hash = hash(levelLeafs[i], levelLeafs[i+ 1]);
        result.push(_hash);
    }
    if (result.length > 1)
        return getSiblings(value, result, _siblings, Math.floor(index / 2));
    else
        return _siblings
}

function getPath(index){
    let pathBits = 0;
    for (let i = 0; i < DEPTH; i++) {
        const isRight = index % 2;
        pathBits |= (isRight << i);
        index = Math.floor(index / 2);
    }
    return pathBits;
}

export function generateProof(value){
    return {
        root,
        value,
        siblings: getSiblings(value),
        path: getPath(valueToIndexMap[value])
    }
}

//INSERT
export function computeRoot(levelLeafs = leafs){//STORE LEAF VALUES HASHED
    let result = [];
    for(let i = 0; i < levelLeafs.length; i+=2){
        result.push(hash(levelLeafs[i], levelLeafs[i+ 1]));
    }
    if (result.length > 1)
        return computeRoot(result);
    else
        return result[0];
}

export function insertItem(value){
    if (maxIndex >= TOTAL_LEAFS)
        return;
    leafs[maxIndex] = value;
    // hashedLeafs[maxIndex] = hash(value);
    //STORE LEAF VALUES HASHED
    valueToIndexMap[value] = maxIndex;
    maxIndex+=1;
    root = computeRoot();
    return root;
}

export function insertMultipleItems(values){

    for (let i = 0; i < values.length; i++){
        if (maxIndex >= TOTAL_LEAFS)
            break;
        leafs[maxIndex] = values[i];
        // hashedLeafs[maxIndex] = hash(values[i]);
        //STORE LEAF VALUES HASHED
        valueToIndexMap[values[i]] = maxIndex;
        maxIndex += 1;
    }
    root = computeRoot();
    return root;
}