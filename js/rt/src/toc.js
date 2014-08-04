var TOC = (function() {

/* TOC data items *************************************************************/

  // config parameters
  // TODO: get better icons, replace with data URIs
  openIconFilePath = "res/expand.png";
  closeIconFilePath = "res/collapse.png";

  // reference to the TOC in the DOM
  var tocHTML = null;

  // TOC node prototype
  function tocNode( level, header, parent ) {
    this.level = level;     // header level 1...6 
    this.header = header;   // reference to the DOM object
    this.parent = parent;   // reference to the containing header
    this.children = [];     // this node's descendants
  }
  // the TOC tree
  // Contains levels 0 through 6 headers. Level 0 is the root and it's
  // children are the level-1 headers (h1's).
  // Thus, a level N node contains level N+1 headers in its children
  // array. 
  // Each node has a pointer to its parent node, except for the level-0
  // node which is parentless and has null.  
  var toc = new tocNode( 0, null, null );

  // current level: the level of the current header (0 ... 6 ), containing
  // an array of headers with level + 1 (level 0 root contains the H1's)
  var currentLevel = 0;
  // currrent node & other data
  var currentNode = null;
  var currentNodeParent = null;

  // regex for checking header tags
  var checkHeading = /^[hH][1-6]$/;

  // 'that' is used to make this available to the private methods 
  var that = this;

/* TOC functions **************************************************************/

  // empty the TOC, reset current level
  function clearTOC() {
    this.toc = new tocNode( 0, null, null );    // a parent-less node
    currentLevel = 0;                           // this is the H1 level
    currentNode = this.toc;                     // position at root node
    currentNodeParent = null;                   // root node has no parent
  };

  // DEBUG: recursively displays the toc in the console
  var logTOC = function() { 

    // display current node and its descendants
    function logTOCNode( thisNode ) {
      if( !!thisNode.header ) {
        console.log( thisNode.level + (new Array(2 * thisNode.level).join(' ')) 
        + thisNode.header.textContent ); 
      } else {
        console.log( thisNode.level + (new Array(2 * thisNode.level).join(' ')) 
        + ' - - no header' ); 
      };
      for(var i = 0; i < thisNode.children.length; i++) {
        // recursively display children nodes
        logTOCNode( thisNode.children[i] );
      };
    };

    logTOCNode( this.toc );
  };

  // render the TOC as nested HTML unordered lists
  // returns HTML text block
  var render = function() {
    var
      tocHTML = '',
      lineHTML = '',
      levelCtrol = -1,
      openedULs = 0;

    // render current node and its descendants, keep count of the
    // number of OLs opened
    function renderNode( thisNode ) {
      lineHTML = '';
      // if there is a level change start or end ULs
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
      };
      levelCtrol = thisNode.level;

      // render the node
      if( !!thisNode.header ) { 
        // node with header
        lineHTML += '<li class="rt_toc_' + thisNode.level + '">';
        lineHTML += '<a href="#' + ( !!thisNode.header.id ? thisNode.header.id : 'NO_ID' ) + '">';
        lineHTML += thisNode.header.textContent;
        lineHTML += '</a>';
      } else {
        // filler node
        lineHTML += '<li class="rt_toc_' + thisNode.level + '">' + '(empty node)';
      };
      // console.log( lineHTML );
      tocHTML += lineHTML;
      for( var i = 0; i < thisNode.children.length; i++ ) {
        // recursively render descendant nodes
        renderNode( thisNode.children[i] );
      };
    };

    levelCtrol = -1;            // initialize
    renderNode( this.toc );     // start rendering from the root
    // close opened UL lists
    for( ; openedULs--; ) {
      lineHTML += '</ul>';
    };
    tocHTML += lineHTML;
    // console.log( lineHTML );
    return tocHTML;
  };

  // adds the header h at the bottom of the TOC
  var addItem = function( h ) {
    if( checkHeading.test( h.tagName ) ) { // it's a header
      // HTML4: get the header level 1...6 from the tag 2nd char
      var headerLevel = parseInt( h.tagName.substring(1, 2), 10);
    } else {
      // not a header: skip
    }

    // build the new node object
    var newNode = new tocNode( headerLevel, h );
    // go to the tree branch where this header belongs and add it
    if( headerLevel === currentLevel ) {
      // same level: push the new node among the current children
      newNode.parent = currentNode.parent;
      currentNode.children.push( newNode );
    } else {
      if( headerLevel > currentLevel ) {
        // create a new branch for this header
        while( currentLevel < headerLevel ) {
          // create a filler node without node ref for now
          var fillerNode =  new tocNode( currentLevel + 1, null, currentNode );
          currentNode.children.push( fillerNode );
          currentLevel++;
          currentNode = fillerNode;
          // sanity check
          if( !currentNode.level === currentLevel ) { console.log( 'level drift' ) };
        } 
        fillerNode.header = h;
      } else {
        // headerLevel < currentLevel: back up to the header's level
        // navigate the tree backwards and insert the new node
        while( currentLevel > headerLevel ) {
          // sanity check
          if( !currentNode.parent ) { alert('ran out of higher levels navigating upwards'); };
          currentNode = currentNode.parent;
          currentLevel = currentNode.level;
        };
        newNode.parent = currentNode.parent;
        currentNode.children.push( newNode );
      };
    };
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
          if ( checkHeading.test( node.tagName ) ) { 
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
      addItem( thisNode );
    };
  };

  // makes the group nodes collapsible adding a click handler
  function makeCollapsible( tocRoot ) {
    // the argument is a reference to the root of a rendered TOC in the page,
    // a DOM node

    // the actual handler
    function expandCollapseTOC( event ) {
      // check that the click happened on one of the open/close icons
      // get a reference to the container div where the click happened
      var c = $(event.target.parentElement)
      if( c.hasClass('rtOpenCloseIcon') ) {
        // get a ref to the associated UL to be mutated
        var theUL = c.parent().children('ul');
        // the click happened in a [+] or [-] div
        if( c.hasClass('rtExpanded') ) {
          // it's expanded: have to close (collapse)
          theUL.slideUp( 'fast' );
          $('img', c).attr( 'src', openIconFilePath );
          c.removeClass('rtExpanded');
          c.addClass('rtCollapsed');
        } else {
          if( c.hasClass('rtCollapsed') ) {
            // it's collapsed: have to open (expand)
            theUL.slideDown( 'fast' );
            $('img', c).attr( 'src', closeIconFilePath );
            c.removeClass('rtCollapsed');
            c.addClass('rtExpanded');
          } else {
            // this is an error: ignore silently
          };
        };
        event.stopPropagation();
      } else {
        if( event.target.nodeName === 'A' ) {
          // it was a click on a link
          // the # target is in event.target.attributes.href.value, it can be 
          // used to find the link target's id
          location.hash = event.target.attributes.href.value;
          RT.$content[0].focus();
        } else {
          // is a click somewhere else to close the TOC overlay
        };
      };
    };


    // bind the event to the TOC root
    $( tocRoot ).on( 'click', expandCollapseTOC );
    // add the open/close controls to LIs having UL children
    var openCloseIcon = '<div class="rtOpenCloseIcon rtExpanded"><img src="'
      + TOC.closeIconFilePath
      + '"/></div>';
    $( 'li:has(ul)', tocRoot ).addClass( 'rtCollapsible' );
    $( '.rtCollapsible', tocRoot ).prepend( openCloseIcon );
    // store a reference to the TOC in the DOM
    tocHTML = tocRoot;

  };

/* external module interface **************************************************/
  return {
    clearTOC: clearTOC,
    buildTOC: buildTOC,
    currentLevel: currentLevel,
    currentNode: currentNode,
    currentNodeParent: currentNodeParent,
    logTOC: logTOC,
    render: render,
    makeCollapsible: makeCollapsible,
    openIconFilePath: openIconFilePath,
    closeIconFilePath: closeIconFilePath,
    tocHTML: tocHTML
  };
})();
