/* RT - functions *************************************************************/



// TODO: the plugin should not set a handler as global as this one
$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
  // alert( "Triggered ajaxError handler." );
});

/* RT - smart scrolling *******************************************************/

/* RT - set it to work ********************************************************/

  // Start RT:
  // The argument is a jQuery selector string for the fixed-height container that
  // houses the tall content
  function rt(rtContainerSelector, pageNumber){

    // store a global reference to the container and one to its content, check
    // that the container has only one child
    RT.$container = $(rtContainerSelector);


    /* $(window).scroll(function() {
      console.log('scrolled');
    }); */

    // scroll event in pure js
    // RT.$container.get(0).onscroll = function() { alert('it scrolled!'); };


    // clicking the lower half of the viewport smartscrolls forward
    // clicking the top half of the viewport smartscrolls backwards
    /* RT.$content.on(
      'click',
      function( e ) {
        // check that the click happened in the text container
        if( e.currentTarget.id == RT.$content.attr('id') ) {
          // check if it happened in the lower half of the viewport
          if( e.clientY > ( $(window).height() / 2 ) ) {
            console.log( 'scroll forward ');
            // scroll forward a chunk
            RT.smartScrollToNextElement();
          } else {
            console.log( 'scroll back ');
            // scroll back
            RT.smartScrollToPrevElement();
          };
        };
      }
    ); */

  };
