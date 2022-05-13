const express = require("express")
const http = require.resolve('http')
const util = require('util');
const { MongoClient } = require('mongodb');
const res = require("express/lib/response");

// The Start
const uri = "mongodb+srv://root:BurgerKing@cluster0.7vumd.mongodb.net/fitness?retryWrites=true&w=majority";

var app = express()
const client = new MongoClient(uri);
//const mongoClient = require('mongodb').MongoClient;

// mongoClient.connect(uri, function(err,db){
//     if(err) throw err;
//     console.log("connected...")
//     const usersCollection = client.db('fitness').collection('users');
//     const query = {username:'foo'};
//     console.log(usersCollection.find(query))
//     db.close();

// })



app.get("/",function(request,response){
    //response.send("Hello World!!")
    find().then(r => response.json(r))
})

const port = process.env.PORT || 10000;

app.listen(port, function () {
    console.log("Started application on port %d", port)
});

// const find = (async(text)=>{
//     try {
//         await client.connect( err => {
//             const usersCollection = client.db('fitness').collection('users');
//             const query = {username:'foo'};
//             const doc = usersCollection.find(query).toArray(function(err,res){
//                 if(err) throw err;
//                 console.log(res)
//                 res
//             });
//         });

//     }
//     catch(err){
//         console.log('error: ', err.message)
//     }
//     finally{
//         await client.close();
//     }
// });

// find();

// client.connect(err => {
//     try{
//         const collection = client.db("fitness").collection("users");
//         console.log("collection passed")
//         const query = {username:'foo'};
//         const doc = collection.find(query).toArray(function(err,res){
//             if(err) throw err;
//             console.log(res)
//         })
//     }
//     catch(err){
//         console.log(err)
//     }
//   // perform actions on the collection object
// //   finally{
// //     client.close();
// //   }
// });

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


async function find(){
    try{
        await client.connect();
        const usernameCollection = await client.db('fitness').collection('users');
        const query = {username:'foo'};
        return await usernameCollection.find(query).toArray();
    }
    catch (e){
        console.error(e);
    }
    finally{
        await client.close();
    }
}