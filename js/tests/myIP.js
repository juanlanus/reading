function myIP() {
    require( 'http' );
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open( "GET","http://api.hostip.info/get_html.php?ip=181.14.190.9", false );
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    /* for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        // if ( ipAddress[0] == "IP" ) return ipAddress[1];
    } */

    console.log( xmlhttp.responseText );
    // IP: console.log( request.connection.remoteAddress );
    // or: request.headers['X-Forwarded-For']
    // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 
    // req.socket.remoteAddress || req.connection.socket.remoteAddress;

    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
      console.log('addr: '+add);
    })

    var os=require('os');
    var ifaces=os.networkInterfaces();
    for (var dev in ifaces) {
      var alias=0;
      ifaces[dev].forEach(function(details){
        if (details.family=='IPv4') {
          console.log(dev+(alias?':'+alias:''),details.address);
          ++alias;
        }
      });
    }


    return false;
}

myIP();
