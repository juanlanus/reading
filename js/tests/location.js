  doTest();

  // read location information
  function doTest() {
    var locationData;
    var jqXHR = $.ajax({
      type: 'GET',
      url: 'http://api.hostip.info/get_json.php',
      data: 'ip=190.31.97.162',    // &position=true',
      cache: false,
      datatype: 'text',
      error: function() {
        // store the record without location info
        // console.log('failed: ' + serverRecord);
      }
    })
    .done( function( locData, textStatus, jqXHR ) {
      // the location info is available
      console.dir( locData );
      var z = 'status: ' + textStatus + ' ';
      for (i in locData) { z += ( i + ': ' + locData[i] + ', ' ); } 
      $( '#locationData' ).val( z );
    });
  };
