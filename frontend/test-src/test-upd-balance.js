export default function update_balances(balances){
    const balanceElem = document.getElementById("balance");
    if (balanceElem) balanceElem.textContent = balances;
}