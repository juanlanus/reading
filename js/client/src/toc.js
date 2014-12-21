var TOC = (function( options ) {
  "use strict";

  var t = {};

  /* TOC data items *************************************************************/

  t.config = {
    openIconFilePath: 'res/expand.png',
    closeIconFilePath: 'res/collapse.png',
    debug: false
  };
  $.extend( t.config, options );

  // the TOC tree
  t.toc = {};

  // reference to the TOC in the DOM
  t.tocHTML = null;

  // TOC node constructor
  t.TocNode = function( level, header, parent ) {
    this.level = level;     // header level 1...6
    this.header = header;   // reference to the DOM element
    this.parent = parent;   // reference to the containing header
    this.children = [];     // this node's descendants
  }
  t.TocNode.prototype.toString = function() {
    if( !! this.header ) {
      /* jshint undef:true, devel:true */
      console.log( this.level + ( new Array(2 * this.level).join(' ') )
      + this.header.textContent );
    } else {
      console.log( this.level + (new Array(2 * this.level).join(' ')) + ' - - no header' );
    }
  };


  var currentLevel = null;
  var currentNode = null;

  /* TOC functions **************************************************************/

  // empty the TOC, reset current level
  function clearTOC() {
    this.toc = {};
    currentLevel = null;
    currentNode = this.toc;
  }


  // Recursively display the TOC in the console
  t.logTOC = function() {
    function logTOCNode( thisNode ) {
      console.log( thisNode.toString() );
      for(var i = 0; i < thisNode.children.length; i++) {
        logTOCNode( thisNode.children[i] );
      }
    }

    logTOCNode( this.toc );
  };


  // Render the TOC as nested HTML unordered lists, returns HTML text block
  t.render = function() {
    var
      tocHTML = '',
      lineHTML = '',
      levelCtrol = 1,
      openedULs = 0
    ;

    function renderNode( thisNode ) {
      lineHTML = '';
      if( thisNode.level > levelCtrol ) {
        // level raise: open a subordinate UL, count it
        lineHTML = '<ul>';
        openedULs++;
      } else {
        if( thisNode.level < levelCtrol ) {
          // level decrease: close UL and update count
          lineHTML = '</li></ul>';
          openedULs--;
        } else {
          // same level: close previous LI
          lineHTML = '</li>';
        }
      }
      levelCtrol = thisNode.level;

      if( !! thisNode.header ) { // node with an actual header
        lineHTML += '<li class="rt_toc_' + thisNode.level + '">';
        lineHTML += '<a href="#' + ( !! thisNode.header.id ? thisNode.header.id : 'NO_ID' ) + '">';
        lineHTML += thisNode.header.textContent;
        lineHTML += '</a>';
      } else { // is a filler node
        lineHTML += '<li class="rt_toc_' + thisNode.level + '">' + '(empty node)';
      }
      tocHTML += lineHTML;
      lineHTML = '';
      for( var ich = 0; ich < thisNode.children.length; ich++ ) {
        // recursively render this node`s descendants
        renderNode( thisNode.children[ich] );
      }
    }

    levelCtrol = 1;             // initialize
    renderNode( this.toc );     // render, starting from the root
    // close opened UL lists
    for( ; openedULs--; ) {
      lineHTML += '</ul>';
    }
    tocHTML += lineHTML;
    return tocHTML;
  };


  // appends the header h to the bottom of the TOC
  var addTOCItem = function( h ) {
    var headerLevel = parseInt( h.tagName.substring(1, 2), 10);
    var newNode = new TocNode( headerLevel, h );
    // go to the tree branch where this header belongs and add it
    if( currentLevel === null ) { // initial empty TOC
      toc = newNode;
      currentLevel = headerLevel;
      console.log( 'created empty TOC');
    } else {
      if( headerLevel === currentLevel ) {
        newNode.parent = currentNode.parent;
        currentNode.children.push( newNode );
      } else {
        if( headerLevel > currentLevel ) {
          // subordinate level: create a new branch for this header
          var fillerNode;
          while( headerLevel > currentLevel ) {
            // create a filler node without node ref for now
            fillerNode =  new TocNode( currentLevel + 1, null, currentNode );
            currentNode.children.push( fillerNode );
            currentLevel++;
            currentNode = fillerNode;
          }
          fillerNode.header = h;
        } else {
          // headerLevel < currentLevel: back up to the header's level
          // navigate the tree backwards and insert the new node
          while( currentLevel > headerLevel ) {
            assert( currentNode.parent, 'ran out of higher levels navigating upwards'); 
            currentNode = currentNode.parent;
            currentLevel = currentNode.level;
          }
          newNode.parent = currentNode.parent;
          currentNode.children.push( newNode );
        }
      }
    }
  };


  // builds a TOC for the DOM branch hanging from the argument
  t.buildTOC = function( dom ) { 
    $allHeaders = $( 'h1, h2, h3, h4, h5, h6', dom );
    var thisNode;
    for( var iah = 0; iah < $allHeaders.length; iah++) {
      thisNode = $allHeaders[iah];
      if( this.config.debug ) { console.log( 'buildTOC: ' + $(thisNode).text() ); }
      addTOCItem( thisNode );
    }
  }


  // makes the group nodes collapsible by adding click handlers
  t.makeCollapsible = function( tocRoot ) {
    // the argument is a reference to the root of a rendered TOC in the page, a DOM node

    // the actual handler
    function expandCollapseTOC( event ) {
      // check that the click happened on one of the open/close icons
      // get a reference to the container div where the click happened
      var c = $( event.target.parentElement );
      if( c.hasClass('rtOpenCloseIcon') ) {
        // get a ref to the associated UL to be mutated
        var theUL = c.parent().children('ul');
        // the click happened in a [+] or [-] div
        if( c.hasClass('rtExpanded') ) {
          // it's expanded: have to close (collapse)
          theUL.slideUp( 'fast' );
          $( 'img', c ).attr( 'src', config.openIconFilePath );
          c.removeClass('rtExpanded').addClass('rtCollapsed');
        } else {
          if( c.hasClass('rtCollapsed') ) {
            // it's collapsed: have to open (expand)
            theUL.slideDown( 'fast' );
            $('img', c).attr( 'src', config.closeIconFilePath );
            c.removeClass('rtCollapsed');
            c.addClass('rtExpanded');
          } else {
            // this is an error: ignore silently
          }
        }
        event.stopPropagation();
      } else {
        if( event.target.nodeName === 'A' ) {
          // it was a click on a link
          // the # target is in event.target.attributes.href.value, it can be
          // used to find the link target's id
          location.hash = event.target.attributes.href.value;
          $.fn.rt.RT.content.focus();
        } else {
          // is a click somewhere else to close the TOC overlay
        }
      }
    }


    // bind the event to the TOC root
    $( tocRoot ).on( 'click', expandCollapseTOC );
    // add the open/close controls to LIs having UL children
    var openCloseIcon = '<div class="rtOpenCloseIcon rtExpanded"><img src="'
      + TOC.config.closeIconFilePath
      + '"/></div>';
    $( 'li:has(ul)', tocRoot ).addClass( 'rtCollapsible' );
    $( '.rtCollapsible', tocRoot ).prepend( openCloseIcon );
    // store a reference to the TOC in the DOM
    tocHTML = tocRoot;
  }


  /* external module interface **************************************************/
  /* /return {
    config: config,
    clearTOC: clearTOC,
    buildTOC: buildTOC,
    currentLevel: currentLevel,
    currentNode: currentNode,
    logTOC: logTOC,
    render: render,
    makeCollapsible: makeCollapsible,
    openIconFilePath: config.openIconFilePath,
    closeIconFilePath: config.closeIconFilePath,
    tocHTML: tocHTML
  }; */

  return t;
})(
  // options:
  {
    debug: true
  }
);

