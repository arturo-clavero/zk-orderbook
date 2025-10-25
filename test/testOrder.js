import { checkOrder } from "../proofs/actions/trade";

const user = "user";
const token = "ETH";

async function test(){
    await checkOrder(test_new_order(user, token, 1));
    
}


function test_new_order(user, token, amount){
    const order = {
        amount, 
        mainToken: token,
        user,
    };
}

await test();