## Deployment

```bash
forge script script/DeployDarkPool.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
````

### Expected Logs

```
== Logs ==
  DarkPool deployed at: 0x2222222222222222222222222222222222222222
```

Use the DarkPool deployment address to interact with the contract.
The latest ABI is located at:

```
./out/DarkPool.sol/DarkPool.json
```

---

## Example Usage

```js
import { readFileSync } from "fs";
import { ethers } from "ethers";

// 1. Create a contract object
const DarkPool = JSON.parse(
  readFileSync(new URL("./contracts/out/DarkPool.sol/DarkPool.json", import.meta.url))
);
const DARKPOOL_ADDRESS = "0x2222222222222222222222222222222222222222";
const RPC_URL = "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(DARKPOOL_ADDRESS, DarkPool.abi, wallet);

// 2. Call a function
const tx = await contract.<functionName>(<param>);

// 3. Log transaction details
const receipt = await tx.wait();

if (receipt.status === 1) {
  console.log("Transaction succeeded!");
} else {
  console.log("Transaction failed or reverted!");
}

// 4. Print emitted events
console.log("Events:", receipt.logs);

```
