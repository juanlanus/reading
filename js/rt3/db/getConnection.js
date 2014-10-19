var MongoClient = require('mongodb').MongoClient;

var getConnection = function getConnection( connURL, callback ) {
  if ( GLOBAL.db ) {
    // connection already opened: no error, run callback
    callback( null, GLOBAL.db );
  } else {
    // open new connection
    console.log( 'About to attempt connection with: ' + GLOBAL.settings.connURL );
    GLOBAL.db = MongoClient.connect(
      GLOBAL.settings.connURL,
      function( err, db ){
        if( err ) { 
          console.log( 'Error creating new connection ' + err ); 
        } else {
          console.log( 'created new connection to ' + GLOBAL.settings.connURL );
        }
        // run callback
        callback( err, db );
        return;
      }
    );
  }
}

module.exports = getConnection;


/* usage example:
 * http://stackoverflow.com/questions/17895309/setting-up-a-mongodb-database-connection-with-node-js

var getConnection = require('yourpath/connection.js')

function yourfunction() {
  getConnection( function( err,GLOBAL.db ) {
    // your callback code
  }
  .
  .
  .
}

other, with export:
http://stackoverflow.com/questions/15039045/access-app-js-variables-in-routes-but-without-global-express
--in apps.js:
exports.GLOBAL.db = db;

--routes/index.js
var db = require("app").db;

The other way is to add db to every handler like this:
--in app.js: then it should be available in any route as req.db
app.use( function( req, res, next ){ req.db = db; next(); } );
app.get( '/', routes.index );
app.get( '/tasks', routes.getAllTasks );

*/
