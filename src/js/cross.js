;
(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'cross';
  var debug;

  function Plugin(element, options) {

    this.element = element;
    this.bFirstShow;
    this.$currentMenuItem = null;
    this.$lastMenuItem = null;
    this.clearLastMenuItem = null;
    this.delayBeforeSlideDown = null;
    this.dragging = false;

    this._name = pluginName;

    this._defaults = $.fn[ pluginName ].defaults;
    this.settings = $.extend({}, this._defaults, options);

    this._debug = this.settings.debug;
    if (this._debug) console.log('defaults', this._defaults);
    if (this._debug) console.log('settings', this.settings);

    this.init();
  }

  $.extend(Plugin.prototype, {

    init: function() {

      // init interaction types manager plugin
      Both.init();

      // init media-queries manager plugin
      Threshold();

      var _this = this;
      _this.buildCache();
      _this.bindEvents();

      //_this.callbacks = {};

      // touch actions
      _this.menuitemTouchend = function(element, event) {
        if (this._debug) console.log('>>> touchend menuitem');
        event.preventDefault();

        var $this = element;
        var $submenu = $this.next('[role="menu"]');
        _this.$collapsibleMenuItems.removeClass('expanded');
        if (!$submenu.attr('hidden')) {
          $submenu.attr('hidden', true);
        } else {
          $this.addClass('expanded');
          _this.$collapsibleMenuItems.next('[role="menu"]').attr('hidden', true);
          $submenu.removeAttr('hidden');
        }
      };

      _this.documentTouchstart = function() {
        _this.dragging = false;
      };

      _this.documentTouchmove = function() {
        _this.dragging = true;
      };

      _this.documentTouchend = function(event) {
        if (_this.dragging) return;
        if (this._debug) console.log('--------------- >>> touchend document');
        if (!_this.$collapsibleMenuItems.hasClass('expanded')) return;
        if ($(event.target).parents('[role="menubar"]').length == 0) {
          if (this._debug) console.log('>>> close menuitems');
          _this.$collapsibleMenuItems.removeClass('expanded').next('[role="menu"]').attr('hidden', true);
        }
      };

      // mouse actions
      _this.menuitemMouseenter = function(element) {
        if (this._debug) console.log('--------------- >>> mouseenter menuitem');
        var $this = element;
        _this.$currentMenuItem = $this.children('[role="menuitem"]');
        _this.bFirstShow = _this.$lastMenuItem == null ? true : false;
        var $submenu = _this.$currentMenuItem.next('[role="menu"]');

        function slideDown() {
          _this.$currentMenuItem.addClass('expanded');
          $submenu.removeAttr('hidden');
        }

        if (_this.bFirstShow) {
          _this.delayBeforeSlideDown = setTimeout(function() {
            slideDown();
          }, 250);
        } else {
          clearTimeout(_this.clearLastMenuItem);
          slideDown();
        }
      };

      _this.menuitemMouseleave = function() {
        if (this._debug) console.log('--------------- >>> mouseleave menuitem');
        _this.$lastMenuItem = _this.$currentMenuItem;

        _this.clearLastMenuItem = setTimeout(function() {
          _this.$lastMenuItem = null;
        }, 0);

        clearTimeout(_this.delayBeforeSlideDown);
        _this.$collapsibleMenuItems.removeClass('expanded').next('[role="menu"]').attr('hidden', true);
      };

      _this.navMouseleave = function() {
        if (this._debug) console.log('--------------- >>> mouseleave menu');
        _this.$lastMenuItem = null;
        _this.bFirstShow = false;
      };

      // init interaction types manager plugin
      Both.start();

    },

    // Remove plugin instance completely
    destroy: function() {
      var _this = this;

      _this.unbindEvents();
      _this.$nav.removeData();
    },

    // Cache DOM nodes for performance
    buildCache: function() {
      var _this = this;

      _this.document = $(document);
      _this.window = $(window);
      _this.$html = $('html');
      _this.$nav = $(_this.element);
      _this.button = Private.define(_this.button);
      _this.$collapsibleMenuItems = _this.$nav.children('[role="presentation"]').children('[role="menuitem"]').filter(function() {
        return $(this).next('[role="menu"]').length;
      });
      _this.$collapsiblePresentations = _this.$collapsibleMenuItems.parent('[role="presentation"]');
      _this.window = $(window);
      _this.$html = $('html');
    },

    // Bind events that trigger methods
    bindEvents: function() {
      var _this = this;

      _this.window.on('resize' + '.' + _this._name, function() {
        _this.set();
      });

      // touch actions
      Both.store('touch', _this.$collapsibleMenuItems, 'touchend' + '.' + _this._name, function(e) {
        _this.menuitemTouchend($(this), e);
      });

      Both.store('touch', _this.document, 'touchstart' + '.' + _this._name, function() {
        _this.documentTouchstart();
      });

      Both.store('touch', _this.document, 'touchmove' + '.' + _this._name, function() {
        _this.documentTouchmove();
      });

      Both.store('touch', _this.document, 'touchend' + '.' + _this._name, function(e) {
        _this.documentTouchend(e);
      });

      // mouse actions
      Both.store('mouse', _this.$collapsiblePresentations, 'mouseenter' + '.' + _this._name, function() {
        _this.menuitemMouseenter($(this));
      });

      Both.store('mouse', _this.$collapsiblePresentations, 'mouseleave' + '.' + _this._name, function() {
        _this.menuitemMouseleave();
      });

      Both.store('mouse', _this.$nav, 'mouseleave' + '.' + _this._name, function(e) {
        _this.navMouseleave();
      });

      /*_this.$nav.on('click' + '.' + _this._name, function() {
        _this.someOtherFunction.call(_this);
      });*/
    },

    // Unbind events that trigger methods
    unbindEvents: function() {
      var _this = this;

      _this.window.off('resize' + '.' + _this._name);

      // touch actions
      Both.settings.oHandlersData.touch[_this.$collapsibleMenuItems]['touchend' + '.' + _this._name] = null;
      Both.settings.oHandlersData.touch[_this._this.document]['touchstart' + '.' + _this._name] = null;
      Both.settings.oHandlersData.touch[_this._this.document]['touchmove' + '.' + _this._name] = null;
      Both.settings.oHandlersData.touch[_this._this.document]['touchend' + '.' + _this._name] = null;

      // mouse actions
      Both.settings.oHandlersData.touch[_this.$collapsibleMenuItems]['mouseenter' + '.' + _this._name] = null;
      Both.settings.oHandlersData.touch[_this.$collapsibleMenuItems]['mouseleave' + '.' + _this._name] = null;
      Both.settings.oHandlersData.touch[_this.$nav]['mouseleave' + '.' + _this._name] = null;

      //_this.$nav.off('.' + _this._name);
    },

    reset: function() {
      if (this._debug) console.log('###################### reset()');
      var _this = this;

      _this.$nav.off('mouseleave');
      _this.$collapsiblePresentations.off('mouseenter' + '.' + _this._name);
      _this.$collapsiblePresentations.off('mouseleave' + '.' + _this._name);
      _this.$collapsibleMenuItems
        .off('click' + '.' + _this._name)
        .removeClass('expanded').next('[role="menu"]').attr('hidden', true);
    },

    set: function() {
      if (this._debug) console.log('###################### set()');
      var _this = this;

      _this.reset();
      $(window).data('Threshold').after('mobile', function() {
        console.log(_this.width + ': mousenter OFF');

        _this.$collapsibleMenuItems.on('click' + '.' + _this._name, function(e) {
          _this.menuitemTouchend($(this), e);
        });

      });

      $(window).data('Threshold').after(['x-small', 'small', 'medium', 'large', 'x-large'], function() {
        console.log(size + ': mousenter ON');

        _this.$collapsiblePresentations.on('mouseenter' + '.' + _this._name, function() {
          _this.menuitemMouseenter($(this));
        });

        _this.$collapsiblePresentations.on('mouseleave' + '.' + _this._name, function() {
          _this.menuitemMouseleave();
        });

        _this.$nav.on('mouseleave' + '.' + _this._name, function() {
          _this.navMouseleave();
        });

      });

      $(window).data('Threshold').after('all', function() {
        _this.$html.removeClass('menu-on');
        $('#toggleNav').removeClass('opened');
      });

    }

  });

  var Private = {

    define: function(o) {
      if (this._debug) console.log('##################### define()');

      var $returnObject = null;

      // Undefined item
      if (typeof o === 'undefined') {
        return;
      }

      // Object item
      else if ((typeof o === 'object') && (o !== null)) {
        $returnObject = o;
      }

      // Id or class item
      else if ((typeof o === 'string') /*&& ((o.charAt(0) == '#') || (o.charAt(0) == '.'))*/) {
        $returnObject = $(o);
      }

      return $returnObject;
    },

  };

  $.fn[pluginName] = function(options) {
    var args = arguments;

    // Is the first parameter an object (options), or was omitted,
    // instantiate a new instance of the plugin.
    if (options === undefined || typeof options === 'object') {
      return this.each(function() {

        // Only allow the plugin to be instantiated once,
        // so we check that the element has no plugin instantiation yet
        if (!$.data(this, 'plugin_' + pluginName)) {

          // if it has no instance, create a new one,
          // pass options to our plugin constructor,
          // and store the plugin instance
          // in the elements jQuery data object.
          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });

      // If the first parameter is a string and it doesn't start
      // with an underscore or "contains" the `init`-function,
      // treat this as a call to a public method.
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      // Cache the method call
      // to make it possible
      // to return a value
      var returns;

      this.each(function() {
        var instance = $.data(this, 'plugin_' + pluginName);

        // Tests that there's already a plugin-instance
        // and checks that the requested public method exists
        if (instance instanceof Plugin && typeof instance[options] === 'function') {

          // Call the method of our plugin instance,
          // and pass it the supplied arguments.
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }

        // Allow instances to be destroyed via the 'destroy' method
        if (options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null);
        }
      });

      // If the earlier cached method
      // gives a value back return the value,
      // otherwise return this to preserve chainability.
      return returns !== undefined ? returns : this;
    }
  };

  $.fn[ pluginName ].defaults = {
    widths: [
      'x-large',
      'large',
      'medium',
      'small',
      'x-small',
      'mobile',
    ],
    width: 'mobile',
    button: '#toggleNav',
    onComplete: null,
    debug: true,
  };

})(jQuery, window, document);
