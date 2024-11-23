var express = require('express');
var app = express();
var port = 3000;
// Handling GET requests


app.get('/'
    , function (req, res) {
        console.log("here"),
        res.send('Hello World!');
    });

app.listen(port, function () {
    console.log('Server running on port '
        , 3000);
});