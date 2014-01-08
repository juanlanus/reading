var dbInput = require('../db/in.js');        // database input code

/* PUT a recorded user action */ 
exports.storeActions = function(req, res){
    // res.render('index', { title: 'Express cookies' });
    debugger;
    console.log('storing an action: ' + req.rawBody);
    var actionData = dbInput.unCompressActionRecord( req.rawBody );
    console.log( actionData.toString() );
};

/* GET home page  */ 
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

