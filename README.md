#cross

## multi-device navigation menu

## Demo

[See Cross in action](http://idomusha.github.io/cross/)

## Usage

1.1 Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	```

1.2 Include device detect [OPTIONAL]:

	```html
	<script src="bower_components/devicejs/lib/device.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="dist/cross.min.js"></script>
	```

3.1 Call the plugin:

	```javascript
	$('[role="navigation"]').cross();
	```

3.2 Or override default options [OPTIONAL]:

	```javascript
	$('[role="navigation"]').cross({

		// breakpoints (minimum: 2)
		widths: {
			'x-large': '1480px',
			'large': '1360px',
			'medium': '1220px',
			'small': '920px',
			'x-small': '740px',
			'mobile': '100%',
		},

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

		// toggle menu button element (string or jQuery object)
		button: '#Burger',

		// device type (string: 'desktop', 'tablet' or 'mobile')
		device: '',

	});
	```

Default CSS breakpoints are defined in src/less. You can find the CSS in dist/cross.css.
If you change these values (either with LESS or directly in CSS), you have to match the new breakpoints values with 'widths' option.

- variable.less:

	```less
	/* ==========================================================================
	 * VARIABLES
	 * ========================================================================== */


	/* page
	 * ========================================================================== */
	@page-width-x-large: 1480px;
	@page-width-large: 1360px;
	@page-width-medium: 1220px;
	@page-width-small: 920px;
	@page-width-x-small: 740px;
	@page-width-mobile: 100%;


	/* steps
	 * ========================================================================== */
	@step-min-x-large: (@page-width-x-large + 2*60);        // 1600 --> 1480 (page) + 2*60 (min auto margin)
	@step-max-large: (@page-width-x-large + 2*60 - 1);
	@step-min-large: (@page-width-large + 2*40);            // 1440 --> 1360 (page) + 2*40 (min auto margin)
	@step-max-medium: (@page-width-large + 2*40 - 1);
	@step-min-medium: (@page-width-medium + 2*30);          // 1280 --> 1220 (page) + 2*30 (min auto margin)
	@step-max-small: (@page-width-medium + 2*30 - 1);
	@step-min-small: (@page-width-small + 2*20);            // 960 --> 920 (page) + 2*20 (min auto margin)
	@step-max-x-small: (@page-width-small + 2*20 - 1);
	@step-min-x-small: (@page-width-x-small);               // 740 (page) + 0 (min auto margin)
	@step-max-mobile: (@page-width-x-small - 1);


	/* screen
	 * ========================================================================== */
	@screen-min-x-large: ~"screen and (min-width:@{step-min-x-large})";   // min 1480
	@screen-min-large: ~"screen and (min-width:@{step-min-large})";       // min 1360
	@screen-min-medium: ~"screen and (min-width:@{step-min-medium})";     // min 1220
	@screen-min-small: ~"screen and (min-width:@{step-min-small})";       // min 940
	@screen-min-x-small: ~"screen and (min-width:@{step-min-x-small})";   // min 740

	@screen-max-large: ~"screen and (max-width:@{step-max-large})";       // max 1479
	@screen-max-medium: ~"screen and (max-width:@{step-max-medium})";     // max 1359
	@screen-max-small: ~"screen and (max-width:@{step-max-small})";       // max 1219
	@screen-max-x-small: ~"screen and (max-width:@{step-max-x-small})";   // max 939
	@screen-max-mobile: ~"screen and (max-width:@{step-max-mobile})";     // max 739

	@screen-x-large: ~"screen and (min-width:@{step-min-x-large})";                                       // min 1480
	@screen-large: ~"screen and (min-width:@{step-min-large}) and (max-width:@{step-max-large})";         // min 1360 & max 1479
	@screen-medium: ~"screen and (min-width:@{step-min-medium}) and (max-width:@{step-max-medium})";      // min 1220 & max 1359
	@screen-small: ~"screen and (min-width:@{step-min-small}) and (max-width:@{step-max-small})";         // min 940 & max 1219
	@screen-x-small: ~"screen and (min-width:@{step-min-x-small}) and (max-width:@{step-max-x-small})";   // min 740 & max 939
	@screen-mobile: ~"screen and (max-width:@{step-max-mobile})";                                         // max 739
	```

- width.less:

	```less
	/**
	 * ==========================================================================
	 * WIDTH
	 * ========================================================================== */


	.width-full {
	  width: 100%;
	  position: relative;
	}

	.width-fixed {
	  width: @page-width-x-large;
	  position: relative;
	  margin: 0 auto;
	}

	@media @screen-max-large {
	  .width-fixed {
		width: @page-width-large;
	  }
	}

	@media @screen-max-medium {
	  .width-fixed {
		width: @page-width-medium;
	  }
	}

	@media @screen-max-small {
	  .width-fixed {
		width: @page-width-small;
	  }
	}

	@media @screen-max-x-small {
	  .width-fixed {
		width: @page-width-x-small;
	  }
	}

	@media @screen-max-mobile {
	  .width-fixed {
		width: @page-width-mobile;
	  }
	}
	```

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
