console.log('module in');

/* how the record is prepared by the client:
  a record: i0b1b10p-2n9d-4mkbm-0,1,1,0,0,0,0,125-2
  // prepare the data to be sent to the server in a compact format
  // 1- timestamp
  var serverRecord = RT.data.scrollData.t.toString(36);
  // 2 - document
  serverRecord += '-' + RT.data.documentNumberEncoded;
  // 3 - reader id
  serverRecord += '-' + RT.data.readerNumberEncoded;
  // 4 - docPath and optional percent scrolled
  serverRecord += '-' + RT.data.scrollData.dp + ( !! RT.data.scrollData.p ? '.' + RT.data.scrollData.p : '' );
  // 5 - action code 1=smartScroll ...
  serverRecord += '-' + RT.data.scrollData.a;
  // 6 - additional data: text in case of a scroll with debug activated
  if( RT.settings.debug ) { !! RT.data.scrollData.text ? '-' + RT.data.scrollData.text : ''; }
*/

exports.unCompressActionRecord = function( sRecord ) {
// reformat an action record from transmission format to JS object
  console.log( 'input rec:' + sRecord );

  var part = sRecord.split('-');
  var actionData = {};

  actionData.t = new Date( parseInt( part[0], 36) );         // 1- timestamp
  actionData.doc = parseInt( part[1], 36);                   // 2 - document
  actionData.rdr = parseInt( part[2], 36);                   // 3 - reader id
  // 4 - docPath and optional percent scrolled
  var n = part[3].indexOf('.'); // percent part separator
  if( n < 0 ) { // no percent data
    actionData.dp = part[3];
  } else {
    actionData.dp = part[3].substring( 0, n );               // 4 - docPath
    actionData.p = parseInt( part[3].substring( n + 1 ));    // 4 - optional percent scrolled
  };
  actionData.a = parseInt( part[4], 36);                     // 5 - action code
  if( ( part.length >= 6 ) && GLOBAL.settings.debug ) {
    actionData.txt = part[5];                                // 6 - optional target text, for debug
  };
  console.log( this.getActionName( actionData.a ) + ' ' + JSON.stringify( actionData ) );
  return actionData;
};

exports.getActionName = function( actionId ) {
  if( ! GLOBAL.actionIdMap ) {
    // build a map from ids to names
    actionIdMap = [];
    for( a in GLOBAL.settings.actionIds ) { actionIdMap[GLOBAL.settings.actionIds[a]] = a; }
  }
  return actionIdMap[actionId];

};
