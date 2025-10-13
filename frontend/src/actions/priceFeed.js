function getPriceFeed(tokenAddress, amount){
    //set up pyth!

}

export default function convertToUSD(tokenAddress, amount){
    const price = getPriceFeed(tokenAddress, amount);
    return price;
}