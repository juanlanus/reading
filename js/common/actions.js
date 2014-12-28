// encoding of recorded user actions types
var Actions = function() {

    var actionIds = {
      sessionStart: 0,
      smartScroll: 1,
      scroll: 2,
      resize: 6,
      followLink: 5,
      openTOC: 7,
      selectTOCLink: 8,
      focusLost: 20,
      focusRegained: 21,
      sessionEnd: 25
    };

    var actionIdMap = null;
      
    this.getActionId = function( actionName ) {
      return actionIds[actionName];
    };

    this.getActionName = function( actionId ) {
      if( ! actionIdMap ) {
        // build a map from ids to names
        actionIdMap = [];
        for( var a in actionIds ) { actionIdMap[actionIds[a]] = a; }
      }
      return actionIdMap[actionId];

    };

    return this;
};
