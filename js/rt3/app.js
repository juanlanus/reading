// rt web server
// A pair of web servers, one serving "pages" and the other handling the data
// sent by the readers, mostly "actions"

/** Module dependencies  */
var MongoClient = require('mongodb').MongoClient;
var serverData = require('./serverData');

// DATABASE CONNECTION ********************************************************
MongoClient.connect('mongodb://localhost:27017/rtdb', function(err, db) {
  // everything data server runs into this db connection callback
  if(err) {
    // throw err;
    console.log( 'Error attempting to connect to the database' );
    console.log( 'error: ' + err.message );
    if( !! err.lineNumber ) { 
        console.log( 'in line #' + err.lineNumber ); 
    };
    return false;
  };

  // PAGES SERVER **************************************************************
  var ServerPages = require('./serverPages');
  var serverPagesPort = process.env.PORT || 3000;
  ServerPages.serverPages( serverPagesPort, db );

  // DATA SERVER ***************************************************************
  var ServerData = require('./serverData');
  var serverDataPort = 3333;
  ServerData.serverData( serverDataPort, db );

});
