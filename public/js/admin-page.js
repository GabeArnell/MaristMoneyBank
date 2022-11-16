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
    // go back to login page
    window.location.assign("index.html")
}

const nameLabel = document.getElementById("profile-name")
const emailLabel = document.getElementById("profile-email")


const searchInput = document.getElementById('search-input')
const searchButton = document.getElementById('search-button')

const cashInput = document.getElementById("change-input")
const cashButton = document.getElementById("change-button")

let currentID = null;

searchButton.onclick = function(){
    let value = searchInput.value;
    if (value.length < 1){
        alert("Input a username");
        return;
    }
    searchUser(value.trim())
}

//getting personal information from website
function searchUser(username){
    fetch("/admin-search",{
        method: "POST",
        cache: "no-cache",
        headers: [["Content-Type","application/json"]],
        body: JSON.stringify({
            logintoken: loginToken,
            username: loginUser,
            targetUser: username
        })
    }).then(response=>{
        response.json().then(json=>{
            if (json.status == "success"){
                personalInformation = json.data;
                let currentBalance = 0;
                for (let child of transactionHistory.children){
                    if (child.classList.contains("no-delete")){

                    }else{
                        child.remove()
                    }
                }
                for (let rowData of json.transactions){
                    addToTransactionTable(rowData)
                    currentBalance+=rowData.amount;
                }
                balanceLabel.innerText = `Balance: $${centsToString(currentBalance)}`
                nameLabel.innerText = json.transactions[0].name;
                emailLabel.innerText = json.transactions[0].email;
                currentID = json.transactions[0].userID
            }else{
                alert(json.reason);
            }
        })
    })    
}

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

cashButton.onclick = function(){
    if (currentID==null){
        alert("Search a user to change");
        return;
    }

    let text = cashInput['value']
    text = text.trim();
    let num = parseInt(text)

    if (text == null){
        return alert("Input a number of $$$ to add/subtract")
    }

    fetch("/new-transaction",{
        method: "POST",
        cache: "no-cache",
        headers: [["Content-Type","application/json"]],
        body: JSON.stringify({
            logintoken: loginToken,
            username: loginUser,
            targetUser: searchInput.value.trim(),
            targetID: currentID,
            amount: num
        })
    }).then(response=>{
        response.json().then(json=>{
            if (json.status == "success"){
                alert("Updated transaction_t table")
                searchUser(searchInput.value.trim())
            }else{
                alert(json.reason);
            }
        })
    })    

}