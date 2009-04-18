function MB(elid, css, positioning, resize){
	if(typeof elid == "string") elid = new Array(elid);

	if(this.mbSupport()){
		for(z=0;z < elid.length; z++){
   	 		if(typeof elid[z] == "string") el = document.getElementById(elid[z]);
   	 		else el = elid[z];
   	 	
			var color = this.getComputedStyle(el, 'backgroundColor');
			el.style.background = css.join(', ');
			el.style.backgroundColor = color;
		}
		return true;
	} 
//	
	for(z=0;z < elid.length; z++){
   	 	var canvas = document.createElement('canvas');
   	 	
   	 	if(typeof elid[z] == "string") el = document.getElementById(elid[z]);
   	 	else el = elid[z];

	   	canvas.id = '_canvas';
				
		var css = css;
		var height = this.getComputedStyle(el, "position");
		var paddingTop = this.getComputedStyle(el, "paddingTop");
		var paddingLeft = this.getComputedStyle(el, "paddingLeft");
		var position = this.getComputedStyle(el, "position");
		var backgroundcolor = this.getComputedStyle(el, "backgroundColor");
   	 	
		var length = el.childNodes.length;
		
		//check if there is already a canvas
		for(y=0; y < length; y++){		
			if(el.childNodes[y].id == '_canvas'){ 
				canvas = el.childNodes[y];
				var canvasAlreadySet = true;
			}
		}
				
		if(positioning == 'relative'){
			canvas.style.position = 'relative';
			canvas.width = el.offsetWidth;
			canvas.height = el.offsetHeight;
			
			canvas.style.top = -height - paddingTop + 'px';
			canvas.style.left = -paddingLeft + 'px';
			canvas.style.marginBottom = -(height + paddingTop) + 'px'; 
			//eigenlijk ook nog -paddingBottom maar wil niet.
			el.style.height = height + 'px';
			
		} else {
			
			if(position == '' && position != 'fixed' || position == 'static') el.style.position = 'relative';	

			canvas.style.position = 'absolute';
			canvas.width = el.offsetWidth;
			canvas.height = el.offsetHeight;
			
			canvas.style.top = '0px';
			canvas.style.left = '0px';
			
		}

		canvas.style.zIndex = '0';

		if(!canvasAlreadySet){
			var div = document.createElement('div');
			div.style.zIndex = '1';
			div.style.position = 'relative';
			
			var length = el.childNodes.length;
			el.appendChild(div);
					
			for(y=0; y < length; y++){		
				div.appendChild(el.firstChild);
			}						
	
			// dynamical initialize canvas
			if (/msie/i.test(navigator.userAgent)){
				el.appendChild(canvas);	
				G_vmlCanvasManager.initElement(canvas);
				
				//retrieve canvas, otherwise it won't work
				for(y=0; y < length; y++){	
					if(el.childNodes[y]){	
						if(el.childNodes[y].id == '_canvas'){ 
							var canvas = el.childNodes[y];
						}
					}
				}
				
			}
		}
			
		var imgs = [];
	
		var urlRegExp = new RegExp(/url\((.*)\)/); 
		
		var mbclass = this;
				
		for(x=0;x < css.length; x++){
			imgs[x] = new Image();
			
			imgs[x].drawme = function(){

			if(this.complete){
				var cssbg = mbclass.css(css[imgs.indexOf(this)]);

				mbclass.draw(el, cssbg, this, canvas);
												
				var prev = imgs.indexOf(this)-1;
				
				if(prev > 0 || prev == 0){						
					imgs[prev].drawme();
				} else {
					mbclass.exportToPNG(canvas, el);
				}
				
			} else {
				
				this.onload = function(){
					
					var cssbg = mbclass.css(css[imgs.indexOf(this)]);

					mbclass.draw(el, cssbg, this, canvas);
	
					var prev = imgs.indexOf(this)-1;
	
					if(prev > 0 || prev == 0){
						imgs[prev].drawme();
					} else {
						mbclass.exportToPNG(canvas, el);
					}
					
				} //end onload function
			
			}//end if

			} //end drawme
			
			imgs[x].src = urlRegExp.exec(css[x])[1];	
					
		} //end for loop
			
		//start loop
		imgs[css.length - 1].drawme();
		
	}
	
	if(resize){
		window.onresize = function(){
			new MB(elid, css, positioning);
		};
	}

}

MB.prototype.draw = function(el, cssbg, img, ctx){
	var ctx = ctx.getContext('2d');
	
	var totalWidth = el.offsetWidth;
	var totalHeight = el.offsetHeight;			

	//switch statement
	switch(cssbg.repeat){
	
	case 'no-repeat':
		
		var x = this.calculateX(cssbg, totalWidth, img);
		var y = this.calculateY(cssbg, totalHeight, img);

		//draw the images
		ctx.drawImage(img,x,y,img.width,img.height);
			
	break;
	
	case 'repeat-y':							
	
		var amount = Math.ceil(totalHeight / img.height)+1;
		
		var x = this.calculateX(cssbg, totalWidth, img);
		var minus = this.calculateMinusY(cssbg, totalHeight, img, amount);
		
		//draw the images
		for (i=0;i<(amount);i++){
			ctx.drawImage(img,x,(i * img.height) - minus,img.width,img.height);	
		}
					
	break;
	
	case 'repeat-x':
	
		var amount = Math.ceil(totalWidth / img.width) + 1;
		
		var minus = this.calculateMinusX(cssbg, totalWidth, img, amount);
		var y = this.calculateY(cssbg, totalHeight, img);

		//draw the images
		for (i=0;i<(amount);i++){
			ctx.drawImage(img,(i * img.width) - minus,y,img.width,img.height);	
		}
		
	break;
		
	default:
		var amountx = Math.ceil(totalWidth / img.width)+1;
		var amounty = Math.ceil(totalHeight / img.height)+1;
		
		var minusx = this.calculateMinusX(cssbg, totalWidth, img, amountx);
		var minusy = this.calculateMinusY(cssbg, totalHeight, img, amounty);

		//draw the images
		for (i=0;i<(amountx);i++){
			for (j=0;j<(amounty);j++){
				ctx.drawImage(img, (i * img.width) - minusx,(j * img.height) - minusy,img.width,img.height);
			}	
		}
	
	} //end of switch
		
}

MB.prototype.css = function(cssline){
	var css = new Object();
	var pixels = [0,0]
  	pixels = new RegExp(/([\d]*)px ([\d]*)/).exec(cssline);
	
	cssline.split(" ").forEach(function(item, index, array){
		switch(item){
			case 'no-repeat':
				css['repeat'] = 'no-repeat';
			break;
			
			case 'repeat-x':
				css['repeat'] = 'repeat-x';
			break;
			
			case 'repeat-y':
				css['repeat'] = 'repeat-y';
			break;

			default:
				if(!(pixels && pixels[2]+'px') && !(pixels && pixels[1]+'px'))
					css[item] = true;
		}
	});	
	
	//DIT IS VOOR DE PIXEL POSITIONING
	if(pixels){
		if(pixels[1] && (css.right || css.left)){
			css.y = pixels[1];
		} else if(pixels[1] && (cssbg.top || cssbg.bottom)){
			css.x = pixels[1];
		} 
	
		if(css.center && cssline.indexOf(' center') < pixels.index){
			css.y = pixels[1];
		} else if(css.center && cssline.indexOf(' center') > pixels.index){
			css.x = pixels[1];
		}
	
		if(pixels[1] && pixels[2]){
			css.x = pixels[1];
			css.y = pixels[2];
		}
	}
					
	css.centerY = (css.center && !css.top && !css.bottom && !css.y) ? true : false;
	css.centerX = (css.center && !css.right && !css.left && !css.x) ? true : false;
	
	return css;
};

MB.prototype.calculateX = function(cssbg, totalWidth, img){
return	(cssbg.left) ? 0 :
		(cssbg.right) ? totalWidth - img.width :
		(cssbg.centerX) ? (totalWidth / 2) - (img.width / 2) : 
		(cssbg.x) ? parseFloat(cssbg.x) : false;
};

MB.prototype.calculateY = function(cssbg, totalHeight, img){
return	(cssbg.top) ? 0 :
		(cssbg.bottom) ? totalHeight - img.height :
		(cssbg.centerY) ? (totalHeight / 2) - (img.height / 2) : 
		(cssbg.y) ? parseFloat(cssbg.y) : false;
};

MB.prototype.calculateMinusY = function(cssbg, totalHeight, img, amount){
return	(cssbg.top) ? 0 : 
		(cssbg.bottom) ? amount * img.height - totalHeight :
		(cssbg.centerY) ? (amount * img.height - totalHeight) / 2 : 
		(cssbg.y) ? img.height - parseFloat(cssbg.y) : false;	
};

MB.prototype.calculateMinusX = function(cssbg, totalWidth, img, amount){
return	(cssbg.left) ? 0 :
		(cssbg.right) ? amount * img.width - totalWidth :
		(cssbg.centerX) ? (amount * img.width - totalWidth) / 2 : 
		(cssbg.x) ? img.width - parseFloat(cssbg.x) : false;
};


MB.prototype.getComputedStyle = function(el, property){
	if (el.currentStyle) return el.currentStyle[property];
	var computed = document.defaultView.getComputedStyle(el, null);
	return (computed) ? computed.getPropertyValue([property.hyphenate()]) : null;
}

MB.prototype.exportToPNG = function(canvas, el){
	try {
		canvas.toDataURL();
		el.style.background = backgroundcolor + ' url(' + sDataUrl  + ')';
	} catch(err) { 
		//canvas could trown a security error
		//ie already appended the canvas
		if (!/msie/i.test(navigator.userAgent))
			el.appendChild(canvas);
	}
};

MB.prototype.mbSupport = function(){
   	var element = document.createElement('div');
	element.style.background = 'url(a.png) top no-repeat, url(a.png) bottom no-repeat';
	if(element.style.background.search(',') != -1) return true;
	else return false;
}

Array.prototype.forEach = function(fn, bind){
	for (var i = 0, l = this.length; i < l; i++) fn.call(bind, this[i], i, this);
};

String.prototype.hyphenate =  function(){
	return this.replace(/[A-Z]/g, function(match){
		return ('-' + match.charAt(0).toLowerCase());
	});
};