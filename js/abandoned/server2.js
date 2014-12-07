var express=require('express');
var app=express();
app.post('/body', express.bodyParser(), function(req, res) {
    // console.log( 'body ' + req.body.toString() );
    debugger;
    res.send( '+++   ' + req.body );
    res.end();
});
app.post('/nobody', function(req, res) {
    res.send(req.body + '\n   ' + typeof(req.body), {'Content-Type': 'text/plain'});
    debugger;
    res.end();
});
app.listen(3000);
console.log('listening on port 3000');

//stackoverflow.com/questions/11295554/how-to-disable-express-bodyparser-for-file-uploads-node-js
