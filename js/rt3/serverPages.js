function serverPages() {
// PAGES SERVER ****************************************************************
// The web server that serves the HTML pages
  // GLOBAL.settings.staticDir = '/home/jlanus/Dropbox/Public/reading';
  var express = require('express');
  var path = require('path');
  var favicon = require('serve-favicon');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var methodOverride = require('method-override');
  var session = require('express-session');
  var bodyParser = require('body-parser');
  // var multer = require('multer');
  var errorHandler = require('errorhandler');
  var routes = require('./routes');
  // http://stackoverflow.com/questions/16548586/adding-a-new-route-to-node-express

  console.log( 'GLOBAL.settings.staticDir: ' + GLOBAL.settings.staticDir );
  var ps = path.sep; 
  console.log( 'favicon: ' +  GLOBAL.settings.staticDir + ps + 'doc' + ps + 'res' + ps + 'favicon.ico' );

  var appPages = express();
  appPages.set('port',  HPPTPort);
  appPages.use( express.favicon( '/home/jlanus/__reading/js/rt/demo/favicon.ico' ));

  // appPages.set('views', __dirname + '/views');
  // appPages.set('view engine', 'ejs');
  // appPages.use(express.logger('short'));
  appPages.use(express.logger('dev'));
  // appPages.use(express.bodyParser());
  // appPages.use(express.methodOverride());
  // appPages.use(express.cookieParser('your secret here'));
  // appPages.use(express.session());
  // appPages.use(appPages.router);
  appPages.use( express.static( GLOBAL.settings.staticDir ) );
  // appPages.use( express.favicon( GLOBAL.settings.staticDir + ps + 'doc' + ps + 'res' + ps + 'favicon.ico' ));
  // appPages.use( express.favicon( '../js/rt/demo/favicon.ico' ));

  // development only
  if ('development' == appPages.get('env')) {
    console.log( 'node thinks this is a dev environment' );
    appPages.use(express.errorHandler());
  } else {
    console.log( 'node thinks this is a prod environment' );
  }

  http.createServer(appPages).listen(appPages.get('port'), function(){
    console.log('Express Pages server listening on port ' + appPages.get('port'));
  });
};

module.exports.serverPages = serverPages;

