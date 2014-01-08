var express = require('express');
var fs = require('fs');
var path = require("path");

var app = express.createServer(express.logger());
var salutation = fs.readFileSync(__dirname + '/index.html');
app.use('/imag', express.static(__dirname + '/imag'));
app.use(express.static(__dirname + '/'));
app.get('/', function(request, response) {
  response.send( salutation.toString() );
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
  console.log("http://ec2-54-235-55-224.compute-1.amazonaws.com:8080/");
  console.log("Directory: " + __dirname);
  console.log(".: %s", path.resolve("."));
});
