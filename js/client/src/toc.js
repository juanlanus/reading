var TOC = (function( options ) {

  /* TOC data items *************************************************************/

  // config parameters
  var config = {
    openIconFilePath: 'res/expand.png',
    closeIconFilePath: 'res/collapse.png',
    debug: false
  };
  $.extend( config, options );

  // reference to the TOC in the DOM
  var tocHTML = null;

  // TOC node constructor
  function TocNode( level, header, parent ) {
    this.level = level;     // header level 1...6
    this.header = header;   // reference to the DOM element
    this.parent = parent;   // reference to the containing header
    this.children = [];     // this node's descendants
  }

  // the TOC tree
  // Contains level 0 through 6 headers.
  // Level 0 is the root and it's children are the level-1 headers (h1's).
  // Thus, a level N node contains level N+1 headers in its children array.
  // Each node has a pointer to its parent node, except for the level-0 node which has null.

  // Current level: the level of the current header (0 ... 6 ), containing an array of headers
  // with level currentLevel + 1
  var currentLevel = 0;
  var currentNode = null;
  var currentNodeParent = null;

  // regex for checking header tags
  var isAHeadingTag = /^[hH][1-6]$/;

  // 'that' is used to make this available to the private methods
  // var that = this;

  /* TOC functions **************************************************************/

  // empty the TOC, reset current level
  function clearTOC() {
    this.toc = new TocNode( 0, null, null );    // a parent-less node
    currentLevel = 0;                           // this is the H1 level
    currentNode = this.toc;                     // position at root node
    currentNodeParent = null;                   // root node has no parent
  }


  // Recursively display the TOC in the console
  var logTOC = function() {
    // display current node and its descendants
    function logTOCNode( thisNode ) {
      if( !! thisNode.header ) {
        /*jshint undef:true, devel:true */
        console.log( thisNode.level + (new Array(2 * thisNode.level).join(' '))
        + thisNode.header.textContent );
      } else {
        console.log( thisNode.level + (new Array(2 * thisNode.level).join(' ')) + ' - - no header' );
      }
      for(var i = 0; i < thisNode.children.length; i++) {
        // recurse over children nodes
        logTOCNode( thisNode.children[i] );
      }
    }
    logTOCNode( this.toc );
  };


  // Render the TOC as nested HTML unordered lists, returns HTML text block
  var render = function() {
    var
      tocHTML = '',
      lineHTML = '',
      levelCtrol = -1,
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

    levelCtrol = -1;            // initialize
    renderNode( this.toc );     // render, starting from the root
    // close opened UL lists
    for( ; openedULs--; ) {
      lineHTML += '</ul>';
    }
    tocHTML += lineHTML;
    return tocHTML;
  };


  // adds the header h at the bottom of the TOC
  var addItem = function( h ) {
    var headerLevel;
    if( isAHeadingTag.test( h.tagName ) ) { // it's a header
      // HTML4: get the header level 1...6 from the tag 2nd char
      headerLevel = parseInt( h.tagName.substring(1, 2), 10);
    } else {
      // not a header: skip
    }

    // build the new node object
    var newNode = new TocNode( headerLevel, h );
    // go to the tree branch where this header belongs and add it
    if( headerLevel === currentLevel ) {
      // same level: push the new node among the current children
      newNode.parent = currentNode.parent;
      currentNode.children.push( newNode );
    } else {
      if( headerLevel > currentLevel ) {
        // subordinate level: create a new branch for this header
        var fillerNode;
        while( currentLevel < headerLevel ) {
          // create a filler node without node ref for now
          fillerNode =  new TocNode( currentLevel + 1, null, currentNode );
          currentNode.children.push( fillerNode );
          currentLevel++;
          currentNode = fillerNode;
          // sanity check
          if( currentNode.level !== currentLevel ) { console.log( 'level drift' ); }
        }
        fillerNode.header = h;
      } else {
        // headerLevel < currentLevel: back up to the header's level
        // navigate the tree backwards and insert the new node
        while( currentLevel > headerLevel ) {
          // sanity check
          if( !currentNode.parent ) { alert('ran out of higher levels navigating upwards'); }
          currentNode = currentNode.parent;
          currentLevel = currentNode.level;
        }
        newNode.parent = currentNode.parent;
        currentNode.children.push( newNode );
      }
    }
  };


  // builds a TOC for the DOM branch passed as argument
  // it is assumed that each and every header has an id (done by rt)
  function buildTOC( dom ) {
    // build an iterator returning the headers
    var headersIterator = document.createNodeIterator(
      dom,                            // root
      NodeFilter.SHOW_ELEMENT,        // only element type nodes
      // Object containing the function to use for the acceptNode method of the NodeFilter
      {
        acceptNode: function(node) {
          // only accept headers
          if ( isAHeadingTag.test( node.tagName ) ) {
            return NodeFilter.FILTER_ACCEPT;
          } else {
            return NodeFilter.FILTER_REJECT;
          }
        }
      },
      null                            // not used but required by IE9?
    );

    var thisNode;
    while( true ) {
      thisNode = headersIterator.nextNode();
      if( thisNode == null ) { break; } // no more nodes
      if( this.config.debug ) { console.log( 'buildTOC: ' + $(thisNode).text() ); }
      addItem( thisNode );
    }
  }


  // makes the group nodes collapsible by adding click handlers
  function makeCollapsible( tocRoot ) {
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
  return {
    config: config,
    clearTOC: clearTOC,
    buildTOC: buildTOC,
    currentLevel: currentLevel,
    currentNode: currentNode,
    currentNodeParent: currentNodeParent,
    logTOC: logTOC,
    render: render,
    makeCollapsible: makeCollapsible,
    openIconFilePath: config.openIconFilePath,
    closeIconFilePath: config.closeIconFilePath,
    tocHTML: tocHTML
  };
})(
  // options:
  {
    debug: true
  }
);
