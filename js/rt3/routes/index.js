var dbInput = require('../db/in.js');        // database input code

/* PUT a recorded user action */ 
exports.storeActions = function( req, res ){
  if( GLOBAL.db === undefined ) {
    throw( 'db not defined trying to store actions' ); 
  } else {
    console.log( 'db defined in storeAdctions' );
  }
  // res.render( 'index', { title: 'Express cookies' } );

  console.log( 'storing an action: ' + req.rawBody );
  var actionData = dbInput.unCompressActionRecord( req.rawBody );
  console.log( actionData );
  res.send( '200\n\n' );

  // $$$$ write actionData into mongo
  GLOBAL.db.actions.insert( actionData, function ( err, result ) {
    "use strict"; 
    if ( err ) return callback( err, null ); 
    console.log( 'Inserted new action' );
    callback( err, permalink );
  });

  appData.get( '/storeActions', function( req, res, next ){
    console.log( 'This is CORS-enabled for all origins!' );
    res.json( {msg: 'This is CORS-enabled for all origins!'} );
  });

};

/* GET home page  */ 
exports.index = function( req, res ){
  res.render('index', { title: 'Express' });
};

