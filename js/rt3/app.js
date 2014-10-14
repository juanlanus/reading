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
} else {
  GLOBAL.settings.staticDir = '/home/jlanus/Dropbox/Public/reading';       // <==========  CHANGE
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

