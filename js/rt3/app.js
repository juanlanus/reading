// rt web server
// A pair of web servers, one serving "pages" and the other handling the data
// sent by the readers, mostly scrolling "actions"


/** Configuration */
GLOBAL.settings = {};
// http://docs.mongodb.org/manual/reference/connection-string
GLOBAL.settings.connURL = 'mongodb://localhost:27017/rtdb/?w=0'; 
GLOBAL.settings.serverPagesPort = process.env.PORT || 3000;
GLOBAL.settings.serverDataPort = 3333;
GLOBAL.settings.debug = true;
console.log( 'process.platform: ' + process.platform );
if( process.platform === 'win32' ) {
  GLOBAL.settings.staticDir = path.join('C:\\w\\reading', '\\');
} else { // 'linux'
  GLOBAL.settings.staticDir = '/home/jlanus/Dropbox/Public/reading';
}

GLOBAL.settings.actionIds = { // encoding of recorded user actions types
  sessionStart: 0,
  smartScroll: 1,
  scroll: 2,
  resize: 6,
  followLink: 5,
  openTOC: 7,
  selectTOCLink: 8,
  focusLost: 20,
  focusRegained: 21,
  sessionEnd: 25
};


/** database connection */
GLOBAL.db = null;

/** Module dependencies  */
var assert = require('assert');
var MongoClient = require( 'mongodb' ).MongoClient;
var Server = require( 'mongodb' ).Server;
var format = require( 'util' ).format;
var path = require('path');
var getConnection = require( './db/getConnection.js' );
var express = require( 'express' );
assert( express );
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');

// CONNECT TO DATABASE AND TEST ***********************************************

MongoClient.connect(
  GLOBAL.settings.connURL,
  {},                               // options
  function( err, db ) {
    if( err ) {
      console.log( 'Error attempting to connect to the database' );
      console.log( 'error: ' + err.message );
      if( err.lineNumber ) { console.log( 'in app.js line ' + err.lineNumber ); };
      throw( 'connection to database failed: ' + err.message );
    };

    // no err: publish connection
    GLOBAL.db = db;

    // connection test: logs an ever-increasing number
    var collection = db.collection('test_insert');
    collection.insert(
      {a:2},
      function( err, docs ) {
        collection.count(function(err, count) {
            console.log( format( 'count = %s', count ) );
        });
    });
    
    GLOBAL.db.actions = db.collection('actions'); 

    // START DATA SERVER **********************************************************
    var ServerData = require( './serverData.js' );
    assert( ServerData );
    ServerData.serverData();

    // START PAGES SERVER *********************************************************
    var ServerPages = require( './serverPages' );
    ServerPages.serverPages( GLOBAL.settings.serverPagesPort, GLOBAL.db );

  }

)
