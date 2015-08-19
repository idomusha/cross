/* =================================================
 *  cross - v0.1.0-alpha
 *  multi-device navigation menu
 *  https://github.com/idomusha/cross
 *
 *  Made by idomusha
 *  Under MIT License
 * =================================================
 */
/*
 *  both - v0.2.0
 *  detects in real time user interaction type (Mouse or Touch) and switches linked events
 *  https://github.com/idomusha/both
 *
 *  Made by idomusha
 *  Under MIT License
 */
/**
 * both
 * detects in real time user interaction type (Mouse or Touch) and switches linked events
 * @author idomusha / https://github.com/idomusha
 */

(function (window, $) {
  var s,
    Both = {

      defaults: {
        types: [],    // mouse, touch (touch and pen), key
        device: '',   // desktop, tablet, mobile

        touch: false,
        mouse: false,
        key: false,
        oHandlersData: [],
        jHandlersData: {},
        iViewportWidth: 1024,
        iInterval: 200,
        debug: false
      },

      options: {},

      settings: {},

      init: function () {
        // merge defaults and options, without modifying defaults explicitly
        this.settings = $.extend({}, this.defaults, this.options);
        s = this.settings;

        if (s.debug) log("##################### init()");

        if (s.device == 'mobile' || s.device == "tablet") {
          this.set('touch', true);
        }
        else {
          this.set('mouse', true);
        }

        s.oHandlersData = {
          mouse: [],
          touch: [],
          key: []
        };

        this.bindUIActions();
      },

      bindUIActions: function () {
        if (s.debug) log("##################### bindUIActions()");

        var _movewait;
        var _return;    // boolean to not fire mousemove event after touchstart event
        $(document).on('mousemove', function (e) {
          if (_return) {
            _return = false;
            return;
          }
          if (s.types.indexOf('mouse') > -1) return;
          if (s.debug) log('>>> mousemove');
          if (typeof _movewait != 'undefined') {
            clearTimeout(_movewait);
          }
          _movewait = setTimeout(function () {

            if (s.debug) log('>>> movewait');
            Both.set('mouse', e);
            Both.handleInteractionTypeChange(e);
          }, s.iInterval);
        });

        $(document).on('touchstart', function (e) {
          if (s.types.indexOf('touch') > -1) return;
          if (s.debug) log('>>> touchstart');
          Both.set('touch', e);
          Both.handleInteractionTypeChange(e);
          _return = true;
        });

        /*$(document).on('click', function (e) {
          if (s.debug) log('>>> click');
          _return = false;
        });*/

      },

      define: function (o) {
        if (s.debug) {
          log("##################### define()");
        }

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

      set: function (type) {
        if (type == 'mouse') {
          $('html').removeClass('touch').addClass('mouse');
          s.touch = false;
          s.mouse = true;
          Both.array.add(s.types, "mouse");
          Both.array.remove(s.types, "touch");
        }
        else if (type == 'touch') {
          $('html').removeClass('mouse').addClass('touch');
          s.touch = true;
          s.mouse = false;
          Both.array.add(s.types, "touch");
          Both.array.remove(s.types, "mouse");
        }
      },

      start: function () {
        Both.handleInteractionTypeChange(true);
      },

      handleInteractionTypeChange: function (e) {
        var _text = typeof(e) == "boolean" && e ? 'is setted' : 'has changed'
        if (s.debug) log('---------------------------------------------------');
        if (s.debug) log('Interaction type ' + _text + ': ' + s.types.toString());
        if (s.debug) log('---------------------------------------------------');
        Both.switch();
      },

      store: function (context, selector, event, handler) {
        if (s.debug) log("##################### store()");

        if (s.debug) log("- context", context);
        if (s.debug) log("- selector", selector);
        if (s.debug) log("- event", event);
        if (s.debug) log("- handler", handler);

        s.oHandlersData[context].push({
          selector: selector,
          event: event,
          handler: handler
        });

        if (s.debug) log("s.oHandlersData", s.oHandlersData);

      },

      switch: function () {
        if (s.debug) log("##################### switch()");
        var _oType = {
          on: s.types.indexOf('mouse') > -1 ? 'mouse' : 'touch',
          off: s.types.indexOf('mouse') > -1 ? 'touch' : 'mouse'
        };
        _type = 'mouse' in s.types ? 'mouse' : 'touch';
        if (s.debug) log(s.types);
        Both.on(_oType.on);
        Both.off(_oType.off);
      },

      on: function (type) {
        if (s.debug) log("##################### on()");
        for (var i = 0; i < s.oHandlersData[type].length; i++) {
          var _oHandlerData = {
            selector: s.oHandlersData[type][i]['selector'],
            event: s.oHandlersData[type][i]['event'],
            handler: s.oHandlersData[type][i]['handler']
          }
          _oHandlerData.selector.on(_oHandlerData.event, _oHandlerData.handler);
        }
      },

      off: function (type) {
        if (s.debug) log("##################### off()");
        for (var i = 0; i < s.oHandlersData[type].length; i++) {
          var _oHandlerData = {
            selector: s.oHandlersData[type][i]['selector'],
            event: s.oHandlersData[type][i]['event'],
            handler: s.oHandlersData[type][i]['handler']
          }
          _oHandlerData.selector.off(_oHandlerData.event, _oHandlerData.handler);
        }
      },

      array: {

        add: function (array, item) {
          if (s.debug) log("##################### array.add()");
          array.push(item);
        },

        remove: function (array, item) {
          if (s.debug) log("##################### array.remove()");
          var index = array.indexOf(item);
          if (index > -1) array.splice(index, 1);
        }

      },

      object: {

        add: function (obj, key, item) {
          if (s.debug) log("##################### object.add()");
          if (this.collection[key] != undefined)
            return undefined;
          this.collection[key] = item;
          return ++this.count
        },

        remove: function (obj, key) {
          if (s.debug) log("##################### object.remove()");
          if (this.collection[key] == undefined)
            return undefined;
          delete this.collection[key]
          return --this.count
        },

        iterate: function (obj) {
          for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
              if (typeof obj[property] == "object") {
                Both.iterate(obj[property]);
              }
              else {
                console.log(property + "   " + obj[property]);
              }
            }
          }
        },

        get: function (obj, prop) {
          if (s.debug) log("##################### object.get()");
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              return obj[prop];
            }
          }
        }

      },

      destroy: function () {
        if (s.debug) log("##################### destroy()");
        $.removeData(Both.get(0));
      },

      refresh: function () {
        if (s.debug) log("##################### refresh()");
        Both.destroy();
        Both.init();
      }
    }
  window.Both = Both;
})
(window, jQuery);
/*
 *  threshold - v0.3.0
 *  manages page width change
 *  https://github.com/idomusha/threshold
 *
 *  Made by idomusha
 *  Under MIT License
 */
;

(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'Threshold';

  function Plugin(options) {

    this._name = pluginName;

    this._defaults = window[ pluginName ].defaults;
    this.settings = $.extend({}, this._defaults, options);

    this._debug = this.settings.debug;
    if (this._debug) console.log('defaults', this._defaults);
    if (this._debug) console.log('settings', this.settings);

    this.init();
  }

  $.extend(Plugin.prototype, {

    init: function() {
      var _this = this;
      _this.buildCache();
      _this.bindEvents();

      _this.callbacks = {};
      _this.set();
    },

    // Remove plugin instance completely
    destroy: function() {
      var _this = this;

      _this.unbindEvents();
      _this.unset();
      _this.window.removeData();
    },

    // Cache DOM nodes for performance
    buildCache: function() {
      var _this = this;

      _this.window = $(window);
      _this.$html = $('html');
    },

    // Bind events that trigger methods
    bindEvents: function() {
      var _this = this;

      _this.window.on('resize' + '.' + _this._name, function() {
        if (this._debug) console.log('----------- resize' + '.' + _this._name);
        _this.reset();
      });
    },

    // Unbind events that trigger methods
    unbindEvents: function() {
      var _this = this;

      _this.window.off('.' + _this._name);
    },

    reset: function() {
      if (this._debug) console.log('########### reset()');
      var _this = this;

      _this.unset(true);
    },

    unset: function(reset) {
      if (this._debug) console.log('########### unset()');
      var _this = this;

      var classes = _this.$html.attr('class').split(' ').filter(function(c) {
        return c.lastIndexOf(_this.settings.class, 0) !== 0;
      });

      _this.$html.attr('class', $.trim(classes.join(' ')));

      if (reset) {
        _this.set();
      }
    },

    set: function() {
      if (this._debug) console.log('########### set()');
      var _this = this;

      // This will prevent JavaScript from calculating pixels for the child element.
      $('.width-full').hide();
      _this.width = $('.width-fixed').eq(0).css('width');
      $('.width-full').show();

      var obj = _this.settings.widths;
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (this._debug) console.log(prop + ' = ' + obj[prop]);
          var name = prop;
          var width = obj[prop];
          if (_this.width === width) {
            _this.state = name;
          }
        }
      }

      if (this._debug) console.log('width:', _this.width);
      if (this._debug) console.log('previousState:', _this.previousState);
      if (this._debug) console.log('state:', _this.state);
      if (this._debug) console.log('callbacks:', _this.callbacks);

      _this.$html.addClass(_this.settings.class + '-' + _this.state);

      if (_this.previousState !== _this.state) {
        _this.onChange.call(_this);
      } else {
        _this.previousState = _this.state;
      }

    },

    onChange: function() {
      if (this._debug) console.log('########### onChange()');
      var _this = this;

      if (this._debug) console.log('state: ' + _this.state);
      if (_this.callbacks[_this.state] !== undefined) {
        _this.call(_this.callbacks[_this.state]);
      }

      if (_this.callbacks.all !== undefined) {
        _this.call(_this.callbacks.all);
      }

      _this.previousState = _this.state;
    },

    call: function(state) {
      if (this._debug) console.log('########### onChange()');

      if (this._debug) console.log(state);
      $.each(state, function(i, v) {
        if (typeof v === 'function') {
          v.call();
        }
      });
    },

    after: function(state, callback) {
      if (this._debug) console.log('########### after()');
      var _this = this;

      // checks if state is an array
      if (state instanceof Array) {
        for (var i = 0; i < state.length; i++) {
          _this.after(state[i], callback);
        }

        return;
      }

      // checks if state is a valid state (in default settings)
      if (_this.settings.widths.hasOwnProperty(state) || state === 'all') {
        _this.store(state, callback);
      }

      if (this._debug) console.log('for', state);
      if (this._debug) console.log('callbacks', _this.callbacks);
      if (state === _this.state || state === 'all') {
        // Clear prev counter, if exist.
        if (_this.interval != null) {
          clearInterval(this.interval);
        }

        // init timer
        _this.timer = 0;
        _this.interval = setInterval(function() {
          if (_this.timer == 1) {
            _this.onChange.call(_this);
            clearInterval(_this.interval);
            _this.interval = null;
          }

          _this.timer++;
        }.bind(_this), 100);

        // Important to .bind(this) so that context will remain consistent.
      }
    },

    store: function(state, callback) {
      if (this._debug) console.log('########### store()');
      var _this = this;

      // checks if one or more callbacks already exist
      if (_this.callbacks[state] === undefined) {
        _this.callbacks[state] = [];
      }

      // store callback
      _this.callbacks[state].push(callback);
    },

  });

  window[ pluginName ] = function(options) {
    if (!$.data(window, pluginName)) {
      $.data(window, pluginName, new Plugin(options));
    }
  };

  window[ pluginName ].defaults = {
    class: 'window',
    widths: {
      'x-large': '1480px',
      'large': '1360px',
      'medium': '1220px',
      'small': '920px',
      'x-small': '740px',
      'mobile': '100%',
    },
    debug: false,
  };

})(jQuery, window, document);

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
      _this.$button = Private.define(_this.settings.button);
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

      _this.$button.on('click' + '.' + _this._name, function() {
        _this.$html.toggleClass('menu-on');
        _this.$button.toggleClass('opened');
      });

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

      _this.$button.off('click' + '.' + _this._name);

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
        console.log(_this.width + ': mousenter ON');

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
        _this.$button.removeClass('opened');
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
