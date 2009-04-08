function $mb(elid, css){
	
	for(z=0;z < elid.length; z++){
	
	var el = document.getElementById(elid[z]);
	var canvas = document.createElement('canvas');
		
	canvas.id = elid[z] + '_canvas';
	canvas.style.position = 'absolute';
	canvas.height = el.offsetHeight;	
	canvas.width = el.offsetWidth;
	canvas.style.top = '0px';
	canvas.style.left = '0px';
	canvas.style.zIndex = '0';
			
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
	    canvas = document.getElementById(elid[z] + '_canvas');			
	} else {
		el.appendChild(canvas);			
	}

	var imgs = [];

	var regex = new RegExp(/url\((.*)\)/); 
	
	for(x=0;x < css.length; x++){
		imgs[x] = new Image();
		
		imgs[x].drawme = function(){
			
			if(this.complete){
				
				var cssbg = $css(css[imgs.indexOf(this)]);
						
				$draw(el, cssbg, this);
											
				var prev = imgs.indexOf(this)-1;
			
				if(prev > 0 || prev == 0){						
					imgs[prev].drawme();
				}
			
			} else {
				
				this.onload = function(){
					
					var cssbg = $css(css[imgs.indexOf(this)]);

					$draw(el, cssbg, this);

					var prev = imgs.indexOf(this)-1;

					if(prev > 0 || prev == 0){
						imgs[prev].drawme();
					}
					
				} //end onload function
				
			}//end if
		}; //end function
		
		imgs[x].src = regex.exec(css[x])[1]; //test	
				
	} //end for loop
		
	//start loop
	imgs[css.length - 1].drawme();
	
	}
	
}


function $draw(el, cssbg, img){	
		var ctx = document.getElementById(el.id + '_canvas').getContext('2d');
		
		var totalWidth = el.offsetWidth;
		var totalHeight = el.offsetHeight;			
	
		if(cssbg.repeat == 'no'){

				var x = (cssbg.left) ? 0 :
					(cssbg.right) ? totalWidth - img.width :
					(cssbg.centerX) ? (totalWidth / 2) - (img.width / 2) : 
					(cssbg.x) ? parseFloat(cssbg.x) : false;

				var y = (cssbg.top) ? 0 :
					(cssbg.bottom) ? totalHeight - img.height :
					(cssbg.centerY) ? (totalHeight / 2) - (img.height / 2) : 
					(cssbg.y) ? parseFloat(cssbg.y) : false;

					ctx.drawImage(img,x,y,img.width,img.height);			
			
			return true;
						
		} else if(cssbg.repeat == 'y'){//end of norepeat
		
				var amount = Math.ceil(totalHeight / img.height);
				if (amount%2 == 0) amount++;
		
				x = (cssbg.left) ? 0 :
					(cssbg.right) ? totalWidth - img.width :
					(cssbg.centerX) ? (totalWidth / 2) - (img.width / 2) : 
					(cssbg.x) ? parseFloat(cssbg.x) : false;
			
				minus = (cssbg.top) ? 0 : 
						(cssbg.bottom) ? amount * img.height - totalHeight :
						(cssbg.centerY) ? (amount * img.height - totalHeight) / 2 : 
						(cssbg.y) ? img.height - parseFloat(cssbg.y) : false;
			
				for (i=0;i<(amount);i++){
						ctx.drawImage(img,x,(i * img.height) - minus,img.width,img.height);	
				}
				
			return true;
		} else if(cssbg.repeat == 'x'){
			
				var amount = Math.ceil(totalWidth / img.width);
				amout = amount++;
				
				var minus = (cssbg.left) ? 0 :
							(cssbg.right) ? amount * img.width - totalWidth :
							(cssbg.centerX) ? (amount * img.width - totalWidth) / 2 : 
							(cssbg.x) ? img.width - parseFloat(cssbg.x) : false;
				
				var y = (cssbg.top) ? 0 :
						(cssbg.bottom) ? totalHeight - img.height :
						(cssbg.centerY) ? (totalHeight / 2) - (img.height / 2) : 
						(cssbg.y) ? parseFloat(cssbg.y) : false;

				for (i=0;i<(amount);i++){
						ctx.drawImage(img,(i * img.width) - minus,y,img.width,img.height);	
				}
			
			return true;
		} else if(cssbg.repeat = 'repeat'){

				var amountx = Math.ceil(totalWidth / img.width);
				amoutx = amountx++;
				
				var amounty = Math.ceil(totalHeight / img.height);
				amouty = amounty++;
				
				minusx = (cssbg.left) ? 0 :
						 (cssbg.right) ? amountx * img.width - totalWidth :
						 (cssbg.centerX) ? (amountx * img.width - totalWidth) / 2 :
						 (cssbg.x) ? img.width - parseFloat(cssbg.x) : false;

				minusy = (cssbg.top) ? 0 : 
						(cssbg.bottom) ? amount * img.height - totalHeight :
						(cssbg.centerY) ? (amount * img.height - totalHeight) / 2 : 
						(cssbg.y) ? img.height - parseFloat(cssbg.y) : false;

				for (i=0;i<(amountx);i++){
					for (j=0;j<(amounty);j++){
						ctx.drawImage(img, (i * img.width) - minusx,(j * img.height) - minusy,img.width,img.height);
					}	
				}

			return true;
		}
		
}

function $css(cssline){
	var regex = new RegExp(/url\((.*)\)/); 
  	var regexpx = new RegExp(/([\d]*)px ([\d]*)/);
	
	var cssbg = {};
	cssbg.top = (cssline.indexOf(' top') != -1) ? true : false;
	cssbg.bottom = (cssline.indexOf(' bottom') != -1) ? true : false;
	cssbg.right = (cssline.indexOf(' right') != -1) ? true : false;
	cssbg.left = (cssline.indexOf(' left') != -1) ? true : false;
	
	//DIT IS VOOR DE PIXEL POSITIONING
	var pixels = regexpx.exec(cssline);

	if(pixels){
		
		if(pixels[1] && (cssbg.right || cssbg.left)){
			cssbg.y = pixels[1];
		} else if(pixels[1] && (cssbg.top || cssbg.bottom)){
			cssbg.x = pixels[1];
		} 
	
		if(cssline.indexOf(' center') != -1 && cssline.indexOf(' center') < pixels.index){
			cssbg.y = pixels[1];
		} else if(cssline.indexOf(' center') != -1 && cssline.indexOf(' center') > pixels.index){
			cssbg.x = pixels[1];
		}
	
		if(pixels[1] != "" && pixels[2] != ""){
			cssbg.x = pixels[1];
			cssbg.y = pixels[2];
		}
	
	}
					
	cssbg.centerY =  (cssline.indexOf(' center') != -1 && !cssbg.top && !cssbg.bottom && !cssbg.y) ? true : false;
	cssbg.centerX = (cssline.indexOf(' center') != -1 && !cssbg.right && !cssbg.left && !cssbg.x) ? true : false;
	
	cssbg.repeat = 
				(cssline.indexOf(' no-repeat') != -1) ? 'no' :
				(cssline.indexOf(' repeat-y') != -1) ? 'y' :
				(cssline.indexOf(' repeat-x') != -1) ? 'x' : 'repeat';
	
	cssbg.url = regex.exec(cssline)[1]; //test

	return cssbg;
	
}
