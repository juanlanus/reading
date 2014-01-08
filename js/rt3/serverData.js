function serverData( HPPTPort, db ) {
// DATA SERVER *****************************************************************
// The web server operating on this port handles the data that is stored into
// or retireved from tha database

  var http = require('http');
  var path = require('path');
  var express = require('express');
  var routes = require('./routes');
  var cors = require('cors');
  
  // the server:
  var appData = express();
  appData.set('port', 3333);

  // parse plain text request body
  function rawBody(req, res, next) {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', function(chunk) {
      req.rawBody += chunk;
    });
    req.on('end', function(){
      next();
    });
  }

  // all environments
  appData.use(express.logger('dev'));
  // replaced by rawBody(): appData.use(express.bodyParser());
  appData.use(rawBody);
  appData.use(express.methodOverride());
  appData.use(cors()); // automatically supports pre-flighting
  appData.use(appData.router);
  // development only
  if ('development' == appData.get('env')) {
    appData.use(express.errorHandler());
  }

  appData.get('/storeActions', function(req, res, next){
    console.log( 'This is CORS-enabled for all origins!' );
    res.json({msg: 'This is CORS-enabled for all origins!'});
  });

  appData.put('/storeActions', routes.storeActions);

  appData.get('/', function(req, res, next) {
    console.log( 'got the f* CORS thing!' );
  });

  appData.post('/', cors(), function(req, res, next) {
    console.log( 'posted the f* CORS thing!' );
  });

  http.createServer(appData).listen(appData.get('port'), function(){
    console.log('Express data server listening on port ' + appData.get('port'));
  });

};

module.exports.serverData = serverData;
