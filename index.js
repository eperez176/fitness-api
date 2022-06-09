const express = require("express")
const http = require.resolve('http')
const util = require('util');
const { MongoClient } = require('mongodb');
const res = require("express/lib/response");
const { stringify,parse } = require('querystring');
var cors = require('cors')

// The Start
const uri = "mongodb+srv://root:BurgerKing@cluster0.7vumd.mongodb.net/fitness?retryWrites=true&w=majority";

var app = express()
const client = new MongoClient(uri);

app.use(cors());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.header(
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('presflightContinue',true);
    next();
})


app.get("/", function(req, res){
    res.send("Home!")
})

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/login/:loginInfo",function(request,response){ // Login checking
    //response.send("Hello World!!")
    console.log('just called...')
    find(request.params.loginInfo).then(r => response.json(r))
})

app.get("/retrieveData/:dataQuery", function(req,res){
    console.log(req.params.dataQuery)
    dataRetrieve(req.params.dataQuery).then(r => res.json(r))
})

// Post

app.post("/newUser", function(req,res){ // Sign Up
    console.log("New user being created and posted...");
    console.log(req.body)
    signUp(req.body).then(r => res.json(r))
    
});
app.post("/newEntry", function(req,res) { // Add Entry for the User
    console.log("New entry...");
    console.log(req.body);
    newEntry(req.body).then(r => res.json(r));
})

const port = process.env.PORT || 10000;

app.listen(port, function () {
    console.log("Started application on port %d", port)
});


// Check if the user and pass are in the DB
async function find(loginInfo){
    try{
        await client.connect();
        const usernameCollection = await client.db('fitness').collection('users');
        const loginInfoObj = parse(loginInfo);
        console.log('The Find Input: ',loginInfoObj.username);
        const query = {username:loginInfoObj.username};
        const doc =  await usernameCollection.find(query).toArray();
        console.log(doc[0].username)
        if(doc[0].username == loginInfoObj.username){
            if(doc[0].password == loginInfoObj.password)
                return true;
        }
        return false;
    }
    catch (e){
        console.error(e);
    }
    finally{
        await client.close();
    }
}

// Sign up the new user
async function signUp(loginInfo){
    try{
        await client.connect();
        const usernameCollection = await client.db('fitness').collection('users');
        const query = {username:loginInfo.username};
        console.log(query)
        const doc = await usernameCollection.find(query).toArray();
        console.log(doc);
        if(!doc.length) // Check if the user exists already
        {
            console.log("empty, good!");
            await usernameCollection.insertOne(loginInfo);
            return true;
        }
        else
            return false
    }
    catch(e){
        console.error(e);
    }
    finally{
        await client.close();
    }
}

// New entry for the user
async function newEntry(entry){
    try {
        await client.connect();
        const user = await client.db('fitness').collection(entry.username);
        delete entry.username;
        console.log(entry);
        await user.insertOne(entry)
    }
    catch(e){
        console.error(e);
    }
    finally {
        await client.close();
    }
}

// New data query
async function dataRetrieve(query){
    try {
        await client.connect();
        const dataObj = parse(query);
        console.log(dataObj)
        const user = client.db('fitness').collection(dataObj.username);
        if(dataObj.option == 'date') {
            console.log("retrieval of date data...")
            const doc = await user.find({date:dataObj.date}).toArray();
            console.log(doc)
            return doc;
        }
        else if(dataObj.option == 'type'){
            console.log("retrieval of type data...");
            return await user.find({workout_type:dataObj.type}).toArray();
        }
        else if(dataObj.option == 'split'){
            console.log('retrieval of split data...');
            return await user.find({workout_split:dataObj.split}).toArray();
        }
        else if(dataObj.option == 'progress'){ // Retrieves docs relating to a specific topic
            console.log('retrieval for progress');
            return await user.find({workout_type:dataObj.progress}).toArray();

        }
        console.log('fail of dataRetrieve')
        return {}

    }
    catch(e){
        console.error(e);
    }
    finally{
        await client.close()
    }
}