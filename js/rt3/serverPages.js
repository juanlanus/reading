function serverPages( HPPTPort, db ) {
// PAGES SERVER ****************************************************************
// The web server that serves the HTML pages

  var http = require('http');
  var path = require('path');
  var express = require('express');
  var appData = express();
  var routes = require('./routes');
  // http://stackoverflow.com/questions/16548586/adding-a-new-route-to-node-express

  var appPages = express();
  appPages.set('port',  HPPTPort);
  appPages.use(express.favicon());

  // appPages.set('views', __dirname + '/views');
  // appPages.set('view engine', 'ejs');
  // appPages.use(express.logger('short'));
  // appPages.use(express.bodyParser());
  // appPages.use(express.methodOverride());
  // appPages.use(express.cookieParser('your secret here'));
  // appPages.use(express.session());
  // appPages.use(appPages.router);
  appPages.use( express.static(path.join(__dirname, '../../doc')) );
  console.log( "static dir:" + (path.join(__dirname, '../../doc')) );
  //appPages.use(express.directory('../../doc'));

  // development only
  if ('development' == appPages.get('env')) {
    console.log( 'node thinks this is a dev environment' );
    appPages.use(express.errorHandler());
  } else {
    console.log( 'node thinks this is a prod environment' );
  }

  ///////////////////////// .use(connect.static(__dirname + '/public', { maxAge: oneDay }))

  //appPages.get('/doc/*', function( req, res ) {
    //console.log('GETting /doc/...');
    //res.send( "this is it " + (path.join(__dirname, '../../doc')) );
  //});

  // appPages.get('/', routes.index);
  // appPages.get('/users', user.list);

  http.createServer(appPages).listen(appPages.get('port'), function(){
    console.log('Express Pages server listening on port ' + appPages.get('port'));
  });

};

module.exports.serverPages = serverPages;
