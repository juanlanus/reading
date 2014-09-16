$.fn.scrollTo = function( target, options, callback ){
  if( typeof options == 'function' && arguments.length == 2 ) { 
    // scrollTo( callback, target )
    callback = options;
    options = target;
  }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each( function() {
    var $scrollPane = $(this);                                        // the container that scrolls
    // position to: a pix number or an element (not $)
    var scrollTarget = ( typeof settings.scrollTarget == 'number' )   // the offset, or an element within the container to be set at top
    ? settings.scrollTarget               // position to a pix#
    : $( settings.scrollTarget );         // position to an element
    var scrollY = ( typeof scrollTarget == 'number' )
    ? scrollTarget
    : scrollTarget.offset().top + $scrollPane.scrollTop() - parseInt( settings.offsetTop ); // THIS NOT WORKING!!!!
    $scrollPane.animate( 
      { scrollTop: scrollY },
      parseInt( settings.duration ),
      settings.easing,
      function(){ if ( typeof callback == 'function' ) { callback.call(this); } }
    );
  });
}

