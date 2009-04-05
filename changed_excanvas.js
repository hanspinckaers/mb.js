if (!window.CanvasRenderingContext2D) {

(function () {

  // alias some functions to make (compiled) code shorter
  var m = Math;
  var mr = m.round;
  var ms = m.sin;
  var mc = m.cos;

  // this is used for sub pixel precision
  var Z = 10;
  var Z2 = Z / 2;

  var G_vmlCanvasManager_ = {
    init: function (opt_doc) {
      var doc = opt_doc || document;
      if (/MSIE/.test(navigator.userAgent) && !window.opera) {
        var self = this;
        doc.attachEvent("onreadystatechange", function () {
          self.init_(doc);
        });
      }
    },

    init_: function (doc) {
      if (doc.readyState == "complete") {
        // create xmlns
        if (!doc.namespaces["g_vml_"]) {
          doc.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml");
        }

        // setup default css
        var ss = doc.createStyleSheet();
        ss.cssText = "canvas{display:inline-block;overflow:hidden;" +
            // default size is 300x150 in Gecko and Opera
            "text-align:left;width:300px;height:150px}" +
            "g_vml_\\:*{behavior:url(#default#VML)}";

        // find all canvas elements
        var els = doc.getElementsByTagName("canvas");
        for (var i = 0; i < els.length; i++) {
          if (!els[i].getContext) {
            this.initElement(els[i]);
          }
        }
      }
    },

    fixElement_: function (el) {
      // in IE before version 5.5 we would need to add HTML: to the tag name
      // but we do not care about IE before version 6
      var outerHTML = el.outerHTML;

      var newEl = el.ownerDocument.createElement(outerHTML);
      // if the tag is still open IE has created the children as siblings and
      // it has also created a tag with the name "/FOO"
      if (outerHTML.slice(-2) != "/>") {
        var tagName = "/" + el.tagName;
        var ns;
        // remove content
        while ((ns = el.nextSibling) && ns.tagName != tagName) {
          ns.removeNode();
        }
        // remove the incorrect closing tag
        if (ns) {
          ns.removeNode();
        }
      }
      el.parentNode.replaceChild(newEl, el);
      return newEl;
    },

    /**
     * Public initializes a canvas element so that it can be used as canvas
     * element from now on. This is called automatically before the page is
     * loaded but if you are creating elements using createElement you need to
     * make sure this is called on the element.
     * @param {HTMLElement} el The canvas element to initialize.
     * @return {HTMLElement} the element that was created.
     */
    initElement: function (el) {
      el = this.fixElement_(el);
      el.getContext = function () {
        if (this.context_) {
          return this.context_;
        }
        return this.context_ = new CanvasRenderingContext2D_(this);
      };

      // do not use inline function because that will leak memory
      el.attachEvent('onpropertychange', onPropertyChange);
      el.attachEvent('onresize', onResize);

      var attrs = el.attributes;
      if (attrs.width && attrs.width.specified) {
        // TODO: use runtimeStyle and coordsize
        // el.getContext().setWidth_(attrs.width.nodeValue);
        el.style.width = attrs.width.nodeValue + "px";
      } else {
        el.width = el.clientWidth;
      }
      if (attrs.height && attrs.height.specified) {
        // TODO: use runtimeStyle and coordsize
        // el.getContext().setHeight_(attrs.height.nodeValue);
        el.style.height = attrs.height.nodeValue + "px";
      } else {
        el.height = el.clientHeight;
      }
      //el.getContext().setCoordsize_()
      return el;
    }
  };

  function onPropertyChange(e) {
    var el = e.srcElement;

    switch (e.propertyName) {
      case 'width':
        el.style.width = el.attributes.width.nodeValue + "px";
        el.getContext().clearRect();
        break;
      case 'height':
        el.style.height = el.attributes.height.nodeValue + "px";
        el.getContext().clearRect();
        break;
    }
  }

  function onResize(e) {
    var el = e.srcElement;
    if (el.firstChild) {
      el.firstChild.style.width =  el.clientWidth + 'px';
      el.firstChild.style.height = el.clientHeight + 'px';
    }
  }

  G_vmlCanvasManager_.init();

  // precompute "00" to "FF"
  var dec2hex = [];
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      dec2hex[i * 16 + j] = i.toString(16) + j.toString(16);
    }
  }

  function createMatrixIdentity() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  /**
   * This class implements CanvasRenderingContext2D interface as described by
   * the WHATWG.
   * @param {HTMLElement} surfaceElement The element that the 2D context should
   * be associated with
   */
   function CanvasRenderingContext2D_(surfaceElement) {
    this.m_ = createMatrixIdentity();

    this.mStack_ = [];
    this.aStack_ = [];
    this.currentPath_ = [];

    // Canvas context properties
    this.strokeStyle = "#000";
    this.fillStyle = "#000";

    this.lineWidth = 1;
    this.lineJoin = "miter";
    this.lineCap = "butt";
    this.miterLimit = Z * 1;
    this.globalAlpha = 1;
    this.canvas = surfaceElement;

    var el = surfaceElement.ownerDocument.createElement('div');
    el.style.width =  surfaceElement.clientWidth + 'px';
    el.style.height = surfaceElement.clientHeight + 'px';
    el.style.overflow = 'hidden';
    el.style.position = 'absolute';
    surfaceElement.appendChild(el);

    this.element_ = el;
    this.arcScaleX_ = 1;
    this.arcScaleY_ = 1;
  };

  var contextPrototype = CanvasRenderingContext2D_.prototype;

  contextPrototype.drawImage = function (image, var_args) {
    var dx, dy, dw, dh, sx, sy, sw, sh;

    // to find the original width we overide the width and height
    var oldRuntimeWidth = image.runtimeStyle.width;
    var oldRuntimeHeight = image.runtimeStyle.height;
    image.runtimeStyle.width = 'auto';
    image.runtimeStyle.height = 'auto';

    // get the original size
    var w = image.width;
    var h = image.height;

    // and remove overides
    image.runtimeStyle.width = oldRuntimeWidth;
    image.runtimeStyle.height = oldRuntimeHeight;

    if (arguments.length == 3) {
      dx = arguments[1];
      dy = arguments[2];
      sx = sy = 0;
      sw = dw = w;
      sh = dh = h;
    } else if (arguments.length == 5) {
      dx = arguments[1];
      dy = arguments[2];
      dw = arguments[3];
      dh = arguments[4];
      sx = sy = 0;
      sw = w;
      sh = h;
    } else if (arguments.length == 9) {
      sx = arguments[1];
      sy = arguments[2];
      sw = arguments[3];
      sh = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dw = arguments[7];
      dh = arguments[8];
    } else {
      throw "Invalid number of arguments";
    }

    var d = this.getCoords_(dx, dy);

    var w2 = sw / 2;
    var h2 = sh / 2;

    var vmlStr = [];

    var W = 10;
    var H = 10;

    // For some reason that I've now forgotten, using divs didn't work
    vmlStr.push(' <g_vml_:group',
                ' coordsize="', Z * W, ',', Z * H, '"',
                ' coordorigin="0,0"' ,
                ' style="width:', W, ';height:', H, ';position:absolute;');

    // If filters are necessary (rotation exists), create them
    // filters are bog-slow, so only create them if abbsolutely necessary
    // The following check doesn't account for skews (which don't exist
    // in the canvas spec (yet) anyway.

    if (this.m_[0][0] != 1 || this.m_[0][1]) {
      var filter = [];

      // Note the 12/21 reversal
      filter.push("M11='", this.m_[0][0], "',",
                  "M12='", this.m_[1][0], "',",
                  "M21='", this.m_[0][1], "',",
                  "M22='", this.m_[1][1], "',",
                  "Dx='", mr(d.x / Z), "',",
                  "Dy='", mr(d.y / Z), "'");

      // Bounding box calculation (need to minimize displayed area so that
      // filters don't waste time on unused pixels.
      var max = d;
      var c2 = this.getCoords_(dx + dw, dy);
      var c3 = this.getCoords_(dx, dy + dh);
      var c4 = this.getCoords_(dx + dw, dy + dh);

      max.x = Math.max(max.x, c2.x, c3.x, c4.x);
      max.y = Math.max(max.y, c2.y, c3.y, c4.y);

      vmlStr.push("padding:0 ", mr(max.x / Z), "px ", mr(max.y / Z),
                  "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",
                  filter.join(""), ", sizingmethod='clip');")
    } else {
      vmlStr.push("top:", mr(d.y / Z), "px;left:", mr(d.x / Z), "px;")
    }

    vmlStr.push(' ">' ,
                '<g_vml_:image src="', image.src, '"',
                ' style="width:', Z * dw, ';',
                ' height:', Z * dh, ';"',
                ' cropleft="', sx / w, '"',
                ' croptop="', sy / h, '"',
                ' cropright="', (w - sx - sw) / w, '"',
                ' cropbottom="', (h - sy - sh) / h, '"',
                ' />',
                '</g_vml_:group>');

    this.element_.insertAdjacentHTML("BeforeEnd",
                                    vmlStr.join(""));
  };


  /**
   * @private
   */
  contextPrototype.getCoords_ = function(aX, aY) {
      return {
        x: Z * (aX * this.m_[0][0] + aY * this.m_[1][0] + this.m_[2][0]) - Z2,
        y: Z * (aX * this.m_[0][1] + aY * this.m_[1][1] + this.m_[2][1]) - Z2
      }
    };
 
  // set up externs
  G_vmlCanvasManager = G_vmlCanvasManager_;
  CanvasRenderingContext2D = CanvasRenderingContext2D_;

})();

} // if
