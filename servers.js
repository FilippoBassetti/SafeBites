var express = require('express');
var app = express();
// Handling GET requests

app.get("/", (req,res) => {console.log("here"), res.send(hi)})
