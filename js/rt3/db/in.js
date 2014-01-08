// REFACTOR: build a number of small modules each one
// handling a single operation, name them after the handled
// operation


console.log('module in');

/* how the record is prepared by the client:
    // prepare the data to be sent to the server in a weird format
    // 1- date and time
    var serverRecord = RT.scrollTime.getTime().toString(36);
    // 2 - document
    serverRecord += '-' + RT.documentNumberEncoded;
    // 3 - reader id
    serverRecord += '-' + RT.readerNumberEncoded;
    // 4 - docPath and optional percent scrolled
    serverRecord += '-' + RT.scrollData.dp + ( !!RT.scrollData.p ? '.' + RT.scrollData.p : '' );
    // 5 - action code 1 = scroll
    serverRecord += '-1';
    // 6 - additional data: text in case of a scroll with debug activated
    !!RT.scrollData.text ? '-' + 'RT.scrollData.text' : '';
*/

exports.unCompressActionRecord = function( sRecord ) {
  // reformat an action record from transmission format to JS object

  var part = sRecord.split('-');
  var actionData = {};

  // 1- date and time (timestamp)
  actionData.ts = new Date( parseInt( part[0], 36) );
  // 2 - document
  actionData.doc = parseInt( part[1], 36);
  // 3 - reader id
  actionData.rdr = parseInt( part[2], 36);
  // 4 - docPath and optional percent scrolled
  var n = part[3].indexOf('.'); // percent part separator
  if( n < 0 ) {
    // no percent data
    actionData.path = part[3];
  } else {
    actionData.path = part[3].substring( 0, n );
    actionData.p = parseInt( part[3].substring( n + 1 ));
  };
  // 5 - action code, default 1 = scroll
  if( part.length >= 5 ) {
    if( part[4].length > 0 ) {
      actionData.a = parseInt( part[4], 36);
    } else {
      actionData.a = 1;
    }
  } else {
    actionData.a = 1;
  };
  // 6 - optional target text, for debug
  if( part.length >= 6 ) {
    actionData.text = part[5];
  };

  console.log( JSON.stringify( actionData ) );
  return actionData;
};
