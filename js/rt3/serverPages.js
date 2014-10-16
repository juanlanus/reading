function serverPages() {
// PAGES SERVER ****************************************************************
// The web server that serves the HTML pages
  console.log( '\nStarting pages server:' );

  var http = require('http');
  // GLOBAL.settings.staticDir = '/home/jlanus/Dropbox/Public/reading';
  var routes = require('./routes');
  // http://stackoverflow.com/questions/16548586/adding-a-new-route-to-node-express
  var express = require('express');
  var path = require('path');
  var assert = require('assert');
  var favicon = require('serve-favicon');
  var errorHandler = require('errorhandler');
  var logger = require('morgan');

  console.log( 'GLOBAL.settings.staticDir: ' + GLOBAL.settings.staticDir );
  console.log( 'favicon: ' + path.join( GLOBAL.settings.staticDir, 'doc', 'res', 'favicon.ico' ) );

  var appPages = express();
  appPages.set( 'port',  GLOBAL.settings.serverPagesPort );
  appPages.use( favicon( '/home/jlanus/__reading/js/rt/demo/favicon.ico' ));

  // appPages.set('views', __dirname + '/views');
  // appPages.set('view engine', 'ejs');
  appPages.use(logger('dev'));
  // appPages.use(bodyParser());
  // appPages.use(methodOverride());
  // appPages.use(cookieParser('your secret here'));
  // appPages.use(session());
  // appPages.use(appPages.router);
  appPages.use( express.static( GLOBAL.settings.staticDir ) );
  appPages.use( favicon( path.join( GLOBAL.settings.staticDir, 'doc', 'res', 'favicon.ico' ) ) );
  // appPages.use( favicon( '../js/rt/demo/favicon.ico' ));

  // development only
  if ( appPages.get('env') === 'development' ) {
    console.log( 'node thinks this is a dev environment' );
    appPages.use( errorHandler() );
  } else {
    console.log( 'node thinks this is a prod environment' );
  }

  http.createServer(appPages).listen(appPages.get('port'), function(){
    console.log('Express Pages server listening on port ' + appPages.get('port'));
  });
};

module.exports.serverPages = serverPages;

