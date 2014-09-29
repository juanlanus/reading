// rt web server
// A pair of web servers, one serving "pages" and the other handling the data
// sent by the readers, mostly scrolling "actions"

/** Module dependencies  */
var MongoClient = require( 'mongodb' ).MongoClient;
var serverData = require( './serverData' );
var getConnection = require( './db/getConnection.js' )

/* Configuration */
settings = {};
settings.connURL = 'mongodb://localhost:27017/rtdb'; 


/** global database connestion */
db = null;

// TEST DATABASE CONNECTION ***************************************************
db = MongoClient.connect(
  'mongodb://localhost:27017/rtdb',
  function( err, db ) {
    if( err ) {
      // throw err;
      console.log( 'Error attempting to connect to the database' );
      console.log( 'error: ' + err.message );
      if( !! err.lineNumber ) { console.log( 'in app.js line ' + err.lineNumber ); };
      throw( 'connection to database failed' );
    };
  }
)

// create connection singleton
db = getConnection(
  settings.connURL,
  function() { console.log( 'db connection singleton opened' ); }
);
if( db ) { console.log( 'db not falsy' ); }

// START PAGES SERVER *********************************************************
var ServerPages = require( './serverPages' );
var serverPagesPort = process.env.PORT || 3000;
ServerPages.serverPages( serverPagesPort, db );

// START DATA SERVER **********************************************************
var ServerData = require( './serverData' );
var serverDataPort = 3333;
ServerData.serverData( serverDataPort, db );

