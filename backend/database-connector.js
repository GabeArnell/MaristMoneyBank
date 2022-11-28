var mysql = require('mysql2');

const easyConfig = require("../game-settings/easy.js")
let connectionInfo = {
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bank_db'
  }
module.exports.setup = ()=>{
    console.log("Setting up database connection")
    module.exports.restartDatabase()
}
module.exports.query = async (queryString)=>{

    module.exports.connection.query(queryString, function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
      });
}

module.exports.close = ()=>{
    module.exports.connection.end();
}

// Resets the database, removing anything that would fix and stuff
module.exports.restartDatabase = ()=>{
    let connection = mysql.createConnection(connectionInfo);
       
    connection.connect();    

    let setupCommands = easyConfig.databaseStartUpScript
    
    for (let command of setupCommands){
        connection.query(command, function (error,results,fields){
            if (error){
                console.log(`Running sql query: ${command}`)
                console.warn("ERROR",error); 
                return
            } 
            console.log(`Running sql query: ${command}`)
            console.log(results)
        })
    }
}
module.exports.validateLogin = (credentials,callbackFunction)=>{
    let username = credentials.username;
    let password = credentials.password;
    username = username.toLowerCase();
    
    let connection = mysql.createConnection(connectionInfo);
    connection.connect();    
    let command = `SELECT * FROM person_t WHERE username='${username}' AND password='${password}';`
    if (command.includes("--")){
        command = command.split("--")[0]
    }

    connection.query(command, function (error,results,fields){
        if (error){
            console.log(`Running sql query: ${command}`)
            console.warn("ERROR",error); 
            return
        } 
        console.log(`Running sql query: ${command}`)
        console.log(results)

        if (results.length > 0){
            callbackFunction({
                status: "success",
                username: results[0].username,
            })
            
        }else{
            lookForUsername(credentials,callbackFunction)
        }
    })
    connection.end();
}

function lookForUsername(credentials,callbackFunction){
    let username = credentials.username;
    let password = credentials.password;
    username = username.toLowerCase();
    
    let connection = mysql.createConnection(connectionInfo);
    connection.connect();    
    let command = `SELECT * FROM person_t WHERE username='${username}';`
    if (command.includes("--")){
        command = command.split("--")[0]
    }

    connection.query(command, function (error,results,fields){
        if (error){
            console.log(`Running sql query: ${command}`)
            console.warn("ERROR",error); 
        } 
        console.log(`Running sql query: ${command}`)
        console.log(results)

        if (results.length > 0){
            callbackFunction({
                status: "failure",
                reason: "Incorrect password."
            })

        }else{
            callbackFunction({
                status: "failure",
                reason: "Username does not exist."
            })
        }
    })
    connection.end();
}

module.exports.getHomeData = (username,callbackFunction)=>{
    username = username.toLowerCase();
    
    let connection = mysql.createConnection(connectionInfo);
    connection.connect();    
    let command = `SELECT * FROM transaction_t INNER JOIN person_t WHERE person_t.username='${username}' AND person_t.id=transaction_t.userID;`
    if (command.includes("--")){
        command = command.split("--")[0]
    }
    connection.query(command, function (error,results,fields){
        if (error){
            console.log(`Running sql query: ${command}`)
            console.warn("ERROR",error); 
            return
        } 
        console.log(`Running sql query: ${command}`)
        console.log(results)

        if (results.length > 0){
            callbackFunction({
                status: "success",
                rows: results
            })

        }else{
            callbackFunction({
                status: "failure",
                reason: "Can not find user."
            })
            return;
        }
    })
    connection.end();
}

module.exports.adminSearchData = (username,targetUser,callbackFunction)=>{
    targetUser = targetUser.toLowerCase();
    
    let connection = mysql.createConnection(connectionInfo);
    connection.connect();    
    let command = `SELECT * FROM transaction_t INNER JOIN person_t WHERE person_t.username='${targetUser}' AND person_t.id=transaction_t.userID;`
    if (command.includes("--")){
        command = command.split("--")[0]
    }
    connection.query(command, function (error,results,fields){
        if (error){
            console.log(`Running sql query: ${command}`)
            console.warn("ERROR",error); 
            return
        } 
        console.log(`Running sql query: ${command}`)
        console.log(results)

        if (results.length > 0){
            callbackFunction({
                status: "success",
                rows: results
            })
        }else{
            callbackFunction({
                status: "failure",
                reason: "Can not find user."
            })
            return;
        }
    })
    connection.end();
}
module.exports.addNewTransaction = (username,targetID,amount,callbackFunction)=>{

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
    
    let connection = mysql.createConnection(connectionInfo);
    connection.connect();    
    let command = `INSERT INTO transaction_t VALUES(${easyConfig.nextTransactionID++}, '${targetID}','${dString}' ,${amount});`

    if (command.includes("--")){
        command = command.split("--")[0]
    }
    connection.query(command, function (error,results,fields){
        if (error){
            console.log(`Running sql query: ${command}`)
            console.warn("ERROR",error); 
            return
        } 
        console.log(`Running sql query: ${command}`)
        console.log(results)
        if (results.warningCount == 0){
            callbackFunction({
                status: "success",
                rows: results
            })
        }else{
            callbackFunction({
                status: "failure",
                reason: "Can not find user."
            })
            return;
        }
    })
    connection.end();
}
