function $mb(a,c){for(z=0;z<a.length;z++){var d=document.getElementById(a[z]);var b=document.createElement("canvas");b.id=a[z]+"_canvas";b.style.position="absolute";b.height=d.offsetHeight;b.width=d.offsetWidth;b.style.top="0px";b.style.left="0px";b.style.zIndex="0";var h=document.createElement("div");h.style.zIndex="1";h.style.position="relative";var f=d.childNodes.length;d.appendChild(h);for(y=0;y<f;y++){h.appendChild(d.firstChild)}if(/msie/i.test(navigator.userAgent)){d.appendChild(b);G_vmlCanvasManager.initElement(b);b=document.getElementById(a[z]+"_canvas")}else{d.appendChild(b)}var g=[];var e=new RegExp(/url\((.*)\)/);for(x=0;x<c.length;x++){g[x]=new Image();g[x].drawme=function(){if(this.complete){var k=$css(c[g.indexOf(this)]);$draw(d,k,this);var l=g.indexOf(this)-1;if(l>0||l==0){g[l].drawme()}}else{this.onload=function(){var m=$css(c[g.indexOf(this)]);$draw(d,m,this);var n=g.indexOf(this)-1;if(n>0||n==0){g[n].drawme()}}}};g[x].src=e.exec(c[x])[1]}g[c.length-1].drawme()}}function $draw(b,m,e){var n=document.getElementById(b.id+"_canvas").getContext("2d");var g=b.offsetWidth;var h=b.offsetHeight;if(m.repeat=="no"){var l=(m.left)?0:(m.right)?g-e.width:(m.centerX)?(g/2)-(e.width/2):(m.x)?parseFloat(m.x):false;var k=(m.top)?0:(m.bottom)?h-e.height:(m.centerY)?(h/2)-(e.height/2):(m.y)?parseFloat(m.y):false;n.drawImage(e,l,k,e.width,e.height);return true}else{if(m.repeat=="y"){var f=Math.ceil(h/e.height);if(f%2==0){f++}l=(m.left)?0:(m.right)?g-e.width:(m.centerX)?(g/2)-(e.width/2):(m.x)?parseFloat(m.x):false;d=(m.top)?0:(m.bottom)?f*e.height-h:(m.centerY)?(f*e.height-h)/2:(m.y)?e.height-parseFloat(m.y):false;for(i=0;i<(f);i++){n.drawImage(e,l,(i*e.height)-d,e.width,e.height)}return true}else{if(m.repeat=="x"){var f=Math.ceil(g/e.width);amout=f++;var d=(m.left)?0:(m.right)?f*e.width-g:(m.centerX)?(f*e.width-g)/2:(m.x)?e.width-parseFloat(m.x):false;var k=(m.top)?0:(m.bottom)?h-e.height:(m.centerY)?(h/2)-(e.height/2):(m.y)?parseFloat(m.y):false;for(i=0;i<(f);i++){n.drawImage(e,(i*e.width)-d,k,e.width,e.height)}return true}else{if(m.repeat="repeat"){var c=Math.ceil(g/e.width);amoutx=c++;var a=Math.ceil(h/e.height);amouty=a++;minusx=(m.left)?0:(m.right)?c*e.width-g:(m.centerX)?(c*e.width-g)/2:(m.x)?e.width-parseFloat(m.x):false;minusy=(m.top)?0:(m.bottom)?f*e.height-h:(m.centerY)?(f*e.height-h)/2:(m.y)?e.height-parseFloat(m.y):false;for(i=0;i<(c);i++){for(j=0;j<(a);j++){n.drawImage(e,(i*e.width)-minusx,(j*e.height)-minusy,e.width,e.height)}}return true}}}}}function $css(a){var c=new RegExp(/url\((.*)\)/);var d=new RegExp(/([\d]*)px ([\d]*)/);var b={};b.top=(a.indexOf(" top")!=-1)?true:false;b.bottom=(a.indexOf(" bottom")!=-1)?true:false;b.right=(a.indexOf(" right")!=-1)?true:false;b.left=(a.indexOf(" left")!=-1)?true:false;var e=d.exec(a);if(e){if(e[1]&&(b.right||b.left)){b.y=e[1]}else{if(e[1]&&(b.top||b.bottom)){b.x=e[1]}}if(a.indexOf(" center")!=-1&&a.indexOf(" center")<e.index){b.y=e[1]}else{if(a.indexOf(" center")!=-1&&a.indexOf(" center")>e.index){b.x=e[1]}}if(e[1]!=""&&e[2]!=""){b.x=e[1];b.y=e[2]}}b.centerY=(a.indexOf(" center")!=-1&&!b.top&&!b.bottom&&!b.y)?true:false;b.centerX=(a.indexOf(" center")!=-1&&!b.right&&!b.left&&!b.x)?true:false;b.repeat=(a.indexOf(" no-repeat")!=-1)?"no":(a.indexOf(" repeat-y")!=-1)?"y":(a.indexOf(" repeat-x")!=-1)?"x":"repeat";b.url=c.exec(a)[1];return b};