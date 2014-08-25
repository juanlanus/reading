(function ( $, window, document, undefined ) {

  // Create the defaults once
  var
    pluginName = "rt",

    // 'that' is used to make this available to the private methods 
    that = this,

    // was: function rt(rtContainerSelector, pageNumber), now rtContain... is this
    defaults = {
      // TODO: some are defaults, other are internal variables; should refactor
      // $container: $(this),                // the element DIV or BODY with scrolled content
      // wrap the content in a sliding div? or ask the user to provide a reference? 
      // $content: this.defaults.$container.children().first(), // the element that scrolls inside $container, a DIV
      // TODO: start at (0, 0) and move right and down checking until the point lies into a desdendant of the container
      leftTopVisiblePix: {                // container's top left corner coordinates, used
          left: 222,                      // to detect visibility using method
          top: 10                         // elementFromPoint() where this is the point
      },
      smartScrollHeight: 333,
      ssIgnoreClass: "ssIgnore",          // marker class for non-top elements
      scrollDuration: 777,                // duration of the scroll to position animation
      tallElementLimit: 300,              // elements taller with height greater then this are
                                          // considered "tall" and the percent scroll is stored
      // development aids
      debug: false,

      // ********************************************************************************
      // Data items below this line are internal data, not "options" neither "defaults"

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
      headerId: {},                       // map from fixed part of docpath to header id

      resizingTimer: null,                // delay resize action until stable
      resizingTimerDelay: 777,            // delay resize action until stable
      containerYOffset: 0                 // top position of the container, used to calculate
                                          // absolute Y coordinates
      
    };

    // ********************************************************************************
    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        // merge options into defaults object
        this.settings = $.extend( {}, defaults, options );
        this.settings.$container = $( element );
        this._defaults = defaults;
        this._name = pluginName;
        // make the plugin data publicly accesible
        $.fn.rt.settings = this.settings;
        // initialize tue plugin
        this.init();
    }

    // ********************************************************************************
    // add functionality to plugin prototype
    $.extend(Plugin.prototype, {

      init: function () {
        var RT = $.fn.rt.settings;

        // when the reader leaves this page store an end of session scroll record
        window.onbeforeunload = function(event) { 
          RT.scrollData = {};
          // TODO: signal the session end with an action code, not an additional column
          RT.scrollData.endSession = '1';
          RT.writeScrollRecord();
        };

        // capture keyboard action
        // TODO: replace by a one-liner, move code to a function
        // TODO: don't allow many spaces to stack in the input buffer, cancel one animation
        // as soo as another happens, and/or consume or lock new spaces when animating one
        // TODO: don't prevent default if the space goes into an input or editable element
        // TODO: scrolling the current element's height does not ensure being at the top of 
        // TODO: must scroll back when shift+space shows
        // enable the content element to receive keyboard input
        RT.$content.attr('tabindex', '0');
        RT.$content.focus();
        // set the event handler
        RT.$content.on(
            'keydown',
            null,
            $.fn.rt.settings,
            function(event) {
              var key = event.which;
              var RT = event.data;
              // spacebar or shift+spacebar: smart scroll
              if( key == 32 && ! ( event.altKey || event.metaKey || event.ctrlKey ) ) {
                RT.scrollTimer = null;
                RT.scrollData = {};
                RT.scrollTime = new Date( event.timeStamp );
                if( event.shiftKey ) { 
                  // scroll back
                  RT.smartScrollToPrevElement();
                } else {
                  // scroll forward a chunk
                  $.fn.rt.smartScrollToNextElement();
                };
                event.preventDefault();
                event.stopPropagation();
                // TODO: set a smartScroll action code
                RT.writeScrollRecord();
                $.fn.rt.displayProgress();
              };
            }
        );

        // capture the resize event
        // TODO: replace by a one-liner, move code to a function
        $(window).on(
            'resize',
            null,
            $.fn.rt.settings,
            function(event) {
              // On resize wait a short while and restore the reading position
              var RT = event.data;
              window.clearTimeout(RT.resizingTimer);
              RT.resizingTimer = window.setTimeout(
                function(event){
                  // indicate that the timer is off
                  RT.resizingTimer = null;
                  // reposition the content
                  this.scrollToPosition(RT.scrollData);
                  // recalculate header positions (used to identify 
                  // the topmost element in the scroll event) 
                  RT.storeHeaderScrollTops; 
                  // recalculate the tops table
                  RT.buildTopsMap();
                },
                RT.resizingTimerDelay
                );
              event.stopPropagation();
            }
        );

        // display the control panel
        // TODO: replace by a one-liner, move code to a function
        // TODO: use a template renderer like moustache?
        var cp = 
          '<div id="rtPanelLeft" class="rtPanelLeft" style="z-index:999;">'
          +  '<div id="rtProgressDiagram">'
          +    '<img src="res/progressDiagram.png" title="progress diagram (non functional yet), shows the reading place'
          +    ' and the number of pages alredy read and still pending">'
          +  '</div>'

          +  '<div id="rtBurgerMenu">'
          +    '<img src="./res/iconmenu.png" alt="menu" title="show menu" />'
          +  '</div>'

          +  '<div id="rtTOCIcon">'
          +    '<img src="./res/icontoc.png" alt="TOC button" title="show table of content" />'
          +  '</div>'

          +  '<div id="rtHighlightIcon">'
          +    '<img src="./res/iconhighlight.png" alt="highlight button" title="highlight the selected text" />'
          +  '</div>'

          +  '<div id="rtHelpIcon">'
          +    '<img src="./res/iconhelp2.png" alt="help (pls read)" title="instructions" />'
          +  '</div>'

          +  '<div id="rtEndTest">'
          +    '<button onclick="location.href=\'survey.html\'">End</button>'
          +  '</div>'

          +'</div>'

          +'<div id="TOCPanel" style="z-index:998;">'
          +  '<div id="TOCContainer"'
          +    '<div class="toc">TOC comes here</div>'
          +  '</div>'
          +'</div>'

          +'<div id="menuPanel" style="z-index:998;">'
          +  '<div id="menuContainer"'
          +    '<div class="menu" font-weight:100; class="menu">(replaced by usability test instructions)<br>click again to dimiss</div>'
          //   '<div class="menu" background:yellow; font-size:200%; font-weight:100; padding:140px;" class="menu">menu comes here, <br>click again to dimiss</div>'
          +  '</div>'
          +'</div>'

          +'<div id="helpPanel" style="z-index:998;">'
          +  '<div id="helpContainer"'
          +    '<div class="help" class="help">instructions come here</div>'
          +  '</div>'
          +'</div>';
        this.settings.$container.prepend( cp );

        // store the query string if any (used initially to collect user data)
        // TODO: replace by a one-liner, move code to a function
        if( !! window.location.search ) {
          var qs = window.location.search.replace('?','').split('&'), request = {};
          $.each(qs, function(i,v) {
            var pair = v.split('=');
            return request[pair[0]] = pair[1];
          });
          console.log(request);
          localStorage.setItem('instructions' + localStorage.length, JSON.stringify( request ) );
        };

        // set the help content
        // TODO: replace by a one-liner, move code to a function
        var $hc = $('#helpContainer');
        $hc.html( $('#helpContentText').html() );

        // initialize the progress indicator
        $.fn.rt.displayProgress();

        // set the highlighter
        // TODO: replace by a one-liner, move code to a function
        rangy.init(); 
        var cssClassApplierModule = rangy.modules.CssClassApplier; 
        var highlight1Applier = rangy.createCssClassApplier("rtHigh1"); 
        $('#rtHighlightIcon').on(
            'click',
            null,
            $.fn.rt.settings,
            function() {
              var RT = event.data;
              highlight1Applier.toggleSelection();
              if( document.selection ) {
                document.selection.empty();
              } else {
                if( window.getSelection() ) {
                  window.getSelection().removeAllRanges();
                }
              }
              // DEBUG: print scroll trace when the high button is clicked
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

        // set the TOC toggler
        // TODO: replace by a one-liner, move code to a function
        $('#rtTOCIcon').on(
            'click',
            null,
            $.fn.rt.settings,
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
            $.fn.rt.settings,
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

        // set the help show/hide handlers
        // TODO: replace by a one-liner, move code to a function
        // TODO: must ensure the oter panels are hidden before showing any
        $('#rtHelpIcon').on(
            'click',
            null,
            $.fn.rt.settings,
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
            $.fn.rt.settings,
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

        // for the usability test, set the instructions into the menu panel
        // TODO: replace by a one-liner, move code to a function
        // TODO: check the "agenda..." name
        $('#menuContainer').html( $('#agendaBody').html() );
        $('#menuContainer').css( 'display', 'block' );

        // show the menu
        // TODO: replace by a one-liner, move code to a function
        $('#rtBurgerMenu').on(
            'click',
            null,
            $.fn.rt.settings,
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

        // build the TOC
        // TODO: the TOC object gets stored in the global context
        // TODO: replace by a one-liner, move code to a function
        TOC.clearTOC();
        TOC.buildTOC( RT.$content.get()[0] );
        // DEBUG: 
        if( RT.debug ) { TOC.logTOC(); };
        // render the TOC in the TOC sliding panel
        // TODO: this .toc class name is not right
        $('.toc').html( TOC.render() );
        // accordionize the TOC tree
        TOC.makeCollapsible( $( '.toc' )[0] );

        // capture the scroll event
        // TODO: replace by a one-liner, move code to a function
        // this.settings.$container.on(
        // $('body').on(
        $(window).on(
            'scroll',
            $.fn.rt.settings,
            function(event) {
              var RT = event.data;
              // save the exact scroll time in a global
              RT.scrollTime = event.timeStamp;
              // On scroll wait a short while and save the position
              window.clearTimeout(RT.scrollTimer);
              RT.scrollTimer = window.setTimeout(
                function(event) {
                  RT.scrollTimer = null;
                  RT.scrollData = {};
                  // TODO: RT.writeScrollRecord();
                  // get a reference to the element at top and store it as
                  // the new top element
                  RT.elementAtTop = RT.getCurrentReadingPosition();
                  // update progress indicator
                  $.fn.rt.displayProgress();
                },
                RT.scrollTimerDelay
                )
                event.stopPropagation();
            }
        );

        // DOM element: this.element
        // options: this.settings
        // you can add more functions like the one below and
        // call them like so: this.yourOtherFunction(this.element, this.settings).
        console.log("xD");

        // build the document structure map used for semantic positioning
        this.buildDocMap();

        // get the last recorded scroll position or null and scroll to it
        // TODO: the argument might not be necessary
        RT.scrollData = this.getLastRecordedPosition( RT.documentNumber );
        if( RT.scrollData ) {
          RT.scrollToPosition( RT.scrollData );
        } else {
          // scroll to ... 
        };
      },

      buildDocMap: function() {
      // build the document structure map used for semantic positioning
        var RT = $.fn.rt.settings;
        RT.docMap = {};
        // init structure values: item [0] is the page, items [1] to [6] correspond
        // to headers H1 through H6, then comes the element number and the element's
        // internal subtree
        // DEBUG: log the docPaths in a PRE element $('#docPathLog')
        // $('#docPathLog').clear;
        var docPath = [RT.pageNumber, 0, 0, 0, 0, 0, 0];
        var $context = RT.$content;         // will iterate over the DOM elements
        buildPath( RT, $context, docPath, 0 ); // start at level 0 = before first tag
        // calculate the value of the scrollTop of all headers (used to identify 
        // the topmost element in the scroll event) 
        this.storeHeaderScrollTops();

        // build the tops map with the scroll position of every text node
        this.buildTopsMap();

        /* local subfunction **********************************************************/
        function buildPath( RT, $context, docPath, level ) {
        // recursively visit the elements of the DOM tree level and record their docPath data
          // $context: process the children of this element
          // docPath: starting docPath, buid on it
          // level: non-H (subtree) tags deph level, 0 = first one, in docPath[7]
          // TODO: get a list of the block tagnames
          // TODO: this function assumes that the headers tree is correctly structured
          // TODO: elements positioned absolute or fixed are taken from the normal flow
          // and should be handled especially
          RT.docMap = {};
          var 
            $mappedElements = $context.children().not('[float=left]').not('[float=right]'),
            n = $mappedElements.length,
            i = 0,
            checkHeading = /^[hH][1-6]$/    // the element is h1...h6
          ;
          // loop over the elements collection that comprise the content
          for( i = 0; i < n; i++ ) {
            // build the docPaths of the subtree of this
            $this = $( $mappedElements[i] );
            // if the current element is a header, increment the header level number
            // and reset the rigth-hand part of docPath
            if( checkHeading.test(this.tagName) ) { // it's a header h1...6
              // update header count
              var headerLevel = parseInt(this.tagName.substring(1, 2), 10);
              if( headerLevel > 0 && headerLevel < 7 ) {
                // count the newfound header
                docPath[ headerLevel ]++;
                // clear the subtree header counters
                for( var i = headerLevel + 1; i < 8; i++ ) { docPath[i] = 0; }
                // truncate the path array to have only the headers count
                docPath.length = 7;
                // make an id for the heading element out of the docPath
                // TODO: attempt to make the id out of the header text (a slug)
                setId( RT, docPath, this );
              }
              // reset other tags level
              level = 0;
            } else {  // the element is not a header
              // it's an "other tags" element, count 1 more in its level
              // TODO: should filter for DIV P IMG TABLE TR UL OL LI DL DT
              // DD QUOTE ... (more block elements)
              if( !docPath[level + 7] ) {
                docPath[level + 7] = 1;     // new level, grow array
              } else {
                docPath[level + 7]++;       // level already started
              }
            }
            // store the element's docPath attribute
            $this.attr( 'docPath', docPath.toString() );
            // DEBUG: log the docPaths in a PRE element $('#docPathLog'), omit noisy tagNames
            // TODO: some elements have a wrong docPath with an empty item, log them always
            if ( RT.debug || ( docPath && docPath.indexOf( ',,' ) !== -1 ) ) {
              var thisElement = $this[0];
              var tn = thisElement.tagName;
              if( !( tn === 'BR' || tn === 'CODE' || tn === 'COL' || tn === 'A' || tn === 'TD' || tn === 'COLGROUP' || tn === 'TH' || tn === 'TBODY') ) {
                var indent = new Array(2 * level).join(' ');
                if( tn.substring(0, 1) === 'H' ) { indent = '++' + indent.substring(2); };
                var tab = 16 - indent.length - tn.length;
                var tab = new Array( tab > 0 ? tab : 1 ).join('_');
                var dp = ( $this.attr('docPath') + '                         ' ).substring(0, 24);
                $('#docPathLog').append( indent + thisElement.tagName + tab + dp );
                $('#docPathLog').append( '  offsetTop:' + thisElement.offsetTop ); // + '  getRelativeTop:' + RT.getRelativeTop(thisElement)
                if( !!$this.attr('id') ) { $('#docPathLog').append( '  id:' + $this.attr('id')); };
                var scrollDataText = $this.text().substr(0, 50).replace(/\r?\n|\r/g, ' ');
                if( scrollDataText ) { $('#docPathLog').append( '  \t' + scrollDataText ); };
                $('#docPathLog').append( '\n');
              };
            };
            // build the path for this element's children (pass a copy of current path)
            buildPath ( RT, $this, docPath.slice(0), level + 1 );

          } // next elements-to-map
        } // end of local sub function buildPath()

        /* local subfunction **********************************************************/
        function setId( RT, docPath, theElement ) {
        // makes an id out of the docPath and assigns it to the theElement iif it
        // does not have already an id (theElement is always a header)
          var theId = null;
          // check if the element already has an id
          if( theElement.id != '' ) {
            // already has id: stash it
            theId = theElement.id;
          } else {
            // no id: provide one made after its docPath by prepending "RT-" and 
            // replacing the toString commas by "-", use the first 7 items
            // TODO: should make the id out of the header text better than the docPath
            // TODO: must check for uniqueness
            theId = 'RT-' + docPath.slice(0, 7).toString().replace(/,/g, '-');
            theElement.id = theId;
          };
          // store the id in the headers id map indexed by the 1st 7 docPath elements
          RT.headerId[docPath.slice(0, 7).toString()] = { id: theId };
          return theId;
        };

      },

      topsMapGetIdxByElement: function( element ) { 
      // given a reference to an element, return its index on the topsMap
      // heuristic: start searching from the current one
        var RT = $.fn.rt.settings;
        var n = RT.topsMap.length;
        var nEnd = 0;
        for( var i = RT.topsMapIdx; true; i++ ) {
          if( i >= n ) { i = 0; };
          if( element === RT.topsMap[i].node ) { 
            return i; 
          };
          nEnd++;
          if( nEnd > n ) { return null; } // not found 
        };
      },

      getRelativeTop: function( elem ) {
      // calculates the top position of the element relative to the origin of the
      // document, 0 if no elem is passed or has no rectangle (i.e., STYLE)
        if( !!elem ) {
          if( !!elem.getBoundingClientRect() ) {
            // TODO: WAS: return elem.getBoundingClientRect().top + this.settings.$container.scrollTop();
            return elem.getBoundingClientRect().top + $('body').scrollTop();
          }
        } else {
          return 0;
        };
      },

      storeHeaderScrollTops: function() {
      // calculates the value of the scrollTop of each header and stores it in
      // the headerId associative array
        var RT = $.fn.rt.settings;
        RT.docMap = {};
        for( var oneHeader in RT.headerId ) { 
          RT.headerId[oneHeader].offsetTop = this.getRelativeTop( 
            document.getElementById( RT.headerId[oneHeader].id )
          );
          // DEBUG: console.log( oneHeader + ' ' + RT.headerId[oneHeader].id );
        };
      },

      buildTopsMap: function() {
      // build a list of the text nodes and their position in the rendered page,
      // to be used for finding the "next" paragraph when the user scrolls
      // it contains a reference to each DOM element and it's scroll position
      // relative to the top of the document
        var RT = $.fn.rt.settings;
        // build the topsMap array
        RT.topsMap = [];
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
            RT.topsMap.push({
              node: thisNode, 
              top: this.getRelativeTop( thisNode )
            })
          };
          var topsMapN = RT.topsMap.length;
          // DEBUG: 
          // console.log( RT.topsMap.length + ' ' + thisNode.nodeName + ' ' + RT.topsMap[topsMapN - 1].top);
          // DEBUG: check how the same top value appears more than once
          if( RT.debug ) { 
            if( RT.topsMap[topsMapN - 1].top == previousNodeTop ) {
              console.log( 'top val repeated: ' + RT.topsMap[topsMapN - 1].node.nodeName 
              + ' ' +  previousNodeTop );
            }
          };
          // check that tops are sorted
          if( RT.topsMap[topsMapN - 1] < previousNodeTop ) { topsMapNeedsSort = true; }
          previousNodeTop = RT.topsMap[topsMapN - 1];
        };

        // sort topsMap on position order if needed
        // TODO: NYI
        if( topsMapNeedsSort ) { /* RT.topsMapSort() */ }
        // prepare for the index of the top element
        RT.topsMapIdx = 0;
      },

      scrollToElement: function( $topElement, duration ) {
      // scroll the content so the argument lies at the top of the viewport
        // TODO: must deactivate the scroll event handler before
        var offsetTop = this.settings.getRelativeTop( $topElement[0] );
        // TODO: WAS: RT.$container.stop(false, false);
        // TODO: WAS: RT.$container.animate( { scrollTop: offsetTop }, duration);
        // $('body').stop( false, false );
        // $('body,html').animate( { scrollTop: offsetTop }, duration);
        // briefly highlight the target element before moving it to top
        $topElement.addClass( 'rtScrolltarget' ).offsetTop;
        window.setTimeout(
            function(event){ 
              $topElement.animatescroll({ 
                scrollSpeed: duration, 
                easing: 'easeInOutQuart',
                element: this.settings.$container[0]
              });
              window.setTimeout(
                function(event){ $topElement.removeClass( 'rtScrolltarget' )},
                600
                );
            },
            555
            );
        var zzz = 123;
      },

      scrollToPosition: function( scrollData ) {
        // reposition the content according to the scrollData argument
        // check if the data is available ...
        if( scrollData && scrollData.dp ) {
          // find the element that was at the top the previous time
          var headerId =  null;
          if( !!scrollData.id ) {
            headerId = scrollData.id;
          } else {
            // use docPath to get the id of the closest header using
            // the RT.headerId[ <here> ] map
            if( scrollData.dp.split(',').slice(0, 7).toString() == "0,0,0,0,0,0,0" ) {
              headerId = this.settings.$content[0].id;
            } else { 
              var theHeader = this.settings.headerId[ scrollData.dp.split(',').slice(0, 7).toString() ];
              if( theHeader ) {
                headerId = this.settings.headerId[ scrollData.dp.split(',').slice(0, 7).toString() ].id;
              } else {
                return;
              };
            }
          };
          var scrollTarget = document.getElementById( headerId );
          if( scrollTarget ) {
            // drill down to the element at top using docPath
            // TODO: null docPath happens at the very top of the document or when the
            // point of document.elementFromPoint() lies in a gap between elements
            if( scrollData.dp ) {
              // get a reference to the element to be placed top of the viewport 
              // using its docPath
              var $targetElement = this.settings.drillDown( scrollTarget, scrollData.dp.split(',').slice(7), 2000 );
              this.settings.elementAtTop = $targetElement.get(0);
              // scrolll to the target element
              this.settings.scrollToElement( $targetElement, this.settings.scrollDuration );
            };
          };
        };
      },

      drillDown: function( startElement, steps, animDuration ) {
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
            if( this.settings.debug ) { $initialElement.css( 'border', '1px solid blue' ); };
            $levelSet = $initialElement.first().children();
          };
        };
        // returns a reference to the element to be placed top of the viewport
        return $initialElement;
      },

      // you can add more functions like the one below and
      // call them like so: this.yourOtherFunction(this.element, this.settings).
      // console.log('xD');
      yourOtherFunction: function () {
        // some logic
      },

      // return the last recorded position of the document docNumber or null
      getLastRecordedPosition: function( $container, settings ) {
        // TODO: refactor RT.xxx data references
        if( !localStorage ) { return null; };
        // loop backwards over localStorage keys looking for a scroll record of
        // this document (has an "RT-nnnn-xxxx" key where nnnn is the document
        // id encoded and xxxx is the time)
        var latestTime = { time: -1, index: -1};
        //  loop over localstorage keys looking for this doc's latest scroll record
        // TODO: replace this local version by an online one
        for( var i = localStorage.length - 1; i >= 0; i-- ) {
          var k = localStorage.key(i);
          if( k.substring( 0, 3 ) === 'RT-' ) {
            var part = k.split( '-' );
            if( part.length === 3 ) {
              // check that it's related to this document
              if( part[1] === documentNumber ) {  
                // compare times and save if newer than latestTime
                if( part[2] > latestTime.time ) {
                  // yes it's later, check that it has .dp
                  var data = JSON.parse(localStorage.getItem( i )); 
                  if( latestTime.data.dp ) {
                    // yes it's later and has .dp: save in latest
                    latestTime.time = part[2];
                    latestTime.index = i;
                    latestTime.data = data;
                  };
                };
              };
            };
          };
        };
        // was there a scroll record for this doc?
        if( latestTime.index === -1 ) { return null; };
        // success: return the read scrolldata
        return latestTime.data;
      },

      getCurrentReadingPosition: function(event) {
        // get a reference to the element at the reading position and store in
        // RT.scrollData the information needed to get back to this position
        // returns a reference to the element at top
        // TODO: replace leftTopVisiblePix by a local, remove leftTopVisiblePix
        // TODO: the event argument is not used

        // get a reference to the element at the reading position
        var topElement = document.elementFromPoint(
            this.settings.leftTopVisiblePix.left,
            this.settings.leftTopVisiblePix.top
            );
        // ensure that the top of the element containing the "point" is close to the scroll
        // position of the container to assert that the "point" is "proper"
        var dx = 0, dy = 0;
        // TODO: replace the constant by half the viewport height
        var maxVerticalDistance = 333;
        var topOffset = 99999;
        while( this.settings.$content[0] == topElement || this.settings.$container[0] == topElement ) {
          // also had: || Math.abs( topElement.getBoundingClientRect().top > maxVerticalDistance )
          // DEBUG:
          // console.log( 'point rejected: ' + this.settings.getRelativeTop( topElement )
          // + '  ' + (!!topElement.id ?  topElement.id : '' ) );
          // we are over a container, move the point right and downwards
          dx += 7;
          // TODO: calculate and cache the this.settings.$content measures
          if( (this.settings.leftTopVisiblePix.left + dx) > this.settings.$content.innerWidth() || topElement == this.settings.$container[0] ) {
            dy += 7;
            dx = parseInt( this.settings.$content.css('margin-left').replace(/px/, ' '), 10);
          };
          var topElement = document.elementFromPoint(
              this.settings.leftTopVisiblePix.left + dx,
              this.settings.leftTopVisiblePix.top + dy
              );
          // if already at the content bottom then stop
          if ( dx > this.settings.$content[0].clientHeight ) {
            if( this.settings.debug ) { alert('reached bottom of document'); };
            topOffset = -1;
            break;
          };
        };

        // --------------------------------------------------------------------------------
        // alternative method: use the headers offsetTop map

        // loop through the headers list looking for the last header above the current
        // reading position 
        var currentScrolltop = this.settings.$container.scrollTop();
        for( var oneHeader in this.settings.headerId ) { 
          if( this.settings.headerId[oneHeader].offsetTop >= currentScrolltop ) { break; };
        };

        // --------------------------------------------------------------------------------
        // this.settings.scrollData will contain the data needed to restore the reading position and
        // rolling out read time statistics
        this.settings.scrollData.dp = topElement.getAttribute('docPath');
        if( this.settings.scrollData.dp == null ) {
          // DEBUG: null happens when scrolling to the very top
          if( this.settings.debug ) { console.log( 'null docPath!' ); };
        };
        if( !topElement.getAttribute('id') == '' ) {
          this.settings.scrollData.id =  topElement.getAttribute('id');
        };
        // percent of the element not visible (scrolled up) if it's taller then the threshold
        if (($(topElement).offset().top < 0 ) && ($(topElement).height() > this.settings.tallElementLimit )) {
          this.settings.scrollData.p = Math.round( Math.abs( $(topElement).offset().top 
                / topElement.offsetHeight * 100 ))
        };
        // up to 50 of the first characters of the text content, if any, for reference
        this.settings.scrollData.text = $(topElement).text().substr(0, 50).replace(/\r?\n|\r/g, ' ');
        // DEBUG: 
        if( this.settings.debug ) {
          console.log('scrolled! this.settings.scrollData: ' 
              + (( !!this.settings.scrollData.p ) ? ' ' + this.settings.scrollData.p + '%' : '' )
              + '  docPath: ' + topElement.getAttribute('docPath')
              + (( !!topElement.getAttribute('id') ) ?  '  id: ' + topElement.getAttribute('id') : '' )
              + '  ' + topElement.tagName + ' ' + ((!!this.settings.scrollData.text) ? this.settings.scrollData.text : '')); 
        } //
        // return a reference to the element at top
        return topElement;
      }

    });

    /* define public functions thus: 
       $.fn.rt.format = function( txt ) {
       return "<strong>" + txt + "</strong>";
       };
    // call the public function
    markup = $.fn.rt.format( markup ); */

    // wrapper around the constructor preventing multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
      var RT = $.fn.rt.settings;
      this.each(function() {
        if ( !$.data( this, "plugin_" + pluginName ) ) {
          $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
        }
      });

      // chain jQuery functions
      return this;
    };

    $.fn.rt.isBlockElement = function( theElement ) {
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
    };

    $.fn.rt.smartScrollGetPrevTopElement = function( nodePrevIdx ) {
      // search backwards for the first element with a height
      var RT = $.fn.rt.settings;
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
        var nextNode = RT.topsMap[nodeNextIdx].node;  // next top node candidate
        // ignore elements with a marker class like "ssIgnore".
        if( $(nextNode).hasClass( RT.ssIgnoreClass )) { 
          continue; 
        };
        // ignore non-block elements like spans
        if(  ! RT.isBlockElement( nextNode )) {
          continue;
        };
        // check if the element has reasonable height
        if( (RT.topsMap[nodePrevIdx].top - RT.topsMap[nodeNextIdx].top) > 50 ) {
          break;
        };
      };
      // ready: scroll and exit loop
      var deltaY = RT.topsMap[nodePrevIdx].top - RT.topsMap[nodeNextIdx].top;
      var propDelay = deltaY / RT.smartScrollHeight;
      console.log( 'scroll back delay: ' + RT.scrollDuration * propDelay );
      RT.scrollToElement( $( nextNode ), RT.scrollDuration * propDelay / 2 );
      return nodeNextIdx; 
    };

    $.fn.rt.smartScrollGetNextTopElement = function( nodePrevIdx ) {
      // TODO: calculate where to scroll, skipping repeated tops and too shallow
      // elements, try to scroll by complete elements using RT.smartScrollHeight
      // as an approximate limit for a scroll shot
      var RT = $.fn.rt.settings;
      if( !nodePrevIdx && nodePrevIdx !== 0 ) {
        return null;
      };
      // save starting point
      var nodeNextIdx = nodePrevIdx;
      while( true ) { 
        nodeNextIdx++; 
        // bounds check: don't search more than .length items
        if( ! ( nodeNextIdx < RT.topsMap.length )) { 
          break;
        };
        var nextNode = RT.topsMap[nodeNextIdx].node;  // next top node candidate
        // ignore elements with a marker class like "ssIgnore".
        if( $(nextNode).hasClass( RT.ssIgnoreClass )) { 
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
        if( (RT.topsMap[nodeNextIdx].top - RT.topsMap[nodePrevIdx].top) > RT.smartScrollHeight ) {
          break;
        };
      };
      // outline the element to be set at the top
      // TODO: add a class rtScrollTarget, set it to be removed then the animation ends
      // do the scroll and exit
      var deltaY = RT.topsMap[nodeNextIdx].top - RT.topsMap[nodePrevIdx].top;
      var propDelay = deltaY / RT.smartScrollHeight;
      console.log( 'scroll forward delay: ' + RT.scrollDuration * propDelay );
      RT.scrollToElement( $( nextNode ), RT.scrollDuration * propDelay );
      return nodeNextIdx; 
    };

    $.fn.rt.smartScrollToNextElement = function() {
      // scroll forward a paragraph or whatever the element at the top of the viewport,
      // using an animation
      // uses the RT.topsMap array, a list of all the elements and their top relative 
      // to the whole document (not their container)
      // must account for elements taller than the viewport and scroll them partially
      // must also account for elements that are too shallow or have a repeated top
      // it shouldn't trust the topsMap except for the elements ordering, because
      // changes in elements visibility can change tops unknowingly
      // if no element at top set to the top of the document
      // TODO: would be better to seek for one close to the current scroll position
      // each element has  { node: aRefToTheNode, top: relativeTop }
      // topsMap: [],
      var RT = this.settings;                                           // $$$$ was: $.fn.rt.settings;
      if( !RT.elementAtTop ) { RT.elementAtTop = RT.topsMap[0].node; };
      // get the current top node index
      var nodePrevIdx = RT.topsMapGetIdxByElement( RT.elementAtTop );
      // identify the next top node
      var nodeNextIdx = RT.smartScrollGetNextTopElement( nodePrevIdx );
      // now the scrolled element is the one at the top
      RT.elementAtTop = RT.topsMap[nodeNextIdx].node;
      // DEBUG:
      if( RT.debug ) {
        console.log(
            'smartScrolled to:' 
            + ' ' +  nodeNextIdx 
            + ' ' +  RT.topsMap[nodeNextIdx].top 
            + ' ' +  RT.topsMap[nodeNextIdx].node.nodeName
            );
      };
      // TODO: check that the top hasn't changed, otherwise recalculate topsMap
      /* var scrollAmount = Math.max(
         RT.elementAtTop.height(),
         this.settings.$container.height() / 2
         ); */
    };

    $.fn.rt.smartScrollToPrevElement = function() {
      // scroll backwards, to the first element with a height
      // get the current top node index
      var RT = $.fn.rt.settings;
      var nodePrevIdx = RT.topsMapGetIdxByElement( RT.elementAtTop );
      // identify the next top node
      var nodeNextIdx = RT.smartScrollGetPrevTopElement( nodePrevIdx );
      // now the scrolled element is the one at the top
      RT.elementAtTop = RT.topsMap[nodeNextIdx].node;
      // DEBUG:
      if( RT.debug ) {
        console.log(
            'smartScrolled back to:' 
            + ' ' +  nodeNextIdx 
            + ' ' +  RT.topsMap[nodeNextIdx].top 
            + ' ' +  RT.topsMap[nodeNextIdx].node.nodeName
            );
      };
    };

    // calculate progress indicator
    $.fn.rt.displayProgress = function() {
      var settings = $.fn.rt.settings;
      var RT = settings;
      var $pd = $('#rtProgressDiagram');
      // set the progress diagram: slap rtProgressTemplate over rtProgressDiagram 
      $pd.html( $('#rtProgressTemplate').html() );
      $pd.addClass('rtProgress');

      // calculate the proportional heights
      var hPri = $pd.height();
      var hTotal = settings.$container[0].clientHeight;
      var hDone = 0;
      if( RT.elementAtTop ) { hDone = RT.elementAtTop.scrollTop; };
      var hCurrent = window.innerHeight;
      var hPending;
      // done part: proportional to current scroll position
      hDone = Math.round( 100 * ( hDone / hTotal ) );
      $('#rtProgressDiagram .rtProgressDone').css( 'height',  hDone + '%' )
        .text( hDone < 10 ? '' : hDone + '%' );
      // current page part: proportional to viewport height
      hCurrent = Math.round( 100 * (hCurrent / hTotal) ); 
      if( hCurrent < 1 ) { hCurrent = 1; };
      $('#rtProgressDiagram .rtProgressCurrent').css('height', hCurrent + '%' );
      // remaining part: proportional to total height less the two other heights
      hPending =  100 - hDone - hCurrent;
      $('#rtProgressDiagram .rtProgressRemaining').css( 'height', hPending + '%' )
        .text( hPending < 10 ? '' : hPending + '%' );
    };

    $.fn.rt.writeScrollRecord = function() {
      // writes a scroll record in localStorage with the content of the scrollData object
      // and eventually fires the saving of a data batch in the server
      // TODO: eventually shoot an AJAX interaction to save the data in the server
      // get the current reading position in RT.scrollData (and in topsMapElement)
      // >>>> must get a reference to the plugin object, and use it to reference getCurrentReadingPosition()
      var RT = $.fn.rt.settings;
      RT.topsMapElement = RT.getCurrentReadingPosition();
      // save the scroll data in localStorage
      localStorage.setItem(
          'RT-' + RT.documentNumberEncoded + '-' + RT.scrollTime.getTime(),
          JSON.stringify(RT.scrollData)
          );
      // aggregate scroll records in the reading time stats
      // TODO: contiguous scrolls with less than 1 second are merged
      // RT.compileReadTimeStats();

      // prepare the data to be sent to the server in a weird format
      // 1- date and time
      var serverRecord = RT.scrollTime.getTime().toString(36);
      // 2 - document
      serverRecord += '-' + RT.documentNumberEncoded;
      // 3 - reader id
      serverRecord += '-' + RT.readerNumberEncoded;
      // 4 - docPath and optional percent scrolled
      serverRecord += '-' + RT.scrollData.dp + ( !!RT.scrollData.p ? '.' + RT.scrollData.p : '' );
      // 5 - action code 1 = scroll
      // TODO: must convert the action numeric code to base36
      // default, ommitted: serverRecord += '-1';
      // 6 - additional data: text in case of a scroll with debug activated
      if( RT.debug ) { !!RT.scrollData.text ? '-1-' + 'RT.scrollData.text' : ''; };

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
    };

})( jQuery, window, document );
