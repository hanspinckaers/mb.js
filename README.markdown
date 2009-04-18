mb.js
======

The canvas HTML element was invented by Apple. It was created to dynamically create complex images for Widgets. There where a few complains about the element, but despite of that it is included in the HTML 5.0 working draft. All modern browsers are compatible with the canvas-tag, beside of Internet Explorer, but Google created a superb piece of javascript that ported the canvas-tag to IE. I created a little piece of javascript for drawing multiple backgrounds in a canvas element behind an HTML element. 

The syntax
----------
new MB(id's, css, position, onresize);

> new MB(['id1','id2','id3'],
> 	['url(background1.png) no-repeat 8px top',
> 	'url(background2.png) no-repeat 8px bottom']);	
	
You could use a javascript framework to retrieve elements like this (in mootools):

> new MB($('ul li'),
> 	['url(background1.png) no-repeat 8px top',
> 	'url(background2.png) no-repeat 8px bottom']);	

And it is possible to use document.getElementById, or getElementsByClassName, browsers you can't convert the canvas into a background image have to append the canvas into the element, the canvas is positioned absolute, but sometimes this gives problems, that why you can change the position to an experimental relative positioning by setting the third argument to 'relative'

The fourth argument is also very experimental, this must be used with fluid/liquid elements, when the browser window resizes the backgrounds are rendered again, the problem is that it only works with one MB-object, and it throws an error in Internet Explorer, to use it set it to "true" 

It should be pretty straight-forward.

Also add the javascript in your html:
> <!--[if IE]>
>	<script type="text/javascript" charset="utf-8" src="changed_excanvas_compressed.js"></script> 
> <![endif]-->
> < script type="text/javascript" charset="utf-8" src="mbmin.js"></script>
(remove the space in "< script")

Examples
---------
You can see a simple example with rounded corners at http://hanspinckaers.com/mb/example

Points of improvements
----------------------
- It's buggy (please report bugs)
- Speed

I modified [Excanvas](
http://code.google.com/p/explorercanvas/) so it is smaller, but it can only be used to draw images.