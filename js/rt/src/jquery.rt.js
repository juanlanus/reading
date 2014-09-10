(function rtIIFE( $, window, document, undefined ) {

  // ********************************************************************************
  // Plugin variables
  var
    pluginName = "rt",

    // 'that' is used to make this available to the private methods (this module uses RT)
    that = this,

    defaults = {
      // TODO: start at (0, 0) and move right and down checking until the point lies into a desdendant of the container
      leftTopVisiblePix: {                // container's top left corner coordinates, used
        left: 222,                        // to detect visibility using method
        top: 10                           // elementFromPoint() where this is the point
      },
      smartScrollHeight: 333,
      ssIgnoreClass: 'ssIgnore',          // marker class for non-top elements
      scrollDuration: 777,                // duration of the scroll to position animation
      tallElementLimit: 300,              // elements taller with height greater then this are
                                          // considered "tall" and the percent scroll is stored
      // development aids
      debug: false
    },

    // Built by init() by applying the options over the defaults
    settings = {}
  ;

  // ********************************************************************************
  // The actual plugin constructor
  function Plugin ( element, options ) {
    // reference to the container (the pugin element) and its content
    this.element = element;
    this.$element = $( element );
    this.content = this.$element.children()[0];
    this.$content = $( this.content );
    // merge options into defaults object
    this.settings = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    // make the plugin data publicly accesible
    $.fn.rt.RT = this;
    // initialize tue plugin
    this.init();
  }

  // ********************************************************************************
  // add functionality to Plugin prototype
  $.extend( Plugin.prototype, {

    init: function () {
      var RT = $.fn.rt.RT;

      RT.data = initData();

      this.buildDocMap();
      setHandler_onbeforeunload();
      setHandler_keyboard( RT );
      setHandler_resize( RT );
      buildControlPanel( RT );
      storeQueryString( RT );
      setHelp( RT );
      RT.displayProgress();
      setHighlighter( RT );
      setTOC( RT );
      showMenu( RT );
      setHandler_scroll( RT );

      // get the last recorded scroll position or null and scroll to it
      RT.data.scrollData = this.getLastRecordedPosition( RT );
      if( RT.data.scrollData ) {
        RT.scrollToPosition( RT.data.scrollData );
      } else {
        // scroll to ... 
      };
    },

    buildDocMap: function() {
    // build the document structure map used for semantic positioning
      var RT = $.fn.rt.RT;
      RT.data.docMap = {};
      // init structure values: item [0] is the page, items [1] to [6] correspond
      // to headers H1 through H6, then comes the element number and the element's
      // internal subtree
      // DEBUG: log the docPaths in a PRE element $('#docPathLog')
      // $('#docPathLog').clear;
      var docPath = [RT.settings.pageNumber, 0, 0, 0, 0, 0, 0];
      var $context = RT.$content;         // will iterate over the DOM elements
      buildPath( RT, $context, docPath, 0 ); // start at level 0 = before first tag
      // calculate the value of the scrollTop of all headers (used to identify 
      // the topmost element in the scroll event) 
      this.storeHeaderScrollTops();

      // build the tops map with the scroll position of every text node
      RT.buildTopsMap();

        /* local subfunction **********************************************************/
        function buildPath( RT, $context, docPath, level ) {
        // recursively visit the elements of the DOM tree levels and record their docPath data
          // RT: a reference to the data
          // $context: process the children of this element
          // docPath: starting docPath, buid on it
          // level: non-H (subtree) tags deph level, 0 = first one, in docPath[7]
          // TODO: get a list of the block tagnames
          // TODO: this function assumes that the headers tree is correctly structured HTML4
          // TODO: elements positioned absolute or fixed are taken from the normal flow
          // and should be handled especially
          // $$$$ this line was suspicious: RT.data.docMap = {};
          var 
            $mappedElements = $context.children().not('[float=left]').not('[float=right]'),
            n = $mappedElements.length,
            i = 0,
            checkHeading = /^[hH][1-6]$/    // the element is h1...h6
          ;
          // loop over the elements collection that comprise the content of this context
          for( i = 0; i < n; i++ ) {
            // build the docPaths of the subtree of this
            thisElement = $mappedElements[i];
            $thisElement = $( thisElement );
            // if the current element is a header, increment the docpath counter at this header
            // level and reset the rigth-hand non-header part of docPath
            if( checkHeading.test( thisElement.tagName ) ) { // it's a header h1...6
              // update header count
              var headerLevel = parseInt( thisElement.tagName.substring(1, 2), 10 );
              // count the newfound header
              docPath[headerLevel]++;
              // clear the subtree header counters
              for( var j = headerLevel + 1; j < 8; j++ ) { docPath[j] = 0; }
              // truncate the docpath array to only the headers count
              docPath.length = 7;
              // ensure that the header element has an id
              setId( RT, docPath, thisElement );
              // reset the non-header tags level
              level = 0;
            } else {  // not a header
              // it's an "non-header" element, count 1 more in its level
              // TODO: should filter for DIV P IMG TABLE TR UL OL LI DL DT
              // DD QUOTE ... (more block elements), or for elements with height
              if( ! docPath[level + 7] ) {
                docPath[level + 7] = 1;     // new level, grow array
              } else {
                docPath[level + 7]++;       // level already started
              }
            }
            // store the element's docPath attribute
            $thisElement.attr( 'docPath', docPath.toString() );
            // DEBUG: log the docPaths in a PRE element $('#docPathLog')
            // TODO: some elements have a wrong docPath with an empty item, log them always
            if ( RT.settings.debug || ( docPath && docPath.indexOf( ',,' ) !== -1 ) ) {
              buildPathLog();
            };
            // build the path for this element's children (pass a copy of current path)
            buildPath ( RT, $thisElement, docPath.slice(0), level + 1 );

          } // next elements-to-map

          function buildPathLog() {
            var tn = thisElement.tagName;
            var z = '';
            if( !( tn === 'BR' || tn === 'CODE' || tn === 'COL' || tn === 'A' || tn === 'TD' || tn === 'COLGROUP' || tn === 'TH' || tn === 'TBODY') ) {
              var indent = new Array(2 * level).join(' ');
              if( tn.substring(0, 1) === 'H' ) { indent = '++' + indent.substring(2); };
              var tab = 16 - indent.length - tn.length;
              var tab = new Array( tab > 0 ? tab : 1 ).join('_');
              var dp = ( $thisElement.attr('docPath') + '                         ' ).substring(0, 24);
              z += indent + thisElement.tagName + tab + dp;
              z += '  offsetTop:' + thisElement.offsetTop; // + '  getRelativeTop:' + RT.getRelativeTop(thisElement)
              if( !! $thisElement.attr('id') ) { z += '  id:' + $thisElement.attr('id'); }
              var scrollDataText = $thisElement.text().substr(0, 50).replace(/\r?\n|\r/g, ' ');
              if( scrollDataText ) { z += '  \t' + scrollDataText; }
              z += '\n';
              // console.log( z );
              $('#docPathLog').append( z );
            }
          };
        } // end of local sub function buildPath()

        /* local subfunction **********************************************************/
        function setId( RT, docPath, theElement ) {
        // makes an id out of the docPath and assigns it to the theElement iif it
        // does not have already an id (theElement is always a header)
          var theId = null;
          // check if the element already has an id
          if( !! theElement.id ) {
            theId = theElement.id;
          } else {
            // no id: provide one made after its docPath by prepending "RT-" and 
            // replacing the toString commas by "-", use the first 7 items
            // TODO: should make the id out of the header text better than the docPath (a slug)
            // TODO: must check for uniqueness
            theId = 'RT-' + docPath.slice(0, 7).toString().replace(/,/g, '-');
            theElement.id = theId;
          };
          // store the id in the headersId map indexed by the 1st 7 docPath elements
          RT.data.headerId[docPath.slice(0, 7).toString()] = { id: theId };
          return theId;
        };
    },

    storeHeaderScrollTops: function() {
    // stores the scrollTop of each header in RT.data.headerId indexed by id
    // TODO: must add the top item with docPath 0,0,0,0,0,0,0
      var RT = $.fn.rt.RT;
      RT.data.docMap = {};
      for( var oneHeader in RT.data.headerId ) { 
        RT.data.headerId[oneHeader].offsetTop = RT.getRelativeTop( 
          document.getElementById( RT.data.headerId[oneHeader].id )
        );
      };
      // add a top-of-the-text reference, before the first header
      // TODO: implies that the content element has an id
      RT.data.headerId[ RT.content.id ] = {};
      RT.data.headerId[ RT.content.id ].offsetTop = RT.getRelativeTop( RT.content );
    },

    // return the last recorded position of the document docNumber or null
    getLastRecordedPosition: function( RT ) {
      if( !localStorage ) { return null; };
      // loop backwards over localStorage keys looking for a scroll record of
      // this document (has an "RT-nnnn-xxxx" key where nnnn is the document
      // id encoded and xxxx is the time)
      RT.data.latestTime = {};
      RT.data.latestTime = { time: -1, index: -1};
      //  loop over localstorage keys looking for this doc's latest scroll record
      // TODO: replace this local version by an online one
      for( var i = localStorage.length - 1; i >= 0; i-- ) {
        var k = localStorage.key( i );
        if( k.substring( 0, 3 ) === 'RT-' ) {
          var part = k.split( '-' );
          if( part.length === 3 ) {
            // check that it's related to this document
            if( part[1] === RT.data.documentNumberEncoded ) {  
              // compare times and save if newer than latestTime
              if( part[2] > RT.data.latestTime.time ) {
                // yes it's more recent, check that it has .dp
                var lastRecordedData = JSON.parse(localStorage.getItem( k )); 
                if( lastRecordedData.dp ) {
                  // yes it's newer and has .dp: save in latest
                  RT.data.latestTime.time = part[2];
                  RT.data.latestTime.index = i;
                  RT.data.latestTime.data = lastRecordedData;
                };
              };
            };
          };
        };
      };
      // was there a scroll record for this doc?
      if( RT.data.latestTime.index === -1 ) { return null; };
      // success: return the read scrolldata
      return RT.data.latestTime.data;
    },

    buildTopsMap: function() {
    // build a list of the text nodes and their position in the rendered page,
    // to be used for finding the "next" paragraph when the user scrolls
    // it contains a reference to each DOM element and it's scroll position
    // relative to the top of the document
      var RT = $.fn.rt.RT;
      // build the topsMap array
      RT.data.topsMap = [];
      var 
        $allElems = $('*', RT.$content),
        topsMapNeedsSort = false,
        thisNode,
        n = $allElems.length,
        i = 0,
        previousNodeTop = -1000000
      ;
      var reltop = 0;
      for( i = 0; i < n; i++ ) {
        thisNode = $allElems[i];
        if( thisNode.getBoundingClientRect() ) {
          RT.data.topsMap.push({
            node: thisNode, 
            top: RT.getRelativeTop( thisNode )
          })
        };
        var topsMapN = RT.data.topsMap.length;
        // DEBUG: 
        // console.log( RT.data.topsMap.length + ' ' + thisNode.nodeName + ' ' + RT.data.topsMap[topsMapN - 1].top);
        // DEBUG: check how the same top value appears more than once
        if( RT.data.debug ) { 
          if( RT.data.topsMap[topsMapN - 1].top == previousNodeTop ) {
            console.log( 'top val repeated: ' + RT.data.topsMap[topsMapN - 1].node.nodeName 
            + ' ' +  previousNodeTop );
          }
        };
        // check that tops are sorted
        if( RT.data.topsMap[topsMapN - 1].top < previousNodeTop ) { topsMapNeedsSort = true; }
        previousNodeTop = RT.data.topsMap[topsMapN - 1];
      };

      // sort topsMap on position order if needed
      // TODO: NYI
      if( topsMapNeedsSort ) { /* RT.data.topsMapSort() */ }
      // prepare for the index of the top element
      RT.data.topsMapIdx = 0;
    }, 

    scrollToPosition: function( scrollData ) {
      // reposition the content according to the scrollData argument
      var RT = $.fn.rt.RT;
      // check if the docpath data is available ...
      if( scrollData && scrollData.dp ) {
        // find the element that was at the top the previous time
        var headerId = null;
        if( !! scrollData.id ) {
          // the target itself has an id
          headerId = scrollData.id;
        } else {
          // docPath's first 7 items is the headers dp
          var headerDP = scrollData.dp.split(',').slice(0, 7).toString();
          var theHeader = RT.data.headerId[ headerDP ];
          if( theHeader ) {
            headerId = RT.data.headerId[ headerDP ].id;
          } else {
            return null;
          };
        };
        var scrollTarget = document.getElementById( headerId );
        if( scrollTarget ) {
          // drill down to the element at top using docPath
          // TODO: null docPath happens at the very top of the document or when the
          // point of document.elementFromPoint() lies in a gap between elements
          if( scrollData.dp ) {
            // get a reference to the element to be placed top of the viewport 
            // using its docPath
            var $targetElement = drillDown( scrollTarget, scrollData.dp.split(',').slice(7), 2000 );
            this.settings.elementAtTop = $targetElement.get(0);
            // scrolll to the target element
            RT.scrollToElement( $targetElement, RT.settings.scrollDuration );
          };
        };
      };

      function drillDown( startElement, steps, animDuration ) {
        // starting with startElement move forward in the childrens lists the
        // number of steps dictated by the steps array, return the final 
        // element of the series, or the last found if unable to finish
        // point to the first element to skip
        var $initialElement = $(startElement);
        // the first time it's a siblings list
        var $levelSet = $initialElement.nextAll();
        // for each contained level step down the childrens list
        for( var i = 0; i < steps.length; i++ ) {
          // skip to the specified number of element (first is #1)
          if( $levelSet.length >= steps[i] ) {
            $initialElement = $($levelSet[ steps[i] - 1 ]);
            // DEBUG: show the elements hierarchy
            if( RT.settings.debug ) { $initialElement.css( 'border', '1px solid blue' ); };
            $levelSet = $initialElement.first().children();
          };
        };
        // returns a reference to the element to be placed top of the viewport
        return $initialElement;
      };
    }, 

    topsMapGetIdxByElement: function( element ) { 
    // given a reference to an element, return its index on the topsMap
      // heuristic: start searching from the current one
      var RT = $.fn.rt.RT;
      var n = RT.data.topsMap.length;
      var nEnd = 0;
      for( var i = RT.data.topsMapIdx; true; i++ ) {
        if( i >= n ) { i = 0; };
        if( element === RT.data.topsMap[i].node ) { 
          return i; 
        };
        nEnd++;
        if( nEnd > n ) { return null; } // not found 
      };
    },

    isBlockElement: function( theElement ) {
      // returns false for elements where smartScroll is not expected
      // to stop
      if( theElement.tagName === 'HR' ) { return false; }
      var d = $(theElement).css('display');
      if( d === 'block') { return true; }
      else if( d === 'list-item') { return true; }
      else if( d === 'table') { return true; }
      else if( d === 'table-cell') { return true; }
      else if( d === 'table-row') { return true; }
      else if( d === 'table-row-group') { return true; }
      else if( d === 'table-header-group') { return true; }
      else if( d === 'flex') { return true; }
      else if( d === 'grid') { return true; }
      else { return false; }
    },

    getRelativeTop: function( elem ) {
    // calculates the top position of the element relative to the origin of the
    // document, 0 if no elem is passed or has no rectangle (i.e., STYLE)
      var RT = $.fn.rt.RT;
      if( !!elem ) {
        if( !!elem.getBoundingClientRect() ) {
          return elem.getBoundingClientRect().top - RT.$element[0].getBoundingClientRect().top;
          // $$$$ this was a hack: return elem.getBoundingClientRect().top + $('body').scrollTop();
        }
      } else {
        return 0;
      };
    },

    smartScrollGetPrevTopElement: function( nodePrevIdx ) {
    // search backwards for the first element with height (less than a forward scroll)
      var RT = $.fn.rt.RT;
      if( !nodePrevIdx ) { return null; };
      // save starting element index
      var nodeNextIdx = nodePrevIdx;
      while( true ) { 
        // bounds check: don't search more than .length items
        if( ! nodeNextIdx > 0 ) { 
          break;
        };
        // back up the pointer
        nodeNextIdx--; 
        var nextNode = RT.data.topsMap[nodeNextIdx].node;  // next top node candidate
        // ignore elements with a marker class like "ssIgnore".
        if( $(nextNode).hasClass( RT.settings.ssIgnoreClass )) { 
          continue; 
        };
        // ignore non-block elements like spans
        if(  ! RT.isBlockElement( nextNode )) {
          continue;
        };
        // check if the element has reasonable height
        if( (RT.data.topsMap[nodePrevIdx].top - RT.data.topsMap[nodeNextIdx].top) > 50 ) {
          break;
        };
      };
      // ready: scroll and exit loop
      var deltaY = RT.data.topsMap[nodePrevIdx].top - RT.data.topsMap[nodeNextIdx].top;
      var propDelay = deltaY / RT.settings.smartScrollHeight;
      RT.scrollToElement( $( nextNode ), RT.settings.scrollDuration * propDelay / 2 );
      return nodeNextIdx; 
    },

    smartScrollGetNextTopElement: function( nodePrevIdx ) {
    // TODO: calculate where to scroll, skipping repeated tops and too shallow
    // elements, try to scroll by complete elements using RT.settings.smartScrollHeight
    // as an approximate limit for a scroll shot
      var RT = $.fn.rt.RT;
      if( !nodePrevIdx && nodePrevIdx !== 0 ) {
        return null;
      };
      // save starting point
      var nodeNextIdx = nodePrevIdx;
      while( true ) { 
        nodeNextIdx++; 
        // bounds check: don't search more than .length items
        if( ! ( nodeNextIdx < RT.data.topsMap.length )) { 
          break;
        };
        var nextNode = RT.data.topsMap[nodeNextIdx].node;  // next top node candidate
        // ignore elements with a marker class like "ssIgnore".
        if( $(nextNode).hasClass( RT.settings.ssIgnoreClass )) { 
          continue; 
        };
        // ignore non-block elements like spans
        if(  ! RT.isBlockElement( nextNode )) {
          continue;
        };
        // if the next element is a heading then put it at top even if it's shallow
        var nn = nextNode.nodeName.toLowerCase();
        if( nn === 'h1' || nn === 'h2' || nn === 'h3' || nn === 'h4' || nn === 'h5' ) {
          // it's a header: this is the next top element
          break;
        };
        // TODO: devise a strategy for finding complete container elements like 
        // small ULs and the like, for example if the container's height is small
        // then don't consider its children
        // TODO: must check if too big a scroll too and calculate a good one
        // TODO: if the element is tall and contains text split it in lines to
        // avoid scrolling partial lines - check element.getClientRects() and 
        // element.getBoundingClientRect() in MDN
        // check if enough scroll
        if( (RT.data.topsMap[nodeNextIdx].top - RT.data.topsMap[nodePrevIdx].top) > RT.settings.smartScrollHeight ) {
          break;
        };
      };
      // outline the element to be set at the top
      // TODO: add a class rtScrollTarget, set it to be removed then the animation ends
      // do the scroll and exit
      var deltaY = RT.data.topsMap[nodeNextIdx].top - RT.data.topsMap[nodePrevIdx].top;
      var propDelay = deltaY / RT.settings.smartScrollHeight;
      console.log( 'scroll forward delay: ' + RT.settings.scrollDuration * propDelay );
      if ( RT.settings.debug ) { RT.scrollToElement( $( nextNode ), RT.settings.scrollDuration * propDelay ); }
      return nodeNextIdx; 
    },

    smartScrollToNextElement: function() {
    // scroll forward a paragraph or whatever the element at the top of the viewport, using an animation
    // uses the RT.data.topsMap array, a list of all the elements and their top relative 
    // to the whole document (not their container)
      // TODO: must account for elements taller than the viewport and scroll them partially
      // TODO: must also account for elements that are too shallow or have a repeated top
      // TODO: it shouldn't trust the topsMap except for the elements ordering, because
      // changes in elements visibility can change tops unknowingly
      // TODO: if no element at top set to the top of the document
      // TODO: would be better to seek for one close to the current scroll position
      // each element has  { node: aRefToTheNode, top: relativeTop }
      // topsMap: [],
      var RT = $.fn.rt.RT;
      if( !RT.data.elementAtTop ) { RT.data.elementAtTop = RT.data.topsMap[0].node; };
      // get the current top node index
      var nodePrevIdx = RT.topsMapGetIdxByElement( RT.data.elementAtTop );
      // identify the next top node
      var nodeNextIdx = RT.smartScrollGetNextTopElement( nodePrevIdx );
      // now the scrolled element is the one at the top
      RT.data.elementAtTop = RT.data.topsMap[nodeNextIdx].node;
      // DEBUG:
      if( RT.settings.debug ) {
        console.log(
            'smartScrolled to:' 
            + ' ' +  nodeNextIdx 
            + ' ' +  RT.data.topsMap[nodeNextIdx].top 
            + ' ' +  RT.data.topsMap[nodeNextIdx].node.nodeName
            );
      };
      // TODO: check that the top hasn't changed, otherwise recalculate topsMap
      /* var scrollAmount = Math.max(
         RT.data.elementAtTop.height(),
         RT.$element.height() / 2
         ); */
    },

    scrollToElement: function( $topElement, duration ) {
    // scroll the content so the argument lies at the top of the viewport
    // TODO: must deactivate the scroll event handler before
      var RT = $.fn.rt.RT;
      var offsetTop = RT.getRelativeTop( $topElement[0] );
      // TODO: WAS: RT.$element.stop(false, false);
      // TODO: WAS: RT.$element.animate( { scrollTop: offsetTop }, duration);
      // $('body').stop( false, false );
      // $('body,html').animate( { scrollTop: offsetTop }, duration);
      // briefly highlight the target element before moving it to top
      $topElement.addClass( 'rtScrolltarget' ).offsetTop;
      window.setTimeout(
        function( event ){ 
          $topElement.animatescroll({ 
            scrollSpeed: duration, 
            easing: 'easeInOutQuart',
            scrollTop: offsetTop,
            element: RT.$element
          });
          window.setTimeout(
            function( event ){ $topElement.removeClass( 'rtScrolltarget' )}, 600
          );
        },
        555
        );
      var zzz = 123;
    },

    smartScrollToPrevElement: function() {
    // scroll backwards, to the first element with a height
      // get the current top node index
      var RT = $.fn.rt.RT;
      var nodePrevIdx = RT.topsMapGetIdxByElement( RT.data.elementAtTop );
      // identify the next top node
      var nodeNextIdx = this.smartScrollGetPrevTopElement( nodePrevIdx );
      // now the scrolled element is the one at the top
      RT.data.elementAtTop = RT.data.topsMap[nodeNextIdx].node;
      // DEBUG:
      if( RT.settings.debug ) {
        console.log( 'smartScrolled back to:' 
        + ' ' +  nodeNextIdx 
        + ' ' +  RT.data.topsMap[nodeNextIdx].top 
        + ' ' +  RT.data.topsMap[nodeNextIdx].node.nodeName
        );
      };
    },

    // calculate progress indicator
    displayProgress: function() {
      var RT = $.fn.rt.RT;
      var $pd = $( '#rtProgressDiagram' );
      // set the progress diagram: slap rtProgressTemplate over rtProgressDiagram 
      $pd.html( $( '#rtProgressTemplate' ).html() );
      $pd.addClass( 'rtProgress' );

      // calculate the proportional heights
      var hPri = $pd.height();
      var hTotal = RT.element.clientHeight;
      var hDone = 0;
      if( RT.data.elementAtTop ) { hDone = RT.data.elementAtTop.scrollTop; };
      var hCurrent = window.innerHeight;
      var hPending;
      // done part: proportional to current scroll position
      hDone = Math.round( 100 * ( hDone / hTotal ) );
      $( '#rtProgressDiagram .rtProgressDone' ).css( 'height',  hDone + '%' )
        .text( hDone < 10 ? '' : hDone + '%' );
      // current page part: proportional to viewport height
      hCurrent = Math.round( 100 * (hCurrent / hTotal) ); 
      if( hCurrent < 1 ) { hCurrent = 1; };
      $( '#rtProgressDiagram.rtProgressCurrent' ).css( 'height', hCurrent + '%' );
      // remaining part: proportional to total height less the two other heights
      hPending =  100 - hDone - hCurrent;
      $( '#rtProgressDiagram .rtProgressRemaining' ).css( 'height', hPending + '%' )
        .text( hPending < 10 ? '' : hPending + '%' );
    },

    writeScrollRecord: function() {
    // writes a scroll record in localStorage with the content of the scrollData object
    // TODO: eventually shoot an AJAX interaction to save the data in the server
    // TODO: must delete scrolls that are very colse in time
      // eventually fire the saving of a data batch in the server
      // get the current reading position in RT.data.scrollData (and in topsMapElement)
      var RT = $.fn.rt.RT;
      RT.data.topsMapElement = RT.getCurrentReadingPosition();
      // save the scroll data in localStorage
      localStorage.setItem(
        'RT-' + RT.data.documentNumberEncoded + '-' + RT.data.scrollTime.getTime(),
        JSON.stringify(RT.data.scrollData)
        );
      // aggregate scroll records in the reading time stats
      // TODO: contiguous scrolls with less than 1 second are merged
      // RT.compileReadTimeStats();

      // prepare the data to be sent to the server in a weird format
      // 1- date and time
      var serverRecord = RT.data.scrollTime.getTime().toString(36);
      // 2 - document
      serverRecord += '-' + RT.data.documentNumberEncoded;
      // 3 - reader id
      serverRecord += '-' + RT.data.readerNumberEncoded;
      // 4 - docPath and optional percent scrolled
      serverRecord += '-' + RT.data.scrollData.dp + ( !!RT.data.scrollData.p ? '.' + RT.data.scrollData.p : '' );
      // 5 - action code 1 = scroll
      // TODO: must convert the action numeric code to base36
      // default, ommitted: serverRecord += '-1';
      // 6 - additional data: text in case of a scroll with debug activated
      if( RT.settings.debug ) { !!RT.data.scrollData.text ? '-1-' + 'RT.data.scrollData.text' : ''; };

      // TODO: upload the record to the server
      /*
        var jqXHR = $.ajax({
        type: 'PUT',
        url: 'http://localhost:3333/storeActions',
        contentType: 'text/plain',
        data: serverRecord,
        success: function() {
      // TODO: can delete the uploaded data from localStorage
      console.log('uploaded: ' + serverRecord);
      },
      error: function() {
      // TODO: can save the data in localstorage until uploaded
      // console.log('failed: ' + serverRecord);
      }
      });
      */
    },

    getCurrentReadingPosition: function( event ) {
      // get a reference to the element at the reading position and store in
      // RT.data.scrollData the information needed to get back to this position
      // returns a reference to the element at top
      // TODO: replace leftTopVisiblePix by a local, remove leftTopVisiblePix
      // TODO: the event argument is not used
      var RT = $.fn.rt.RT;

      // get a reference to the element at the reading position
      var topElement = document.elementFromPoint(
          RT.settings.leftTopVisiblePix.left,
          RT.settings.leftTopVisiblePix.top
          );
      // ensure that the top of the element containing the "point" is close to the scroll
      // position of the container to assert that the "point" is "proper"
      var dx = 0, dy = 0;
      // TODO: replace the constant by half the viewport height
      var maxVerticalDistance = 333;
      var topOffset = 99999;
      while( RT.content == topElement || RT.element == topElement ) {
        // also had: || Math.abs( topElement.getBoundingClientRect().top > maxVerticalDistance )
        // DEBUG:
        // console.log( 'point rejected: ' + RT.getRelativeTop( topElement )
        // + '  ' + (!!topElement.id ?  topElement.id : '' ) );
        // we are over a container, move the point right and downwards
        dx += 7;
        // TODO: calculate and cache the RT.$content measures
        if( (RT.settings.leftTopVisiblePix.left + dx) > RT.$content.innerWidth() || topElement == RT.element ) {
          dy += 7;
          dx = parseInt( RT.$content.css('margin-left').replace(/px/, ' '), 10);
        };
        var topElement = document.elementFromPoint(
            RT.settings.leftTopVisiblePix.left + dx,
            RT.settings.leftTopVisiblePix.top + dy
            );
        // if already at the content bottom then stop
        if ( dx > RT.content.clientHeight ) {
          if( RT.data.debug ) { alert('reached bottom of document'); };
          topOffset = -1;
          break;
        };
      };

      // --------------------------------------------------------------------------------
      // alternative method: use the headers offsetTop map

      // loop through the headers list looking for the last header above the current
      // reading position 
      var currentScrolltop = RT.$element.scrollTop();
      for( var oneHeader in RT.data.headerId ) { 
        if( RT.data.headerId[oneHeader].offsetTop >= currentScrolltop ) { break; };
      };


      logScrollData = function() {
        console.log('scrolled! RT.data.scrollData: ' 
        + (( !! RT.data.scrollData.p ) ? ' ' + RT.data.scrollData.p + '%' : '' )
        + '  docPath: ' + topElement.getAttribute('docPath')
        + (( !!topElement.getAttribute('id') ) ?  '  id: ' + topElement.getAttribute('id') : '' )
        + '  ' + topElement.tagName + ' ' + ((!! RT.data.scrollData.text) ? RT.data.scrollData.text : '')); 
      }

      // --------------------------------------------------------------------------------
      // RT.data.scrollData will contain the data needed to restore the reading position and
      // rolling out read time statistics
      RT.data.scrollData.dp = topElement.getAttribute('docPath');
      if( RT.data.scrollData.dp == null ) {
        // DEBUG: null happens when scrolling to the very top
        if( RT.settings.debug ) { console.log( 'null docPath!' ); };
      };
      if( !topElement.getAttribute('id') == '' ) {
        RT.data.scrollData.id =  topElement.getAttribute('id');
      };
      // percent of the element not visible (scrolled up) if it's taller then the threshold
      if (( $(topElement).offset().top < 0 ) && ( $(topElement).height() > RT.data.tallElementLimit )) {
        RT.data.scrollData.p = Math.round( Math.abs( $(topElement).offset().top / topElement.offsetHeight * 100 ))
      };
      // up to 50 of the first characters of the text content, if any, for reference
      RT.data.scrollData.text = $(topElement).text().substr(0, 50).replace(/\r?\n|\r/g, ' ');
      // DEBUG: 
      if( RT.settings.debug ) { logScrollData(); }
      // return a reference to the element at top
      return topElement;
    }

  })
  // *************************** end of member functions ****************************

    setHandler_onbeforeunload = function( RT ) {
    // when the reader leaves this page store an end of session scroll record
      window.onbeforeunload = function(event) { 
      // TODO: signal the session end with an action code, not an additional column
        RT = $.fn.rt.RT;
        if( ! RT.data.scrollData ) { RT.data.scrollData = {}; }
        RT.data.scrollData.endSession = '1';
        RT.writeScrollRecord();
      };
    };


    setHandler_keyboard = function( RT ) {
    // capture keyboard action
      // TODO: replace by a one-liner, move code to a function
      // TODO: don't allow many spaces to stack in the input buffer, cancel one animation
      // as soo as another happens, and/or consume or lock new spaces when animating one
      // TODO: don't prevent default if the space goes into an input or editable element
      // TODO: scrolling the current element's height does not ensure being at the top of 
      // TODO: must scroll back when shift+space shows
      // enable the content element to receive keyboard input
      RT.$element.attr('tabindex', '0');
      RT.$element.focus();
      // set the event handler
      RT.$element.on(
        'keydown',
        null,
        RT,
        function(event) {
          var key = event.which;
          var RT = event.data;
          // spacebar or shift+spacebar: smart scroll
          if( key == 32 && ! ( event.altKey || event.metaKey || event.ctrlKey ) ) {
            RT.data.scrollTimer = null;
            RT.data.scrollData = {};
            RT.data.scrollTime = new Date( event.timeStamp );
            if( event.shiftKey ) { 
              // scroll back
              RT.smartScrollToPrevElement();
            } else {
              // scroll forward a chunk
              RT.smartScrollToNextElement();
            };
            event.preventDefault();
            event.stopPropagation();
            // TODO: set a smartScroll action code
            RT.writeScrollRecord();
            RT.displayProgress();
          };
        }
      );
    };


    setHandler_resize = function( RT ) {
    // capture the resize event
      $(window).on(
          'resize',
          null,
          RT,
          function(event) {
            // On resize wait a short while and restore the reading position
            var RT = event.data;
            window.clearTimeout(RT.data.resizingTimer);
            RT.data.resizingTimer = window.setTimeout(
              function(event){
                var RT = $.fn.rt.RT;
                // indicate that the timer is off
                RT.data.resizingTimer = null;
                // reposition the content
                RT.scrollToPosition( RT.scrollData );
                // recalculate header positions (used to identify 
                // the topmost element in the scroll event) 
                RT.storeHeaderScrollTops; 
                // recalculate the tops table
                RT.buildTopsMap();
              },
              RT.data.resizingTimerDelay
              );
            event.stopPropagation();
          }
      );
    };


    setHandler_scroll = function( RT ) {
    // capture the scroll event
      // RT.$element.on(
      $(window).on(
          'scroll',
          RT,
          function(event) {
            var RT = event.data;
            // save the exact scroll time in a global
            RT.data.scrollTime = event.timeStamp;
            // On scroll wait a short while and save the position
            window.clearTimeout(RT.scrollTimer);
            RT.data.scrollTimer = window.setTimeout(
              function(event) {
                RT.data.scrollTimer = null;
                RT.data.scrollData = {};
                // TODO: RT.writeScrollRecord();
                // get a reference to the element at top and store it as
                // the new top element
                RT.data.elementAtTop = RT.getCurrentReadingPosition();
                // update progress indicator
                RT.displayProgress();
              },
              RT.settings.scrollTimerDelay
              )
              event.stopPropagation();
          }
      );
    };


    buildControlPanel = function( RT ) {
      // display the control panel
      // TODO: use a template renderer like moustache?
      var cp = 
        '<div id="rtPanelLeft" class="rtPanelLeft" style="z-index:999;">\n'
        +  '<div id="rtProgressDiagram">\n'
        +    '<img src="res/progressDiagram.png" title="progress diagram (non functional yet), shows the reading place\n'
        +    ' and the number of pages alredy read and still pending">\n'
        +  '</div>\n'

        +  '<div id="rtBurgerMenu">\n'
        +    '<img src="./res/iconmenu.png" alt="menu" title="show menu" />\n'
        +  '</div>\n'

        +  '<div id="rtTOCIcon">\n'
        +    '<img src="./res/icontoc.png" alt="TOC button" title="show table of content" />\n'
        +  '</div>\n'

        +  '<div id="rtHighlightIcon">\n'
        +    '<img src="./res/iconhighlight.png" alt="highlight button" title="highlight the selected text" />\n'
        +  '</div>\n'

        +  '<div id="rtHelpIcon">\n'
        +    '<img src="./res/iconhelp2.png" alt="help (pls read)" title="instructions" />\n'
        +  '</div>\n'

        +  '<div id="rtEndTest">\n'
        +    '<button onclick="location.href=\'survey.html\'">End</button>\n'
        +  '</div>\n'

        +'</div>\n'

        +'<div id="TOCPanel" style="z-index:998;">\n'
        +  '<div id="TOCContainer"\n'
        +    '<div class="toc">TOC comes here</div>\n'
        +  '</div>\n'
        +'</div>\n'

        +'<div id="menuPanel" style="z-index:998;">\n'
        +  '<div id="menuContainer"\n'
        +    '<div class="menu" font-weight:100; class="menu">(replaced by usability test instructions)<br>click again to dimiss</div>\n'
        //   '<div class="menu" background:yellow; font-size:200%; font-weight:100; padding:140px;" class="menu">menu comes here, <br>click again to dimiss</div>\n'
        +  '</div>\n'
        +'</div>\n'

        +'<div id="helpPanel" style="z-index:998;">\n'
        +  '<div id="helpContainer"\n'
        +    '<div class="help" class="help">instructions come here</div>\n'
        +  '</div>\n'
        +'</div>\n';
        RT.$element.prepend( cp );
      };


    storeQueryString = function( RT ) {
    // store the query string if any (used initially to collect user data)
      // TODO: replace by a one-liner, move code to a function
      if( !! window.location.search ) {
        var qs = window.location.search.replace( '?', '' ).split( '&' ), request = {};
        $.each( qs, function( i, v ) {
          var pair = v.split( '=' );
          return request[pair[0]] = pair[1];
        });
        console.log(request);
        localStorage.setItem( 'instructions' + localStorage.length, JSON.stringify( request ) );
      };
    };


    setHelp = function( RT ) {
      // set the help content
      var $hc = $( '#helpContainer' );
      $hc.html( $( '#helpContentText' ).html() );

      // set the help show/hide handlers
      // TODO: replace by a one-liner, move code to a function
      // TODO: must ensure the oter panels are hidden before showing any
      $('#rtHelpIcon').on(
          'click',
          null,
          RT,
          function( event ) {
            var RT = event.data;
            var theHelp = $('#helpPanel');
            var w = theHelp.width();
            if( theHelp.css( 'display' ) === 'none' ) {
              // show the Help
              theHelp.show().animate( { left: - w + 1 }, 3); // a jQuery bug
              theHelp.show().animate(
                { left: 0 },
                777
                );
            } else {
              // hide the Help
              theHelp.show().animate( 
                { left: -w },
                'fast',
                function() { 
                  theHelp.hide(); 
                  RT.$content.focus();
                }
                );
            }
          }
      );
      // hide on click again
      $('#helpPanel').on(
          'click',
          null,
          RT,
          function( event ) {
            var RT = event.data;
            var theHelp = $('#helpPanel');
            var w = theHelp.width();
            theHelp.show().animate( 
              { left: -w },
              'fast',
              function() { 
                theHelp.hide(); 
                RT.$content.focus();
              }
              );
            event.stopPropagation();
            return false;
          }
        );
    };


    setHighlighter = function( RT ) {
    // set the highlighter
      rangy.init(); 
      var cssClassApplierModule = rangy.modules.CssClassApplier; 
      var highlight1Applier = rangy.createCssClassApplier("rtHigh1"); 
      $('#rtHighlightIcon').on(
        'click',
        null,
        RT,
        function( event ) {
          var RT = event.data;
          highlight1Applier.toggleSelection();
          if( document.selection ) {
            document.selection.empty();
          } else {
            if( window.getSelection() ) {
              window.getSelection().removeAllRanges();
            }
          }
          // DEBUG: print scroll trace when the highlight button is clicked
          // scroll:  DIV#textContent:0 DIV#textContainer:0 BODY.undefined:0 HTML.undefined:10716 undefined.undefined:10716
          var $ele = RT.$content;
          var z = 'scroll: ';
          var eleId = '';
          while ( $ele.length > 0 ) { 
            if( typeof ( $ele.attr('id') ) === "undefined" ) {
              eleId = '.' + $ele.attr('class');
            } else {
              eleId = '#' + $ele.attr('id');
            };
            z = z + ' ' + $ele.prop('tagName') + eleId + ':' + $ele.scrollTop();
            $ele = $ele.parent(); 
          };
          console.log(z);
          //
          return false;
        }
      );
    };

    
    setTOC = function( RT ) {
    // set the TOC toggler
      $('#rtTOCIcon').on(
          'click',
          null,
          RT,
          function( event ) {
            var RT = event.data;
            var theTOC = $('#TOCPanel');
            var w = theTOC.width();
            if( theTOC.css( 'display' ) === 'none' ) {
              // show the TOC
              theTOC.show().animate( { left: - w + 1 }, 3); // a jQuery bug
              theTOC.show().animate(
                { left: 0 },
                777
                );
            } else {
              // hide the TOC
              theTOC.show().animate( 
                { left: -w },
                'fast',
                function() { 
                  theTOC.hide(); 
                  RT.$content.focus();
                }
              );
            }
          }
      );
      // hide on click again
      $('#TOCPanel').on(
        'click',
        null,
        RT,
        function( event ) {
          var RT = event.data;
          var theTOC = $('#TOCPanel');
          var w = theTOC.width();
          theTOC.show().animate(
            { left: -w },
            'fast',
            function() { 
              theTOC.hide(); 
              RT.$content.focus();
            }
          );
          event.stopPropagation();
          return false;
        }
      );

      // build the TOC
      // TODO: the TOC object gets stored in the global context
      TOC.clearTOC();
      TOC.buildTOC( RT.$content.get()[0] );
      // DEBUG: 
      if( RT.debug ) { TOC.logTOC(); };
      // render the TOC in the TOC sliding panel
      // TODO: this .toc class name is not right
      $('.toc').html( TOC.render() );
      // accordionize the TOC tree
      TOC.makeCollapsible( $( '.toc' )[0] );
    };


    showMenu = function( RT ) {
    // build and show the menu
      // for the usability test, set the instructions into the menu panel
      // TODO: check the "agenda..." name
      $('#menuContainer').html( $('#agendaBody').html() );
      $('#menuContainer').css( 'display', 'block' );

      // show the menu
      $('#rtBurgerMenu').on(
        'click',
        null,
        RT,
        function( event ) {
          var RT = event.data;
          var theMenu = $('#menuPanel');
          var w = theMenu.width();
          if( theMenu.css( 'display' ) === 'none' ) {
            // show the Menu
            theMenu.show().animate( { left: - w + 1 }, 3); // a jQuery bug
            theMenu.show().animate(
              { left: 0 },
              777
              );
          } else {
            // hide the Menu
            theMenu.show().animate( 
              { left: -w },
              'fast',
              function() { 
                theMenu.hide(); 
                RT.$content.focus();
              }
            );
          }
        }
      );
    };


    // Data items comprising the internal state of the plugin
    function initData() {
      var data = {
        // DEBUG: this values will come from the server
        documentNumberEncoded: '2n9d',      // document id in base36
        readerNumberEncoded: '4mkbm',       // reader id in base36

        // tops:
        // list of the HTML nodes and their position in the rendered page, to be
        // used for finding the "next" paragraph when the user scrolls
        // it contains a reference to each DOM element and it's scroll position
        // relative to the top of the document
        // each element has  { node: aRefToTheNode, top: relativeTop }
        topsMap: [],
        // element currently at the top of the viewport
        topsMapIdx: 0,
        topsMapElement: null,

        // used for recording the user action events
        scrollTime: new Date(),             // time the last scroll was started
        // elementAtTop: null,              // reference to the current top element
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Defining_getters_and_setters
        _eat: null,                         // reference to a node
        get elementAtTop() {
          if( typeof( this._eat ) === 'object' ) {
            return this._eat;
          } else {
            // search for an element near the current scroll position
            var iMap = 0;
            while( this.topsMap[iMap].top >= window.scrollY ) {
              this._eat = this.topsMap[iMap].node;
            };
            return this._eat;
          };
        },
        set elementAtTop(newEat) { this._eat = newEat; },
        scrollData: null,                   // object with current reading position data
        scrollTimer: null,                  // delay scroll reaction until stable
        scrollTimerDelay: 999,              // delay scroll reaction until stable
        scrollPosition: 0,                  // the user reading position, a number of px below
                                            // viewport top

        // Contains each header's docpath indexed by the header id, and the offsetTop
        // Used when repositioning, to find the header id given the docPath of the
        // target element (its first 7 items), contains docPath and .offsetTop 
        headerId: {},                       // map from headers part of docpath to header id

        resizingTimer: null,                // delay resize action until stable
        resizingTimerDelay: 777,            // delay resize action until stable
        containerYOffset: 0                 // top position of the container, used to calculate
                                            // absolute Y coordinates
      };
      return data;
    };


    /* define public functions thus: 
       DOLLAR.fn.rt.format = function( txt ) {
       return "<strong>" + txt + "</strong>";
       };
      // call the public function
      markup = $.fn.rt.format( markup );
    */


    // wrapper around the constructor preventing multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
      this.each(function() {
        if ( !$.data( this, "plugin_" + pluginName ) ) {
          $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
        }
      });

      // chain jQuery functions
      return this;
    };


})( jQuery, window, document );
