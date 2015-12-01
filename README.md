# cross

### multi-device navigation menu

Cross is a responsive navigation menu which lets define the thresholds you want, switches hover/click events according to menu state (reduced or extended) and, separately, switches mouse/touch events (because window width and interaction types are two differents things!).

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

You can specify how many ranges you want.  
- **ranges** setting takes as key the width range name (string) and as values the media query begin and end (array). "-1" means no value (for min-width or max-width)  
- **name** setting allows you to change the default data-attribute name by your own (or class prefix name if 'class' is defined as true)  
- **class** setting allows you to use a class instead of data-attribute  

- **short** setting lists the breakpoint(s) name(s) when short menu is activated (string or array)
- **long** setting lists the breakpoint(s) name(s) when long menu is activated (string or array)
- **after** settings allows you to define callbacks (function)
- **button** setting allows you to override default toggle menu button element (string or jQuery object)

- **device** setting allows you to initialize the plugin with a presetted device (string) : read [both](https://github.com/idomusha/both)


	```javascript
	$('[role="navigation"]').cross({

        // threshold: breakpoints (minimum: 2)
        ranges: {
          'x-large': ['1600px', -1],        // '1480px'
          large: ['1440px', '1599px'],      // '1360px'
          medium: ['1280px', '1439px'],     // '1220px'
          small: ['960px', '1279px'],       // '920px'
          'x-small': ['760px', '959px'],    // '740px',
          mobile: [-1,'759px'],             // '100%',
        },
    
        // threshold: data attribute name (or class name prefix)
        name: 'width',                      // default: 'window'
    
        // threshold: data attribute (false) or class (true)
        class: true,						// default: false

		// breakpoint(s) name(s) when short menu is activated (string or array)
		short: [
			'mobile',
		],

		// breakpoint(s) name(s) when long menu is activated (string or array)
		long: [
			'x-large',
			'large',
			'medium',
			'small',
			'x-small',
		],

		// after menu state change (function)
		after: {
			init: function() {
				console.log('cross is ready')
			},
			short: function() {
				console.log('after menu has switched to: reduced')
			},
			long: function() {
				console.log('after menu has switched to: extensive')
			},
			both: function() {
				console.log('after menu has switched (reduced or extensive)')
			},
		}

		// toggle menu button element (string or jQuery object)
		button: '#Burger',

		// device type ['desktop', 'tablet' or 'mobile'] (string)
		device: null,

	});
	```


Default CSS breakpoints are defined in src/less. You can find the CSS in dist/cross.css.
If you change these values (either with LESS or directly in CSS), you have to match the new breakpoints values with 'ranges' option.


You can change the HTML too.
For example, you can have several [role="menubar"]...
Cross targets WAI-ARIA roles: you just have to keep them.

## Accessibility
Cross uses semantic elements and attributes, as well as microdata and WAI-ARIA.

## Dependencies
Cross uses:
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
