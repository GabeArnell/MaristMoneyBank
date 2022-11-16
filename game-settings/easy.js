const {characterList} = require("./characters")

module.exports.databaseStartUpScript = [

    // Person table
    `DROP TABLE IF EXISTS transaction_t;`
    ,`DROP TABLE IF EXISTS person_t;`
    ,`CREATE TABLE person_t( id int(3) NOT NULL, username varchar(25) NOT NULL, name varchar(25) NOT NULL, email varchar(30) NOT NULL, password varchar(20) NOT NULL, CONSTRAINT Person_PK PRIMARY KEY (id));`
    // Transactions Data
    // Person table
    ,`CREATE TABLE transaction_t( id int(3) NOT NULL, userID int(3), timestamp DATE NOT NULL, amount int(25), CONSTRAINT Transaction_PK PRIMARY KEY (id), CONSTRAINT UserID_FK FOREIGN KEY (userID) REFERENCES person_t(id));`
    
]
module.exports.nextTransactionID = 1
for (let character of characterList){
    let username = character.email.split("@")[0].toLowerCase()
    module.exports.databaseStartUpScript.push(`INSERT INTO person_t VALUES(${character.id}, '${username}', '${character.name}', '${character.email}', '${character.password}');`)
    let transactionCount = Math.ceil(Math.random()*5)
    let currentBalance = 0;
    for (let i = 0; i < transactionCount;i++){
        let newAmount = Math.ceil(Math.random()*10)*5
        newAmount = newAmount*100;// convert to cents
        if (currentBalance > newAmount && Math.random() > .5){
            newAmount = newAmount*-1
        }
        currentBalance+=newAmount
        let date = new Date();
        let dString = date.getDate();
        if (dString.length < 2){
            dString = "0"+dString
        }
        dString = date.getMonth()+"-"+dString;
        if (dString.length < 5){
            dString = "0"+dString
        }
        dString = date.getFullYear()+"-"+dString

        
        module.exports.databaseStartUpScript.push(`INSERT INTO transaction_t VALUES(${module.exports.nextTransactionID++}, '${character.id}','${dString}' ,${newAmount});`)
    }
}

