import crypto from "crypto";

const userSecrets = {};

export function getUserSecret(user){
    if (!(user in userSecrets)){
        userSecrets[user] = "0x" + crypto.randomBytes(16).toString("hex");
    }
    return userSecrets[user];
}