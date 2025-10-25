

async function depositEth(amount){
    await darkPool.depositETH({ value: ethers.parseEther(amount) });
}

async function depositToken(amount, token){
    await token.approve(darkPool.address, ethers.parseUnits("500", 6));
    await darkPool.depositToken(token.address, ethers.parseUnits("500", 6));
}

async function depositTokenPermit(amount, token){
    await darkPool.depositTokenWithPermit(
        token.address,
        amount,
        deadline,
        v, r, s
    );
}