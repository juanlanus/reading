
v3:

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret here' }));
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});






v4:

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/users', user.list);

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});












// rt web server
// A pair of web servers, one serving "pages" and the other handling the data
// sent by the readers, mostly scrolling "actions"


/** Configuration */
GLOBAL.settings = {};
// http://docs.mongodb.org/manual/reference/connection-string
GLOBAL.settings.connURL = 'mongodb://localhost:27017/rtdb/?w=0'; 
GLOBAL.settings.serverPagesPort = process.env.PORT || 3000;
GLOBAL.settings.serverDataPort = 3333;
console.log( 'process.platform: ' + process.platform );
if( process.platform === 'linux' ) {
  GLOBAL.settings.staticDir = '/home/jlanus/Dropbox/Public/reading';
} else { // 'win32'
  GLOBAL.settings.staticDir = path.join('C:\\w\\reading', '\\');
}

/** Module dependencies  */
var assert = require('assert');
var MongoClient = require( 'mongodb' ).MongoClient;
var Server = require( 'mongodb' ).Server;
var format = require( 'util' ).format;
var getConnection = require( './db/getConnection.js' );
var express = require( 'express' );
assert( express );

/** global database connection */
GLOBAL.db = null;

// CONNECT TO DATABASE AND TEST ***********************************************

GLOBAL.db = MongoClient.connect(
  GLOBAL.settings.connURL,
  function( err, db ) {
    if( err ) {
      console.log( 'Error attempting to connect to the database' );
      console.log( 'error: ' + err.message );
      if( err.lineNumber ) { console.log( 'in app.js line ' + err.lineNumber ); };
      throw( 'connection to database failed: ' + err.message );
    };

    // connection test
    var collection = db.collection('test_insert');
    collection.insert(
      {a:2},
      function( err, docs ) {
        collection.count(function(err, count) {
            console.log( format( 'count = %s', count ) );
        });
    });
  }
)

// START DATA SERVER **********************************************************
var ServerData = require( './serverData.js' );
assert( ServerData );
ServerData.serverData();

// START PAGES SERVER *********************************************************
var ServerPages = require( './serverPages' );
ServerPages.serverPages( GLOBAL.settings.serverPagesPort, GLOBAL.db );

