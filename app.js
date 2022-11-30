const dbcModule = require("./backend/database-connector")

const path = require("path")
const {PORT} = require("./config.json")
const express = require('express')
const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
var cors = require('cors')

app.use(cors())

app.use(express.static(path.join(__dirname,'public')));
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
    dbcModule.setup();
})


app.post("/login",async (req,res)=>{
    console.log("Got a new login request!")

    let credentials = req.body;

    // Validate
    dbcModule.validateLogin(credentials,callback)
    function callback(validationResult){
        if (validationResult.status == "failure"){
            res.send({
                status: "failure",
                reason: validationResult.reason
            });
            return;
        }
    
        let authenticationToken = Buffer.from(credentials.username).toString('base64')
        
        res.send({
            status: "success",
            token: authenticationToken
        });
    }
})


app.post("/home-page-info",(req,res)=>{
    console.log("Got a home page info request!")

    let token = req.body.logintoken;
    let username = req.body.username;
    username = username.toLowerCase();
    
    if ((Buffer.from(token, 'base64').toString()) != username){
        console.log(Buffer.from(token, 'base64').toString(), username)
        res.send({
            status: "failure",
            reason: "Invalid or Expired Token"
        });
        return;
    }
    // Validate
    
    dbcModule.getHomeData(username,callback)
    function callback(result){
        if (result.status == "failure"){
            res.send({
                status: "failure",
                reason: result.reason
            });
            return;
        }
                
        res.send({
            status: "success",
            data: null,
            transactions: result.rows
        });
    
    }
})
app.post("/admin-search",(req,res)=>{
    console.log("Got admin-search request!")

    let token = req.body.logintoken;
    let username = req.body.username;
    let targetUser = req.body.targetUser;

    targetUser = targetUser.toLowerCase();
    username = username.toLowerCase();
    if (Buffer.from(token, 'base64').toString()!= username){
        console.log(Buffer.from(token, 'base64').toString(), username)
        res.send({
            status: "failure",
            reason: "Invalid or Expired Token"
        });
        return;
    }
    // Validate
    
    dbcModule.adminSearchData(username,targetUser,callback)
    function callback(result){
        if (result.status == "failure"){
            res.send({
                status: "failure",
                reason: result.reason
            });
            return;
        }
                
        res.send({
            status: "success",
            data: null,
            transactions: result.rows
        });
    
    }
})
app.post("/new-transaction",(req,res)=>{
    console.log("Got new-transaction request!")

    let token = req.body.logintoken;
    let username = req.body.username;
    let targetUser = req.body.targetUser;
    let amount = req.body.amount
    let targetID = req.body.targetID

    targetUser = targetUser.toLowerCase();
    username = username.toLowerCase();
    if (Buffer.from(token, 'base64').toString() != username){
        console.log(Buffer.from(token, 'base64').toString(), username)
        res.send({
            status: "failure",
            reason: "Invalid or Expired Token"
        });
        return;
    }
    // Validate
    dbcModule.addNewTransaction(username,targetID,amount,callback)
    function callback(result){
        if (result.status == "failure"){
            res.send({
                status: "failure",
                reason: result.reason
            });
            return;
        }
                
        res.send({
            status: "success",
            data: null,
            transactions: result.rows
        });
    
    }
})

app.post("/full-game-reset",(req,res)=>{
    console.log("Got reset request!")
    console.log("-".repeat(20))
    dbcModule.setup();

    res.send({
        status: "success"
    });
})


