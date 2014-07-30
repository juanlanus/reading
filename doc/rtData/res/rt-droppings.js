
/* Code snippets **************************************************************/
/*

    function scrollWin(){
        $('html,body').animate(
            { scrollTop: $("#scrollToHere").offset().top },
            2000
        );
    }


    // returns the position of the element relative to BODY (ppk)
    function findPos(element) {
        var curleft = curtop = 0;
        if (element.offsetParent) {
            do {
                curleft += element.offsetLeft;
                curtop += element.offsetTop;
            } while (element = element.offsetParent);
            return { left: curleft, top: curtop };
        }



        $this.offset().top
        -6326.08349609375

        $('#rtBody').height(): 56799
        $('#rtOuter').scrollTop(): 5907

        $(window).height();   // returns height of browser viewport     returns 626
        $(document).height(); // returns height of HTML document        returns 674

        // how to delay the reaction to the scroll events:
        var myVar;
        function myFunction() {
            myVar = setTimeout(function(){alert("Hello")},3000);
        }

        function myStopFunction() {
            clearTimeout(myVar);
        }

// calculates absolute Y of the argument, accounts for scrolling
function getOffsetTop(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docElem = document.documentElement;
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var top  = box.top +  scrollTop - clientTop;
    return Math.round(top);
}

function getRelativeYOffset(elem) {
    if( !RT.containerYOffset ) { RT.containerYOffset = getOffsetTop(RT.$container[0]); };
    return getOffsetTop(elem) - RT.containerYOffset;
};

// returns the position of one inner element relative to other that
// contains it
function offsetRelative($innerElement, $outerElement) {
    var offsetInner = $($innerElement).offset();
    var offsetOuter = $($outerElement).offset();
    return {
        left: $($innerElement).offset().left - $($outerElement).offset().left,
        top: $($innerElement).offset().top - $($outerElement).offset().top
    };
};

// returns the position of the element relative to BODY (ppk)
function getAbsolutePos(element) {
    var curleft = curtop = 0;
    if (element.offsetParent) {
        do {
            curleft += element.offsetLeft;
            curtop += element.offsetTop;
        } while (element = element.offsetParent);
    }
    return { left: curleft, top: curtop };
};




        */

/*      // get the scroll info saved in the "scrollData" cookie
        var scrollData = {};
        scrollData = JSON.parse(COOKIE.read('scrollData'));
        // DEBUG: dummy cookie (the element id is "NULL", works OK in Chrome)
        // scrollData = {"scrollTop":8759,"dp":"0,0,1,2,2,3,0,1"};
        // scrollData = {"scrollTop":40463,"dp":"0,0,1,3,18,3,0,1"}
        // scrollData = {"scrollTop":2102,"dp":"0,0,1,1,1,0,0,3,9,1,5,1,1,1,6","text":"Flag (type F) "}
        console.log( 'cookie docPath: ' + scrollData.dp + ' ' + scrollData.text );

        // position the content according to scrollData cookie
        // RT.scrollToPosition( scrollData );
*/


        /* $(window).unload( 
            function () {
                localStorage.setItem("bye", new Date().toISOString());
            } 
        ); */


/* COOKIES ********************************************************************/
/*
var COOKIE = {};
COOKIE.create = function(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value+expires+"; path=/";
};

COOKIE.read = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

COOKIE.erase = function (name) {
    COOKIE.create(name, "", -1);
};


    // store scrollData in a cookie
    COOKIE.create('scrollData', JSON.stringify(RT.scrollData), 333);


*/


/* JASONP from http://www.intelligrape.com/blog/2012/09/24/accessing-remote-data-through-cross-domain-ajax-call-in-jquery/

function crossDomainCall(url,data,fnSuccess,fnError){
  $.ajax({
    type: 'POST',
    url: url,
    contentType: "application/json",
    dataType: 'jsonp',
    crossDomain: true,
    data: data,
    success: fnSuccess,
    error: fnError
  });
};

function authenticateUser(username, password) {
  var url = 'http://www.example.com/user/authenticate';
  var data={username: username, password: password};
  var fnSuccess=function (dataReceived) {
    if(dataReceived) {
      alert("Welcome " + dataReceived.name);
    } else {
      alert("Authentication failed")
    }
  };

  var fnError=function (e) {
    alert(e);
  };
  crossDomainCall(url,data,fnSuccess,fnError);
};

*/

/*                          http://www.html5rocks.com/en/tutorials/cors/
 
$.ajax({                    // http://api.jquery.com/jQuery.ajax/

  // The 'type' property sets the HTTP method.
  // A value of 'PUT' or 'DELETE' will trigger a preflight request.
  type: 'GET',

  // The URL to make the request to.
  url: 'http://updates.html5rocks.com',

  // The 'contentType' property sets the 'Content-Type' header.
  // The JQuery default for this property is
  // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
  // a preflight. If you set this value to anything other than
  // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
  // you will trigger a preflight request.
  contentType: 'text/plain',

  xhrFields: {
    // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
    // This can be used to set the 'withCredentials' property.
    // Set the value to 'true' if you'd like to pass cookies to the server.
    // If this is enabled, your server must respond with the header
    // 'Access-Control-Allow-Credentials: true'.
    withCredentials: false 
  },

  headers: {
    // Set any custom headers here.
    // If you set any non-simple headers, your server must include these
    // headers in the 'Access-Control-Allow-Headers' response header.
  },

  success: function() {
    // Here's where you handle a successful response.
  },

  error: function() {
    // Here's where you handle an error response.
    // Note that if the error was due to a CORS issue,
    // this function will still fire, but there won't be any additional
    // information about the error.
  }
});

*/

