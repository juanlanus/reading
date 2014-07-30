;(function($, window, document, undefined) {

  var PLUGIN_NAME = 'pluginname',
      PLUGIN_VERSION = '0.1',
      PLUGIN_OPTIONS = {
      };

  function Plugin(element, options) {

    this.name = PLUGIN_NAME;
    this.version = PLUGIN_VERSION;
    this.settings = PLUGIN_OPTIONS;
    this.element = element;
    this.$element = $(this.element);

    this._setOptions(options);

  };

  Plugin.prototype._setOptions = function(options) {
    this.settings = $.extend({}, this.settings, options);
    this._setup();
    this.init();
  };

  Plugin.prototype._getOptions = function() {
    return this.settings;
  };

  Plugin.prototype.options = function(options) {
    return typeof options === 'object' ? this._setOptions(options) : this._getOptions();
  };

  // set some attributes new, helpfull if you change some dynamic settings
  Plugin.prototype._setup = function() {

  };

  // do some init stuff here
  Plugin.prototype.init = function() {

  };

  // Function (e.g. open)
  Plugin.prototype.open = function(n) {

  };

  // Function (e.g. close)
  Plugin.prototype.close = function(n) {

  };

  $.fn[PLUGIN_NAME] = function() {

    var args = arguments;

    return this.each(function() {

      var pluginObject = $(this).data('plugin_'+PLUGIN_NAME);

      if (!pluginObject && (typeof args[0] === 'object' || args.length === 0)) {
        $(this).data('plugin_'+PLUGIN_NAME, new Plugin(this, args[0]));
      } else if (typeof args[0] === 'string') {

        var method = args[0].replace('_', '');

        if (pluginObject[method]) {
          return pluginObject[method].apply(pluginObject, Array.prototype.slice.call(args, 1));
        }

      }

      return pluginObject;

    });

  };

}(jQuery, window, document));
