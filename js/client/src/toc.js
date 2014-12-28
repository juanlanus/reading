var TOC = function( options ) {
  'use strict';

  /* TOC data items *************************************************************/

  this.config = {
    openIconFilePath: 'res/expand.png',
    closeIconFilePath: 'res/collapse.png',
    debug: false
  };
  $.extend( this.config, options );

  // the TOC tree
  this.toc = {};

  // TOC node constructor
  this.TocNode = function( level, header, parent ) {
    this.level = level;     // header level 1...6
    this.header = header;   // reference to the DOM element
    this.parent = parent;   // reference to the containing header
    this.children = [];     // this node's descendants
  };
  this.TocNode.prototype.toString = function() {
    if( !! this.header ) {
      /* jshint undef:true, devel:true */
      console.log( this.level + ( new Array(2 * this.level).join(' ') )
      + this.header.textContent );
    } else {
      console.log( this.level + (new Array(2 * this.level).join(' ')) + ' - - no header' );
    }
  };



  /* TOC functions **************************************************************/

  // empty the TOC, reset current level
  this.clearTOC = function() {
    this.toc = {};
  };


  // Recursively display the TOC in the console
  this.logTOC = function() {
    function logTOCNode( thisNode ) {
      console.log( thisNode.toString() );
      for(var i = 0; i < thisNode.children.length; i++) {
        logTOCNode( thisNode.children[i] );
      }
    }

    logTOCNode( this.toc );
  };


  // Render the TOC as nested HTML unordered lists, returns HTML text block
  this.render = function() {
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
  var addTOCItem = function( h, currentNode, currentLevel ) {
    var headerLevel = parseInt( h.tagName.substring(1, 2), 10);
    var newNode = new TOC.TocNode( headerLevel, h, null );
    // go to the tree branch where this header belongs and add it
    if( currentLevel === null ) { // initial empty TOC
      // var toc = newNode;
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
            fillerNode =  new this.TocNode( currentLevel + 1, null, currentNode );
            currentNode.children.push( fillerNode );
            currentLevel++;
            currentNode = fillerNode;
          }
          fillerNode.header = h;
        } else {
          // headerLevel < currentLevel: back up to the header's level
          // navigate the tree backwards and insert the new node
          while( currentLevel > headerLevel ) {
            // assert( currentNode.parent, 'ran out of higher levels navigating upwards');
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
  this.buildTOC = function( dom ) {
    var $allHeaders = $( 'h1, h2, h3, h4, h5, h6', dom );
    var thisNode;
    var currentNode = null;
    var currentLevel = null;
    for( var iah = 0; iah < $allHeaders.length; iah++) {
      thisNode = $allHeaders[iah];
      if( this.config.debug ) { console.log( 'buildTOC: ' + thisNode.tagName + $(thisNode).text() ); }
      addTOCItem( thisNode, currentNode, currentLevel );
    }
    return this.toc;
  };


  // makes the group nodes collapsible by adding click handlers
  this.makeCollapsible = function( tocRoot ) {
    // the argument is a reference to the root of a rendered TOC in the page, a DOM node

    // the actual handler
    function expandCollapseTOC( event ) {
      var c = $( event.target.parentElement );
      if( c.hasClass('rtOpenCloseIcon') ) {
        var theUL = c.parent().children('ul');
        if( c.hasClass('rtExpanded') ) {
          theUL.slideUp( 'fast' );
          $( 'img', c ).attr( 'src', this.config.openIconFilePath );
          c.removeClass('rtExpanded').addClass('rtCollapsed');
        } else {
          if( c.hasClass('rtCollapsed') ) {
            theUL.slideDown( 'fast' );
            /* jshint validthis: true */
            $('img', c).attr( 'src', this.config.closeIconFilePath );
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
    // var tocHTML = tocRoot;
  };

  return this;
};
