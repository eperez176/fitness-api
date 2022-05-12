const express = require("express")
const http = require.resolve('http')

// The Start

var app = express()


app.get("/",function(request,response){
    response.send("Hello World!!")
})

const port = process.env.PORT || 10000;

app.listen(port, function () {
    console.log("Started application on port %d", port)
});