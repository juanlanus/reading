function serverData( ) {
// DATA SERVER *****************************************************************
// The web server operating on this port handles the data that is stored into
// or retireved from tha database
  console.log( '\nStarting data server:' );

  var http = require('http');
  var path = require('path');
  var express = require('express');
  var appData = express();
  var cors = require('cors');
  var methodOverride = require('method-override');
  var logger = require('morgan');
  var path = require('path');
  var assert = require('assert');
  var errorHandler = require('errorhandler');
  var routes = require('./routes');
  var StoreActions = require('./db/in');

  
  // the server:
  var appData = express();
  appData.set( 'port', GLOBAL.settings.serverDataPort );

  // parse plain text request body
  function rawBody(req, res, next) {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', function(chunk) {
      req.rawBody += chunk;
    });
    req.on('end', function(){
      console.log( 'rawBody parsed: ' + req.rawBody );
      next();
    });
  }

  // all environments
  appData.use(logger('dev'));

  appData.use(rawBody);  // WAS: appData.use(express.bodyParser());
  appData.use(methodOverride());
  appData.use(cors()); // automatically supports pre-flighting
  // appData.use(appData.router);

  if ('development' == appData.get('env')) {
    appData.use(errorHandler());
  }

  appData.put('/storeActions', routes.storeActions);
  appData.get('/', function(req, res, next) { console.log( 'got the f* CORS thing!' ); });
  appData.post('/', cors(), function(req, res, next) { console.log( 'posted the f* CORS thing!' ); });
  http.createServer(appData).listen(appData.get('port'), function(){
    console.log('Express data server listening on port ' + appData.get('port'));
  });
};

module.exports.serverData = serverData;
