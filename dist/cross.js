/* =================================================
 *  cross - v0.6.0
 *  multi-device navigation menu
 *  https://github.com/idomusha/cross
 *
 *  Made by idomusha
 *  Under MIT License
 * =================================================
 */
/*
 *  both - v0.7.0
 *  detects in real time user interaction type (mouse, touch or keyboard) and switches linked events
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

;

(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'both';

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
      if (_this._debug) console.log('##################### init()');

      _this.buildCache();

      // mouse, touch (touch and pen), key
      _this.types = [];
      _this.touch = false;
      _this.mouse = false;
      _this.keyboard = false;

      _this.handlersData = {
        mouse: [],
        touch: [],
        key: [],
      };

      _this.scroll = false;

      _this.inputs = [
        'input',
        'select',
        'textarea',
      ];
      _this.keys = {
        9: 'tab',
        13: 'enter',
        16: 'shift',
        27: 'esc',
        32: 'space',
        33: 'page up',
        34: 'page down',
        35: 'end',
        36: 'home',
        37: 'left arrow',
        38: 'up arrow',
        39: 'right arrow',
        40: 'down arrow',
      };

      _this.active = {
        type: '',
        input: '',
      };

      _this.all = {
        type: [],
        keys: [],
      };

      // map of IE 10 and Windows 8 pointer types (IE 11 and Windows 8.1 return a string)
      // https://msdn.microsoft.com/fr-fr/library/windows/apps/hh466130.aspx
      // https://msdn.microsoft.com/fr-fr/library/windows/apps/hh466130.aspx
      /*_this.pointerTypes = {
        2: 'touch',

        // treat pen like touch
        3: 'touch',
        4: 'mouse',
      };*/

      if (_this._debug) console.log('device:', _this.settings.device);
      if (_this.settings.device == 'mobile' || _this.settings.device == 'tablet') {
        _this.set('touch', true);
      } else {
        _this.set('mouse', true);
      }

      _this.bindEvents();
    },

    // Remove plugin instance completely
    destroy: function() {
      var _this = this;

      _this.unbindEvents();
      _this.window.removeData();
    },

    // Cache DOM nodes for performance
    buildCache: function() {

      this.document = $(document);
      this.$html = $('html');
    },

    // Bind events that trigger methods
    bindEvents: function() {
      var _this = this;
      if (_this._debug) console.log('##################### bindUIActions()');

      //comment:mousemoveend:var _movewait;

      // boolean to not fire mousemove event after touchstart event
      var _touchstart;

      _this.document.on('mousemove' + '.' + _this._name, function(e) {
        if (_this._debug) console.log('>>> mousemove');

        if (_this.active.type === 'mouse') return;

        //comment:mousemoveend:if (typeof _movewait != 'undefined') {
        //comment:mousemoveend:  clearTimeout(_movewait);
        //comment:mousemoveend:}

        //comment:mousemoveend:_movewait = setTimeout(function() {
        //comment:mousemoveend:if (_this._debug) console.log('>>> movewait');

        if (_this._debug) console.log('_touchstart', _touchstart);

        // prevent false positive on mousemove with touch devices
        if (_touchstart) {
          _touchstart = false;
          return;
        }

        // prevent false positive on mousemove when navigate with keyboard
        if (_this.scroll & _this.active.type === 'keyboard') {
          _this.scroll = false;
          return;
        }

        _this.set.call(_this, 'mouse', e);
        _this.handleInteractionTypeChange(e);

        //comment:mousemoveend:}, _this.settings.interval);
      });

      _this.document.on('touchstart' + '.' + _this._name, function(e) {
        if (_this._debug) console.log('>>> touchstart');
        _touchstart = true;

        if (_this.active.type === 'touch') return;

        _this.set('touch', e);
        _this.handleInteractionTypeChange(e);

      });

      // keyboard
      _this.document.on('keydown' + '.' + _this._name, function(e) {
        _this.check.call(_this, e);
      });

    },

    // Unbind events that trigger methods
    unbindEvents: function() {
      var _this = this;

      _this.document.off('mousemove' + '.' + _this._name);
      _this.document.off('touchstart' + '.' + _this._name);
    },

    check: function(event) {
      var _this = this;
      if (_this._debug) console.log('##################### check()', event);

      if (_this._debug) console.log('event.type:', event.type);

      console.log('key:', _this._key(event), _this.keys[_this._key(event)]);
      console.log('accessible key:', _this.keys.hasOwnProperty(_this._key(event)));

      if (

        // if the key is a accessible key
        _this.keys.hasOwnProperty(_this._key(event))

      ) {

        if (

        // if the key is `TAB`
        _this.keys[_this._key(event)] !== 'tab' &&

        // only if the target is one of the elements in `inputs` list
        _this.inputs.indexOf(_this._target(event).nodeName.toLowerCase()) >= 0

        ) {
          // ignore navigation keys typing on form elements
          console.log('| ignore navigation keys typing on form element');
          return;
        } else /*if (

          // if the key is `HOME`
          _this.keys[_this._key(event)] === 'home' ||

            // if the key is `END`
          _this.keys[_this._key(event)] === 'end' ||

            // if the key is `UP ARROW`
          _this.keys[_this._key(event)] === 'up arrow' ||

            // if the key is `DOWN ARROW`
          _this.keys[_this._key(event)] === 'down arrow' ||

            // if the key is `PAGE UP`
          _this.keys[_this._key(event)] === 'page up' ||

            // if the key is `PAGE DOWN`
          _this.keys[_this._key(event)] === 'page down'

        )*/ {
          console.log('| this pressed key causes an event mousemove');
          _this.scroll = true;
        }

        if (_this.active.type === 'keyboard') return;

        _this.set('keyboard', event);
        _this.handleInteractionTypeChange(event);
      }

    },

    set: function(type, event) {
      var _this = this;
      if (_this._debug) console.log('##################### set()', type);
      console.log(this);

      if (type == 'mouse') {
        _this.keyboard = false;
        _this.touch = false;
        _this.mouse = true;
        _this._array.remove(_this.types, 'keyboard');
        _this._array.remove(_this.types, 'touch');
        _this._array.add(_this.types, 'mouse');
      } else if (type == 'touch') {
        _this.keyboard = false;
        _this.touch = true;
        _this.mouse = false;
        _this._array.remove(_this.types, 'keyboard');
        _this._array.remove(_this.types, 'mouse');
        _this._array.add(_this.types, 'touch');
      } else if (type == 'keyboard') {
        if (_this.active.type === 'keyboard') return;
        _this.mouse = false;
        _this.touch = false;
        _this.keyboard = true;
        _this._array.remove(_this.types, 'mouse');
        _this._array.remove(_this.types, 'touch');
        _this._array.add(_this.types, 'keyboard');
      }

      _this.active.type = type;

      if (_this._debug) console.log('types:', _this.types);
      if (_this._debug) console.log('inputs:', _this.active.input);
      if (_this._debug) console.log('keys:', _this.active.key);
      _this.$html.attr('data-interaction', _this.active.type);

      if (_this.settings.class) {
        $('html').removeClass('mouse touch keyboard');
        $('html').addClass(_this.active.type);
      }
    },

    _key: function(event) {
      return (event.keyCode) ? event.keyCode : event.which;
    },

    _target: function(event) {
      return event.target || event.srcElement;
    },

    /*pointer: function(event) {
      return (typeof event.pointerType === 'number') ? pointerTypes[event.pointerType] : event.pointerType;
    },*/

    // keyboard logging
    _log: {
      keys: function(eventKey) {
        if (this.active.keys.indexOf(this.keys[eventKey]) === -1 && this.keys[eventKey]) this.active.keys.push(this.keys[eventKey]);
      },
    },

    _unlog: {
      keys: function(event) {
        var eventKey = key(event);
        var arrayPos = this.active.keys.indexOf(this.keys[eventKey]);

        if (arrayPos !== -1) this.active.keys.splice(arrayPos, 1);
      },
    },

    start: function() {
      this.handleInteractionTypeChange(true);
    },

    handleInteractionTypeChange: function(e) {
      var _this = this;
      var _text = typeof (e) == 'boolean' && e ? 'is setted' : 'has changed';
      if (_this._debug) console.log('---------------------------------------------------');
      if (_this._debug) console.log('Interaction type ' + _text + ': ' + _this.types.toString());
      if (_this._debug) console.log('---------------------------------------------------');
      _this.switch();
    },

    store: function(context, selector, event, handler) {
      var _this = this;
      if (_this._debug) console.log('##################### store()');

      if (_this._debug) console.log('- context', context);
      if (_this._debug) console.log('- selector', selector);
      if (_this._debug) console.log('- event', event);
      if (_this._debug) console.log('- handler', handler);

      _this._array.add(_this.handlersData[context], {
          selector: selector,
          event: event,
          handler: handler,
        });
      /*_this.handlersData[context].push({
        selector: selector,
        event: event,
        handler: handler,
      });*/

      if (_this._debug) console.log('handlersData', _this.handlersData);

      // Wait last call to start plugin:
      // Clear prev counter, if exist.
      if (_this.interval != null) {
        clearInterval(this.interval);
      }

      // init timer
      _this.timer = 0;
      _this.interval = setInterval(function() {
        if (_this.timer == 1) {
          _this.start.call(_this);
          clearInterval(_this.interval);
          _this.interval = null;
        }

        _this.timer++;
      }.bind(_this), 100);

      // Important to .bind(this) so that context will remain consistent.

    },

    lose: function(context, selector, event) {
      var _this = this;
      if (_this._debug) console.log('##################### lose()');

      if (_this._debug) console.log('- context', context);
      if (_this._debug) console.log('- selector', selector.selector);
      if (_this._debug) console.log('- event', event);
      for (var i = 0; i < _this.handlersData[context].length; i++) {
        if (_this.handlersData[context][i].selector.selector === selector.selector && _this.handlersData[context][i].event === event) {
          _this.handlersData[context][i].selector.off(_this.handlersData[context][i].event, _this.handlersData[context][i].handler);
          _this._array.remove(_this.handlersData[context], _this.handlersData[context][i]);
          i--;
        }
      }

    },

    switch: function() {
      var _this = this;
      if (_this._debug) console.log('##################### switch()');
      var _oType = {
        on: _this.types.indexOf('mouse') > -1 ? 'mouse' : 'touch',
        off: _this.types.indexOf('mouse') > -1 ? 'touch' : 'mouse',
      };
      if (_this._debug) console.log(_this.types);
      _this.on(_oType.on);
      _this.off(_oType.off);
    },

    on: function(type) {
      var _this = this;
      if (_this._debug) console.log('##################### on()');
      for (var i = 0; i < _this.handlersData[type].length; i++) {
        var _handlerData = {
          selector: _this.handlersData[type][i]['selector'],
          event: _this.handlersData[type][i]['event'],
          handler: _this.handlersData[type][i]['handler'],
        }
        _handlerData.selector.on(_handlerData.event, _handlerData.handler);
      }
    },

    off: function(type) {
      var _this = this;
      if (_this._debug) console.log('##################### off()');
      for (var i = 0; i < _this.handlersData[type].length; i++) {
        var _handlerData = {
          selector: _this.handlersData[type][i]['selector'],
          event: _this.handlersData[type][i]['event'],
          handler: _this.handlersData[type][i]['handler'],
        };
        _handlerData.selector.off(_handlerData.event, _handlerData.handler);
      }
    },

    _array: {

      add: function(array, item) {
        if (this._debug) console.log('##################### array.add()');
        array.push(item);
      },

      remove: function(array, item) {
        if (this._debug) console.log('##################### array.remove()');
        var index = array.indexOf(item);
        if (index > -1) array.splice(index, 1);
      },

    },

    /*_object: {

      add: function(obj, key, item) {
        if (this._debug) console.log('##################### object.add()');
        if (this.collection[key] != undefined)
          return undefined;
        this.collection[key] = item;
        return ++this.count;
      },

      remove: function(obj, key) {
        if (this._debug) console.log('##################### object.remove()');
        if (this.collection[key] == undefined)
          return undefined;
        delete this.collection[key];
        return --this.count;
      },

      iterate: function(obj) {
        for (var property in obj) {
          if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] == 'object') {
              this._object.iterate(obj[property]);
            } else {
              console.log(property + '   ' + obj[property]);
            }
          }
        }
      },

      get: function(obj, prop) {
        if (this._debug) log('##################### object.get()');
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            return obj[prop];
          }
        }
      },

    },*/

    refresh: function() {
      var _this = this;
      if (this._debug) console.log('##################### refresh()');

    },

    /**
     * @return {string} current input type
     */
    getType: function() {
      console.log(this);
      return this.active.type;
    },

    /**
     * @return {array} currently pressed keys
     */
    getKey: function() {
      return this.active.input;
    },

    /**
     * @return {array} all the detected input types
     */
    getTypes: function() {
      return this.types;
    },

  });

  /*window[ pluginName ] = function(options) {
    var args = arguments;

    if (options === undefined || typeof options === 'object') {
      if (!$.data(window, pluginName)) {
        $.data(window, pluginName, new Plugin(options));
      }

    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      var returns;

      this.each(function() {
        var instance = $.data(this, pluginName);

        if (instance instanceof Plugin && typeof instance[options] === 'function') {

          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }

        if (options === 'destroy') {
          $.data(this, pluginName, null);
        }
      });

      return returns !== undefined ? returns : this;
    }
  };*/

  window[ pluginName ] = function(options) {
    if (!$.data(window, pluginName)) {
      $.data(window, pluginName, new Plugin(options));
    }
  };

  window[ pluginName ].defaults = {

    // desktop, tablet, mobile
    device: '',

    //interval: 200,

    // adds class in addition to the data-attribute
    // to override Modernizr's classes (Modernizr has a useless 'touch' class positive for touch screens)
    class: false,
    debug: false,
  };

})(jQuery, window, document);

/*
 *  threshold - v0.4
 *  manages window width changes
 *  https://github.com/idomusha/threshold
 *
 *  Made by idomusha
 *  Under MIT License
 */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

/*
 *  threshold - v0.3.2
 *  manages page width change
 *  https://github.com/idomusha/threshold
 *
 *  Made by idomusha
 *  Under MIT License
 */

;

(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'threshold';

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

      if (_this.settings.class) {
        var classes = _this.$html.attr('class').split(' ').filter(function(c) {
          return c.lastIndexOf(_this.settings.name, 0) !== 0;
        });
        _this.$html.attr('class', $.trim(classes.join(' ')));
      } else {
        _this.$html.removeAttr('data-' + _this.settings.name);
      }

      if (reset) {
        _this.set();
      }
    },

    set: function() {
      if (this._debug) console.log('########### set()');
      var _this = this;

      //_this.width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

      // This will prevent JavaScript from calculating pixels for the child element.
      /*$('.width-full').hide();
       _this.width = $('.width-fixed').eq(0).css('width');
       $('.width-full').attr('style', function(i, style) {
       return style.replace(/display[^;]+;?/g, '');
       });*/

      var obj = _this.settings.ranges;
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (this._debug) console.log(prop + ' = ' + obj[prop]);
          var name = prop;
          var width = obj[prop];
          var mq = 'only screen';
          mq += obj[prop][0] !== -1 ? ' and (min-width: ' + obj[prop][0] + ')' : '';
          mq += obj[prop][1] !== -1 ? ' and (max-width: ' + obj[prop][1] + ')' : '';
          if (matchMedia(mq).matches) {
            console.log('match: ',  _this.state = name);
            _this.state = name;
          }
          /*if (_this.width === width) {
           _this.state = name;
           }*/
        }
      }

      //if (this._debug) console.log('width:', _this.width);
      if (this._debug) console.log('previousState:', _this.previousState);
      if (this._debug) console.log('state:', _this.state);
      if (this._debug) console.log('callbacks:', _this.callbacks);

      if (_this.settings.class) {
        _this.$html.addClass(_this.settings.name + '-' + _this.state);
      } else {
        _this.$html.attr('data-' + _this.settings.name, _this.state);
      }

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
      if (_this.settings.ranges.hasOwnProperty(state) || state === 'all') {
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
    ranges: {
      'x-large': ['1600px', -1],      // '1480px'
      large: ['1440px', '1599px'],    // '1360px'
      medium: ['1280px', '1439px'],   // '1220px'
      small: ['960px', '1279px'],     // '920px'
      'x-small': ['760px', '959px'],  //'740px',
      mobile: [-1,'759px'],           //'100%',
    },
    name: 'window',
    class: false,
    debug: false,
  };

})(jQuery, window, document);

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
      if (_this.devices.indexOf(_this.settings.device) > -1) {
        both({
          device: _this.settings.device,
        });
      } else {
        if (device.tablet()) {
          both({
            device: 'tablet',
          });

          $('meta[name="viewport"]').attr('content', 'width=920');
        } else if (device.mobile()) {
          both({
            device: 'mobile',
          });

          $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1.0');
        } else {
          both();
        }
      }

      _this.buildCache();

      // init media-queries manager plugin
      threshold({
        name: _this.settings.name,
        ranges: _this.settings.ranges,
        class: _this.settings.class,
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

        if (typeof _this.settings.after.both === 'function') {
          _this.settings.after.both.call(_this);
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

        if (typeof _this.settings.after.both === 'function') {
          _this.settings.after.both.call(_this);
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

    // threshold: breakpoints (minimum: 2)
    ranges: {
      'x-large': ['1600px', -1],      // '1480px'
      large: ['1440px', '1599px'],    // '1360px'
      medium: ['1280px', '1439px'],   // '1220px'
      small: ['960px', '1279px'],     // '920px'
      'x-small': ['760px', '959px'],  // '740px',
      mobile: [-1,'759px'],           // '100%',
    },

    // threshold: data attribute name (or class name prefix)
    name: 'width',						        // default: 'window'

    // threshold: data attribute (false) or class (true)
    class: true,						          // default: false

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
      both: null,
    },

    // toggle menu button element (string or jQuery object)
    button: '#toggleNav',

    // device type ('desktop', 'tablet' or 'mobile')
    device: null,

    // debug mode
    debug: false,

  };

})(jQuery, window, document);
