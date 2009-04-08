mb.js
======

The canvas HTML element was invented by Apple. It was created to dynamically create complex images for Widgets. There where a few complains about the element, but despite of that it is included in the HTML 5.0 working draft. All modern browsers are compatible with the canvas-tag, beside of Internet Explorer, but Google created a superb piece of javascript that ported the canvas-tag to IE. I created a little piece of javascript for drawing multiple backgrounds in a canvas element behind an HTML element. 

The syntax
----------
> $mb(['id1','id2','id3'],
> 	['url(background1.png) no-repeat 8px top',
> 	'url(background2.png) no-repeat 8px bottom']);	
	
It should be pretty straight-forward.

Also add the javascript in your html:
> <!--[if IE]>
>	<script type="text/javascript" charset="utf-8" src="changed_excanvas_compressed.js"></script> 
> <![endif]-->
> < script type="text/javascript" charset="utf-8" src="mbmin.js"></script>

(remove the space in "< script")

Examples
---------
You can see a simple example with rounded corners at http://hanspinckaers.com/mb/
W3C weblog multiple backgrounds example with mb.js (css3.info) http://hanspinckaers.com/mb/test2.html

Points of improvements
----------------------
- It's buggy (please report them)
- Maybe convert it into a class
- Speed (always a good one to improve)
- Destination element must have an absolute or relative position declared in his css

Using it
---------
You have to add these lines before you call the $mb funtion:

> <!--[if IE]>
> 	<script type="text/javascript" charset="utf-8" src="changed_excanvas-compressed.js"></script> 
> <![endif]-->
> < script type="text/javascript" charset="utf-8" src="mbmin.js"></script> 

(remove the space "< script")

I modified [Zone naming: Excanvas](
http://code.google.com/p/explorercanvas/) so it is smaller, but it can only be used to draw images.