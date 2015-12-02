;
(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'cross';

  function Plugin(element, options) {

    this.element = element;
    this.bFirstShow;
    this.$currentMenuItem = null;
    this.$lastMenuItem = null;
    this.clearLastMenuItem = null;
    this.delayBeforeSlideDown = null;
    this.dragging = false;
    this.state = null;

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
      var _this = this;
      _this.devices = [
      'desktop',
      'tablet',
      'mobile',
      ];

      // init interaction types manager plugin
      if (_this.settings.both.touch) {
        both({
          touch: _this.settings.both.touch,
          name: _this.settings.both.name,
          class: _this.settings.both.class,
        });
      } else {
        both({
          name: _this.settings.both.name,
          class: _this.settings.both.class,
        });
      }

      _this.buildCache();

      // init media-queries manager plugin
      threshold({
        ranges: _this.settings.threshold.ranges,
        name: _this.settings.threshold.name,
        class: _this.settings.threshold.class,
      });

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

        if (!$(event.target).closest(_this.$nav).length && _this.$html.hasClass('menu-on') && !$(event.target).closest(_this.$button).length) {
          _this.$button.trigger('click');
        }

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

      _this.documentClick = function(event) {
        if (this._debug) console.log('--------------- >>> click document');

        if (!$(event.target).closest(_this.$nav).length && _this.$html.hasClass('menu-on') && !$(event.target).closest(_this.$button).length) {
          _this.$button.trigger('click');
        }

      };

      _this.start();
    },

    // Remove plugin instance completely
    destroy: function() {
      var _this = this;

      _this.unbindEvents.short();
      _this.unbindEvents.long();
      _this.$nav.removeData();
    },

    // Cache DOM nodes for performance
    buildCache: function() {
      var _this = this;

      _this.document = $(document.documentElement);;
      _this.window = $(window);
      _this.$html = $('html');
      _this.$nav = $(_this.element).children('[role="menubar"]');
      _this.$button = Private.define(_this.settings.button);
      _this.$collapsibleMenuItems = _this.$nav
				.children('[role="presentation"]')
				.children('[role="menuitem"]')
				.filter(function() {
  return $(this).next('[role="menu"]').length;
				});

      _this.$collapsiblePresentations = _this.$collapsibleMenuItems.parent('[role="presentation"]');
      _this.window = $(window);
      _this.$html = $('html');
    },

    // Bind events that trigger methods
    bindEvents: {

      short: function(c) {
        if (this._debug) console.log('########### bindEvents.short()');
        var _this = this;

        _this.$button.on('click' + '.' + _this._name, function() {
          if (this._debug) console.log('~~~~~~~~~~~ ' + _this.$button + ' click');
          _this.$collapsibleMenuItems.removeClass('expanded').next('[role="menu"]').attr('hidden', true);
          _this.$html.toggleClass('menu-on');
          _this.$button.toggleClass('opened');
        });

        _this.$collapsibleMenuItems.on('click' + '.' + _this._name, function(e) {
          _this.menuitemTouchend($(this), e);
        });

        _this.document.on('click' + '.' + _this._name, function(e) {
          _this.documentClick(e);
        });

        if (typeof c === 'function') {
          c.call();
        }

      },

      long: function(c) {
        if (this._debug) console.log('########### bindEvents.long()');
        var _this = this;

        // touch actions
        $(window).data('both').store('touch', _this.$collapsibleMenuItems, 'touchend' + '.' + _this._name, function(e) {
          _this.menuitemTouchend($(this), e);
        });

        $(window).data('both').store('touch', _this.document, 'touchstart' + '.' + _this._name, function() {
          _this.documentTouchstart();
        });

        $(window).data('both').store('touch', _this.document, 'touchmove' + '.' + _this._name, function() {
          _this.documentTouchmove();
        });

        $(window).data('both').store('touch', _this.document, 'touchend' + '.' + _this._name, function(e) {
          _this.documentTouchend(e);
        });

        // mouse actions
        $(window).data('both').store('mouse', _this.$collapsiblePresentations, 'mouseenter' + '.' + _this._name, function() {
          _this.menuitemMouseenter($(this));
        });

        $(window).data('both').store('mouse', _this.$collapsiblePresentations, 'mouseleave' + '.' + _this._name, function() {
          _this.menuitemMouseleave();
        });

        $(window).data('both').store('mouse', _this.$nav, 'mouseleave' + '.' + _this._name, function(e) {
          _this.navMouseleave();
        });

        $(window).data('both').store('mouse', _this.document, 'click' + '.' + _this._name, function(e) {
          _this.documentClick(e);
        });

        if (typeof c === 'function') {
          c.call();
        }

      },

    },

    // Unbind events that trigger methods
    unbindEvents: {

      short: function() {
        if (this._debug) console.log('########### unbindEvents.short()');
        var _this = this;

        _this.$button.off('click' + '.' + _this._name);
        _this.$collapsibleMenuItems.off('click' + '.' + _this._name);
        _this.document.off('click' + '.' + _this._name);
      },

      long: function(c) {
        if (this._debug) console.log('########### unbindEvents.long()');
        var _this = this;

        // touch actions
        $(window).data('both').lose('touch', _this.$collapsibleMenuItems, 'touchend' + '.' + _this._name);

        $(window).data('both').lose('touch', _this.document, 'touchstart' + '.' + _this._name);

        $(window).data('both').lose('touch', _this.document, 'touchmove' + '.' + _this._name);

        $(window).data('both').lose('touch', _this.document, 'touchend' + '.' + _this._name);

        // mouse actions
        $(window).data('both').lose('mouse', _this.$collapsiblePresentations, 'mouseenter' + '.' + _this._name);

        $(window).data('both').lose('mouse', _this.$collapsiblePresentations, 'mouseleave' + '.' + _this._name);

        $(window).data('both').lose('mouse', _this.$nav, 'mouseleave' + '.' + _this._name);

        $(window).data('both').lose('mouse', _this.document, 'click' + '.' + _this._name);

        if (typeof c === 'function') {
          c.call();
        }

      },

    },

    reset: function(type) {
      if (this._debug) console.log('########### reset()');
      var _this = this;

      _this.unset(true, type);
    },

    unset: function(reset, type) {
      if (this._debug) console.log('########### unset()');
      var _this = this;

      if (type === 'short') {
        _this.unbindEvents.long.call(_this/*, both.start*/);
      } else if (type === 'long') {
        _this.unbindEvents.short.call(_this);
      }

      if (reset) {
        _this.set(type);
      }
    },

    set: function(type) {
      if (this._debug) console.log('###################### set()');
      var _this = this;

      if (_this._debug) console.log('type', type);

      if (type === 'short') {
        _this.bindEvents.short.call(_this/*, both.start*/);
      } else if (type === 'long') {
        _this.bindEvents.long.call(_this/*, both.start*/);
      }

    },

    start: function() {
      if (this._debug) console.log('###################### start()');
      var _this = this;

      $(window).data('threshold').after(_this.settings.short, function() {
        //console.log(_this.settings.short + ': mousenter OFF / touch ON');

        if (_this.state === 'short') return;
        _this.state = 'short';
        _this.reset('short');
        if (typeof _this.settings.after.short === 'function') {
          _this.settings.after.short.call(_this);
        }

        if (typeof _this.settings.after.all === 'function') {
          _this.settings.after.all.call(_this);
        }
      });

      $(window).data('threshold').after(_this.settings.long, function() {
        //console.log(_this.settings.long + ': mousenter ON / touch OFF');

        if (_this.state === 'long') return;
        _this.state = 'long';
        _this.reset('long');
        if (typeof _this.settings.after.long === 'function') {
          _this.settings.after.long.call(_this);
        }

        if (typeof _this.settings.after.all === 'function') {
          _this.settings.after.all.call(_this);
        }
      });

      $(window).data('threshold').after('all', function() {
        //_this.$html.removeClass('menu-on');
        //_this.$button.removeClass('opened');
      });

      if (typeof _this.settings.after.init === 'function') {
        _this.settings.after.init.call(_this);
      }

    },

  });

  var Private = {

    define: function(o) {
      if (this._debug) console.log('##################### define()');

      var $returnObject = null;

      if (typeof o === 'undefined') {
        // Undefined item
        return;
      } else if ((typeof o === 'object') && (o !== null)) {
        // Object item
        $returnObject = o;
      } else if ((typeof o === 'string') /*&& ((o.charAt(0) == '#') || (o.charAt(0) == '.'))*/) {
        // Id or class item
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
        if (!$.data(this, pluginName)) {

          // if it has no instance, create a new one,
          // pass options to our plugin constructor,
          // and store the plugin instance
          // in the elements jQuery data object.
          $.data(this, pluginName, new Plugin(this, options));
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
        var instance = $.data(this, pluginName);

        // Tests that there's already a plugin-instance
        // and checks that the requested public method exists
        if (instance instanceof Plugin && typeof instance[options] === 'function') {

          // Call the method of our plugin instance,
          // and pass it the supplied arguments.
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }

        // Allow instances to be destroyed via the 'destroy' method
        if (options === 'destroy') {
          $.data(this, pluginName, null);
        }
      });

      // If the earlier cached method
      // gives a value back return the value,
      // otherwise return this to preserve chainability.
      return returns !== undefined ? returns : this;
    }
  };

  $.fn[ pluginName ].defaults = {

    threshold: {

      // [threshold] breakpoints (minimum: 2)
      ranges: {
        'x-large': ['1600px', -1],      // '1480px'
        large: ['1440px', '1599px'],    // '1360px'
        medium: ['1280px', '1439px'],   // '1220px'
        small: ['960px', '1279px'],     // '920px'
        'x-small': ['760px', '959px'],  // '740px',
        mobile: [-1, '759px'],           // '100%',
      },

      // [threshold] data attribute name (or class name prefix)
      name: 'window',

      // [threshold] data attribute (false) or class (true)
      class: false,
    },

    // breakpoint(s) name(s) when short menu is activated
    short: [
      'mobile',
    ],

    // breakpoint(s) name(s) when long menu is activated
    long: [
      'x-large',
      'large',
      'medium',
      'small',
      'x-small',
    ],

    // after menu state change (function)
    after: {
      init: null,
      short: null,
      long: null,
      all: null,
    },

    // toggle menu button element (string or jQuery object)
    button: '#toggleNav',

    both: {

      // [both] touch screen (true) or not (false)
      touch: false,

      // [both] data attribute name (or class name prefix)
      name: 'interaction',

      // [both] data attribute (false) or class (true)
      class: false,

    },

    // debug mode
    debug: false,

  };

})(jQuery, window, document);
