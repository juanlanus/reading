

function serverPages( HPPTPort, db ) {
// PAGES SERVER ****************************************************************
// The web server that serves the HTML pages
  // GLOBAL.settings.staticDir = '/home/jlanus/Dropbox/Public/reading';       http://localhost:3000/js/rt/demo/favicon.ico
  var http = require('http');
  var path = require('path');
  var express = require('express');
  var favicon = require('serve-favicon');
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

  console.log( 'node thinks this is a ' + appPages.get('env') + ' environment' );
  if( 'development' === appPages.get('env') ) { appPages.use(express.errorHandler()); }

  http.createServer(appPages).listen(appPages.get('port'), function(){
    console.log('Express Pages server listening on port ' + appPages.get('port'));
  });
};

module.exports.serverPages = serverPages;


function serverPages( HPPTPort, db ) {
// PAGES SERVER ****************************************************************
// The web server that serves the HTML pages
  // GLOBAL.settings.staticDir = '/home/jlanus/Dropbox/Public/reading';       http://localhost:3000/js/rt/demo/favicon.ico
  var http = require('http');
  var path = require('path');
  var express = require('express');
  var favicon = require('serve-favicon');
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
<<<<<<< HEAD
  appPages.use( express.static( GLOBAL.settings.staticDir ) );
  // appPages.use( express.favicon( GLOBAL.settings.staticDir + ps + 'doc' + ps + 'res' + ps + 'favicon.ico' ));
  // appPages.use( express.favicon( '../js/rt/demo/favicon.ico' ));
=======
  if( process.platform === 'win32' ) {
      appPages.use( express.static(path.join('C:\\w\\reading', '\\')) );
      console.log( "static dir:" + 'C:\\w\\reading' );
  } else {
      appPages.use( express.static(path.join('/home/jlanus/Dropbox/Public/reading', '/')) );
      console.log( "static dir:" + '/home/jlanus/Dropbox/Public/reading' );
  }
  console.log( "dirname:" + __dirname); // dirname:/home/jlanus/Dropbox/Public/reading[/js/rt3]
  //appPages.use(express.directory('../../doc'));

  // development only
  if ('development' == appPages.get('env')) {
    console.log( 'node thinks this is a dev environment' );
    appPages.use(express.errorHandler());
  } else {
    console.log( 'node thinks this is a prod environment' );
  }
>>>>>>> 9db1d45412f02fb4f1f6ff8c91748e5c178287c5

  console.log( 'node thinks this is a ' + appPages.get('env') + ' environment' );
  if( 'development' === appPages.get('env') ) { appPages.use(express.errorHandler()); }

  http.createServer(appPages).listen(appPages.get('port'), function(){
    console.log('Express Pages server listening on port ' + appPages.get('port'));
  });
};

module.exports.serverPages = serverPages;
