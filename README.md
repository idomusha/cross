# cross

### multi-device navigation menu

*cross* is a responsive navigation menu which lets define the thresholds you want, switches hover/click events according to menu state (reduced or extended) **depending on window width** and, separately, switches mouse/touch events **depending on interaction type** (because window width and interaction types are two different things!).

## Demo

[See Cross in action](http://idomusha.github.io/cross/)

## Usage

###1.
##### Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	```

##### Include device detect [OPTIONAL]:

	```html
	<script src="bower_components/devicejs/lib/device.min.js"></script>
	```

###2.
##### Include plugin's code:

	```html
	<script src="dist/cross.min.js"></script>
	```

###3.
##### Call the plugin:

	```javascript
	$('[role="navigation"]').cross();
	```

##### Or override default options [OPTIONAL]:

	```javascript
	$('[role="navigation"]').cross({

        threshold: {
    
          // [threshold] breakpoints (minimum: 2)
          ranges: {
            'x-large': ['1600px', -1],      // '1480px'
            large: ['1440px', '1599px'],    // '1360px'
            medium: ['1280px', '1439px'],   // '1220px'
            small: ['960px', '1279px'],     // '920px'
            'x-small': ['760px', '959px'],  // '740px',
            mobile: [-1, '759px'],          // '100%',
          },
    
          // [threshold] data attribute name (or class name prefix)
          name: 'window',                   // default: 'window'
    
          // [threshold] data attribute (false) or class (true)
          class: true,                      // default: false
        },

		// breakpoint(s) name(s) when short menu is activated (string or array)
		short: [
			'mobile',
		],                                  // default: ['mobile']

		// breakpoint(s) name(s) when long menu is activated (string or array)
		long: [
			'x-large',
			'large',
			'medium',
			'small',
			'x-small',
		],                                  // default: ['x-large', 'large', 'medium', 'small', 'x-small',]

		// after menu state change (function)
		after: {
			init: function() {
				console.log('cross is ready')
			},                              // default: null
			short: function() {
				console.log('after menu has switched to: reduced')
			},                              // default: null
			long: function() {
				console.log('after menu has switched to: extensive')
			},                              // default: null
			all: function() {
				console.log('after menu has switched (reduced or extensive)')
			},                              // default: null
		}

		// toggle menu button element (string or jQuery object)
		button: '#burger',                  // default: '#toggleNav'

        both: {
        
            // [both] touch screen (true) or not (false)
            touch: Modernizr.touch,         // default: false
            
            // [both] data attribute name (or class name prefix)
            name: null,                     // default: 'interaction'
            
            // [both] data attribute (false) or class (true)
            class: true,                    // default: false
        
        },

	});
	```
	
You can specify how many ranges you want (minimum: 2).  

[threshold](https://github.com/idomusha/threshold) settings:
- **ranges** setting takes as key the width range name (string) and as values the media query begin and end (array). "-1" means no value (for min-width or max-width)
- **name** setting allows you to change the default data attribute name by your own (or class prefix name if 'class' is defined as true)
- **class** setting allows you to use a class instead of data attribute

[cross](https://github.com/idomusha/cross) settings:
- **short** setting lists the breakpoint(s) name(s) when short menu is activated (string or array)
- **long** setting lists the breakpoint(s) name(s) when long menu is activated (string or array)
- **after** settings allows you to define callbacks (function)
- **button** setting allows you to override default toggle menu button element (string or jQuery object)

[both](https://github.com/idomusha/both) settings:
- **touch** setting allows you to initialize the plugin with a presetted touch device (string) 
- **name** setting allows you to change the default data attribute name by your own (or class prefix name if **class** is defined as *true*)
- **class** setting allows you to use a class instead of data attribute
    
If you use a device detection solution like [device.js](https://github.com/matthewhudson/device.js) or a touch screen detection like [Modernizr(https://github.com/modernizr/modernizr), you can specify the screen type in **touch** option for not waiting the first tap on touch devices (default: false).
    
Set **name** at *null* or *''* and **class** at *true* to deactivate class prefix (override useless Modernizr 'touch' class which detects touch screens, no interaction type).


Default CSS breakpoints are defined in src/less. You can find the CSS in dist/cross.css.
If you change these values (either with LESS or directly in CSS), you have to match the new breakpoints values with 'ranges' option.


You can change the HTML too.
For example, you can have several [role="menubar"]...
*cross* targets WAI-ARIA roles: you just have to keep them, and  __**more specifically [role="menu"] and [aria-expanded="false"]**__.

## Accessibility
*cross* uses semantic elements and attributes, as well as microdata and WAI-ARIA.

## Dependencies
*cross* uses:
- [devicejs](http://matthewhudson.me/projects/device.js/) [OPTIONAL]
- [both](https://github.com/idomusha/both)
- [threshold](https://github.com/idomusha/threshold)


## You can also grab Both using bower:
```
	bower install cross --save
```

#### Authors

[![idomusha](https://fr.gravatar.com/userimage/43584317/49cfb592a2054e9c39c5dc195e5ea419.png?size=70)](https://github.com/idomusha) |
--- |
[idomusha](https://github.com/idomusha) |

## License

MIT: [http://idomusha.mit-license.org/](http://idomusha.mit-license.org/)
