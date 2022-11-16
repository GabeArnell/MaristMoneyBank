let loginToken = getCookie('logintoken')
let loginUser = getCookie('username')
let transactionHistory = document.getElementById('transaction-history-table')
let balanceLabel = document.getElementById('balance-label')
if (loginToken.length < 1 || loginUser.length < 1){
    // go back to login page
    window.location.assign("index.html")
}
let admins = ['greg.arnold','stan.rickson','admin','xander.washington']
if (!admins.includes(loginUser.toLowerCase())){
    // delete admin button
    document.getElementById('admin-button').remove()
}

const nameLabel = document.getElementById("profile-name")
const emailLabel = document.getElementById("profile-email")

//getting personal information from website
fetch("/home-page-info",{
    method: "POST",
    cache: "no-cache",
    headers: [["Content-Type","application/json"]],
    body: JSON.stringify({
        logintoken: loginToken,
        username: loginUser
    })
}).then(response=>{
    response.json().then(json=>{
        if (json.status == "success"){
            personalInformation = json.data;
            let currentBalance = 0;
            for (let rowData of json.transactions){
                addToTransactionTable(rowData)
                currentBalance+=rowData.amount;
            }
            balanceLabel.innerText = `Balance: $${centsToString(currentBalance)}`
            nameLabel.innerText = json.transactions[0].name;
            emailLabel.innerText = json.transactions[0].email;
        }else{
            alert(json.reason);
        }
    })
})

function addToTransactionTable(rowData){
    let row = document.createElement("tr");
    let timeCell = document.createElement("td");
    let amountCell = document.createElement("td");
    transactionHistory.appendChild(row);
    row.appendChild(timeCell);
    row.appendChild(amountCell);

    timeCell.innerText = rowData.timestamp.split("T")[0];
    amountCell.innerText = `$${centsToString(rowData.amount)}`

}

const logoutButton = document.getElementById("logout-button")
logoutButton.onclick = function(){
    setCookie('username',"")
    setCookie('logintoken',"")
    window.location.assign("index.html")

}