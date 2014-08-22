var express = require('express');
var fs = require('fs');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
        console.log("request for : "+req);
        fs.readFile("./welcome.html", function(err, html) {
        console.log("In readFile");
        res.setHeader("Content-Type", "text/html");
                res.end(html);
                console.log(html); // executed after the file has been read completely 

        });
});

module.exports = router;
