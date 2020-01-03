(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Clappr = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  // Copyright 2014 Globo.com Player authors. All rights reserved.
  // Use of this source code is governed by a BSD-style
  // license that can be found in the LICENSE file.

  /**
   * Array.prototype.find
   *
   * Original source : https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/find
   * See also : https://tc39.github.io/ecma262/#sec-array.prototype.find
   */
  if (!Array.prototype.find) {
    // eslint-disable-next-line
    Object.defineProperty(Array.prototype, 'find', {
      // Note: ES6 arrow function syntax is not used on purpose to avoid this to be undefined
      value: function value(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) throw new TypeError('"this" is null or not defined');
        var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

        var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

        if (typeof predicate !== 'function') throw new TypeError('predicate must be a function'); // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.

        var thisArg = arguments[1]; // 5. Let k be 0.

        var k = 0; // 6. Repeat, while k < len

        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) return kValue; // e. Increase k by 1.

          k++;
        } // 7. Return undefined.


        return undefined;
      }
    });
  }

  // https://github.com/mathiasbynens/small
  var mp4 = 'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAC721kYXQhEAUgpBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBSCkG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAsJtb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAALwABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAB7HRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAIAAAAAAAAALwAAAAAAAAAAAAAAAQEAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAC8AAAAAAAEAAAAAAWRtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAAKxEAAAIAFXEAAAAAAAtaGRscgAAAAAAAAAAc291bgAAAAAAAAAAAAAAAFNvdW5kSGFuZGxlcgAAAAEPbWluZgAAABBzbWhkAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAADTc3RibAAAAGdzdHNkAAAAAAAAAAEAAABXbXA0YQAAAAAAAAABAAAAAAAAAAAAAgAQAAAAAKxEAAAAAAAzZXNkcwAAAAADgICAIgACAASAgIAUQBUAAAAAAfQAAAHz+QWAgIACEhAGgICAAQIAAAAYc3R0cwAAAAAAAAABAAAAAgAABAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAIAAAABAAAAHHN0c3oAAAAAAAAAAAAAAAIAAAFzAAABdAAAABRzdGNvAAAAAAAAAAEAAAAsAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1Ni40MC4xMDE=';
  var Media = {
    mp4: mp4
  };

  /* Zepto v1.2.0 - zepto ajax callbacks deferred event ie selector - zeptojs.com/license */
  var Zepto = function () {
    var undefined$1,
        key,
        $,
        classList,
        emptyArray = [],
        concat = emptyArray.concat,
        filter = emptyArray.filter,
        slice = emptyArray.slice,
        document = window.document,
        elementDisplay = {},
        classCache = {},
        cssNumber = {
      'column-count': 1,
      'columns': 1,
      'font-weight': 1,
      'line-height': 1,
      'opacity': 1,
      'z-index': 1,
      'zoom': 1
    },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,
        capitalRE = /([A-Z])/g,
        // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
        adjacencyOperators = ['after', 'prepend', 'before', 'append'],
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
      'tr': document.createElement('tbody'),
      'tbody': table,
      'thead': table,
      'tfoot': table,
      'td': tableRow,
      'th': tableRow,
      '*': document.createElement('div')
    },
        readyRE = /complete|loaded|interactive/,
        simpleSelectorRE = /^[\w-]*$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize,
        uniq,
        tempParent = document.createElement('div'),
        propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
        isArray = Array.isArray || function (object) {
      return object instanceof Array;
    };

    zepto.matches = function (element, selector) {
      if (!selector || !element || element.nodeType !== 1) return false;
      var matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
      if (matchesSelector) return matchesSelector.call(element, selector); // fall back to performing a selector:

      var match,
          parent = element.parentNode,
          temp = !parent;
      if (temp) (parent = tempParent).appendChild(element);
      match = ~zepto.qsa(parent, selector).indexOf(element);
      temp && tempParent.removeChild(element);
      return match;
    };

    function type(obj) {
      return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
    }

    function isFunction(value) {
      return type(value) == "function";
    }

    function isWindow(obj) {
      return obj != null && obj == obj.window;
    }

    function isDocument(obj) {
      return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }

    function isObject(obj) {
      return type(obj) == "object";
    }

    function isPlainObject(obj) {
      return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }

    function likeArray(obj) {
      var length = !!obj && 'length' in obj && obj.length,
          type = $.type(obj);
      return 'function' != type && !isWindow(obj) && ('array' == type || length === 0 || typeof length == 'number' && length > 0 && length - 1 in obj);
    }

    function compact(array) {
      return filter.call(array, function (item) {
        return item != null;
      });
    }

    function flatten(array) {
      return array.length > 0 ? $.fn.concat.apply([], array) : array;
    }

    camelize = function (str) {
      return str.replace(/-+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    };

    function dasherize(str) {
      return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
    }

    uniq = function (array) {
      return filter.call(array, function (item, idx) {
        return array.indexOf(item) == idx;
      });
    };

    function classRE(name) {
      return name in classCache ? classCache[name] : classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
    }

    function maybeAddPx(name, value) {
      return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
    }

    function defaultDisplay(nodeName) {
      var element, display;

      if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName);
        document.body.appendChild(element);
        display = getComputedStyle(element, '').getPropertyValue("display");
        element.parentNode.removeChild(element);
        display == "none" && (display = "block");
        elementDisplay[nodeName] = display;
      }

      return elementDisplay[nodeName];
    }

    function children(element) {
      return 'children' in element ? slice.call(element.children) : $.map(element.childNodes, function (node) {
        if (node.nodeType == 1) return node;
      });
    }

    function Z(dom, selector) {
      var i,
          len = dom ? dom.length : 0;

      for (i = 0; i < len; i++) this[i] = dom[i];

      this.length = len;
      this.selector = selector || '';
    } // `$.zepto.fragment` takes a html string and an optional tag name
    // to generate DOM nodes from the given html string.
    // The generated DOM nodes are returned as an array.
    // This function can be overridden in plugins for example to make
    // it compatible with browsers that don't support the DOM fully.


    zepto.fragment = function (html, name, properties) {
      var dom, nodes, container; // A special case optimization for a single tag

      if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));

      if (!dom) {
        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
        if (name === undefined$1) name = fragmentRE.test(html) && RegExp.$1;
        if (!(name in containers)) name = '*';
        container = containers[name];
        container.innerHTML = '' + html;
        dom = $.each(slice.call(container.childNodes), function () {
          container.removeChild(this);
        });
      }

      if (isPlainObject(properties)) {
        nodes = $(dom);
        $.each(properties, function (key, value) {
          if (methodAttributes.indexOf(key) > -1) nodes[key](value);else nodes.attr(key, value);
        });
      }

      return dom;
    }; // `$.zepto.Z` swaps out the prototype of the given `dom` array
    // of nodes with `$.fn` and thus supplying all the Zepto functions
    // to the array. This method can be overridden in plugins.


    zepto.Z = function (dom, selector) {
      return new Z(dom, selector);
    }; // `$.zepto.isZ` should return `true` if the given object is a Zepto
    // collection. This method can be overridden in plugins.


    zepto.isZ = function (object) {
      return object instanceof zepto.Z;
    }; // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
    // takes a CSS selector and an optional context (and handles various
    // special cases).
    // This method can be overridden in plugins.


    zepto.init = function (selector, context) {
      var dom; // If nothing given, return an empty Zepto collection

      if (!selector) return zepto.Z(); // Optimize for string selectors
      else if (typeof selector == 'string') {
          selector = selector.trim(); // If it's a html fragment, create nodes from it
          // Note: In both Chrome 21 and Firefox 15, DOM error 12
          // is thrown if the fragment doesn't begin with <

          if (selector[0] == '<' && fragmentRE.test(selector)) dom = zepto.fragment(selector, RegExp.$1, context), selector = null; // If there's a context, create a collection on that context first, and select
          // nodes from there
          else if (context !== undefined$1) return $(context).find(selector); // If it's a CSS selector, use it to select nodes.
            else dom = zepto.qsa(document, selector);
        } // If a function is given, call it when the DOM is ready
        else if (isFunction(selector)) return $(document).ready(selector); // If a Zepto collection is given, just return it
          else if (zepto.isZ(selector)) return selector;else {
              // normalize array if an array of nodes is given
              if (isArray(selector)) dom = compact(selector); // Wrap DOM nodes.
              else if (isObject(selector)) dom = [selector], selector = null; // If it's a html fragment, create nodes from it
                else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null; // If there's a context, create a collection on that context first, and select
                  // nodes from there
                  else if (context !== undefined$1) return $(context).find(selector); // And last but no least, if it's a CSS selector, use it to select nodes.
                    else dom = zepto.qsa(document, selector);
            } // create a new Zepto collection from the nodes found

      return zepto.Z(dom, selector);
    }; // `$` will be the base `Zepto` object. When calling this
    // function just call `$.zepto.init, which makes the implementation
    // details of selecting nodes and creating Zepto collections
    // patchable in plugins.


    $ = function (selector, context) {
      return zepto.init(selector, context);
    };

    function extend(target, source, deep) {
      for (key in source) if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
        if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
        extend(target[key], source[key], deep);
      } else if (source[key] !== undefined$1) target[key] = source[key];
    } // Copy all but undefined properties from one or more
    // objects to the `target` object.


    $.extend = function (target) {
      var deep,
          args = slice.call(arguments, 1);

      if (typeof target == 'boolean') {
        deep = target;
        target = args.shift();
      }

      args.forEach(function (arg) {
        extend(target, arg, deep);
      });
      return target;
    }; // `$.zepto.qsa` is Zepto's CSS selector implementation which
    // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
    // This method can be overridden in plugins.


    zepto.qsa = function (element, selector) {
      var found,
          maybeID = selector[0] == '#',
          maybeClass = !maybeID && selector[0] == '.',
          nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
          // Ensure that a 1 char tag name still gets checked
      isSimple = simpleSelectorRE.test(nameOnly);
      return element.getElementById && isSimple && maybeID ? // Safari DocumentFragment doesn't have getElementById
      (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11 ? [] : slice.call(isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
      maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
      element.getElementsByTagName(selector) : // Or a tag
      element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      );
    };

    function filtered(nodes, selector) {
      return selector == null ? $(nodes) : $(nodes).filter(selector);
    }

    $.contains = document.documentElement.contains ? function (parent, node) {
      return parent !== node && parent.contains(node);
    } : function (parent, node) {
      while (node && (node = node.parentNode)) if (node === parent) return true;

      return false;
    };

    function funcArg(context, arg, idx, payload) {
      return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }

    function setAttribute(node, name, value) {
      value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
    } // access className property while respecting SVGAnimatedString


    function className(node, value) {
      var klass = node.className || '',
          svg = klass && klass.baseVal !== undefined$1;
      if (value === undefined$1) return svg ? klass.baseVal : klass;
      svg ? klass.baseVal = value : node.className = value;
    } // "true"  => true
    // "false" => false
    // "null"  => null
    // "42"    => 42
    // "42.5"  => 42.5
    // "08"    => "08"
    // JSON    => parse if valid
    // String  => self


    function deserializeValue(value) {
      try {
        return value ? value == "true" || (value == "false" ? false : value == "null" ? null : +value + "" == value ? +value : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
      } catch (e) {
        return value;
      }
    }

    $.type = type;
    $.isFunction = isFunction;
    $.isWindow = isWindow;
    $.isArray = isArray;
    $.isPlainObject = isPlainObject;

    $.isEmptyObject = function (obj) {
      var name;

      for (name in obj) return false;

      return true;
    };

    $.isNumeric = function (val) {
      var num = Number(val),
          type = typeof val;
      return val != null && type != 'boolean' && (type != 'string' || val.length) && !isNaN(num) && isFinite(num) || false;
    };

    $.inArray = function (elem, array, i) {
      return emptyArray.indexOf.call(array, elem, i);
    };

    $.camelCase = camelize;

    $.trim = function (str) {
      return str == null ? "" : String.prototype.trim.call(str);
    }; // plugin compatibility


    $.uuid = 0;
    $.support = {};
    $.expr = {};

    $.noop = function () {};

    $.map = function (elements, callback) {
      var value,
          values = [],
          i,
          key;
      if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i);
        if (value != null) values.push(value);
      } else for (key in elements) {
        value = callback(elements[key], key);
        if (value != null) values.push(value);
      }
      return flatten(values);
    };

    $.each = function (elements, callback) {
      var i, key;

      if (likeArray(elements)) {
        for (i = 0; i < elements.length; i++) if (callback.call(elements[i], i, elements[i]) === false) return elements;
      } else {
        for (key in elements) if (callback.call(elements[key], key, elements[key]) === false) return elements;
      }

      return elements;
    };

    $.grep = function (elements, callback) {
      return filter.call(elements, callback);
    };

    if (window.JSON) $.parseJSON = JSON.parse; // Populate the class2type map

    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
      class2type["[object " + name + "]"] = name.toLowerCase();
    }); // Define methods that will be available on all
    // Zepto collections

    $.fn = {
      constructor: zepto.Z,
      length: 0,
      // Because a collection acts like an array
      // copy over these useful array functions.
      forEach: emptyArray.forEach,
      reduce: emptyArray.reduce,
      push: emptyArray.push,
      sort: emptyArray.sort,
      splice: emptyArray.splice,
      indexOf: emptyArray.indexOf,
      concat: function () {
        var i,
            value,
            args = [];

        for (i = 0; i < arguments.length; i++) {
          value = arguments[i];
          args[i] = zepto.isZ(value) ? value.toArray() : value;
        }

        return concat.apply(zepto.isZ(this) ? this.toArray() : this, args);
      },
      // `map` and `slice` in the jQuery API work differently
      // from their array counterparts
      map: function (fn) {
        return $($.map(this, function (el, i) {
          return fn.call(el, i, el);
        }));
      },
      slice: function () {
        return $(slice.apply(this, arguments));
      },
      ready: function (callback) {
        // need to check if document.body exists for IE as that browser reports
        // document ready when it hasn't yet created the body element
        if (readyRE.test(document.readyState) && document.body) callback($);else document.addEventListener('DOMContentLoaded', function () {
          callback($);
        }, false);
        return this;
      },
      get: function (idx) {
        return idx === undefined$1 ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
      },
      toArray: function () {
        return this.get();
      },
      size: function () {
        return this.length;
      },
      remove: function () {
        return this.each(function () {
          if (this.parentNode != null) this.parentNode.removeChild(this);
        });
      },
      each: function (callback) {
        emptyArray.every.call(this, function (el, idx) {
          return callback.call(el, idx, el) !== false;
        });
        return this;
      },
      filter: function (selector) {
        if (isFunction(selector)) return this.not(this.not(selector));
        return $(filter.call(this, function (element) {
          return zepto.matches(element, selector);
        }));
      },
      add: function (selector, context) {
        return $(uniq(this.concat($(selector, context))));
      },
      is: function (selector) {
        return this.length > 0 && zepto.matches(this[0], selector);
      },
      not: function (selector) {
        var nodes = [];
        if (isFunction(selector) && selector.call !== undefined$1) this.each(function (idx) {
          if (!selector.call(this, idx)) nodes.push(this);
        });else {
          var excludes = typeof selector == 'string' ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
          this.forEach(function (el) {
            if (excludes.indexOf(el) < 0) nodes.push(el);
          });
        }
        return $(nodes);
      },
      has: function (selector) {
        return this.filter(function () {
          return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
        });
      },
      eq: function (idx) {
        return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
      },
      first: function () {
        var el = this[0];
        return el && !isObject(el) ? el : $(el);
      },
      last: function () {
        var el = this[this.length - 1];
        return el && !isObject(el) ? el : $(el);
      },
      find: function (selector) {
        var result,
            $this = this;
        if (!selector) result = $();else if (typeof selector == 'object') result = $(selector).filter(function () {
          var node = this;
          return emptyArray.some.call($this, function (parent) {
            return $.contains(parent, node);
          });
        });else if (this.length == 1) result = $(zepto.qsa(this[0], selector));else result = this.map(function () {
          return zepto.qsa(this, selector);
        });
        return result;
      },
      closest: function (selector, context) {
        var nodes = [],
            collection = typeof selector == 'object' && $(selector);
        this.each(function (_, node) {
          while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) node = node !== context && !isDocument(node) && node.parentNode;

          if (node && nodes.indexOf(node) < 0) nodes.push(node);
        });
        return $(nodes);
      },
      parents: function (selector) {
        var ancestors = [],
            nodes = this;

        while (nodes.length > 0) nodes = $.map(nodes, function (node) {
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node);
            return node;
          }
        });

        return filtered(ancestors, selector);
      },
      parent: function (selector) {
        return filtered(uniq(this.pluck('parentNode')), selector);
      },
      children: function (selector) {
        return filtered(this.map(function () {
          return children(this);
        }), selector);
      },
      contents: function () {
        return this.map(function () {
          return this.contentDocument || slice.call(this.childNodes);
        });
      },
      siblings: function (selector) {
        return filtered(this.map(function (i, el) {
          return filter.call(children(el.parentNode), function (child) {
            return child !== el;
          });
        }), selector);
      },
      empty: function () {
        return this.each(function () {
          this.innerHTML = '';
        });
      },
      // `pluck` is borrowed from Prototype.js
      pluck: function (property) {
        return $.map(this, function (el) {
          return el[property];
        });
      },
      show: function () {
        return this.each(function () {
          this.style.display == "none" && (this.style.display = '');
          if (getComputedStyle(this, '').getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName);
        });
      },
      replaceWith: function (newContent) {
        return this.before(newContent).remove();
      },
      wrap: function (structure) {
        var func = isFunction(structure);
        if (this[0] && !func) var dom = $(structure).get(0),
            clone = dom.parentNode || this.length > 1;
        return this.each(function (index) {
          $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
        });
      },
      wrapAll: function (structure) {
        if (this[0]) {
          $(this[0]).before(structure = $(structure));
          var children; // drill down to the inmost element

          while ((children = structure.children()).length) structure = children.first();

          $(structure).append(this);
        }

        return this;
      },
      wrapInner: function (structure) {
        var func = isFunction(structure);
        return this.each(function (index) {
          var self = $(this),
              contents = self.contents(),
              dom = func ? structure.call(this, index) : structure;
          contents.length ? contents.wrapAll(dom) : self.append(dom);
        });
      },
      unwrap: function () {
        this.parent().each(function () {
          $(this).replaceWith($(this).children());
        });
        return this;
      },
      clone: function () {
        return this.map(function () {
          return this.cloneNode(true);
        });
      },
      hide: function () {
        return this.css("display", "none");
      },
      toggle: function (setting) {
        return this.each(function () {
          var el = $(this);
          (setting === undefined$1 ? el.css("display") == "none" : setting) ? el.show() : el.hide();
        });
      },
      prev: function (selector) {
        return $(this.pluck('previousElementSibling')).filter(selector || '*');
      },
      next: function (selector) {
        return $(this.pluck('nextElementSibling')).filter(selector || '*');
      },
      html: function (html) {
        return 0 in arguments ? this.each(function (idx) {
          var originHtml = this.innerHTML;
          $(this).empty().append(funcArg(this, html, idx, originHtml));
        }) : 0 in this ? this[0].innerHTML : null;
      },
      text: function (text) {
        return 0 in arguments ? this.each(function (idx) {
          var newText = funcArg(this, text, idx, this.textContent);
          this.textContent = newText == null ? '' : '' + newText;
        }) : 0 in this ? this.pluck('textContent').join("") : null;
      },
      attr: function (name, value) {
        var result;
        return typeof name == 'string' && !(1 in arguments) ? 0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined$1 : this.each(function (idx) {
          if (this.nodeType !== 1) return;
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key]);else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
        });
      },
      removeAttr: function (name) {
        return this.each(function () {
          this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
            setAttribute(this, attribute);
          }, this);
        });
      },
      prop: function (name, value) {
        name = propMap[name] || name;
        return 1 in arguments ? this.each(function (idx) {
          this[name] = funcArg(this, value, idx, this[name]);
        }) : this[0] && this[0][name];
      },
      removeProp: function (name) {
        name = propMap[name] || name;
        return this.each(function () {
          delete this[name];
        });
      },
      data: function (name, value) {
        var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase();
        var data = 1 in arguments ? this.attr(attrName, value) : this.attr(attrName);
        return data !== null ? deserializeValue(data) : undefined$1;
      },
      val: function (value) {
        if (0 in arguments) {
          if (value == null) value = "";
          return this.each(function (idx) {
            this.value = funcArg(this, value, idx, this.value);
          });
        } else {
          return this[0] && (this[0].multiple ? $(this[0]).find('option').filter(function () {
            return this.selected;
          }).pluck('value') : this[0].value);
        }
      },
      offset: function (coordinates) {
        if (coordinates) return this.each(function (index) {
          var $this = $(this),
              coords = funcArg(this, coordinates, index, $this.offset()),
              parentOffset = $this.offsetParent().offset(),
              props = {
            top: coords.top - parentOffset.top,
            left: coords.left - parentOffset.left
          };
          if ($this.css('position') == 'static') props['position'] = 'relative';
          $this.css(props);
        });
        if (!this.length) return null;
        if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0])) return {
          top: 0,
          left: 0
        };
        var obj = this[0].getBoundingClientRect();
        return {
          left: obj.left + window.pageXOffset,
          top: obj.top + window.pageYOffset,
          width: Math.round(obj.width),
          height: Math.round(obj.height)
        };
      },
      css: function (property, value) {
        if (arguments.length < 2) {
          var element = this[0];

          if (typeof property == 'string') {
            if (!element) return;
            return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property);
          } else if (isArray(property)) {
            if (!element) return;
            var props = {};
            var computedStyle = getComputedStyle(element, '');
            $.each(property, function (_, prop) {
              props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
            });
            return props;
          }
        }

        var css = '';

        if (type(property) == 'string') {
          if (!value && value !== 0) this.each(function () {
            this.style.removeProperty(dasherize(property));
          });else css = dasherize(property) + ":" + maybeAddPx(property, value);
        } else {
          for (key in property) if (!property[key] && property[key] !== 0) this.each(function () {
            this.style.removeProperty(dasherize(key));
          });else css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
        }

        return this.each(function () {
          this.style.cssText += ';' + css;
        });
      },
      index: function (element) {
        return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
      },
      hasClass: function (name) {
        if (!name) return false;
        return emptyArray.some.call(this, function (el) {
          return this.test(className(el));
        }, classRE(name));
      },
      addClass: function (name) {
        if (!name) return this;
        return this.each(function (idx) {
          if (!('className' in this)) return;
          classList = [];
          var cls = className(this),
              newName = funcArg(this, name, idx, cls);
          newName.split(/\s+/g).forEach(function (klass) {
            if (!$(this).hasClass(klass)) classList.push(klass);
          }, this);
          classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
        });
      },
      removeClass: function (name) {
        return this.each(function (idx) {
          if (!('className' in this)) return;
          if (name === undefined$1) return className(this, '');
          classList = className(this);
          funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
            classList = classList.replace(classRE(klass), " ");
          });
          className(this, classList.trim());
        });
      },
      toggleClass: function (name, when) {
        if (!name) return this;
        return this.each(function (idx) {
          var $this = $(this),
              names = funcArg(this, name, idx, className(this));
          names.split(/\s+/g).forEach(function (klass) {
            (when === undefined$1 ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
          });
        });
      },
      scrollTop: function (value) {
        if (!this.length) return;
        var hasScrollTop = 'scrollTop' in this[0];
        if (value === undefined$1) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
        return this.each(hasScrollTop ? function () {
          this.scrollTop = value;
        } : function () {
          this.scrollTo(this.scrollX, value);
        });
      },
      scrollLeft: function (value) {
        if (!this.length) return;
        var hasScrollLeft = 'scrollLeft' in this[0];
        if (value === undefined$1) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
        return this.each(hasScrollLeft ? function () {
          this.scrollLeft = value;
        } : function () {
          this.scrollTo(value, this.scrollY);
        });
      },
      position: function () {
        if (!this.length) return;
        var elem = this[0],
            // Get *real* offsetParent
        offsetParent = this.offsetParent(),
            // Get correct offsets
        offset = this.offset(),
            parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
          top: 0,
          left: 0
        } : offsetParent.offset(); // Subtract element margins
        // note: when an element has margin: auto the offsetLeft and marginLeft
        // are the same in Safari causing offset.left to incorrectly be 0

        offset.top -= parseFloat($(elem).css('margin-top')) || 0;
        offset.left -= parseFloat($(elem).css('margin-left')) || 0; // Add offsetParent borders

        parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0;
        parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0; // Subtract the two offsets

        return {
          top: offset.top - parentOffset.top,
          left: offset.left - parentOffset.left
        };
      },
      offsetParent: function () {
        return this.map(function () {
          var parent = this.offsetParent || document.body;

          while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") parent = parent.offsetParent;

          return parent;
        });
      }
    }; // for now

    $.fn.detach = $.fn.remove // Generate the `width` and `height` functions
    ;
    ['width', 'height'].forEach(function (dimension) {
      var dimensionProperty = dimension.replace(/./, function (m) {
        return m[0].toUpperCase();
      });

      $.fn[dimension] = function (value) {
        var offset,
            el = this[0];
        if (value === undefined$1) return isWindow(el) ? el['inner' + dimensionProperty] : isDocument(el) ? el.documentElement['scroll' + dimensionProperty] : (offset = this.offset()) && offset[dimension];else return this.each(function (idx) {
          el = $(this);
          el.css(dimension, funcArg(this, value, idx, el[dimension]()));
        });
      };
    });

    function traverseNode(node, fun) {
      fun(node);

      for (var i = 0, len = node.childNodes.length; i < len; i++) traverseNode(node.childNodes[i], fun);
    } // Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.


    adjacencyOperators.forEach(function (operator, operatorIndex) {
      var inside = operatorIndex % 2; //=> prepend, append

      $.fn[operator] = function () {
        // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
        var argType,
            nodes = $.map(arguments, function (arg) {
          var arr = [];
          argType = type(arg);

          if (argType == "array") {
            arg.forEach(function (el) {
              if (el.nodeType !== undefined$1) return arr.push(el);else if ($.zepto.isZ(el)) return arr = arr.concat(el.get());
              arr = arr.concat(zepto.fragment(el));
            });
            return arr;
          }

          return argType == "object" || arg == null ? arg : zepto.fragment(arg);
        }),
            parent,
            copyByClone = this.length > 1;
        if (nodes.length < 1) return this;
        return this.each(function (_, target) {
          parent = inside ? target : target.parentNode; // convert all methods to a "before" operation

          target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
          var parentInDocument = $.contains(document.documentElement, parent);
          nodes.forEach(function (node) {
            if (copyByClone) node = node.cloneNode(true);else if (!parent) return $(node).remove();
            parent.insertBefore(node, target);
            if (parentInDocument) traverseNode(node, function (el) {
              if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src) {
                var target = el.ownerDocument ? el.ownerDocument.defaultView : window;
                target['eval'].call(target, el.innerHTML);
              }
            });
          });
        });
      }; // after    => insertAfter
      // prepend  => prependTo
      // before   => insertBefore
      // append   => appendTo


      $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
        $(html)[operator](this);
        return this;
      };
    });
    zepto.Z.prototype = Z.prototype = $.fn; // Export internal API functions in the `$.zepto` namespace

    zepto.uniq = uniq;
    zepto.deserializeValue = deserializeValue;
    $.zepto = zepto;
    return $;
  }();

  window.Zepto = Zepto;
  window.$ === undefined && (window.$ = Zepto);

  (function ($) {
    var jsonpID = +new Date(),
        document = window.document,
        key,
        name,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        scriptTypeRE = /^(?:text|application)\/javascript/i,
        xmlTypeRE = /^(?:text|application)\/xml/i,
        jsonType = 'application/json',
        htmlType = 'text/html',
        blankRE = /^\s*$/,
        originAnchor = document.createElement('a');
    originAnchor.href = window.location.href; // trigger a custom event and return false if it was cancelled

    function triggerAndReturn(context, eventName, data) {
      var event = $.Event(eventName);
      $(context).trigger(event, data);
      return !event.isDefaultPrevented();
    } // trigger an Ajax "global" event


    function triggerGlobal(settings, context, eventName, data) {
      if (settings.global) return triggerAndReturn(context || document, eventName, data);
    } // Number of active Ajax requests


    $.active = 0;

    function ajaxStart(settings) {
      if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart');
    }

    function ajaxStop(settings) {
      if (settings.global && ! --$.active) triggerGlobal(settings, null, 'ajaxStop');
    } // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable


    function ajaxBeforeSend(xhr, settings) {
      var context = settings.context;
      if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) return false;
      triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
    }

    function ajaxSuccess(data, xhr, settings, deferred) {
      var context = settings.context,
          status = 'success';
      settings.success.call(context, data, status, xhr);
      if (deferred) deferred.resolveWith(context, [data, status, xhr]);
      triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
      ajaxComplete(status, xhr, settings);
    } // type: "timeout", "error", "abort", "parsererror"


    function ajaxError(error, type, xhr, settings, deferred) {
      var context = settings.context;
      settings.error.call(context, xhr, type, error);
      if (deferred) deferred.rejectWith(context, [xhr, type, error]);
      triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type]);
      ajaxComplete(type, xhr, settings);
    } // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"


    function ajaxComplete(status, xhr, settings) {
      var context = settings.context;
      settings.complete.call(context, xhr, status);
      triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
      ajaxStop(settings);
    }

    function ajaxDataFilter(data, type, settings) {
      if (settings.dataFilter == empty) return data;
      var context = settings.context;
      return settings.dataFilter.call(context, data, type);
    } // Empty function, used as default callback


    function empty() {}

    $.ajaxJSONP = function (options, deferred) {
      if (!('type' in options)) return $.ajax(options);

      var _callbackName = options.jsonpCallback,
          callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || 'Zepto' + jsonpID++,
          script = document.createElement('script'),
          originalCallback = window[callbackName],
          responseData,
          abort = function (errorType) {
        $(script).triggerHandler('error', errorType || 'abort');
      },
          xhr = {
        abort: abort
      },
          abortTimeout;

      if (deferred) deferred.promise(xhr);
      $(script).on('load error', function (e, errorType) {
        clearTimeout(abortTimeout);
        $(script).off().remove();

        if (e.type == 'error' || !responseData) {
          ajaxError(null, errorType || 'error', xhr, options, deferred);
        } else {
          ajaxSuccess(responseData[0], xhr, options, deferred);
        }

        window[callbackName] = originalCallback;
        if (responseData && $.isFunction(originalCallback)) originalCallback(responseData[0]);
        originalCallback = responseData = undefined;
      });

      if (ajaxBeforeSend(xhr, options) === false) {
        abort('abort');
        return xhr;
      }

      window[callbackName] = function () {
        responseData = arguments;
      };

      script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
      document.head.appendChild(script);
      if (options.timeout > 0) abortTimeout = setTimeout(function () {
        abort('timeout');
      }, options.timeout);
      return xhr;
    };

    $.ajaxSettings = {
      // Default type of request
      type: 'GET',
      // Callback that is executed before request
      beforeSend: empty,
      // Callback that is executed if the request succeeds
      success: empty,
      // Callback that is executed the the server drops error
      error: empty,
      // Callback that is executed on request complete (both: error and success)
      complete: empty,
      // The context for the callbacks
      context: null,
      // Whether to trigger "global" Ajax events
      global: true,
      // Transport
      xhr: function () {
        return new window.XMLHttpRequest();
      },
      // MIME types mapping
      // IIS returns Javascript as "application/x-javascript"
      accepts: {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json: jsonType,
        xml: 'application/xml, text/xml',
        html: htmlType,
        text: 'text/plain'
      },
      // Whether the request is to another domain
      crossDomain: false,
      // Default timeout
      timeout: 0,
      // Whether data should be serialized to string
      processData: true,
      // Whether the browser should be allowed to cache GET responses
      cache: true,
      //Used to handle the raw response data of XMLHttpRequest.
      //This is a pre-filtering function to sanitize the response.
      //The sanitized response should be returned
      dataFilter: empty
    };

    function mimeToDataType(mime) {
      if (mime) mime = mime.split(';', 2)[0];
      return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
    }

    function appendQuery(url, query) {
      if (query == '') return url;
      return (url + '&' + query).replace(/[&?]{1,2}/, '?');
    } // serialize payload and append it to the URL for GET requests


    function serializeData(options) {
      if (options.processData && options.data && $.type(options.data) != "string") options.data = $.param(options.data, options.traditional);
      if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType)) options.url = appendQuery(options.url, options.data), options.data = undefined;
    }

    $.ajax = function (options) {
      var settings = $.extend({}, options || {}),
          deferred = $.Deferred && $.Deferred(),
          urlAnchor,
          hashIndex;

      for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];

      ajaxStart(settings);

      if (!settings.crossDomain) {
        urlAnchor = document.createElement('a');
        urlAnchor.href = settings.url; // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049

        urlAnchor.href = urlAnchor.href;
        settings.crossDomain = originAnchor.protocol + '//' + originAnchor.host !== urlAnchor.protocol + '//' + urlAnchor.host;
      }

      if (!settings.url) settings.url = window.location.toString();
      if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex);
      serializeData(settings);
      var dataType = settings.dataType,
          hasPlaceholder = /\?.+=\?/.test(settings.url);
      if (hasPlaceholder) dataType = 'jsonp';
      if (settings.cache === false || (!options || options.cache !== true) && ('script' == dataType || 'jsonp' == dataType)) settings.url = appendQuery(settings.url, '_=' + Date.now());

      if ('jsonp' == dataType) {
        if (!hasPlaceholder) settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + '=?' : settings.jsonp === false ? '' : 'callback=?');
        return $.ajaxJSONP(settings, deferred);
      }

      var mime = settings.accepts[dataType],
          headers = {},
          setHeader = function (name, value) {
        headers[name.toLowerCase()] = [name, value];
      },
          protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
          xhr = settings.xhr(),
          nativeSetHeader = xhr.setRequestHeader,
          abortTimeout;

      if (deferred) deferred.promise(xhr);
      if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest');
      setHeader('Accept', mime || '*/*');

      if (mime = settings.mimeType || mime) {
        if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
        xhr.overrideMimeType && xhr.overrideMimeType(mime);
      }

      if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET') setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
      if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name]);
      xhr.setRequestHeader = setHeader;

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = empty;
          clearTimeout(abortTimeout);
          var result,
              error = false;

          if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == 'file:') {
            dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
            if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob') result = xhr.response;else {
              result = xhr.responseText;

              try {
                // http://perfectionkills.com/global-eval-what-are-the-options/
                // sanitize response accordingly if data filter callback provided
                result = ajaxDataFilter(result, dataType, settings);
                if (dataType == 'script') (1, eval)(result);else if (dataType == 'xml') result = xhr.responseXML;else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result);
              } catch (e) {
                error = e;
              }

              if (error) return ajaxError(error, 'parsererror', xhr, settings, deferred);
            }
            ajaxSuccess(result, xhr, settings, deferred);
          } else {
            ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
          }
        }
      };

      if (ajaxBeforeSend(xhr, settings) === false) {
        xhr.abort();
        ajaxError(null, 'abort', xhr, settings, deferred);
        return xhr;
      }

      var async = 'async' in settings ? settings.async : true;
      xhr.open(settings.type, settings.url, async, settings.username, settings.password);
      if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name];

      for (name in headers) nativeSetHeader.apply(xhr, headers[name]);

      if (settings.timeout > 0) abortTimeout = setTimeout(function () {
        xhr.onreadystatechange = empty;
        xhr.abort();
        ajaxError(null, 'timeout', xhr, settings, deferred);
      }, settings.timeout); // avoid sending empty string (#319)

      xhr.send(settings.data ? settings.data : null);
      return xhr;
    }; // handle optional data/success arguments


    function parseArguments(url, data, success, dataType) {
      if ($.isFunction(data)) dataType = success, success = data, data = undefined;
      if (!$.isFunction(success)) dataType = success, success = undefined;
      return {
        url: url,
        data: data,
        success: success,
        dataType: dataType
      };
    }

    $.get = function ()
    /* url, data, success, dataType */
    {
      return $.ajax(parseArguments.apply(null, arguments));
    };

    $.post = function ()
    /* url, data, success, dataType */
    {
      var options = parseArguments.apply(null, arguments);
      options.type = 'POST';
      return $.ajax(options);
    };

    $.getJSON = function ()
    /* url, data, success */
    {
      var options = parseArguments.apply(null, arguments);
      options.dataType = 'json';
      return $.ajax(options);
    };

    $.fn.load = function (url, data, success) {
      if (!this.length) return this;
      var self = this,
          parts = url.split(/\s/),
          selector,
          options = parseArguments(url, data, success),
          callback = options.success;
      if (parts.length > 1) options.url = parts[0], selector = parts[1];

      options.success = function (response) {
        self.html(selector ? $('<div>').html(response.replace(rscript, "")).find(selector) : response);
        callback && callback.apply(self, arguments);
      };

      $.ajax(options);
      return this;
    };

    var escape = encodeURIComponent;

    function serialize(params, obj, traditional, scope) {
      var type,
          array = $.isArray(obj),
          hash = $.isPlainObject(obj);
      $.each(obj, function (key, value) {
        type = $.type(value);
        if (scope) key = traditional ? scope : scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'; // handle data in serializeArray() format

        if (!scope && array) params.add(value.name, value.value); // recurse into nested objects
        else if (type == "array" || !traditional && type == "object") serialize(params, value, traditional, key);else params.add(key, value);
      });
    }

    $.param = function (obj, traditional) {
      var params = [];

      params.add = function (key, value) {
        if ($.isFunction(value)) value = value();
        if (value == null) value = "";
        this.push(escape(key) + '=' + escape(value));
      };

      serialize(params, obj, traditional);
      return params.join('&').replace(/%20/g, '+');
    };
  })(Zepto);

  (function ($) {
    // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
    // Option flags:
    //   - once: Callbacks fired at most one time.
    //   - memory: Remember the most recent context and arguments
    //   - stopOnFalse: Cease iterating over callback list
    //   - unique: Permit adding at most one instance of the same callback
    $.Callbacks = function (options) {
      options = $.extend({}, options);

      var memory,
          // Last fire value (for non-forgettable lists)
      fired,
          // Flag to know if list was already fired
      firing,
          // Flag to know if list is currently firing
      firingStart,
          // First callback to fire (used internally by add and fireWith)
      firingLength,
          // End of the loop when firing
      firingIndex,
          // Index of currently firing callback (modified by remove if needed)
      list = [],
          // Actual callback list
      stack = !options.once && [],
          // Stack of fire calls for repeatable lists
      fire = function (data) {
        memory = options.memory && data;
        fired = true;
        firingIndex = firingStart || 0;
        firingStart = 0;
        firingLength = list.length;
        firing = true;

        for (; list && firingIndex < firingLength; ++firingIndex) {
          if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
            memory = false;
            break;
          }
        }

        firing = false;

        if (list) {
          if (stack) stack.length && fire(stack.shift());else if (memory) list.length = 0;else Callbacks.disable();
        }
      },
          Callbacks = {
        add: function () {
          if (list) {
            var start = list.length,
                add = function (args) {
              $.each(args, function (_, arg) {
                if (typeof arg === "function") {
                  if (!options.unique || !Callbacks.has(arg)) list.push(arg);
                } else if (arg && arg.length && typeof arg !== 'string') add(arg);
              });
            };

            add(arguments);
            if (firing) firingLength = list.length;else if (memory) {
              firingStart = start;
              fire(memory);
            }
          }

          return this;
        },
        remove: function () {
          if (list) {
            $.each(arguments, function (_, arg) {
              var index;

              while ((index = $.inArray(arg, list, index)) > -1) {
                list.splice(index, 1); // Handle firing indexes

                if (firing) {
                  if (index <= firingLength) --firingLength;
                  if (index <= firingIndex) --firingIndex;
                }
              }
            });
          }

          return this;
        },
        has: function (fn) {
          return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length));
        },
        empty: function () {
          firingLength = list.length = 0;
          return this;
        },
        disable: function () {
          list = stack = memory = undefined;
          return this;
        },
        disabled: function () {
          return !list;
        },
        lock: function () {
          stack = undefined;
          if (!memory) Callbacks.disable();
          return this;
        },
        locked: function () {
          return !stack;
        },
        fireWith: function (context, args) {
          if (list && (!fired || stack)) {
            args = args || [];
            args = [context, args.slice ? args.slice() : args];
            if (firing) stack.push(args);else fire(args);
          }

          return this;
        },
        fire: function () {
          return Callbacks.fireWith(this, arguments);
        },
        fired: function () {
          return !!fired;
        }
      };

      return Callbacks;
    };
  })(Zepto);

  (function ($) {
    var slice = Array.prototype.slice;

    function Deferred(func) {
      var tuples = [// action, add listener, listener list, final state
      ["resolve", "done", $.Callbacks({
        once: 1,
        memory: 1
      }), "resolved"], ["reject", "fail", $.Callbacks({
        once: 1,
        memory: 1
      }), "rejected"], ["notify", "progress", $.Callbacks({
        memory: 1
      })]],
          state = "pending",
          promise = {
        state: function () {
          return state;
        },
        always: function () {
          deferred.done(arguments).fail(arguments);
          return this;
        },
        then: function ()
        /* fnDone [, fnFailed [, fnProgress]] */
        {
          var fns = arguments;
          return Deferred(function (defer) {
            $.each(tuples, function (i, tuple) {
              var fn = $.isFunction(fns[i]) && fns[i];
              deferred[tuple[1]](function () {
                var returned = fn && fn.apply(this, arguments);

                if (returned && $.isFunction(returned.promise)) {
                  returned.promise().done(defer.resolve).fail(defer.reject).progress(defer.notify);
                } else {
                  var context = this === promise ? defer.promise() : this,
                      values = fn ? [returned] : arguments;
                  defer[tuple[0] + "With"](context, values);
                }
              });
            });
            fns = null;
          }).promise();
        },
        promise: function (obj) {
          return obj != null ? $.extend(obj, promise) : promise;
        }
      },
          deferred = {};
      $.each(tuples, function (i, tuple) {
        var list = tuple[2],
            stateString = tuple[3];
        promise[tuple[1]] = list.add;

        if (stateString) {
          list.add(function () {
            state = stateString;
          }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
        }

        deferred[tuple[0]] = function () {
          deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
          return this;
        };

        deferred[tuple[0] + "With"] = list.fireWith;
      });
      promise.promise(deferred);
      if (func) func.call(deferred, deferred);
      return deferred;
    }

    $.when = function (sub) {
      var resolveValues = slice.call(arguments),
          len = resolveValues.length,
          i = 0,
          remain = len !== 1 || sub && $.isFunction(sub.promise) ? len : 0,
          deferred = remain === 1 ? sub : Deferred(),
          progressValues,
          progressContexts,
          resolveContexts,
          updateFn = function (i, ctx, val) {
        return function (value) {
          ctx[i] = this;
          val[i] = arguments.length > 1 ? slice.call(arguments) : value;

          if (val === progressValues) {
            deferred.notifyWith(ctx, val);
          } else if (! --remain) {
            deferred.resolveWith(ctx, val);
          }
        };
      };

      if (len > 1) {
        progressValues = new Array(len);
        progressContexts = new Array(len);
        resolveContexts = new Array(len);

        for (; i < len; ++i) {
          if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise().done(updateFn(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFn(i, progressContexts, progressValues));
          } else {
            --remain;
          }
        }
      }

      if (!remain) deferred.resolveWith(resolveContexts, resolveValues);
      return deferred.promise();
    };

    $.Deferred = Deferred;
  })(Zepto);

  (function ($) {
    var _zid = 1,
        undefined$1,
        slice = Array.prototype.slice,
        isFunction = $.isFunction,
        isString = function (obj) {
      return typeof obj == 'string';
    },
        handlers = {},
        specialEvents = {},
        focusinSupported = 'onfocusin' in window,
        focus = {
      focus: 'focusin',
      blur: 'focusout'
    },
        hover = {
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    };

    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

    function zid(element) {
      return element._zid || (element._zid = _zid++);
    }

    function findHandlers(element, event, fn, selector) {
      event = parse(event);
      if (event.ns) var matcher = matcherFor(event.ns);
      return (handlers[zid(element)] || []).filter(function (handler) {
        return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
      });
    }

    function parse(event) {
      var parts = ('' + event).split('.');
      return {
        e: parts[0],
        ns: parts.slice(1).sort().join(' ')
      };
    }

    function matcherFor(ns) {
      return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
    }

    function eventCapture(handler, captureSetting) {
      return handler.del && !focusinSupported && handler.e in focus || !!captureSetting;
    }

    function realEvent(type) {
      return hover[type] || focusinSupported && focus[type] || type;
    }

    function add(element, events, fn, data, selector, delegator, capture) {
      var id = zid(element),
          set = handlers[id] || (handlers[id] = []);
      events.split(/\s/).forEach(function (event) {
        if (event == 'ready') return $(document).ready(fn);
        var handler = parse(event);
        handler.fn = fn;
        handler.sel = selector; // emulate mouseenter, mouseleave

        if (handler.e in hover) fn = function (e) {
          var related = e.relatedTarget;
          if (!related || related !== this && !$.contains(this, related)) return handler.fn.apply(this, arguments);
        };
        handler.del = delegator;
        var callback = delegator || fn;

        handler.proxy = function (e) {
          e = compatible(e);
          if (e.isImmediatePropagationStopped()) return;
          e.data = data;
          var result = callback.apply(element, e._args == undefined$1 ? [e] : [e].concat(e._args));
          if (result === false) e.preventDefault(), e.stopPropagation();
          return result;
        };

        handler.i = set.length;
        set.push(handler);
        if ('addEventListener' in element) element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
      });
    }

    function remove(element, events, fn, selector, capture) {
      var id = zid(element);
      (events || '').split(/\s/).forEach(function (event) {
        findHandlers(element, event, fn, selector).forEach(function (handler) {
          delete handlers[id][handler.i];
          if ('removeEventListener' in element) element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
        });
      });
    }

    $.event = {
      add: add,
      remove: remove
    };

    $.proxy = function (fn, context) {
      var args = 2 in arguments && slice.call(arguments, 2);

      if (isFunction(fn)) {
        var proxyFn = function () {
          return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
        };

        proxyFn._zid = zid(fn);
        return proxyFn;
      } else if (isString(context)) {
        if (args) {
          args.unshift(fn[context], fn);
          return $.proxy.apply(null, args);
        } else {
          return $.proxy(fn[context], fn);
        }
      } else {
        throw new TypeError("expected function");
      }
    };

    $.fn.bind = function (event, data, callback) {
      return this.on(event, data, callback);
    };

    $.fn.unbind = function (event, callback) {
      return this.off(event, callback);
    };

    $.fn.one = function (event, selector, data, callback) {
      return this.on(event, selector, data, callback, 1);
    };

    var returnTrue = function () {
      return true;
    },
        returnFalse = function () {
      return false;
    },
        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
        eventMethods = {
      preventDefault: 'isDefaultPrevented',
      stopImmediatePropagation: 'isImmediatePropagationStopped',
      stopPropagation: 'isPropagationStopped'
    };

    function compatible(event, source) {
      if (source || !event.isDefaultPrevented) {
        source || (source = event);
        $.each(eventMethods, function (name, predicate) {
          var sourceMethod = source[name];

          event[name] = function () {
            this[predicate] = returnTrue;
            return sourceMethod && sourceMethod.apply(source, arguments);
          };

          event[predicate] = returnFalse;
        });
        event.timeStamp || (event.timeStamp = Date.now());
        if (source.defaultPrevented !== undefined$1 ? source.defaultPrevented : 'returnValue' in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault()) event.isDefaultPrevented = returnTrue;
      }

      return event;
    }

    function createProxy(event) {
      var key,
          proxy = {
        originalEvent: event
      };

      for (key in event) if (!ignoreProperties.test(key) && event[key] !== undefined$1) proxy[key] = event[key];

      return compatible(proxy, event);
    }

    $.fn.delegate = function (selector, event, callback) {
      return this.on(event, selector, callback);
    };

    $.fn.undelegate = function (selector, event, callback) {
      return this.off(event, selector, callback);
    };

    $.fn.live = function (event, callback) {
      $(document.body).delegate(this.selector, event, callback);
      return this;
    };

    $.fn.die = function (event, callback) {
      $(document.body).undelegate(this.selector, event, callback);
      return this;
    };

    $.fn.on = function (event, selector, data, callback, one) {
      var autoRemove,
          delegator,
          $this = this;

      if (event && !isString(event)) {
        $.each(event, function (type, fn) {
          $this.on(type, selector, data, fn, one);
        });
        return $this;
      }

      if (!isString(selector) && !isFunction(callback) && callback !== false) callback = data, data = selector, selector = undefined$1;
      if (callback === undefined$1 || data === false) callback = data, data = undefined$1;
      if (callback === false) callback = returnFalse;
      return $this.each(function (_, element) {
        if (one) autoRemove = function (e) {
          remove(element, e.type, callback);
          return callback.apply(this, arguments);
        };
        if (selector) delegator = function (e) {
          var evt,
              match = $(e.target).closest(selector, element).get(0);

          if (match && match !== element) {
            evt = $.extend(createProxy(e), {
              currentTarget: match,
              liveFired: element
            });
            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
          }
        };
        add(element, event, callback, data, selector, delegator || autoRemove);
      });
    };

    $.fn.off = function (event, selector, callback) {
      var $this = this;

      if (event && !isString(event)) {
        $.each(event, function (type, fn) {
          $this.off(type, selector, fn);
        });
        return $this;
      }

      if (!isString(selector) && !isFunction(callback) && callback !== false) callback = selector, selector = undefined$1;
      if (callback === false) callback = returnFalse;
      return $this.each(function () {
        remove(this, event, callback, selector);
      });
    };

    $.fn.trigger = function (event, args) {
      event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
      event._args = args;
      return this.each(function () {
        // handle focus(), blur() by calling them directly
        if (event.type in focus && typeof this[event.type] == "function") this[event.type](); // items in the collection might not be DOM elements
        else if ('dispatchEvent' in this) this.dispatchEvent(event);else $(this).triggerHandler(event, args);
      });
    }; // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble


    $.fn.triggerHandler = function (event, args) {
      var e, result;
      this.each(function (i, element) {
        e = createProxy(isString(event) ? $.Event(event) : event);
        e._args = args;
        e.target = element;
        $.each(findHandlers(element, event.type || event), function (i, handler) {
          result = handler.proxy(e);
          if (e.isImmediatePropagationStopped()) return false;
        });
      });
      return result;
    } // shortcut methods for `.bind(event, fn)` for each event type
    ;

    ('focusin focusout focus blur load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select keydown keypress keyup error').split(' ').forEach(function (event) {
      $.fn[event] = function (callback) {
        return 0 in arguments ? this.bind(event, callback) : this.trigger(event);
      };
    });

    $.Event = function (type, props) {
      if (!isString(type)) props = type, type = props.type;
      var event = document.createEvent(specialEvents[type] || 'Events'),
          bubbles = true;
      if (props) for (var name in props) name == 'bubbles' ? bubbles = !!props[name] : event[name] = props[name];
      event.initEvent(type, bubbles, true);
      return compatible(event);
    };
  })(Zepto);

  (function () {
    // getComputedStyle shouldn't freak out when called
    // without a valid element as argument
    try {
      getComputedStyle(undefined);
    } catch (e) {
      var nativeGetComputedStyle = getComputedStyle;

      window.getComputedStyle = function (element, pseudoElement) {
        try {
          return nativeGetComputedStyle(element, pseudoElement);
        } catch (e) {
          return null;
        }
      };
    }
  })();

  (function ($) {
    var zepto = $.zepto,
        oldQsa = zepto.qsa,
        oldMatches = zepto.matches;

    function visible(elem) {
      elem = $(elem);
      return !!(elem.width() || elem.height()) && elem.css("display") !== "none";
    } // Implements a subset from:
    // http://api.jquery.com/category/selectors/jquery-selector-extensions/
    //
    // Each filter function receives the current index, all nodes in the
    // considered set, and a value if there were parentheses. The value
    // of `this` is the node currently being considered. The function returns the
    // resulting node(s), null, or undefined.
    //
    // Complex selectors are not supported:
    //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
    //   ul.inner:first > li


    var filters = $.expr[':'] = {
      visible: function () {
        if (visible(this)) return this;
      },
      hidden: function () {
        if (!visible(this)) return this;
      },
      selected: function () {
        if (this.selected) return this;
      },
      checked: function () {
        if (this.checked) return this;
      },
      parent: function () {
        return this.parentNode;
      },
      first: function (idx) {
        if (idx === 0) return this;
      },
      last: function (idx, nodes) {
        if (idx === nodes.length - 1) return this;
      },
      eq: function (idx, _, value) {
        if (idx === value) return this;
      },
      contains: function (idx, _, text) {
        if ($(this).text().indexOf(text) > -1) return this;
      },
      has: function (idx, _, sel) {
        if (zepto.qsa(this, sel).length) return this;
      }
    };
    var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
        childRe = /^\s*>/,
        classTag = 'Zepto' + +new Date();

    function process(sel, fn) {
      // quote the hash in `a[href^=#]` expression
      sel = sel.replace(/=#\]/g, '="#"]');
      var filter,
          arg,
          match = filterRe.exec(sel);

      if (match && match[2] in filters) {
        filter = filters[match[2]], arg = match[3];
        sel = match[1];

        if (arg) {
          var num = Number(arg);
          if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '');else arg = num;
        }
      }

      return fn(sel, filter, arg);
    }

    zepto.qsa = function (node, selector) {
      return process(selector, function (sel, filter, arg) {
        try {
          var taggedParent;
          if (!sel && filter) sel = '*';else if (childRe.test(sel)) // support "> *" child queries by tagging the parent node with a
            // unique class and prepending that classname onto the selector
            taggedParent = $(node).addClass(classTag), sel = '.' + classTag + ' ' + sel;
          var nodes = oldQsa(node, sel);
        } catch (e) {
          console.error('error performing selector: %o', selector);
          throw e;
        } finally {
          if (taggedParent) taggedParent.removeClass(classTag);
        }

        return !filter ? nodes : zepto.uniq($.map(nodes, function (n, i) {
          return filter.call(n, i, nodes, arg);
        }));
      });
    };

    zepto.matches = function (node, selector) {
      return process(selector, function (sel, filter, arg) {
        return (!sel || oldMatches(node, sel)) && (!filter || filter.call(node, null, arg) === node);
      });
    };
  })(Zepto);

  var zepto = Zepto;

  /* eslint-disable no-useless-escape */
  // The order of the following arrays is important, be careful if you change it.
  var BROWSER_DATA = [{
    name: 'Chromium',
    group: 'Chrome',
    identifier: 'Chromium/([0-9\.]*)'
  }, {
    name: 'Chrome Mobile',
    group: 'Chrome',
    identifier: 'Chrome/([0-9\.]*) Mobile',
    versionIdentifier: 'Chrome/([0-9\.]*)'
  }, {
    name: 'Chrome',
    group: 'Chrome',
    identifier: 'Chrome/([0-9\.]*)'
  }, {
    name: 'Chrome for iOS',
    group: 'Chrome',
    identifier: 'CriOS/([0-9\.]*)'
  }, {
    name: 'Android Browser',
    group: 'Chrome',
    identifier: 'CrMo/([0-9\.]*)'
  }, {
    name: 'Firefox',
    group: 'Firefox',
    identifier: 'Firefox/([0-9\.]*)'
  }, {
    name: 'Opera Mini',
    group: 'Opera',
    identifier: 'Opera Mini/([0-9\.]*)'
  }, {
    name: 'Opera',
    group: 'Opera',
    identifier: 'Opera ([0-9\.]*)'
  }, {
    name: 'Opera',
    group: 'Opera',
    identifier: 'Opera/([0-9\.]*)',
    versionIdentifier: 'Version/([0-9\.]*)'
  }, {
    name: 'IEMobile',
    group: 'Explorer',
    identifier: 'IEMobile/([0-9\.]*)'
  }, {
    name: 'Internet Explorer',
    group: 'Explorer',
    identifier: 'MSIE ([a-zA-Z0-9\.]*)'
  }, {
    name: 'Internet Explorer',
    group: 'Explorer',
    identifier: 'Trident/([0-9\.]*)',
    versionIdentifier: 'rv:([0-9\.]*)'
  }, {
    name: 'Spartan',
    group: 'Spartan',
    identifier: 'Edge/([0-9\.]*)',
    versionIdentifier: 'Edge/([0-9\.]*)'
  }, {
    name: 'Safari',
    group: 'Safari',
    identifier: 'Safari/([0-9\.]*)',
    versionIdentifier: 'Version/([0-9\.]*)'
  }];

  /* eslint-disable no-useless-escape */
  // The order of the following arrays is important, be careful if you change it.
  var OS_DATA = [{
    name: 'Windows 2000',
    group: 'Windows',
    identifier: 'Windows NT 5.0',
    version: '5.0'
  }, {
    name: 'Windows XP',
    group: 'Windows',
    identifier: 'Windows NT 5.1',
    version: '5.1'
  }, {
    name: 'Windows Vista',
    group: 'Windows',
    identifier: 'Windows NT 6.0',
    version: '6.0'
  }, {
    name: 'Windows 7',
    group: 'Windows',
    identifier: 'Windows NT 6.1',
    version: '7.0'
  }, {
    name: 'Windows 8',
    group: 'Windows',
    identifier: 'Windows NT 6.2',
    version: '8.0'
  }, {
    name: 'Windows 8.1',
    group: 'Windows',
    identifier: 'Windows NT 6.3',
    version: '8.1'
  }, {
    name: 'Windows 10',
    group: 'Windows',
    identifier: 'Windows NT 10.0',
    version: '10.0'
  }, {
    name: 'Windows Phone',
    group: 'Windows Phone',
    identifier: 'Windows Phone ([0-9\.]*)'
  }, {
    name: 'Windows Phone',
    group: 'Windows Phone',
    identifier: 'Windows Phone OS ([0-9\.]*)'
  }, {
    name: 'Windows',
    group: 'Windows',
    identifier: 'Windows'
  }, {
    name: 'Chrome OS',
    group: 'Chrome OS',
    identifier: 'CrOS'
  }, {
    name: 'Android',
    group: 'Android',
    identifier: 'Android',
    versionIdentifier: 'Android ([a-zA-Z0-9\.-]*)'
  }, {
    name: 'iPad',
    group: 'iOS',
    identifier: 'iPad',
    versionIdentifier: 'OS ([0-9_]*)',
    versionSeparator: '[_|\.]'
  }, {
    name: 'iPod',
    group: 'iOS',
    identifier: 'iPod',
    versionIdentifier: 'OS ([0-9_]*)',
    versionSeparator: '[_|\.]'
  }, {
    name: 'iPhone',
    group: 'iOS',
    identifier: 'iPhone OS',
    versionIdentifier: 'OS ([0-9_]*)',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X High Sierra',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])13([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Sierra',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])12([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X El Capitan',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])11([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Yosemite',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])10([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Mavericks',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])9([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Mountain Lion',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])8([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Lion',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])7([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Snow Leopard',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])6([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Leopard',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])5([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Tiger',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])4([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Panther',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])3([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Jaguar',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])2([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Puma',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])1([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS X Cheetah',
    group: 'Mac OS',
    identifier: 'Mac OS X (10([_|\.])0([0-9_\.]*))',
    versionSeparator: '[_|\.]'
  }, {
    name: 'Mac OS',
    group: 'Mac OS',
    identifier: 'Mac OS'
  }, {
    name: 'Ubuntu',
    group: 'Linux',
    identifier: 'Ubuntu',
    versionIdentifier: 'Ubuntu/([0-9\.]*)'
  }, {
    name: 'Debian',
    group: 'Linux',
    identifier: 'Debian'
  }, {
    name: 'Gentoo',
    group: 'Linux',
    identifier: 'Gentoo'
  }, {
    name: 'Linux',
    group: 'Linux',
    identifier: 'Linux'
  }, {
    name: 'BlackBerry',
    group: 'BlackBerry',
    identifier: 'BlackBerry'
  }];

  var Browser = {};

  var hasLocalstorage = function hasLocalstorage() {
    try {
      localStorage.setItem('clappr', 'clappr');
      localStorage.removeItem('clappr');
      return true;
    } catch (e) {
      return false;
    }
  };

  var hasFlash = function hasFlash() {
    try {
      var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
      return !!fo;
    } catch (e) {
      return !!(navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'] !== undefined && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin);
    }
  };

  var getBrowserInfo = function getBrowserInfo(ua) {
    var parts = ua.match(/\b(playstation 4|nx|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [],
        extra;

    if (/trident/i.test(parts[1])) {
      extra = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return {
        name: 'IE',
        version: parseInt(extra[1] || '')
      };
    } else if (parts[1] === 'Chrome') {
      extra = ua.match(/\bOPR\/(\d+)/);
      if (extra != null) return {
        name: 'Opera',
        version: parseInt(extra[1])
      };
      extra = ua.match(/\bEdge\/(\d+)/);
      if (extra != null) return {
        name: 'Edge',
        version: parseInt(extra[1])
      };
    } else if (/android/i.test(ua) && (extra = ua.match(/version\/(\d+)/i))) {
      parts.splice(1, 1, 'Android WebView');
      parts.splice(2, 1, extra[1]);
    }

    parts = parts[2] ? [parts[1], parts[2]] : [navigator.appName, navigator.appVersion, '-?'];
    return {
      name: parts[0],
      version: parseInt(parts[1])
    };
  }; //  Get browser data

  var getBrowserData = function getBrowserData() {
    var browserObject = {};
    var userAgent = Browser.userAgent.toLowerCase(); // Check browser type

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = BROWSER_DATA[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var browser = _step.value;
        var browserRegExp = new RegExp(browser.identifier.toLowerCase());
        var browserRegExpResult = browserRegExp.exec(userAgent);

        if (browserRegExpResult != null && browserRegExpResult[1]) {
          browserObject.name = browser.name;
          browserObject.group = browser.group; // Check version

          if (browser.versionIdentifier) {
            var versionRegExp = new RegExp(browser.versionIdentifier.toLowerCase());
            var versionRegExpResult = versionRegExp.exec(userAgent);
            if (versionRegExpResult != null && versionRegExpResult[1]) setBrowserVersion(versionRegExpResult[1], browserObject);
          } else {
            setBrowserVersion(browserRegExpResult[1], browserObject);
          }

          break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return browserObject;
  }; // Set browser version

  var setBrowserVersion = function setBrowserVersion(version, browserObject) {
    var splitVersion = version.split('.', 2);
    browserObject.fullVersion = version; // Major version

    if (splitVersion[0]) browserObject.majorVersion = parseInt(splitVersion[0]); // Minor version

    if (splitVersion[1]) browserObject.minorVersion = parseInt(splitVersion[1]);
  }; //  Get OS data


  var getOsData = function getOsData() {
    var osObject = {};
    var userAgent = Browser.userAgent.toLowerCase(); // Check browser type

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = OS_DATA[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var os = _step2.value;
        var osRegExp = new RegExp(os.identifier.toLowerCase());
        var osRegExpResult = osRegExp.exec(userAgent);

        if (osRegExpResult != null) {
          osObject.name = os.name;
          osObject.group = os.group; // Version defined

          if (os.version) {
            setOsVersion(os.version, os.versionSeparator ? os.versionSeparator : '.', osObject); // Version detected
          } else if (osRegExpResult[1]) {
            setOsVersion(osRegExpResult[1], os.versionSeparator ? os.versionSeparator : '.', osObject); // Version identifier
          } else if (os.versionIdentifier) {
            var versionRegExp = new RegExp(os.versionIdentifier.toLowerCase());
            var versionRegExpResult = versionRegExp.exec(userAgent);
            if (versionRegExpResult != null && versionRegExpResult[1]) setOsVersion(versionRegExpResult[1], os.versionSeparator ? os.versionSeparator : '.', osObject);
          }

          break;
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return osObject;
  }; // Set OS version

  var setOsVersion = function setOsVersion(version, separator, osObject) {
    var finalSeparator = separator.substr(0, 1) == '[' ? new RegExp(separator, 'g') : separator;
    var splitVersion = version.split(finalSeparator, 2);
    if (separator != '.') version = version.replace(new RegExp(separator, 'g'), '.');
    osObject.fullVersion = version; // Major version

    if (splitVersion && splitVersion[0]) osObject.majorVersion = parseInt(splitVersion[0]); // Minor version

    if (splitVersion && splitVersion[1]) osObject.minorVersion = parseInt(splitVersion[1]);
  }; // Set viewport size


  var getViewportSize = function getViewportSize() {
    var viewportObject = {};
    viewportObject.width = zepto(window).width();
    viewportObject.height = zepto(window).height();
    return viewportObject;
  }; // Set viewport orientation

  var setViewportOrientation = function setViewportOrientation() {
    switch (window.orientation) {
      case -90:
      case 90:
        Browser.viewport.orientation = 'landscape';
        break;

      default:
        Browser.viewport.orientation = 'portrait';
        break;
    }
  };

  var getDevice = function getDevice(ua) {
    var platformRegExp = /\((iP(?:hone|ad|od))?(?:[^;]*; ){0,2}([^)]+(?=\)))/;
    var matches = platformRegExp.exec(ua);
    var device = matches && (matches[1] || matches[2]) || '';
    return device;
  };
  var browserInfo = getBrowserInfo(navigator.userAgent);
  Browser.isEdge = /edge/i.test(navigator.userAgent);
  Browser.isChrome = /chrome|CriOS/i.test(navigator.userAgent) && !Browser.isEdge;
  Browser.isSafari = /safari/i.test(navigator.userAgent) && !Browser.isChrome && !Browser.isEdge;
  Browser.isFirefox = /firefox/i.test(navigator.userAgent);
  Browser.isLegacyIE = !!window.ActiveXObject;
  Browser.isIE = Browser.isLegacyIE || /trident.*rv:1\d/i.test(navigator.userAgent);
  Browser.isIE11 = /trident.*rv:11/i.test(navigator.userAgent);
  Browser.isChromecast = Browser.isChrome && /CrKey/i.test(navigator.userAgent);
  Browser.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Mobile Safari|Opera Mini/i.test(navigator.userAgent);
  Browser.isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
  Browser.isAndroid = /Android/i.test(navigator.userAgent);
  Browser.isWindowsPhone = /Windows Phone/i.test(navigator.userAgent);
  Browser.isWin8App = /MSAppHost/i.test(navigator.userAgent);
  Browser.isWiiU = /WiiU/i.test(navigator.userAgent);
  Browser.isPS4 = /PlayStation 4/i.test(navigator.userAgent);
  Browser.hasLocalstorage = hasLocalstorage();
  Browser.hasFlash = hasFlash();
  /**
  * @deprecated
  * This parameter currently exists for retrocompatibility reasons.
  * Use Browser.data.name instead.
  */

  Browser.name = browserInfo.name;
  /**
  * @deprecated
  * This parameter currently exists for retrocompatibility reasons.
  * Use Browser.data.fullVersion instead.
  */

  Browser.version = browserInfo.version;
  Browser.userAgent = navigator.userAgent;
  Browser.data = getBrowserData();
  Browser.os = getOsData();
  Browser.viewport = getViewportSize();
  Browser.device = getDevice(Browser.userAgent);
  typeof window.orientation !== 'undefined' && setViewportOrientation();

  function assign(obj, source) {
    if (source) {
      for (var prop in source) {
        var propDescriptor = Object.getOwnPropertyDescriptor(source, prop);
        propDescriptor ? Object.defineProperty(obj, prop, propDescriptor) : obj[prop] = source[prop];
      }
    }

    return obj;
  }
  function extend(parent, properties) {
    var Surrogate =
    /*#__PURE__*/
    function (_parent) {
      _inherits(Surrogate, _parent);

      function Surrogate() {
        var _getPrototypeOf2;

        var _this;

        _classCallCheck(this, Surrogate);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Surrogate)).call.apply(_getPrototypeOf2, [this].concat(args)));
        if (properties.initialize) properties.initialize.apply(_assertThisInitialized(_this), args);
        return _this;
      }

      return Surrogate;
    }(parent);

    assign(Surrogate.prototype, properties);
    return Surrogate;
  }
  function formatTime(time, paddedHours) {
    if (!isFinite(time)) return '--:--';
    time = time * 1000;
    time = parseInt(time / 1000);
    var seconds = time % 60;
    time = parseInt(time / 60);
    var minutes = time % 60;
    time = parseInt(time / 60);
    var hours = time % 24;
    var days = parseInt(time / 24);
    var out = '';

    if (days && days > 0) {
      out += days + ':';
      if (hours < 1) out += '00:';
    }

    if (hours && hours > 0 || paddedHours) out += ('0' + hours).slice(-2) + ':';
    out += ('0' + minutes).slice(-2) + ':';
    out += ('0' + seconds).slice(-2);
    return out.trim();
  }
  var Fullscreen = {
    fullscreenElement: function fullscreenElement() {
      return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    },
    requestFullscreen: function requestFullscreen(el) {
      if (el.requestFullscreen) el.requestFullscreen();else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();else if (el.mozRequestFullScreen) el.mozRequestFullScreen();else if (el.msRequestFullscreen) el.msRequestFullscreen();else if (el.querySelector && el.querySelector('video') && el.querySelector('video').webkitEnterFullScreen) el.querySelector('video').webkitEnterFullScreen();else if (el.webkitEnterFullScreen) el.webkitEnterFullScreen();
    },
    cancelFullscreen: function cancelFullscreen() {
      var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      if (el.exitFullscreen) el.exitFullscreen();else if (el.webkitCancelFullScreen) el.webkitCancelFullScreen();else if (el.webkitExitFullscreen) el.webkitExitFullscreen();else if (el.mozCancelFullScreen) el.mozCancelFullScreen();else if (el.msExitFullscreen) el.msExitFullscreen();
    },
    fullscreenEnabled: function fullscreenEnabled() {
      return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
    }
  };
  var Config =
  /*#__PURE__*/
  function () {
    function Config() {
      _classCallCheck(this, Config);
    }

    _createClass(Config, null, [{
      key: "_defaultConfig",
      value: function _defaultConfig() {
        return {
          volume: {
            value: 100,
            parse: parseInt
          }
        };
      }
    }, {
      key: "_defaultValueFor",
      value: function _defaultValueFor(key) {
        try {
          return this._defaultConfig()[key].parse(this._defaultConfig()[key].value);
        } catch (e) {
          return undefined;
        }
      }
    }, {
      key: "_createKeyspace",
      value: function _createKeyspace(key) {
        return "clappr.".concat(document.domain, ".").concat(key);
      }
    }, {
      key: "restore",
      value: function restore(key) {
        if (Browser.hasLocalstorage && localStorage[this._createKeyspace(key)]) return this._defaultConfig()[key].parse(localStorage[this._createKeyspace(key)]);
        return this._defaultValueFor(key);
      }
    }, {
      key: "persist",
      value: function persist(key, value) {
        if (Browser.hasLocalstorage) {
          try {
            localStorage[this._createKeyspace(key)] = value;
            return true;
          } catch (e) {
            return false;
          }
        }
      }
    }]);

    return Config;
  }();
  var QueryString =
  /*#__PURE__*/
  function () {
    function QueryString() {
      _classCallCheck(this, QueryString);
    }

    _createClass(QueryString, null, [{
      key: "parse",
      value: function parse(paramsString) {
        var match;

        var pl = /\+/g,
            // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
            decode = function decode(s) {
          return decodeURIComponent(s.replace(pl, ' '));
        },
            params = {};

        while (match = search.exec(paramsString)) {
          // eslint-disable-line no-cond-assign
          params[decode(match[1]).toLowerCase()] = decode(match[2]);
        }

        return params;
      }
    }, {
      key: "params",
      get: function get() {
        var query = window.location.search.substring(1);

        if (query !== this.query) {
          this._urlParams = this.parse(query);
          this.query = query;
        }

        return this._urlParams;
      }
    }, {
      key: "hashParams",
      get: function get() {
        var hash = window.location.hash.substring(1);

        if (hash !== this.hash) {
          this._hashParams = this.parse(hash);
          this.hash = hash;
        }

        return this._hashParams;
      }
    }]);

    return QueryString;
  }();
  function seekStringToSeconds() {
    var paramName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 't';
    var seconds = 0;
    var seekString = QueryString.params[paramName] || QueryString.hashParams[paramName] || '';
    var parts = seekString.match(/[0-9]+[hms]+/g) || [];

    if (parts.length > 0) {
      var factor = {
        'h': 3600,
        'm': 60,
        's': 1
      };
      parts.forEach(function (el) {
        if (el) {
          var suffix = el[el.length - 1];
          var time = parseInt(el.slice(0, el.length - 1), 10);
          seconds += time * factor[suffix];
        }
      });
    } else if (seekString) {
      seconds = parseInt(seekString, 10);
    }

    return seconds;
  }
  var idsCounter = {};
  function uniqueId(prefix) {
    idsCounter[prefix] || (idsCounter[prefix] = 0);
    var id = ++idsCounter[prefix];
    return prefix + id;
  }
  function isNumber(value) {
    return value - parseFloat(value) + 1 >= 0;
  }
  function currentScriptUrl() {
    var scripts = document.getElementsByTagName('script');
    return scripts.length ? scripts[scripts.length - 1].src : '';
  }
  var requestAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
    window.setTimeout(fn, 1000 / 60);
  }).bind(window);
  var cancelAnimationFrame = (window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout).bind(window);
  function getBrowserLanguage() {
    return window.navigator && window.navigator.language;
  }
  function now() {
    if (window.performance && window.performance.now) return performance.now();
    return Date.now();
  } // remove the item from the array if it exists in the array

  function removeArrayItem(arr, item) {
    var i = arr.indexOf(item);
    if (i >= 0) arr.splice(i, 1);
  } // find an item regardless of its letter case

  function listContainsIgnoreCase(item, items) {
    if (item === undefined || items === undefined) return false;
    return items.find(function (itemEach) {
      return item.toLowerCase() === itemEach.toLowerCase();
    }) !== undefined;
  } // https://github.com/video-dev/can-autoplay

  function canAutoPlayMedia(cb, options) {
    options = Object.assign({
      inline: false,
      muted: false,
      timeout: 250,
      type: 'video',
      source: Media.mp4,
      element: null
    }, options);
    var element = options.element ? options.element : document.createElement(options.type);
    element.muted = options.muted;
    if (options.muted === true) element.setAttribute('muted', 'muted');
    if (options.inline === true) element.setAttribute('playsinline', 'playsinline');
    element.src = options.source;
    var promise = element.play();
    var timeoutId = setTimeout(function () {
      setResult(false, new Error("Timeout ".concat(options.timeout, " ms has been reached")));
    }, options.timeout);

    var setResult = function setResult(result) {
      var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      clearTimeout(timeoutId);
      cb(result, error);
    };

    if (promise !== undefined) {
      promise.then(function () {
        return setResult(true);
      })["catch"](function (err) {
        return setResult(false, err);
      });
    } else {
      setResult(true);
    }
  } // Simple Zepto element factory with video recycle feature.

  var videoStack = [];
  var DomRecycler =
  /*#__PURE__*/
  function () {
    function DomRecycler() {
      _classCallCheck(this, DomRecycler);
    }

    _createClass(DomRecycler, null, [{
      key: "configure",
      value: function configure(options) {
        this.options = zepto.extend(this.options, options);
      }
    }, {
      key: "create",
      value: function create(name) {
        if (this.options.recycleVideo && name === 'video' && videoStack.length > 0) return videoStack.shift();
        return zepto('<' + name + '>');
      }
    }, {
      key: "garbage",
      value: function garbage($el) {
        // Expect Zepto collection with single element (does not iterate!)
        if (!this.options.recycleVideo || $el[0].tagName.toUpperCase() !== 'VIDEO') return;
        $el.children().remove();
        videoStack.push($el);
      }
    }]);

    return DomRecycler;
  }();
  DomRecycler.options = {
    recycleVideo: false
  };
  var DoubleEventHandler =
  /*#__PURE__*/
  function () {
    function DoubleEventHandler() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;

      _classCallCheck(this, DoubleEventHandler);

      this.delay = delay;
      this.lastTime = 0;
    }

    _createClass(DoubleEventHandler, [{
      key: "handle",
      value: function handle(event, cb) {
        var prevented = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        // Based on http://jsfiddle.net/brettwp/J4djY/
        var currentTime = new Date().getTime();
        var diffTime = currentTime - this.lastTime;

        if (diffTime < this.delay && diffTime > 0) {
          cb();
          prevented && event.preventDefault();
        }

        this.lastTime = currentTime;
      }
    }]);

    return DoubleEventHandler;
  }();
  var Utils = {
    Config: Config,
    Fullscreen: Fullscreen,
    QueryString: QueryString,
    DomRecycler: DomRecycler,
    assign: assign,
    extend: extend,
    formatTime: formatTime,
    seekStringToSeconds: seekStringToSeconds,
    uniqueId: uniqueId,
    currentScriptUrl: currentScriptUrl,
    isNumber: isNumber,
    requestAnimationFrame: requestAnimationFrame,
    cancelAnimationFrame: cancelAnimationFrame,
    getBrowserLanguage: getBrowserLanguage,
    now: now,
    removeArrayItem: removeArrayItem,
    listContainsIgnoreCase: listContainsIgnoreCase,
    canAutoPlayMedia: canAutoPlayMedia,
    Media: Media,
    DoubleEventHandler: DoubleEventHandler
  };

  // Use of this source code is governed by a BSD-style
  // license that can be found in the LICENSE file.
  var BOLD = 'font-weight: bold; font-size: 13px;';
  var INFO = 'color: #006600;' + BOLD;
  var DEBUG = 'color: #0000ff;' + BOLD;
  var WARN = 'color: #ff8000;' + BOLD;
  var ERROR = 'color: #ff0000;' + BOLD;
  var LEVEL_DEBUG = 0;
  var LEVEL_INFO = 1;
  var LEVEL_WARN = 2;
  var LEVEL_ERROR = 3;
  var LEVEL_DISABLED = LEVEL_ERROR;
  var COLORS = [DEBUG, INFO, WARN, ERROR, ERROR];
  var DESCRIPTIONS = ['debug', 'info', 'warn', 'error', 'disabled'];

  var Log =
  /*#__PURE__*/
  function () {
    function Log() {
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : LEVEL_INFO;
      var offLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : LEVEL_DISABLED;

      _classCallCheck(this, Log);

      this.BLACKLIST = ['timeupdate', 'playback:timeupdate', 'playback:progress', 'container:hover', 'container:timeupdate', 'container:progress'];
      this.level = level;
      this.offLevel = offLevel;
    }

    _createClass(Log, [{
      key: "debug",
      value: function debug(klass) {
        this.log(klass, LEVEL_DEBUG, Array.prototype.slice.call(arguments, 1));
      }
    }, {
      key: "info",
      value: function info(klass) {
        this.log(klass, LEVEL_INFO, Array.prototype.slice.call(arguments, 1));
      }
    }, {
      key: "warn",
      value: function warn(klass) {
        this.log(klass, LEVEL_WARN, Array.prototype.slice.call(arguments, 1));
      }
    }, {
      key: "error",
      value: function error(klass) {
        this.log(klass, LEVEL_ERROR, Array.prototype.slice.call(arguments, 1));
      }
    }, {
      key: "onOff",
      value: function onOff() {
        if (this.level === this.offLevel) {
          this.level = this.previousLevel;
        } else {
          this.previousLevel = this.level;
          this.level = this.offLevel;
        } // handle instances where console.log is unavailable


        if (window.console && window.console.log) window.console.log('%c[Clappr.Log] set log level to ' + DESCRIPTIONS[this.level], WARN);
      }
    }, {
      key: "level",
      value: function level(newLevel) {
        this.level = newLevel;
      }
    }, {
      key: "log",
      value: function log(klass, level, message) {
        if (this.BLACKLIST.indexOf(message[0]) >= 0) return;
        if (level < this.level) return;

        if (!message) {
          message = klass;
          klass = null;
        }

        var color = COLORS[level];
        var klassDescription = '';
        if (klass) klassDescription = '[' + klass + ']';
        if (window.console && window.console.log) window.console.log.apply(console, ['%c[' + DESCRIPTIONS[level] + ']' + klassDescription, color].concat(message));
      }
    }]);

    return Log;
  }();
  Log.LEVEL_DEBUG = LEVEL_DEBUG;
  Log.LEVEL_INFO = LEVEL_INFO;
  Log.LEVEL_WARN = LEVEL_WARN;
  Log.LEVEL_ERROR = LEVEL_ERROR;

  Log.getInstance = function () {
    if (this._instance === undefined) this._instance = new this();
    return this._instance;
  };

  Log.setLevel = function (level) {
    this.getInstance().level = level;
  };

  Log.debug = function () {
    this.getInstance().debug.apply(this.getInstance(), arguments);
  };

  Log.info = function () {
    this.getInstance().info.apply(this.getInstance(), arguments);
  };

  Log.warn = function () {
    this.getInstance().warn.apply(this.getInstance(), arguments);
  };

  Log.error = function () {
    this.getInstance().error.apply(this.getInstance(), arguments);
  };

  var slice = Array.prototype.slice;
  var eventSplitter = /\s+/;

  var eventsApi = function eventsApi(obj, action, name, rest) {
    if (!name) return true; // Handle event maps.

    if (_typeof(name) === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }

      return false;
    } // Handle space separated event names.


    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);

      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }

      return false;
    }

    return true;
  };

  var triggerEvents = function triggerEvents(events, args, klass, name) {
    var ev,
        i = -1;
    var l = events.length,
        a1 = args[0],
        a2 = args[1],
        a3 = args[2];
    run();

    function run() {
      try {
        switch (args.length) {
          /* eslint-disable curly */
          case 0:
            while (++i < l) {
              (ev = events[i]).callback.call(ev.ctx);
            }

            return;

          case 1:
            while (++i < l) {
              (ev = events[i]).callback.call(ev.ctx, a1);
            }

            return;

          case 2:
            while (++i < l) {
              (ev = events[i]).callback.call(ev.ctx, a1, a2);
            }

            return;

          case 3:
            while (++i < l) {
              (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
            }

            return;

          default:
            while (++i < l) {
              (ev = events[i]).callback.apply(ev.ctx, args);
            }

            return;
        }
      } catch (exception) {
        Log.error.apply(Log, [klass, 'error on event', name, 'trigger', '-', exception]);
        run();
      }
    }
  };
  /**
   * @class Events
   * @constructor
   * @module base
   */


  var Events =
  /*#__PURE__*/
  function () {
    function Events() {
      _classCallCheck(this, Events);
    }

    _createClass(Events, [{
      key: "on",

      /**
       * listen to an event indefinitely, if you want to stop you need to call `off`
       * @method on
       * @param {String} name
       * @param {Function} callback
       * @param {Object} context
       */
      value: function on(name, callback, context) {
        if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({
          callback: callback,
          context: context,
          ctx: context || this
        });
        return this;
      }
      /**
       * listen to an event only once
       * @method once
       * @param {String} name
       * @param {Function} callback
       * @param {Object} context
       */

    }, {
      key: "once",
      value: function once(name, callback, context) {
        var _this = this;

        var _once;

        if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;

        var off = function off() {
          return _this.off(name, _once);
        };

        _once = function once() {
          off();
          callback.apply(this, arguments);
        };

        return this.on(name, _once, context);
      }
      /**
       * stop listening to an event
       * @method off
       * @param {String} name
       * @param {Function} callback
       * @param {Object} context
       */

    }, {
      key: "off",
      value: function off(name, callback, context) {
        var retain, ev, events, names, i, l, j, k;
        if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;

        if (!name && !callback && !context) {
          this._events = void 0;
          return this;
        }

        names = name ? [name] : Object.keys(this._events); // jshint maxdepth:5

        for (i = 0, l = names.length; i < l; i++) {
          name = names[i];
          events = this._events[name];

          if (events) {
            this._events[name] = retain = [];

            if (callback || context) {
              for (j = 0, k = events.length; j < k; j++) {
                ev = events[j];
                if (callback && callback !== ev.callback && callback !== ev.callback._callback || context && context !== ev.context) retain.push(ev);
              }
            }

            if (!retain.length) delete this._events[name];
          }
        }

        return this;
      }
      /**
       * triggers an event given its `name`
       * @method trigger
       * @param {String} name
       */

    }, {
      key: "trigger",
      value: function trigger(name) {
        var klass = this.name || this.constructor.name;
        Log.debug.apply(Log, [klass].concat(Array.prototype.slice.call(arguments)));
        if (!this._events) return this;
        var args = slice.call(arguments, 1);
        if (!eventsApi(this, 'trigger', name, args)) return this;
        var events = this._events[name];
        var allEvents = this._events.all;
        if (events) triggerEvents(events, args, klass, name);
        if (allEvents) triggerEvents(allEvents, arguments, klass, name);
        return this;
      }
      /**
       * stop listening an event for a given object
       * @method stopListening
       * @param {Object} obj
       * @param {String} name
       * @param {Function} callback
       */

    }, {
      key: "stopListening",
      value: function stopListening(obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) return this;
        var remove = !name && !callback;
        if (!callback && _typeof(name) === 'object') callback = this;
        if (obj) (listeningTo = {})[obj._listenId] = obj;

        for (var id in listeningTo) {
          obj = listeningTo[id];
          obj.off(name, callback, this);
          if (remove || Object.keys(obj._events).length === 0) delete this._listeningTo[id];
        }

        return this;
      }
    }], [{
      key: "register",
      value: function register(eventName) {
        Events.Custom || (Events.Custom = {});
        var property = typeof eventName === 'string' && eventName.toUpperCase().trim();

        if (property && !Events.Custom[property]) {
          Events.Custom[property] = property.toLowerCase().split('_').map(function (value, index) {
            return index === 0 ? value : value = value[0].toUpperCase() + value.slice(1);
          }).join('');
        } else Log.error('Events', 'Error when register event: ' + eventName);
      }
    }, {
      key: "listAvailableCustomEvents",
      value: function listAvailableCustomEvents() {
        Events.Custom || (Events.Custom = {});
        return Object.keys(Events.Custom).filter(function (property) {
          return typeof Events.Custom[property] === 'string';
        });
      }
    }]);

    return Events;
  }();
  var listenMethods = {
    listenTo: 'on',
    listenToOnce: 'once'
  };
  Object.keys(listenMethods).forEach(function (method) {
    Events.prototype[method] = function (obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && _typeof(name) === 'object') callback = this;
      obj[listenMethods[method]](name, callback, this);
      return this;
    };
  }); // PLAYER EVENTS

  /**
   * Fired when the player is ready on startup
   *
   * @event PLAYER_READY
   */

  Events.PLAYER_READY = 'ready';
  /**
   * Fired when player resizes
   *
   * @event PLAYER_RESIZE
   * @param {Object} currentSize an object with the current size
   */

  Events.PLAYER_RESIZE = 'resize';
  /**
   * Fired when player changes its fullscreen state
   *
   * @event PLAYER_FULLSCREEN
   * @param {Boolean} whether or not the player is on fullscreen mode
   */

  Events.PLAYER_FULLSCREEN = 'fullscreen';
  /**
   * Fired when player starts to play
   *
   * @event PLAYER_PLAY
   */

  Events.PLAYER_PLAY = 'play';
  /**
   * Fired when player pauses
   *
   * @event PLAYER_PAUSE
   */

  Events.PLAYER_PAUSE = 'pause';
  /**
   * Fired when player stops
   *
   * @event PLAYER_STOP
   */

  Events.PLAYER_STOP = 'stop';
  /**
   * Fired when player ends the video
   *
   * @event PLAYER_ENDED
   */

  Events.PLAYER_ENDED = 'ended';
  /**
   * Fired when player seeks the video
   *
   * @event PLAYER_SEEK
   * @param {Number} time the current time in seconds
   */

  Events.PLAYER_SEEK = 'seek';
  /**
   * Fired when player receives an error
   *
   * @event PLAYER_ERROR
   * @param {Object} error the error
   */

  Events.PLAYER_ERROR = 'playererror';
  /**
   * Fired when there is an error
   *
   * @event ERROR
   * @param {Object} error
   * the error with the following format `{code, description, level, raw, origin, scope}`
   * @param {String} [options.code]
   * error's code: code to identify error in the following format: origin:code
   * @param {String} [options.description]
   * error's description: description of the error
   * @param {String} [options.level]
   * error's level: FATAL or WARN.
   * @param {String} [options.origin]
   * error's origin. Example: hls, html5, etc
   * @param {String} [options.scope]
   * error's scope. Example: playback, container, etc
   * @param {String} [options.raw]
   * raw error: the initial error received
   */

  Events.ERROR = 'error';
  /**
   * Fired when the time is updated on player
   *
   * @event PLAYER_TIMEUPDATE
   * @param {Object} progress Data
   * progress object
   * @param {Number} [progress.current]
   * current time (in seconds)
   * @param {Number} [progress.total]
   * total time (in seconds)
   */

  Events.PLAYER_TIMEUPDATE = 'timeupdate';
  /**
   * Fired when player updates its volume
   *
   * @event PLAYER_VOLUMEUPDATE
   * @param {Number} volume the current volume
   */

  Events.PLAYER_VOLUMEUPDATE = 'volumeupdate';
  /**
   * Fired when subtitle is available
   *
   * @event PLAYER_SUBTITLE_AVAILABLE
   */

  Events.PLAYER_SUBTITLE_AVAILABLE = 'subtitleavailable'; // Playback Events

  /**
   * Fired when the playback is downloading the media
   *
   * @event PLAYBACK_PROGRESS
   * @param progress {Object}
   * Data progress object
   * @param [progress.start] {Number}
   * start position of buffered content at current position
   * @param [progress.current] {Number}
   * end position of buffered content at current position
   * @param [progress.total] {Number}
   * total content to be downloaded
   * @param buffered {Array}
   * array of buffered segments ({start, end}). [Only for supported playbacks]
   */

  Events.PLAYBACK_PROGRESS = 'playback:progress';
  /**
   * Fired when the time is updated on playback
   *
   * @event PLAYBACK_TIMEUPDATE
   * @param {Object} progress Data
   * progress object
   * @param {Number} [progress.current]
   * current time (in seconds)
   * @param {Number} [progress.total]
   * total time (in seconds)
   */

  Events.PLAYBACK_TIMEUPDATE = 'playback:timeupdate';
  /**
   * Fired when playback is ready
   *
   * @event PLAYBACK_READY
   */

  Events.PLAYBACK_READY = 'playback:ready';
  /**
   * Fired when the playback starts having to buffer because
   * playback can currently not be smooth.
   *
   * This corresponds to the playback `buffering` property being
   * `true`.
   *
   * @event PLAYBACK_BUFFERING
   */

  Events.PLAYBACK_BUFFERING = 'playback:buffering';
  /**
   * Fired when the playback has enough in the buffer to be
   * able to play smoothly, after previously being unable to
   * do this.
   *
   * This corresponds to the playback `buffering` property being
   * `false`.
   *
   * @event PLAYBACK_BUFFERFULL
   */

  Events.PLAYBACK_BUFFERFULL = 'playback:bufferfull';
  /**
   * Fired when playback changes any settings (volume, seek and etc)
   *
   * @event PLAYBACK_SETTINGSUPDATE
   */

  Events.PLAYBACK_SETTINGSUPDATE = 'playback:settingsupdate';
  /**
   * Fired when playback loaded its metadata
   *
   * @event PLAYBACK_LOADEDMETADATA
   * @param {Object} metadata Data
   * settings object
   * @param {Number} [metadata.duration]
   * the playback duration
   * @param {Object} [metadata.data]
   * extra meta data
   */

  Events.PLAYBACK_LOADEDMETADATA = 'playback:loadedmetadata';
  /**
   * Fired when playback updates its video quality
   *
   * @event PLAYBACK_HIGHDEFINITIONUPDATE
   * @param {Boolean} isHD
   * true when is on HD, false otherwise
   */

  Events.PLAYBACK_HIGHDEFINITIONUPDATE = 'playback:highdefinitionupdate';
  /**
   * Fired when playback updates its bitrate
   *
   * @event PLAYBACK_BITRATE
   * @param {Object} bitrate Data
   * bitrate object
   * @param {Number} [bitrate.bandwidth]
   * bitrate bandwidth when it's available
   * @param {Number} [bitrate.width]
   * playback width (ex: 720, 640, 1080)
   * @param {Number} [bitrate.height]
   * playback height (ex: 240, 480, 720)
   * @param {Number} [bitrate.level]
   * playback level when it's available, it could be just a map for width (0 => 240, 1 => 480, 2 => 720)
   */

  Events.PLAYBACK_BITRATE = 'playback:bitrate';
  /**
   * Fired when the playback has its levels
   *
   * @event PLAYBACK_LEVELS_AVAILABLE
   * @param {Array} levels
   * the ordered levels, each one with the following format `{id: 1, label: '500kbps'}` ps: id should be a number >= 0
   * @param {Number} initial
   * the initial level otherwise -1 (AUTO)
   */

  Events.PLAYBACK_LEVELS_AVAILABLE = 'playback:levels:available';
  /**
   * Fired when the playback starts to switch level
   *
   * @event PLAYBACK_LEVEL_SWITCH_START
   *
   */

  Events.PLAYBACK_LEVEL_SWITCH_START = 'playback:levels:switch:start';
  /**
   * Fired when the playback ends the level switch
   *
   * @event PLAYBACK_LEVEL_SWITCH_END
   *
   */

  Events.PLAYBACK_LEVEL_SWITCH_END = 'playback:levels:switch:end';
  /**
   * Fired when playback internal state changes
   *
   * @event PLAYBACK_PLAYBACKSTATE
   * @param {Object} state Data
   * state object
   * @param {String} [state.type]
   * the playback type
   */

  Events.PLAYBACK_PLAYBACKSTATE = 'playback:playbackstate';
  /**
   * Fired when DVR becomes enabled/disabled.
   *
   * @event PLAYBACK_DVR
   * @param {boolean} state true if dvr enabled
   */

  Events.PLAYBACK_DVR = 'playback:dvr'; // TODO doc

  Events.PLAYBACK_MEDIACONTROL_DISABLE = 'playback:mediacontrol:disable'; // TODO doc

  Events.PLAYBACK_MEDIACONTROL_ENABLE = 'playback:mediacontrol:enable';
  /**
   * Fired when the media for a playback ends.
   *
   * @event PLAYBACK_ENDED
   * @param {String} name the name of the playback
   */

  Events.PLAYBACK_ENDED = 'playback:ended';
  /**
   * Fired when user requests `play()`
   *
   * @event PLAYBACK_PLAY_INTENT
   */

  Events.PLAYBACK_PLAY_INTENT = 'playback:play:intent';
  /**
   * Fired when the media for a playback starts playing.
   * This is not necessarily when the user requests `play()`
   * The media may have to buffer first.
   * I.e. `isPlaying()` might return `true` before this event is fired,
   * because `isPlaying()` represents the intended state.
   *
   * @event PLAYBACK_PLAY
   */

  Events.PLAYBACK_PLAY = 'playback:play';
  /**
   * Fired when the media for a playback pauses.
   *
   * @event PLAYBACK_PAUSE
   */

  Events.PLAYBACK_PAUSE = 'playback:pause';
  /**
   * Fired when the media for a playback is seeking.
   *
   * @event PLAYBACK_SEEK
   */

  Events.PLAYBACK_SEEK = 'playback:seek';
  /**
   * Fired when the media for a playback is seeked.
   *
   * @event PLAYBACK_SEEKED
   */

  Events.PLAYBACK_SEEKED = 'playback:seeked';
  /**
   * Fired when the media for a playback is stopped.
   *
   * @event PLAYBACK_STOP
   */

  Events.PLAYBACK_STOP = 'playback:stop';
  /**
   * Fired if an error occurs in the playback.
   *
   * @event PLAYBACK_ERROR
   * @param {Object} error An object containing the error details
   * @param {String} name Playback name
   */

  Events.PLAYBACK_ERROR = 'playback:error'; // TODO doc

  Events.PLAYBACK_STATS_ADD = 'playback:stats:add'; // TODO doc

  Events.PLAYBACK_FRAGMENT_LOADED = 'playback:fragment:loaded'; // TODO doc

  Events.PLAYBACK_LEVEL_SWITCH = 'playback:level:switch';
  /**
   * Fired when subtitle is available on playback for display
   *
   * @event PLAYBACK_SUBTITLE_AVAILABLE
   */

  Events.PLAYBACK_SUBTITLE_AVAILABLE = 'playback:subtitle:available';
  /**
   * Fired when playback subtitle track has changed
   *
   * @event CONTAINER_SUBTITLE_CHANGED
   * @param {Object} track Data
   * track object
   * @param {Number} [track.id]
   * selected track id
   */

  Events.PLAYBACK_SUBTITLE_CHANGED = 'playback:subtitle:changed'; // Core Events

  /**
   * Fired when the containers are created
   *
   * @event CORE_CONTAINERS_CREATED
   */

  Events.CORE_CONTAINERS_CREATED = 'core:containers:created';
  /**
   * Fired when the active container changed
   *
   * @event CORE_ACTIVE_CONTAINER_CHANGED
   */

  Events.CORE_ACTIVE_CONTAINER_CHANGED = 'core:active:container:changed';
  /**
   * Fired when the options were changed for the core
   *
   * @event CORE_OPTIONS_CHANGE
   * @param {Object} new options provided to configure() method
   */

  Events.CORE_OPTIONS_CHANGE = 'core:options:change';
  /**
   * Fired after creating containers, when the core is ready
   *
   * @event CORE_READY
   */

  Events.CORE_READY = 'core:ready';
  /**
   * Fired when the fullscreen state change
   *
   * @event CORE_FULLSCREEN
   * @param {Boolean} whether or not the player is on fullscreen mode
   */

  Events.CORE_FULLSCREEN = 'core:fullscreen';
  /**
   * Fired when core updates size
   *
   * @event CORE_RESIZE
   * @param {Object} currentSize an object with the current size
   */

  Events.CORE_RESIZE = 'core:resize';
  /**
   * Fired when the screen orientation has changed.
   * This event is trigger only for mobile devices.
   *
   * @event CORE_SCREEN_ORIENTATION_CHANGED
   * @param {Object} screen An object with screen orientation
   * screen object
   * @param {Object} [screen.event]
   * window resize event object
   * @param {String} [screen.orientation]
   * screen orientation (ie: 'landscape' or 'portrait')
   */

  Events.CORE_SCREEN_ORIENTATION_CHANGED = 'core:screen:orientation:changed';
  /**
   * Fired when occurs mouse move event on core element
   *
   * @event CORE_MOUSE_MOVE
   * @param {Object} event a DOM event
   */

  Events.CORE_MOUSE_MOVE = 'core:mousemove';
  /**
   * Fired when occurs mouse leave event on core element
   *
   * @event CORE_MOUSE_LEAVE
   * @param {Object} event a DOM event
   */

  Events.CORE_MOUSE_LEAVE = 'core:mouseleave'; // Container Events

  /**
   * Fired when the container internal state changes
   *
   * @event CONTAINER_PLAYBACKSTATE
   * @param {Object} state Data
   * state object
   * @param {String} [state.type]
   * the playback type
   */

  Events.CONTAINER_PLAYBACKSTATE = 'container:playbackstate';
  Events.CONTAINER_PLAYBACKDVRSTATECHANGED = 'container:dvr';
  /**
   * Fired when the container updates its bitrate
   *
   * @event CONTAINER_BITRATE
   * @param {Object} bitrate Data
   * bitrate object
   * @param {Number} [bitrate.bandwidth]
   * bitrate bandwidth when it's available
   * @param {Number} [bitrate.width]
   * playback width (ex: 720, 640, 1080)
   * @param {Number} [bitrate.height]
   * playback height (ex: 240, 480, 720)
   * @param {Number} [bitrate.level]
   * playback level when it's available, it could be just a map for width (0 => 240, 1 => 480, 2 => 720)
   */

  Events.CONTAINER_BITRATE = 'container:bitrate';
  Events.CONTAINER_STATS_REPORT = 'container:stats:report';
  Events.CONTAINER_DESTROYED = 'container:destroyed';
  /**
   * Fired when the container is ready
   *
   * @event CONTAINER_READY
   */

  Events.CONTAINER_READY = 'container:ready';
  /**
   * Fired when the container was resized.
   *
   * Some fullscreen modes won't trigger this resize since they don't affect the container, only the playback contents.
   *
   * @event CONTAINER_RESIZE
   */

  Events.CONTAINER_RESIZE = 'container:resize';
  Events.CONTAINER_ERROR = 'container:error';
  /**
   * Fired when the container loaded its metadata
   *
   * @event CONTAINER_LOADEDMETADATA
   * @param {Object} metadata Data
   * settings object
   * @param {Number} [metadata.duration]
   * the playback duration
   * @param {Object} [metadata.data]
   * extra meta data
   */

  Events.CONTAINER_LOADEDMETADATA = 'container:loadedmetadata';
  /**
   * Fired when subtitle is available on container for display
   *
   * @event CONTAINER_SUBTITLE_AVAILABLE
   */

  Events.CONTAINER_SUBTITLE_AVAILABLE = 'container:subtitle:available';
  /**
   * Fired when subtitle track has changed
   *
   * @event CONTAINER_SUBTITLE_CHANGED
   * @param {Object} track Data
   * track object
   * @param {Number} [track.id]
   * selected track id
   */

  Events.CONTAINER_SUBTITLE_CHANGED = 'container:subtitle:changed';
  /**
   * Fired when the time is updated on container
   *
   * @event CONTAINER_TIMEUPDATE
   * @param {Object} progress Data
   * progress object
   * @param {Number} [progress.current]
   * current time (in seconds)
   * @param {Number} [progress.total]
   * total time (in seconds)
   */

  Events.CONTAINER_TIMEUPDATE = 'container:timeupdate';
  /**
   * Fired when the container is downloading the media
   *
   * @event CONTAINER_PROGRESS
   * @param {Object} progress Data
   * progress object
   * @param {Number} [progress.start]
   * initial downloaded content
   * @param {Number} [progress.current]
   * current dowloaded content
   * @param {Number} [progress.total]
   * total content to be downloaded
   */

  Events.CONTAINER_PROGRESS = 'container:progress';
  Events.CONTAINER_PLAY = 'container:play';
  Events.CONTAINER_STOP = 'container:stop';
  Events.CONTAINER_PAUSE = 'container:pause';
  Events.CONTAINER_ENDED = 'container:ended';
  Events.CONTAINER_CLICK = 'container:click';
  Events.CONTAINER_DBLCLICK = 'container:dblclick';
  Events.CONTAINER_CONTEXTMENU = 'container:contextmenu';
  Events.CONTAINER_MOUSE_ENTER = 'container:mouseenter';
  Events.CONTAINER_MOUSE_LEAVE = 'container:mouseleave';
  /**
   * Fired when the container seeks the video
   *
   * @event CONTAINER_SEEK
   * @param {Number} time the current time in seconds
   */

  Events.CONTAINER_SEEK = 'container:seek';
  /**
   * Fired when the container was finished the seek video
   *
   * @event CONTAINER_SEEKED
   * @param {Number} time the current time in seconds
   */

  Events.CONTAINER_SEEKED = 'container:seeked';
  Events.CONTAINER_VOLUME = 'container:volume';
  Events.CONTAINER_FULLSCREEN = 'container:fullscreen';
  /**
   * Fired when container is buffering
   *
   * @event CONTAINER_STATE_BUFFERING
   */

  Events.CONTAINER_STATE_BUFFERING = 'container:state:buffering';
  /**
   * Fired when the container filled the buffer
   *
   * @event CONTAINER_STATE_BUFFERFULL
   */

  Events.CONTAINER_STATE_BUFFERFULL = 'container:state:bufferfull';
  /**
   * Fired when the container changes any settings (volume, seek and etc)
   *
   * @event CONTAINER_SETTINGSUPDATE
   */

  Events.CONTAINER_SETTINGSUPDATE = 'container:settingsupdate';
  /**
   * Fired when container updates its video quality
   *
   * @event CONTAINER_HIGHDEFINITIONUPDATE
   * @param {Boolean} isHD
   * true when is on HD, false otherwise
   */

  Events.CONTAINER_HIGHDEFINITIONUPDATE = 'container:highdefinitionupdate';
  /**
   * Fired when the media control shows
   *
   * @event CONTAINER_MEDIACONTROL_SHOW
   */

  Events.CONTAINER_MEDIACONTROL_SHOW = 'container:mediacontrol:show';
  /**
   * Fired when the media control hides
   *
   * @event CONTAINER_MEDIACONTROL_HIDE
   */

  Events.CONTAINER_MEDIACONTROL_HIDE = 'container:mediacontrol:hide';
  Events.CONTAINER_MEDIACONTROL_DISABLE = 'container:mediacontrol:disable';
  Events.CONTAINER_MEDIACONTROL_ENABLE = 'container:mediacontrol:enable';
  Events.CONTAINER_STATS_ADD = 'container:stats:add';
  /**
   * Fired when the options were changed for the container
   *
   * @event CONTAINER_OPTIONS_CHANGE
   */

  Events.CONTAINER_OPTIONS_CHANGE = 'container:options:change'; // MediaControl Events

  Events.MEDIACONTROL_RENDERED = 'mediacontrol:rendered';
  /**
   * Fired when the player enters/exit on fullscreen
   *
   * @event MEDIACONTROL_FULLSCREEN
   */

  Events.MEDIACONTROL_FULLSCREEN = 'mediacontrol:fullscreen';
  /**
   * Fired when the media control shows
   *
   * @event MEDIACONTROL_SHOW
   */

  Events.MEDIACONTROL_SHOW = 'mediacontrol:show';
  /**
   * Fired when the media control hides
   *
   * @event MEDIACONTROL_HIDE
   */

  Events.MEDIACONTROL_HIDE = 'mediacontrol:hide';
  /**
   * Fired when mouse enters on the seekbar
   *
   * @event MEDIACONTROL_MOUSEMOVE_SEEKBAR
   * @param {Object} event
   * the javascript event
   */

  Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR = 'mediacontrol:mousemove:seekbar';
  /**
   * Fired when mouse leaves the seekbar
   *
   * @event MEDIACONTROL_MOUSELEAVE_SEEKBAR
   * @param {Object} event
   * the javascript event
   */

  Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR = 'mediacontrol:mouseleave:seekbar';
  /**
   * Fired when the media is being played
   *
   * @event MEDIACONTROL_PLAYING
   */

  Events.MEDIACONTROL_PLAYING = 'mediacontrol:playing';
  /**
   * Fired when the media is not being played
   *
   * @event MEDIACONTROL_NOTPLAYING
   */

  Events.MEDIACONTROL_NOTPLAYING = 'mediacontrol:notplaying';
  /**
   * Fired when the container was changed
   *
   * @event MEDIACONTROL_CONTAINERCHANGED
   */

  Events.MEDIACONTROL_CONTAINERCHANGED = 'mediacontrol:containerchanged';
  /**
   * Fired when the options were changed for the mediacontrol
   *
   * @event MEDIACONTROL_OPTIONS_CHANGE
   */

  Events.MEDIACONTROL_OPTIONS_CHANGE = 'mediacontrol:options:change';

  /**
   * @class BaseObject
   * @constructor
   * @extends Events
   * @module base
   */

  var BaseObject =
  /*#__PURE__*/
  function (_Events) {
    _inherits(BaseObject, _Events);

    _createClass(BaseObject, [{
      key: "options",

      /**
       * returns the object options
       * @property options
       * @type Object
       */
      get: function get() {
        return this._options;
      }
      /**
       * @method constructor
       * @param {Object} options
       */

    }]);

    function BaseObject() {
      var _this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, BaseObject);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(BaseObject).call(this, options));
      _this._options = options;
      _this.uniqueId = uniqueId('o');
      return _this;
    }
    /**
    * a unique id prefixed with `'o'`, `o1, o232`
    *
    * @property uniqueId
    * @type String
    */


    return BaseObject;
  }(Events);

  var delegateEventSplitter = /^(\S+)\s*(.*)$/;
  /**
   * A base class to create ui object.
   * @class UIObject
   * @constructor
   * @extends BaseObject
   * @module base
   */

  var UIObject =
  /*#__PURE__*/
  function (_BaseObject) {
    _inherits(UIObject, _BaseObject);

    _createClass(UIObject, [{
      key: "tagName",

      /**
       * a unique id prefixed with `'c'`, `c1, c232`
       *
       * @property cid
       * @type String
       */

      /**
       * the dom element itself
       *
       * @property el
       * @type HTMLElement
       */

      /**
       * the dom element wrapped by `$`
       *
       * @property $el
       * @type HTMLElement
       */

      /**
       * gets the tag name for the ui component
       * @method tagName
       * @default div
       * @return {String} tag's name
       */
      get: function get() {
        return 'div';
      }
      /**
       * a literal object mapping element's events to methods
       * @property events
       * @type Object
       * @example
       *
       *```javascript
       *
       * class MyButton extends UIObject {
       *   constructor(options) {
       *     super(options)
       *     this.myId = 0
       *   }
       *   get events() { return { 'click': 'myClick' } }
       *   myClick(){ this.myId = 42 }
       * }
       *
       * // when you click on MyButton the method `myClick` will be called
       *```
       */

    }, {
      key: "events",
      get: function get() {
        return {};
      }
      /**
       * a literal object mapping attributes and values to the element
       * element's attribute name and the value the attribute value
       * @property attributes
       * @type Object
       * @example
       *
       *```javascript
       *
       * class MyButton extends UIObject {
       *    constructor(options) { super(options) }
       *    get attributes() { return { class: 'my-button'} }
       * }
       *
       * // MyButton.el.className will be 'my-button'
       * ```
       */

    }, {
      key: "attributes",
      get: function get() {
        return {};
      }
      /**
       * it builds an ui component by:
       *  * creating an id for the component `cid`
       *  * making sure the element is created `$el`
       *  * delegating all `events` to the element
       * @method constructor
       * @param {Object} options the options object
       */

    }]);

    function UIObject(options) {
      var _this;

      _classCallCheck(this, UIObject);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(UIObject).call(this, options));
      _this.cid = uniqueId('c');

      _this._ensureElement();

      _this.delegateEvents();

      return _this;
    }
    /**
     * selects within the component.
     * @method $
     * @param {String} selector a selector to find within the component.
     * @return {HTMLElement} an element, if it exists.
     * @example
     * ```javascript
     * fullScreenBarUIComponent.$('.button-full') //will return only `.button-full` within the component
     * ```
     */


    _createClass(UIObject, [{
      key: "$",
      value: function $(selector) {
        return this.$el.find(selector);
      }
      /**
       * render the component, usually attach it to a real existent `element`
       * @method render
       * @return {UIObject} itself
       */

    }, {
      key: "render",
      value: function render() {
        return this;
      }
      /**
       * removes the ui component from DOM
       * @method destroy
       * @return {UIObject} itself
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this.$el.remove();
        this.stopListening();
        this.undelegateEvents();
        return this;
      }
      /**
       * set element to `el` and `$el`
       * @method setElement
       * @param {HTMLElement} element
       * @param {Boolean} delegate whether is delegate or not
       * @return {UIObject} itself
       */

    }, {
      key: "setElement",
      value: function setElement(element, delegate) {
        if (this.$el) this.undelegateEvents();
        this.$el = zepto.zepto.isZ(element) ? element : zepto(element);
        this.el = this.$el[0];
        if (delegate !== false) this.delegateEvents();
        return this;
      }
      /**
       * delegates all the original `events` on `element` to its callbacks
       * @method delegateEvents
       * @param {Object} events
       * @return {UIObject} itself
       */

    }, {
      key: "delegateEvents",
      value: function delegateEvents(events) {
        if (!(events || (events = this.events))) return this;
        this.undelegateEvents();

        for (var key in events) {
          var method = events[key];
          if (method && method.constructor !== Function) method = this[events[key]];
          if (!method) continue;
          var match = key.match(delegateEventSplitter);
          var eventName = match[1],
              selector = match[2];
          eventName += '.delegateEvents' + this.cid;
          if (selector === '') this.$el.on(eventName, method.bind(this));else this.$el.on(eventName, selector, method.bind(this));
        }

        return this;
      }
      /**
       * undelegats all the `events`
       * @method undelegateEvents
       * @return {UIObject} itself
       */

    }, {
      key: "undelegateEvents",
      value: function undelegateEvents() {
        this.$el.off('.delegateEvents' + this.cid);
        return this;
      }
      /**
       * ensures the creation of this ui component
       * @method _ensureElement
       * @private
       */

    }, {
      key: "_ensureElement",
      value: function _ensureElement() {
        if (!this.el) {
          var attrs = zepto.extend({}, this.attributes);
          if (this.id) attrs.id = this.id;
          if (this.className) attrs['class'] = this.className;
          var $el = DomRecycler.create(this.tagName).attr(attrs);
          this.setElement($el, false);
        } else {
          this.setElement(this.el, false);
        }
      }
    }]);

    return UIObject;
  }(BaseObject);

  /**
   * The PlayerError is responsible to receive and propagate errors.
   * @class PlayerError
   * @constructor
   * @extends BaseObject
   * @module components
   */

  var PlayerError =
  /*#__PURE__*/
  function (_BaseObject) {
    _inherits(PlayerError, _BaseObject);

    _createClass(PlayerError, [{
      key: "name",
      get: function get() {
        return 'error';
      }
      /**
       * @property Levels
       * @type {Object} object with error levels
       */

    }], [{
      key: "Levels",
      get: function get() {
        return {
          FATAL: 'FATAL',
          WARN: 'WARN',
          INFO: 'INFO'
        };
      }
    }]);

    function PlayerError() {
      var _this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var core = arguments.length > 1 ? arguments[1] : undefined;

      _classCallCheck(this, PlayerError);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PlayerError).call(this, options));
      _this.core = core;
      return _this;
    }
    /**
     * creates and trigger an error.
     * @method createError
     * @param {Object} err should be an object with code, description, level, origin, scope and raw error.
     */


    _createClass(PlayerError, [{
      key: "createError",
      value: function createError(err) {
        if (!this.core) {
          Log.warn(this.name, 'Core is not set. Error: ', err);
          return;
        }

        this.core.trigger(Events.ERROR, err);
      }
    }]);

    return PlayerError;
  }(BaseObject);

  var ErrorMixin = {
    /**
     * creates an error.
     * @method createError
     * @param {Object} error should be an object with code, description, level and raw error.
     * @return {Object} Object with formatted error data including origin and scope
     */
    createError: function createError(error) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        useCodePrefix: true
      };
      var scope = this.constructor && this.constructor.type || '';
      var origin = this.name || scope;
      var i18n = this.i18n || this.core && this.core.i18n || this.container && this.container.i18n;
      var prefixedCode = "".concat(origin, ":").concat(error && error.code || 'unknown');
      var defaultError = {
        description: '',
        level: PlayerError.Levels.FATAL,
        origin: origin,
        scope: scope,
        raw: {}
      };
      var errorData = Object.assign({}, defaultError, error, {
        code: options.useCodePrefix ? prefixedCode : error.code
      });

      if (i18n && errorData.level == PlayerError.Levels.FATAL && !errorData.UI) {
        var defaultUI = {
          title: i18n.t('default_error_title'),
          message: i18n.t('default_error_message')
        };
        errorData.UI = defaultUI;
      }

      if (this.playerError) this.playerError.createError(errorData);else Log.warn(origin, 'PlayerError is not defined. Error: ', errorData);
      return errorData;
    }
  };

  var UICorePlugin =
  /*#__PURE__*/
  function (_UIObject) {
    _inherits(UICorePlugin, _UIObject);

    _createClass(UICorePlugin, [{
      key: "playerError",
      get: function get() {
        return this.core.playerError;
      }
    }]);

    function UICorePlugin(core) {
      var _this;

      _classCallCheck(this, UICorePlugin);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(UICorePlugin).call(this, core.options));
      _this.core = core;
      _this.enabled = true;

      _this.bindEvents();

      _this.render();

      return _this;
    }

    _createClass(UICorePlugin, [{
      key: "bindEvents",
      value: function bindEvents() {}
    }, {
      key: "getExternalInterface",
      value: function getExternalInterface() {
        return {};
      }
    }, {
      key: "enable",
      value: function enable() {
        if (!this.enabled) {
          this.bindEvents();
          this.$el.show();
          this.enabled = true;
        }
      }
    }, {
      key: "disable",
      value: function disable() {
        this.stopListening();
        this.$el.hide();
        this.enabled = false;
      }
    }, {
      key: "render",
      value: function render() {
        return this;
      }
    }]);

    return UICorePlugin;
  }(UIObject);
  Object.assign(UICorePlugin.prototype, ErrorMixin);

  UICorePlugin.extend = function (properties) {
    return extend(UICorePlugin, properties);
  };

  UICorePlugin.type = 'core';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = ".container[data-container] {\n  position: absolute;\n  background-color: black;\n  height: 100%;\n  width: 100%;\n  max-width: 100%; }\n  .container[data-container] .chromeless {\n    cursor: default; }\n\n[data-player]:not(.nocursor) .container[data-container]:not(.chromeless).pointer-enabled {\n  cursor: pointer; }\n";
  styleInject(css);

  /**
   * An abstraction to represent a container for a given playback
   * TODO: describe its responsabilities
   * @class Container
   * @constructor
   * @extends UIObject
   * @module base
   */

  var Container =
  /*#__PURE__*/
  function (_UIObject) {
    _inherits(Container, _UIObject);

    _createClass(Container, [{
      key: "name",

      /**
       * container's name
       * @method name
       * @default Container
       * @return {String} container's name
       */
      get: function get() {
        return 'Container';
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          "class": 'container',
          'data-container': ''
        };
      }
    }, {
      key: "events",
      get: function get() {
        return {
          'click': 'clicked',
          'dblclick': 'dblClicked',
          'touchend': 'dblTap',
          'contextmenu': 'onContextMenu',
          'mouseenter': 'mouseEnter',
          'mouseleave': 'mouseLeave'
        };
      }
      /**
       * Determine if the playback has ended.
       * @property ended
       * @type Boolean
       */

    }, {
      key: "ended",
      get: function get() {
        return this.playback.ended;
      }
      /**
       * Determine if the playback is having to buffer in order for
       * playback to be smooth.
       * (i.e if a live stream is playing smoothly, this will be false)
       * @property buffering
       * @type Boolean
       */

    }, {
      key: "buffering",
      get: function get() {
        return this.playback.buffering;
      }
      /**
       * The internationalization plugin.
       * @property i18n
       * @type {Strings}
       */

    }, {
      key: "i18n",
      get: function get() {
        return this._i18n;
      }
      /**
       * checks if has closed caption tracks.
       * @property hasClosedCaptionsTracks
       * @type {Boolean}
       */

    }, {
      key: "hasClosedCaptionsTracks",
      get: function get() {
        return this.playback.hasClosedCaptionsTracks;
      }
      /**
       * gets the available closed caption tracks.
       * @property closedCaptionsTracks
       * @type {Array} an array of objects with at least 'id' and 'name' properties
       */

    }, {
      key: "closedCaptionsTracks",
      get: function get() {
        return this.playback.closedCaptionsTracks;
      }
      /**
       * gets the selected closed caption track index. (-1 is disabled)
       * @property closedCaptionsTrackId
       * @type {Number}
       */

    }, {
      key: "closedCaptionsTrackId",
      get: function get() {
        return this.playback.closedCaptionsTrackId;
      }
      /**
       * sets the selected closed caption track index. (-1 is disabled)
       * @property closedCaptionsTrackId
       * @type {Number}
       */
      ,
      set: function set(trackId) {
        this.playback.closedCaptionsTrackId = trackId;
      }
      /**
       * it builds a container
       * @method constructor
       * @param {Object} options the options object
       * @param {Strings} i18n the internationalization component
       */

    }]);

    function Container(options, i18n, playerError) {
      var _this;

      _classCallCheck(this, Container);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Container).call(this, options));
      _this._i18n = i18n;
      _this.currentTime = 0;
      _this.volume = 100;
      _this.playback = options.playback;
      _this.playerError = playerError;
      _this.settings = zepto.extend({}, _this.playback.settings);
      _this.isReady = false;
      _this.mediaControlDisabled = false;
      _this.plugins = [_this.playback];
      _this.dblTapHandler = new DoubleEventHandler(500);
      _this.clickTimer = null;
      _this.clickDelay = 200; // FIXME: could be a player option

      _this.bindEvents();

      return _this;
    }
    /**
     * binds playback events to the methods of the container.
     * it listens to playback's events and triggers them as container events.
     *
     * | Playback |
     * |----------|
     * | progress |
     * | timeupdate |
     * | ready |
     * | buffering |
     * | bufferfull |
     * | settingsupdate |
     * | loadedmetadata |
     * | highdefinitionupdate |
     * | bitrate |
     * | playbackstate |
     * | dvr |
     * | mediacontrol_disable |
     * | mediacontrol_enable |
     * | ended |
     * | play |
     * | pause |
     * | error |
     *
     * ps: the events usually translate from PLABACK_x to CONTAINER_x, you can check all the events at `Event` class.
     *
     * @method bindEvents
     */


    _createClass(Container, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.playback, Events.PLAYBACK_PROGRESS, this.onProgress);
        this.listenTo(this.playback, Events.PLAYBACK_TIMEUPDATE, this.timeUpdated);
        this.listenTo(this.playback, Events.PLAYBACK_READY, this.ready);
        this.listenTo(this.playback, Events.PLAYBACK_BUFFERING, this.onBuffering);
        this.listenTo(this.playback, Events.PLAYBACK_BUFFERFULL, this.bufferfull);
        this.listenTo(this.playback, Events.PLAYBACK_SETTINGSUPDATE, this.settingsUpdate);
        this.listenTo(this.playback, Events.PLAYBACK_LOADEDMETADATA, this.loadedMetadata);
        this.listenTo(this.playback, Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinitionUpdate);
        this.listenTo(this.playback, Events.PLAYBACK_BITRATE, this.updateBitrate);
        this.listenTo(this.playback, Events.PLAYBACK_PLAYBACKSTATE, this.playbackStateChanged);
        this.listenTo(this.playback, Events.PLAYBACK_DVR, this.playbackDvrStateChanged);
        this.listenTo(this.playback, Events.PLAYBACK_MEDIACONTROL_DISABLE, this.disableMediaControl);
        this.listenTo(this.playback, Events.PLAYBACK_MEDIACONTROL_ENABLE, this.enableMediaControl);
        this.listenTo(this.playback, Events.PLAYBACK_SEEKED, this.onSeeked);
        this.listenTo(this.playback, Events.PLAYBACK_ENDED, this.onEnded);
        this.listenTo(this.playback, Events.PLAYBACK_PLAY, this.playing);
        this.listenTo(this.playback, Events.PLAYBACK_PAUSE, this.paused);
        this.listenTo(this.playback, Events.PLAYBACK_STOP, this.stopped);
        this.listenTo(this.playback, Events.PLAYBACK_ERROR, this.error);
        this.listenTo(this.playback, Events.PLAYBACK_SUBTITLE_AVAILABLE, this.subtitleAvailable);
        this.listenTo(this.playback, Events.PLAYBACK_SUBTITLE_CHANGED, this.subtitleChanged);
      }
    }, {
      key: "subtitleAvailable",
      value: function subtitleAvailable() {
        this.trigger(Events.CONTAINER_SUBTITLE_AVAILABLE);
      }
    }, {
      key: "subtitleChanged",
      value: function subtitleChanged(track) {
        this.trigger(Events.CONTAINER_SUBTITLE_CHANGED, track);
      }
    }, {
      key: "playbackStateChanged",
      value: function playbackStateChanged(state) {
        this.trigger(Events.CONTAINER_PLAYBACKSTATE, state);
      }
    }, {
      key: "playbackDvrStateChanged",
      value: function playbackDvrStateChanged(dvrInUse) {
        this.settings = this.playback.settings;
        this.dvrInUse = dvrInUse;
        this.trigger(Events.CONTAINER_PLAYBACKDVRSTATECHANGED, dvrInUse);
      }
    }, {
      key: "updateBitrate",
      value: function updateBitrate(newBitrate) {
        this.trigger(Events.CONTAINER_BITRATE, newBitrate);
      }
    }, {
      key: "statsReport",
      value: function statsReport(metrics) {
        this.trigger(Events.CONTAINER_STATS_REPORT, metrics);
      }
    }, {
      key: "getPlaybackType",
      value: function getPlaybackType() {
        return this.playback.getPlaybackType();
      }
      /**
       * returns `true` if DVR is enable otherwise `false`.
       * @method isDvrEnabled
       * @return {Boolean}
       */

    }, {
      key: "isDvrEnabled",
      value: function isDvrEnabled() {
        return !!this.playback.dvrEnabled;
      }
      /**
       * returns `true` if DVR is in use otherwise `false`.
       * @method isDvrInUse
       * @return {Boolean}
       */

    }, {
      key: "isDvrInUse",
      value: function isDvrInUse() {
        return !!this.dvrInUse;
      }
      /**
       * destroys the container
       * @method destroy
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this.disableResizeObserver();
        this.trigger(Events.CONTAINER_DESTROYED, this, this.name);
        this.stopListening();
        this.plugins.forEach(function (plugin) {
          return plugin.destroy();
        });
        this.$el.remove();
      }
    }, {
      key: "setStyle",
      value: function setStyle(style) {
        this.$el.css(style);
      }
    }, {
      key: "animate",
      value: function animate(style, duration) {
        return this.$el.animate(style, duration).promise();
      }
    }, {
      key: "ready",
      value: function ready() {
        this.isReady = true;
        this.trigger(Events.CONTAINER_READY, this.name);
      }
    }, {
      key: "isPlaying",
      value: function isPlaying() {
        return this.playback.isPlaying();
      }
    }, {
      key: "getStartTimeOffset",
      value: function getStartTimeOffset() {
        return this.playback.getStartTimeOffset();
      }
    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        return this.currentTime;
      }
    }, {
      key: "getDuration",
      value: function getDuration() {
        return this.playback.getDuration();
      }
    }, {
      key: "error",
      value: function error(_error) {
        if (!this.isReady) this.ready();
        this.trigger(Events.CONTAINER_ERROR, _error, this.name);
      }
    }, {
      key: "loadedMetadata",
      value: function loadedMetadata(metadata) {
        this.trigger(Events.CONTAINER_LOADEDMETADATA, metadata);
      }
    }, {
      key: "timeUpdated",
      value: function timeUpdated(timeProgress) {
        this.currentTime = timeProgress.current;
        this.trigger(Events.CONTAINER_TIMEUPDATE, timeProgress, this.name);
      }
    }, {
      key: "onProgress",
      value: function onProgress() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        this.trigger.apply(this, [Events.CONTAINER_PROGRESS].concat(args, [this.name]));
      }
    }, {
      key: "playing",
      value: function playing() {
        this.trigger(Events.CONTAINER_PLAY, this.name);
      }
    }, {
      key: "paused",
      value: function paused() {
        this.trigger(Events.CONTAINER_PAUSE, this.name);
      }
      /**
       * plays the playback
       * @method play
       */

    }, {
      key: "play",
      value: function play() {
        this.playback.play();
      }
      /**
       * stops the playback
       * @method stop
       */

    }, {
      key: "stop",
      value: function stop() {
        this.playback.stop();
        this.currentTime = 0;
      }
      /**
       * pauses the playback
       * @method pause
       */

    }, {
      key: "pause",
      value: function pause() {
        this.playback.pause();
      }
    }, {
      key: "onEnded",
      value: function onEnded() {
        this.trigger(Events.CONTAINER_ENDED, this, this.name);
        this.currentTime = 0;
      }
    }, {
      key: "stopped",
      value: function stopped() {
        this.trigger(Events.CONTAINER_STOP);
      }
    }, {
      key: "clicked",
      value: function clicked() {
        var _this2 = this;

        if (!this.options.chromeless || this.options.allowUserInteraction) {
          // The event is delayed because it can be canceled by a double-click event
          // An example of use is to prevent playback from pausing when switching to full screen
          this.clickTimer = setTimeout(function () {
            _this2.clickTimer && _this2.trigger(Events.CONTAINER_CLICK, _this2, _this2.name);
          }, this.clickDelay);
        }
      }
    }, {
      key: "cancelClicked",
      value: function cancelClicked() {
        clearTimeout(this.clickTimer);
        this.clickTimer = null;
      }
    }, {
      key: "dblClicked",
      value: function dblClicked() {
        if (!this.options.chromeless || this.options.allowUserInteraction) {
          this.cancelClicked();
          this.trigger(Events.CONTAINER_DBLCLICK, this, this.name);
        }
      }
    }, {
      key: "dblTap",
      value: function dblTap(evt) {
        var _this3 = this;

        if (!this.options.chromeless || this.options.allowUserInteraction) {
          this.dblTapHandler.handle(evt, function () {
            _this3.cancelClicked();

            _this3.trigger(Events.CONTAINER_DBLCLICK, _this3, _this3.name);
          });
        }
      }
    }, {
      key: "onContextMenu",
      value: function onContextMenu(event) {
        if (!this.options.chromeless || this.options.allowUserInteraction) this.trigger(Events.CONTAINER_CONTEXTMENU, event, this.name);
      }
    }, {
      key: "seek",
      value: function seek(time) {
        this.trigger(Events.CONTAINER_SEEK, time, this.name);
        this.playback.seek(time);
      }
    }, {
      key: "onSeeked",
      value: function onSeeked() {
        this.trigger(Events.CONTAINER_SEEKED, this.name);
      }
    }, {
      key: "seekPercentage",
      value: function seekPercentage(percentage) {
        var duration = this.getDuration();

        if (percentage >= 0 && percentage <= 100) {
          var time = duration * (percentage / 100);
          this.seek(time);
        }
      }
    }, {
      key: "setVolume",
      value: function setVolume(value) {
        this.volume = parseFloat(value);
        this.trigger(Events.CONTAINER_VOLUME, this.volume, this.name);
        this.playback.volume(this.volume);
      }
    }, {
      key: "fullscreen",
      value: function fullscreen() {
        this.trigger(Events.CONTAINER_FULLSCREEN, this.name);
      }
    }, {
      key: "onBuffering",
      value: function onBuffering() {
        this.trigger(Events.CONTAINER_STATE_BUFFERING, this.name);
      }
    }, {
      key: "bufferfull",
      value: function bufferfull() {
        this.trigger(Events.CONTAINER_STATE_BUFFERFULL, this.name);
      }
      /**
       * adds plugin to the container
       * @method addPlugin
       * @param {Object} plugin
       */

    }, {
      key: "addPlugin",
      value: function addPlugin(plugin) {
        this.plugins.push(plugin);
      }
      /**
       * checks if a plugin, given its name, exist
       * @method hasPlugin
       * @param {String} name
       * @return {Boolean}
       */

    }, {
      key: "hasPlugin",
      value: function hasPlugin(name) {
        return !!this.getPlugin(name);
      }
      /**
       * get the plugin given its name
       * @method getPlugin
       * @param {String} name
       */

    }, {
      key: "getPlugin",
      value: function getPlugin(name) {
        return this.plugins.filter(function (plugin) {
          return plugin.name === name;
        })[0];
      }
    }, {
      key: "mouseEnter",
      value: function mouseEnter() {
        if (!this.options.chromeless || this.options.allowUserInteraction) this.trigger(Events.CONTAINER_MOUSE_ENTER);
      }
    }, {
      key: "mouseLeave",
      value: function mouseLeave() {
        if (!this.options.chromeless || this.options.allowUserInteraction) this.trigger(Events.CONTAINER_MOUSE_LEAVE);
      }
    }, {
      key: "settingsUpdate",
      value: function settingsUpdate() {
        this.settings = this.playback.settings;
        this.trigger(Events.CONTAINER_SETTINGSUPDATE);
      }
    }, {
      key: "highDefinitionUpdate",
      value: function highDefinitionUpdate(isHD) {
        this.trigger(Events.CONTAINER_HIGHDEFINITIONUPDATE, isHD);
      }
    }, {
      key: "isHighDefinitionInUse",
      value: function isHighDefinitionInUse() {
        return this.playback.isHighDefinitionInUse();
      }
    }, {
      key: "disableMediaControl",
      value: function disableMediaControl() {
        if (!this.mediaControlDisabled) {
          this.mediaControlDisabled = true;
          this.trigger(Events.CONTAINER_MEDIACONTROL_DISABLE);
        }
      }
    }, {
      key: "enableMediaControl",
      value: function enableMediaControl() {
        if (this.mediaControlDisabled) {
          this.mediaControlDisabled = false;
          this.trigger(Events.CONTAINER_MEDIACONTROL_ENABLE);
        }
      }
    }, {
      key: "updateStyle",
      value: function updateStyle() {
        if (!this.options.chromeless || this.options.allowUserInteraction) this.$el.removeClass('chromeless');else this.$el.addClass('chromeless');
      }
    }, {
      key: "enableResizeObserver",
      value: function enableResizeObserver() {
        var _this4 = this;

        this.disableResizeObserver();
        this.resizeObserverInterval = setInterval(function () {
          return _this4.checkResize();
        }, 500);
      }
    }, {
      key: "disableResizeObserver",
      value: function disableResizeObserver() {
        this.resizeObserverInterval && clearInterval(this.resizeObserverInterval);
      }
    }, {
      key: "checkResize",
      value: function checkResize() {
        var newSize = {
          width: this.el.clientWidth,
          height: this.el.clientHeight
        };

        var _ref = this.currentSize || {},
            width = _ref.width,
            height = _ref.height;

        var isResize = height !== newSize.height || width !== newSize.width;

        if (isResize) {
          this.currentSize = newSize;
          this.trigger(Events.CONTAINER_RESIZE, newSize);
        }
      }
      /**
       * enables to configure the container after its creation
       * @method configure
       * @param {Object} options all the options to change in form of a javascript object
       */

    }, {
      key: "configure",
      value: function configure(options) {
        this._options = zepto.extend(this._options, options);
        this.updateStyle();
        this.playback.configure(this.options);
        this.trigger(Events.CONTAINER_OPTIONS_CHANGE);
      }
    }, {
      key: "render",
      value: function render() {
        this.$el.append(this.playback.render().el);
        this.updateStyle();
        this.enableResizeObserver();
        return this;
      }
    }]);

    return Container;
  }(UIObject);
  Object.assign(Container.prototype, ErrorMixin);

  /**
   * An abstraction to represent a generic playback, it's like an interface to be implemented by subclasses.
   * @class Playback
   * @constructor
   * @extends UIObject
   * @module base
   */

  var Playback =
  /*#__PURE__*/
  function (_UIObject) {
    _inherits(Playback, _UIObject);

    _createClass(Playback, [{
      key: "isAudioOnly",

      /**
      * Determine if the playback does not contain video/has video but video should be ignored.
      * @property isAudioOnly
      * @type Boolean
      */
      get: function get() {
        return false;
      }
    }, {
      key: "isAdaptive",
      get: function get() {
        return false;
      }
      /**
       * Determine if the playback has ended.
       * @property ended
       * @type Boolean
       */

    }, {
      key: "ended",
      get: function get() {
        return false;
      }
      /**
       * The internationalization plugin.
       * @property i18n
       * @type {Strings}
       */

    }, {
      key: "i18n",
      get: function get() {
        return this._i18n;
      }
      /**
       * Determine if the playback is having to buffer in order for
       * playback to be smooth.
       * (i.e if a live stream is playing smoothly, this will be false)
       * @property buffering
       * @type Boolean
       */

    }, {
      key: "buffering",
      get: function get() {
        return false;
      }
      /**
       * Determine if the playback has user consent.
       * @property consented
       * @type Boolean
       */

    }, {
      key: "consented",
      get: function get() {
        return this._consented;
      }
      /**
       * @method constructor
       * @param {Object} options the options object
       * @param {Strings} i18n the internationalization component
       */

    }]);

    function Playback(options, i18n, playerError) {
      var _this;

      _classCallCheck(this, Playback);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Playback).call(this, options));
      _this.settings = {};
      _this._i18n = i18n;
      _this.playerError = playerError;
      _this._consented = false;
      return _this;
    }
    /**
     * Gives user consent to playback (mobile devices).
     * @method consent
     */


    _createClass(Playback, [{
      key: "consent",
      value: function consent() {
        this._consented = true;
      }
      /**
       * plays the playback.
       * @method play
       */

    }, {
      key: "play",
      value: function play() {}
      /**
       * pauses the playback.
       * @method pause
       */

    }, {
      key: "pause",
      value: function pause() {}
      /**
       * stops the playback.
       * @method stop
       */

    }, {
      key: "stop",
      value: function stop() {}
      /**
       * seeks the playback to a given `time` in seconds
       * @method seek
       * @param {Number} time should be a number between 0 and the video duration
       */

    }, {
      key: "seek",
      value: function seek(time) {} // eslint-disable-line no-unused-vars

      /**
       * seeks the playback to a given `percentage` in percentage
       * @method seekPercentage
       * @param {Number} time should be a number between 0 and 100
       */

    }, {
      key: "seekPercentage",
      value: function seekPercentage(percentage) {} // eslint-disable-line no-unused-vars

      /**
       * The time that "0" now represents relative to when playback started.
       * For a stream with a sliding window this will increase as content is
       * removed from the beginning.
       * @method getStartTimeOffset
       * @return {Number} time (in seconds) that time "0" represents.
       */

    }, {
      key: "getStartTimeOffset",
      value: function getStartTimeOffset() {
        return 0;
      }
      /**
       * gets the duration in seconds
       * @method getDuration
       * @return {Number} duration (in seconds) of the current source
       */

    }, {
      key: "getDuration",
      value: function getDuration() {
        return 0;
      }
      /**
       * checks if the playback is playing.
       * @method isPlaying
       * @return {Boolean} `true` if the current playback is playing, otherwise `false`
       */

    }, {
      key: "isPlaying",
      value: function isPlaying() {
        return false;
      }
      /**
       * checks if the playback is ready.
       * @property isReady
       * @type {Boolean} `true` if the current playback is ready, otherwise `false`
       */

    }, {
      key: "getPlaybackType",
      // eslint-disable-line no-unused-vars

      /**
       * gets the playback type (`'vod', 'live', 'aod'`)
       * @method getPlaybackType
       * @return {String} you should write the playback type otherwise it'll assume `'no_op'`
       * @example
       * ```javascript
       * html5VideoPlayback.getPlaybackType() //vod
       * html5AudioPlayback.getPlaybackType() //aod
       * html5VideoPlayback.getPlaybackType() //live
       * flashHlsPlayback.getPlaybackType() //live
       * ```
       */
      value: function getPlaybackType() {
        return Playback.NO_OP;
      }
      /**
       * checks if the playback is in HD.
       * @method isHighDefinitionInUse
       * @return {Boolean} `true` if the playback is playing in HD, otherwise `false`
       */

    }, {
      key: "isHighDefinitionInUse",
      value: function isHighDefinitionInUse() {
        return false;
      }
      /**
       * sets the volume for the playback
       * @method volume
       * @param {Number} value a number between 0 (`muted`) to 100 (`max`)
       */

    }, {
      key: "volume",
      value: function volume(value) {} // eslint-disable-line no-unused-vars

      /**
       * enables to configure the playback after its creation
       * @method configure
       * @param {Object} options all the options to change in form of a javascript object
       */

    }, {
      key: "configure",
      value: function configure(options) {
        this._options = zepto.extend(this._options, options);
      }
      /**
       * attempt to autoplays the playback.
       * @method attemptAutoPlay
       */

    }, {
      key: "attemptAutoPlay",
      value: function attemptAutoPlay() {
        var _this2 = this;

        this.canAutoPlay(function (result, error) {
          // eslint-disable-line no-unused-vars
          result && _this2.play();
        });
      }
      /**
       * checks if the playback can autoplay.
       * @method canAutoPlay
       * @param {Function} callback function where first param is Boolean and second param is playback Error or null
       */

    }, {
      key: "canAutoPlay",
      value: function canAutoPlay(cb) {
        cb(true, null); // Assume playback can autoplay by default
      }
    }, {
      key: "isReady",
      get: function get() {
        return false;
      }
      /**
       * checks if the playback has closed caption tracks.
       * @property hasClosedCaptionsTracks
       * @type {Boolean}
       */

    }, {
      key: "hasClosedCaptionsTracks",
      get: function get() {
        return this.closedCaptionsTracks.length > 0;
      }
      /**
       * gets the playback available closed caption tracks.
       * @property closedCaptionsTracks
       * @type {Array} an array of objects with at least 'id' and 'name' properties
       */

    }, {
      key: "closedCaptionsTracks",
      get: function get() {
        return [];
      }
      /**
       * gets the selected closed caption track index. (-1 is disabled)
       * @property closedCaptionsTrackId
       * @type {Number}
       */

    }, {
      key: "closedCaptionsTrackId",
      get: function get() {
        return -1;
      }
      /**
       * sets the selected closed caption track index. (-1 is disabled)
       * @property closedCaptionsTrackId
       * @type {Number}
       */
      ,
      set: function set(trackId) {}
    }]);

    return Playback;
  }(UIObject);
  Object.assign(Playback.prototype, ErrorMixin);

  Playback.extend = function (properties) {
    return extend(Playback, properties);
  };
  /**
   * checks if the playback can play a given `source`
   * If a mimeType is provided then this will be used instead of inferring the mimetype
   * from the source extension.
   * @method canPlay
   * @static
   * @param {String} source the given source ex: `http://example.com/play.mp4`
   * @param {String} [mimeType] the given mime type, ex: `'application/vnd.apple.mpegurl'`
   * @return {Boolean} `true` if the playback is playable, otherwise `false`
   */


  Playback.canPlay = function (source, mimeType) {
    // eslint-disable-line no-unused-vars
    return false;
  };
  /**
   * a playback type for video on demand
   *
   * @property VOD
   * @static
   * @type String
   */


  Playback.VOD = 'vod';
  /**
   * a playback type for audio on demand
   *
   * @property AOD
   * @static
   * @type String
   */

  Playback.AOD = 'aod';
  /**
   * a playback type for live video
   *
   * @property LIVE
   * @static
   * @type String
   */

  Playback.LIVE = 'live';
  /**
   * a default playback type
   *
   * @property NO_OP
   * @static
   * @type String
   */

  Playback.NO_OP = 'no_op';
  /**
   * the plugin type
   *
   * @property type
   * @static
   * @type String
   */

  Playback.type = 'playback';

  var ContainerFactory =
  /*#__PURE__*/
  function (_BaseObject) {
    _inherits(ContainerFactory, _BaseObject);

    _createClass(ContainerFactory, [{
      key: "options",
      get: function get() {
        return this._options;
      },
      set: function set(options) {
        this._options = options;
      }
    }]);

    function ContainerFactory(options, loader, i18n, playerError) {
      var _this;

      _classCallCheck(this, ContainerFactory);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ContainerFactory).call(this, options));
      _this._i18n = i18n;
      _this.loader = loader;
      _this.playerError = playerError;
      return _this;
    }

    _createClass(ContainerFactory, [{
      key: "createContainers",
      value: function createContainers() {
        var _this2 = this;

        return zepto.Deferred(function (promise) {
          promise.resolve(_this2.options.sources.map(function (source) {
            return _this2.createContainer(source);
          }));
        });
      }
    }, {
      key: "findPlaybackPlugin",
      value: function findPlaybackPlugin(source, mimeType) {
        return this.loader.playbackPlugins.filter(function (p) {
          return p.canPlay(source, mimeType);
        })[0];
      }
    }, {
      key: "createContainer",
      value: function createContainer(source) {
        var resolvedSource = null,
            mimeType = this.options.mimeType;

        if (_typeof(source) === 'object') {
          resolvedSource = source.source.toString();
          if (source.mimeType) mimeType = source.mimeType;
        } else {
          resolvedSource = source.toString();
        }

        if (resolvedSource.match(/^\/\//)) resolvedSource = window.location.protocol + resolvedSource;
        var options = zepto.extend({}, this.options, {
          src: resolvedSource,
          mimeType: mimeType
        });
        var playbackPlugin = this.findPlaybackPlugin(resolvedSource, mimeType); // Fallback to empty playback object until we sort out unsupported sources error without NoOp playback

        var playback = playbackPlugin ? new playbackPlugin(options, this._i18n, this.playerError) : new Playback();
        options = zepto.extend({}, options, {
          playback: playback
        });
        var container = new Container(options, this._i18n, this.playerError);
        var defer = zepto.Deferred();
        defer.promise(container);
        this.addContainerPlugins(container);
        this.listenToOnce(container, Events.CONTAINER_READY, function () {
          return defer.resolve(container);
        });
        return container;
      }
    }, {
      key: "addContainerPlugins",
      value: function addContainerPlugins(container) {
        this.loader.containerPlugins.forEach(function (Plugin) {
          container.addPlugin(new Plugin(container));
        });
      }
    }]);

    return ContainerFactory;
  }(BaseObject);

  var css$1 = "[data-player] {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n  position: relative;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-style: normal;\n  font-weight: normal;\n  text-align: center;\n  overflow: hidden;\n  font-size: 100%;\n  font-family: \"Roboto\", \"Open Sans\", Arial, sans-serif;\n  text-shadow: 0 0 0;\n  box-sizing: border-box; }\n  [data-player] div, [data-player] span, [data-player] applet, [data-player] object, [data-player] iframe,\n  [data-player] h1, [data-player] h2, [data-player] h3, [data-player] h4, [data-player] h5, [data-player] h6, [data-player] p, [data-player] blockquote, [data-player] pre,\n  [data-player] a, [data-player] abbr, [data-player] acronym, [data-player] address, [data-player] big, [data-player] cite, [data-player] code,\n  [data-player] del, [data-player] dfn, [data-player] em, [data-player] img, [data-player] ins, [data-player] kbd, [data-player] q, [data-player] s, [data-player] samp,\n  [data-player] small, [data-player] strike, [data-player] strong, [data-player] sub, [data-player] sup, [data-player] tt, [data-player] var,\n  [data-player] b, [data-player] u, [data-player] i, [data-player] center,\n  [data-player] dl, [data-player] dt, [data-player] dd, [data-player] ol, [data-player] ul, [data-player] li,\n  [data-player] fieldset, [data-player] form, [data-player] label, [data-player] legend,\n  [data-player] table, [data-player] caption, [data-player] tbody, [data-player] tfoot, [data-player] thead, [data-player] tr, [data-player] th, [data-player] td,\n  [data-player] article, [data-player] aside, [data-player] canvas, [data-player] details, [data-player] embed,\n  [data-player] figure, [data-player] figcaption, [data-player] footer, [data-player] header, [data-player] hgroup,\n  [data-player] menu, [data-player] nav, [data-player] output, [data-player] ruby, [data-player] section, [data-player] summary,\n  [data-player] time, [data-player] mark, [data-player] audio, [data-player] video {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    font: inherit;\n    font-size: 100%;\n    vertical-align: baseline; }\n  [data-player] table {\n    border-collapse: collapse;\n    border-spacing: 0; }\n  [data-player] caption, [data-player] th, [data-player] td {\n    text-align: left;\n    font-weight: normal;\n    vertical-align: middle; }\n  [data-player] q, [data-player] blockquote {\n    quotes: none; }\n    [data-player] q:before, [data-player] q:after, [data-player] blockquote:before, [data-player] blockquote:after {\n      content: \"\";\n      content: none; }\n  [data-player] a img {\n    border: none; }\n  [data-player]:focus {\n    outline: 0; }\n  [data-player] * {\n    max-width: none;\n    box-sizing: inherit;\n    float: none; }\n  [data-player] div {\n    display: block; }\n  [data-player].fullscreen {\n    width: 100% !important;\n    height: 100% !important;\n    top: 0;\n    left: 0; }\n  [data-player].nocursor {\n    cursor: none; }\n\n.clappr-style {\n  display: none !important; }\n";
  styleInject(css$1);

  /**
   * The Core is responsible to manage Containers and the player state.
   * @class Core
   * @constructor
   * @extends UIObject
   * @module components
   */

  var Core =
  /*#__PURE__*/
  function (_UIObject) {
    _inherits(Core, _UIObject);

    _createClass(Core, [{
      key: "events",
      get: function get() {
        return {
          'webkitfullscreenchange': 'handleFullscreenChange',
          'mousemove': 'onMouseMove',
          'mouseleave': 'onMouseLeave'
        };
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'data-player': '',
          tabindex: 9999
        };
      }
      /**
       * checks if the core is ready.
       * @property isReady
       * @type {Boolean} `true` if the core is ready, otherwise `false`
       */

    }, {
      key: "isReady",
      get: function get() {
        return !!this.ready;
      }
      /**
       * The internationalization plugin.
       * @property i18n
       * @type {Strings}
       */

    }, {
      key: "i18n",
      get: function get() {
        return this.getPlugin('strings') || {
          t: function t(key) {
            return key;
          }
        };
      }
      /**
       * @deprecated
       * This property currently exists for retrocompatibility reasons.
       * If you want to access the media control instance, use the method getPlugin('media_control').
       */

    }, {
      key: "mediaControl",
      get: function get() {
        return this.getPlugin('media_control') || this.dummyMediaControl;
      }
    }, {
      key: "dummyMediaControl",
      get: function get() {
        if (this._dummyMediaControl) return this._dummyMediaControl;
        this._dummyMediaControl = new UICorePlugin(this);
        return this._dummyMediaControl;
      }
      /**
       * gets the active container reference.
       * @property activeContainer
       * @type {Object}
       */

    }, {
      key: "activeContainer",
      get: function get() {
        return this._activeContainer;
      }
      /**
       * sets the active container reference and trigger a event with the new reference.
       * @property activeContainer
       * @type {Object}
       */
      ,
      set: function set(container) {
        this._activeContainer = container;
        this.trigger(Events.CORE_ACTIVE_CONTAINER_CHANGED, this._activeContainer);
      }
      /**
       * gets the active playback reference.
       * @property activePlayback
       * @type {Object}
       */

    }, {
      key: "activePlayback",
      get: function get() {
        return this.activeContainer && this.activeContainer.playback;
      }
    }]);

    function Core(options) {
      var _this;

      _classCallCheck(this, Core);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Core).call(this, options));
      _this.playerError = new PlayerError(options, _assertThisInitialized(_this));

      _this.configureDomRecycler();

      _this.firstResize = true;
      _this.plugins = [];
      _this.containers = []; //FIXME fullscreen api sucks

      _this._boundFullscreenHandler = function () {
        return _this.handleFullscreenChange();
      };

      zepto(document).bind('fullscreenchange', _this._boundFullscreenHandler);
      zepto(document).bind('MSFullscreenChange', _this._boundFullscreenHandler);
      zepto(document).bind('mozfullscreenchange', _this._boundFullscreenHandler);
      Browser.isMobile && zepto(window).bind('resize', function (o) {
        _this.handleWindowResize(o);
      });
      return _this;
    }

    _createClass(Core, [{
      key: "configureDomRecycler",
      value: function configureDomRecycler() {
        var recycleVideo = this.options && this.options.playback && this.options.playback.recycleVideo;
        DomRecycler.configure({
          recycleVideo: recycleVideo
        });
      }
    }, {
      key: "createContainers",
      value: function createContainers(options) {
        this.defer = zepto.Deferred();
        this.defer.promise(this);
        this.containerFactory = new ContainerFactory(options, options.loader, this.i18n, this.playerError);
        this.prepareContainers();
      }
    }, {
      key: "prepareContainers",
      value: function prepareContainers() {
        var _this2 = this;

        this.containerFactory.createContainers().then(function (containers) {
          return _this2.setupContainers(containers);
        }).then(function (containers) {
          return _this2.resolveOnContainersReady(containers);
        });
      }
    }, {
      key: "updateSize",
      value: function updateSize() {
        this.isFullscreen() ? this.setFullscreen() : this.setPlayerSize();
      }
    }, {
      key: "setFullscreen",
      value: function setFullscreen() {
        if (!Browser.isiOS) {
          this.$el.addClass('fullscreen');
          this.$el.removeAttr('style');
          this.previousSize = {
            width: this.options.width,
            height: this.options.height
          };
          this.currentSize = {
            width: zepto(window).width(),
            height: zepto(window).height()
          };
        }
      }
    }, {
      key: "setPlayerSize",
      value: function setPlayerSize() {
        this.$el.removeClass('fullscreen');
        this.currentSize = this.previousSize;
        this.previousSize = {
          width: zepto(window).width(),
          height: zepto(window).height()
        };
        this.resize(this.currentSize);
      }
    }, {
      key: "resize",
      value: function resize(options) {
        if (!isNumber(options.height) && !isNumber(options.width)) {
          this.el.style.height = "".concat(options.height);
          this.el.style.width = "".concat(options.width);
        } else {
          this.el.style.height = "".concat(options.height, "px");
          this.el.style.width = "".concat(options.width, "px");
        }

        this.previousSize = {
          width: this.options.width,
          height: this.options.height
        };
        this.options.width = options.width;
        this.options.height = options.height;
        this.currentSize = options;
        this.triggerResize(this.currentSize);
      }
    }, {
      key: "enableResizeObserver",
      value: function enableResizeObserver() {
        var _this3 = this;

        var checkSizeCallback = function checkSizeCallback() {
          _this3.triggerResize({
            width: _this3.el.clientWidth,
            height: _this3.el.clientHeight
          });
        };

        this.resizeObserverInterval = setInterval(checkSizeCallback, 500);
      }
    }, {
      key: "triggerResize",
      value: function triggerResize(newSize) {
        var thereWasChange = this.firstResize || this.oldHeight !== newSize.height || this.oldWidth !== newSize.width;

        if (thereWasChange) {
          this.oldHeight = newSize.height;
          this.oldWidth = newSize.width;
          this.computedSize = newSize;
          this.firstResize = false;
          this.trigger(Events.CORE_RESIZE, newSize);
        }
      }
    }, {
      key: "disableResizeObserver",
      value: function disableResizeObserver() {
        this.resizeObserverInterval && clearInterval(this.resizeObserverInterval);
      }
    }, {
      key: "resolveOnContainersReady",
      value: function resolveOnContainersReady(containers) {
        var _this4 = this;

        zepto.when.apply(zepto, containers).done(function () {
          _this4.defer.resolve(_this4);

          _this4.ready = true;

          _this4.trigger(Events.CORE_READY);
        });
      }
    }, {
      key: "addPlugin",
      value: function addPlugin(plugin) {
        this.plugins.push(plugin);
      }
    }, {
      key: "hasPlugin",
      value: function hasPlugin(name) {
        return !!this.getPlugin(name);
      }
    }, {
      key: "getPlugin",
      value: function getPlugin(name) {
        return this.plugins.filter(function (plugin) {
          return plugin.name === name;
        })[0];
      }
    }, {
      key: "load",
      value: function load(sources, mimeType) {
        this.options.mimeType = mimeType;
        sources = sources && sources.constructor === Array ? sources : [sources];
        this.options.sources = sources;
        this.containers.forEach(function (container) {
          return container.destroy();
        });
        this.containerFactory.options = zepto.extend(this.options, {
          sources: sources
        });
        this.prepareContainers();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.disableResizeObserver();
        this.containers.forEach(function (container) {
          return container.destroy();
        });
        this.plugins.forEach(function (plugin) {
          return plugin.destroy();
        });
        this.$el.remove();
        zepto(document).unbind('fullscreenchange', this._boundFullscreenHandler);
        zepto(document).unbind('MSFullscreenChange', this._boundFullscreenHandler);
        zepto(document).unbind('mozfullscreenchange', this._boundFullscreenHandler);
        this.stopListening();
      }
    }, {
      key: "handleFullscreenChange",
      value: function handleFullscreenChange() {
        this.trigger(Events.CORE_FULLSCREEN, this.isFullscreen());
        this.updateSize();
      }
    }, {
      key: "handleWindowResize",
      value: function handleWindowResize(event) {
        var orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        if (this._screenOrientation === orientation) return;
        this._screenOrientation = orientation;
        this.triggerResize({
          width: this.el.clientWidth,
          height: this.el.clientHeight
        });
        this.trigger(Events.CORE_SCREEN_ORIENTATION_CHANGED, {
          event: event,
          orientation: this._screenOrientation
        });
      }
    }, {
      key: "removeContainer",
      value: function removeContainer(container) {
        this.stopListening(container);
        this.containers = this.containers.filter(function (c) {
          return c !== container;
        });
      }
    }, {
      key: "setupContainer",
      value: function setupContainer(container) {
        this.listenTo(container, Events.CONTAINER_DESTROYED, this.removeContainer);
        this.containers.push(container);
      }
    }, {
      key: "setupContainers",
      value: function setupContainers(containers) {
        containers.forEach(this.setupContainer.bind(this));
        this.trigger(Events.CORE_CONTAINERS_CREATED);
        this.renderContainers();
        this.activeContainer = containers[0];
        this.render();
        this.appendToParent();
        return this.containers;
      }
    }, {
      key: "renderContainers",
      value: function renderContainers() {
        var _this5 = this;

        this.containers.forEach(function (container) {
          return _this5.el.appendChild(container.render().el);
        });
      }
    }, {
      key: "createContainer",
      value: function createContainer(source, options) {
        var container = this.containerFactory.createContainer(source, options);
        this.setupContainer(container);
        this.el.appendChild(container.render().el);
        return container;
      }
      /**
       * @deprecated
       * This method currently exists for retrocompatibility reasons.
       * If you want the current container reference, use the activeContainer getter.
       */

    }, {
      key: "getCurrentContainer",
      value: function getCurrentContainer() {
        return this.activeContainer;
      }
      /**
       * @deprecated
       * This method currently exists for retrocompatibility reasons.
       * If you want the current playback reference, use the activePlayback getter.
       */

    }, {
      key: "getCurrentPlayback",
      value: function getCurrentPlayback() {
        return this.activePlayback;
      }
    }, {
      key: "getPlaybackType",
      value: function getPlaybackType() {
        return this.activeContainer && this.activeContainer.getPlaybackType();
      }
    }, {
      key: "isFullscreen",
      value: function isFullscreen() {
        // Ensure current instance is in fullscreen mode by checking fullscreen element
        var fullscreenElement = Fullscreen.fullscreenElement();
        if (!fullscreenElement) return false;
        var playbackEl = this.activePlayback && this.activePlayback.el;
        return fullscreenElement === this.el || fullscreenElement === playbackEl;
      }
    }, {
      key: "toggleFullscreen",
      value: function toggleFullscreen() {
        if (this.isFullscreen()) {
          Fullscreen.cancelFullscreen();
          !Browser.isiOS && this.$el.removeClass('fullscreen nocursor');
        } else {
          var fullscreenEl = Browser.isiOS ? this.activePlayback && this.activePlayback.el : this.el;
          if (!fullscreenEl) return;
          Fullscreen.requestFullscreen(fullscreenEl);
          !Browser.isiOS && this.$el.addClass('fullscreen');
        }
      }
    }, {
      key: "onMouseMove",
      value: function onMouseMove(event) {
        this.trigger(Events.CORE_MOUSE_MOVE, event);
      }
    }, {
      key: "onMouseLeave",
      value: function onMouseLeave(event) {
        this.trigger(Events.CORE_MOUSE_LEAVE, event);
      }
      /**
       * enables to configure the container after its creation
       * @method configure
       * @param {Object} options all the options to change in form of a javascript object
       */

    }, {
      key: "configure",
      value: function configure(options) {
        var _this6 = this;

        this._options = zepto.extend(this._options, options);
        this.configureDomRecycler();
        var sources = options.source || options.sources;
        sources && this.load(sources, options.mimeType || this.options.mimeType);
        this.trigger(Events.CORE_OPTIONS_CHANGE, options); // Trigger with newly provided options

        this.containers.forEach(function (container) {
          return container.configure(_this6.options);
        });
      }
    }, {
      key: "appendToParent",
      value: function appendToParent() {
        var hasCoreParent = this.$el.parent() && this.$el.parent().length;
        !hasCoreParent && this.$el.appendTo(this.options.parentElement);
      }
    }, {
      key: "render",
      value: function render() {
        this.options.width = this.options.width || this.$el.width();
        this.options.height = this.options.height || this.$el.height();
        var size = {
          width: this.options.width,
          height: this.options.height
        };
        this.previousSize = this.currentSize = this.computedSize = size;
        this.updateSize();
        this.previousSize = {
          width: this.$el.width(),
          height: this.$el.height()
        };
        this.enableResizeObserver();
        return this;
      }
    }]);

    return Core;
  }(UIObject);
  Object.assign(Core.prototype, ErrorMixin);

  /**
   * The Core Factory is responsible for instantiate the core and it's plugins.
   * @class CoreFactory
   * @constructor
   * @extends BaseObject
   * @module components
   */

  var CoreFactory =
  /*#__PURE__*/
  function (_BaseObject) {
    _inherits(CoreFactory, _BaseObject);

    _createClass(CoreFactory, [{
      key: "loader",
      get: function get() {
        return this.player.loader;
      }
      /**
       * it builds the core factory
       * @method constructor
       * @param {Player} player the player object
       */

    }]);

    function CoreFactory(player) {
      var _this;

      _classCallCheck(this, CoreFactory);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CoreFactory).call(this));
      _this.player = player;
      _this._options = player.options;
      return _this;
    }
    /**
     * creates a core and its plugins
     * @method create
     * @return {Core} created core
     */


    _createClass(CoreFactory, [{
      key: "create",
      value: function create() {
        this.options.loader = this.loader;
        this.core = new Core(this.options);
        this.addCorePlugins();
        this.core.createContainers(this.options);
        return this.core;
      }
      /**
       * given the core plugins (`loader.corePlugins`) it builds each one
       * @method addCorePlugins
       * @return {Core} the core with all plugins
       */

    }, {
      key: "addCorePlugins",
      value: function addCorePlugins() {
        var _this2 = this;

        this.loader.corePlugins.forEach(function (Plugin) {
          var plugin = new Plugin(_this2.core);

          _this2.core.addPlugin(plugin);

          _this2.setupExternalInterface(plugin);
        });
        return this.core;
      }
    }, {
      key: "setupExternalInterface",
      value: function setupExternalInterface(plugin) {
        var externalFunctions = plugin.getExternalInterface();

        for (var key in externalFunctions) {
          this.player[key] = externalFunctions[key].bind(plugin);
        }
      }
    }]);

    return CoreFactory;
  }(BaseObject);

  var global$1 = (typeof global !== "undefined" ? global :
              typeof self !== "undefined" ? self :
              typeof window !== "undefined" ? window : {});

  // shim for using process in browser
  // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  var cachedSetTimeout = defaultSetTimout;
  var cachedClearTimeout = defaultClearTimeout;
  if (typeof global$1.setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
  }
  if (typeof global$1.clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
  }

  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }


  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }



  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;

  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }

  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  function nextTick(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  }
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  var title = 'browser';
  var platform = 'browser';
  var browser = true;
  var env = {};
  var argv = [];
  var version = ''; // empty string to avoid regexp issues
  var versions = {};
  var release = {};
  var config = {};

  function noop() {}

  var on = noop;
  var addListener = noop;
  var once = noop;
  var off = noop;
  var removeListener = noop;
  var removeAllListeners = noop;
  var emit = noop;

  function binding(name) {
      throw new Error('process.binding is not supported');
  }

  function cwd () { return '/' }
  function chdir (dir) {
      throw new Error('process.chdir is not supported');
  }function umask() { return 0; }

  // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
  var performance$1 = global$1.performance || {};
  var performanceNow =
    performance$1.now        ||
    performance$1.mozNow     ||
    performance$1.msNow      ||
    performance$1.oNow       ||
    performance$1.webkitNow  ||
    function(){ return (new Date()).getTime() };

  // generate timestamp or delta
  // see http://nodejs.org/api/process.html#process_process_hrtime
  function hrtime(previousTimestamp){
    var clocktime = performanceNow.call(performance$1)*1e-3;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor((clocktime%1)*1e9);
    if (previousTimestamp) {
      seconds = seconds - previousTimestamp[0];
      nanoseconds = nanoseconds - previousTimestamp[1];
      if (nanoseconds<0) {
        seconds--;
        nanoseconds += 1e9;
      }
    }
    return [seconds,nanoseconds]
  }

  var startTime = new Date();
  function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
  }

  var process = {
    nextTick: nextTick,
    title: title,
    browser: browser,
    env: env,
    argv: argv,
    version: version,
    versions: versions,
    on: on,
    addListener: addListener,
    once: once,
    off: off,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners,
    emit: emit,
    binding: binding,
    cwd: cwd,
    chdir: chdir,
    umask: umask,
    hrtime: hrtime,
    platform: platform,
    release: release,
    config: config,
    uptime: uptime
  };

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var semver = createCommonjsModule(function (module, exports) {
  exports = module.exports = SemVer;

  var debug;
  /* istanbul ignore next */
  if (typeof process === 'object' &&
      process.env &&
      process.env.NODE_DEBUG &&
      /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
    debug = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift('SEMVER');
      console.log.apply(console, args);
    };
  } else {
    debug = function () {};
  }

  // Note: this is the semver.org version of the spec that it implements
  // Not necessarily the package version of this code.
  exports.SEMVER_SPEC_VERSION = '2.0.0';

  var MAX_LENGTH = 256;
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
    /* istanbul ignore next */ 9007199254740991;

  // Max safe segment length for coercion.
  var MAX_SAFE_COMPONENT_LENGTH = 16;

  // The actual regexps go on exports.re
  var re = exports.re = [];
  var src = exports.src = [];
  var t = exports.tokens = {};
  var R = 0;

  function tok (n) {
    t[n] = R++;
  }

  // The following Regular Expressions can be used for tokenizing,
  // validating, and parsing SemVer version strings.

  // ## Numeric Identifier
  // A single `0`, or a non-zero digit followed by zero or more digits.

  tok('NUMERICIDENTIFIER');
  src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*';
  tok('NUMERICIDENTIFIERLOOSE');
  src[t.NUMERICIDENTIFIERLOOSE] = '[0-9]+';

  // ## Non-numeric Identifier
  // Zero or more digits, followed by a letter or hyphen, and then zero or
  // more letters, digits, or hyphens.

  tok('NONNUMERICIDENTIFIER');
  src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';

  // ## Main Version
  // Three dot-separated numeric identifiers.

  tok('MAINVERSION');
  src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                     '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                     '(' + src[t.NUMERICIDENTIFIER] + ')';

  tok('MAINVERSIONLOOSE');
  src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                          '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                          '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')';

  // ## Pre-release Version Identifier
  // A numeric identifier, or a non-numeric identifier.

  tok('PRERELEASEIDENTIFIER');
  src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] +
                              '|' + src[t.NONNUMERICIDENTIFIER] + ')';

  tok('PRERELEASEIDENTIFIERLOOSE');
  src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] +
                                   '|' + src[t.NONNUMERICIDENTIFIER] + ')';

  // ## Pre-release Version
  // Hyphen, followed by one or more dot-separated pre-release version
  // identifiers.

  tok('PRERELEASE');
  src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] +
                    '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))';

  tok('PRERELEASELOOSE');
  src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] +
                         '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))';

  // ## Build Metadata Identifier
  // Any combination of digits, letters, or hyphens.

  tok('BUILDIDENTIFIER');
  src[t.BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

  // ## Build Metadata
  // Plus sign, followed by one or more period-separated build metadata
  // identifiers.

  tok('BUILD');
  src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] +
               '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))';

  // ## Full Version String
  // A main version, followed optionally by a pre-release version and
  // build metadata.

  // Note that the only major, minor, patch, and pre-release sections of
  // the version string are capturing groups.  The build metadata is not a
  // capturing group, because it should not ever be used in version
  // comparison.

  tok('FULL');
  tok('FULLPLAIN');
  src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] +
                    src[t.PRERELEASE] + '?' +
                    src[t.BUILD] + '?';

  src[t.FULL] = '^' + src[t.FULLPLAIN] + '$';

  // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  // common in the npm registry.
  tok('LOOSEPLAIN');
  src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] +
                    src[t.PRERELEASELOOSE] + '?' +
                    src[t.BUILD] + '?';

  tok('LOOSE');
  src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$';

  tok('GTLT');
  src[t.GTLT] = '((?:<|>)?=?)';

  // Something like "2.*" or "1.2.x".
  // Note that "x.x" is a valid xRange identifer, meaning "any version"
  // Only the first item is strictly required.
  tok('XRANGEIDENTIFIERLOOSE');
  src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
  tok('XRANGEIDENTIFIER');
  src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*';

  tok('XRANGEPLAIN');
  src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' +
                     '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                     '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                     '(?:' + src[t.PRERELEASE] + ')?' +
                     src[t.BUILD] + '?' +
                     ')?)?';

  tok('XRANGEPLAINLOOSE');
  src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                          '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                          '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                          '(?:' + src[t.PRERELEASELOOSE] + ')?' +
                          src[t.BUILD] + '?' +
                          ')?)?';

  tok('XRANGE');
  src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$';
  tok('XRANGELOOSE');
  src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$';

  // Coercion.
  // Extract anything that could conceivably be a part of a valid semver
  tok('COERCE');
  src[t.COERCE] = '(^|[^\\d])' +
                '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
                '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
                '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
                '(?:$|[^\\d])';
  tok('COERCERTL');
  re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g');

  // Tilde ranges.
  // Meaning is "reasonably at or greater than"
  tok('LONETILDE');
  src[t.LONETILDE] = '(?:~>?)';

  tok('TILDETRIM');
  src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+';
  re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g');
  var tildeTrimReplace = '$1~';

  tok('TILDE');
  src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$';
  tok('TILDELOOSE');
  src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$';

  // Caret ranges.
  // Meaning is "at least and backwards compatible with"
  tok('LONECARET');
  src[t.LONECARET] = '(?:\\^)';

  tok('CARETTRIM');
  src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+';
  re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g');
  var caretTrimReplace = '$1^';

  tok('CARET');
  src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$';
  tok('CARETLOOSE');
  src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$';

  // A simple gt/lt/eq thing, or just "" to indicate "any version"
  tok('COMPARATORLOOSE');
  src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$';
  tok('COMPARATOR');
  src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$';

  // An expression to strip any whitespace between the gtlt and the thing
  // it modifies, so that `> 1.2.3` ==> `>1.2.3`
  tok('COMPARATORTRIM');
  src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] +
                        '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')';

  // this one has to use the /g flag
  re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g');
  var comparatorTrimReplace = '$1$2$3';

  // Something like `1.2.3 - 1.2.4`
  // Note that these all use the loose form, because they'll be
  // checked against either the strict or loose comparator form
  // later.
  tok('HYPHENRANGE');
  src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' +
                     '\\s+-\\s+' +
                     '(' + src[t.XRANGEPLAIN] + ')' +
                     '\\s*$';

  tok('HYPHENRANGELOOSE');
  src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' +
                          '\\s+-\\s+' +
                          '(' + src[t.XRANGEPLAINLOOSE] + ')' +
                          '\\s*$';

  // Star ranges basically just allow anything at all.
  tok('STAR');
  src[t.STAR] = '(<|>)?=?\\s*\\*';

  // Compile to actual regexp objects.
  // All are flag-free, unless they were created above with a flag.
  for (var i = 0; i < R; i++) {
    debug(i, src[i]);
    if (!re[i]) {
      re[i] = new RegExp(src[i]);
    }
  }

  exports.parse = parse;
  function parse (version, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    if (version instanceof SemVer) {
      return version
    }

    if (typeof version !== 'string') {
      return null
    }

    if (version.length > MAX_LENGTH) {
      return null
    }

    var r = options.loose ? re[t.LOOSE] : re[t.FULL];
    if (!r.test(version)) {
      return null
    }

    try {
      return new SemVer(version, options)
    } catch (er) {
      return null
    }
  }

  exports.valid = valid;
  function valid (version, options) {
    var v = parse(version, options);
    return v ? v.version : null
  }

  exports.clean = clean;
  function clean (version, options) {
    var s = parse(version.trim().replace(/^[=v]+/, ''), options);
    return s ? s.version : null
  }

  exports.SemVer = SemVer;

  function SemVer (version, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }
    if (version instanceof SemVer) {
      if (version.loose === options.loose) {
        return version
      } else {
        version = version.version;
      }
    } else if (typeof version !== 'string') {
      throw new TypeError('Invalid Version: ' + version)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
    }

    if (!(this instanceof SemVer)) {
      return new SemVer(version, options)
    }

    debug('SemVer', version, options);
    this.options = options;
    this.loose = !!options.loose;

    var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);

    if (!m) {
      throw new TypeError('Invalid Version: ' + version)
    }

    this.raw = version;

    // these are actually numbers
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split('.').map(function (id) {
        if (/^[0-9]+$/.test(id)) {
          var num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      });
    }

    this.build = m[5] ? m[5].split('.') : [];
    this.format();
  }

  SemVer.prototype.format = function () {
    this.version = this.major + '.' + this.minor + '.' + this.patch;
    if (this.prerelease.length) {
      this.version += '-' + this.prerelease.join('.');
    }
    return this.version
  };

  SemVer.prototype.toString = function () {
    return this.version
  };

  SemVer.prototype.compare = function (other) {
    debug('SemVer.compare', this.version, this.options, other);
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    return this.compareMain(other) || this.comparePre(other)
  };

  SemVer.prototype.compareMain = function (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    return compareIdentifiers(this.major, other.major) ||
           compareIdentifiers(this.minor, other.minor) ||
           compareIdentifiers(this.patch, other.patch)
  };

  SemVer.prototype.comparePre = function (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    var i = 0;
    do {
      var a = this.prerelease[i];
      var b = other.prerelease[i];
      debug('prerelease compare', i, a, b);
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  };

  SemVer.prototype.compareBuild = function (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    var i = 0;
    do {
      var a = this.build[i];
      var b = other.build[i];
      debug('prerelease compare', i, a, b);
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  };

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  SemVer.prototype.inc = function (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc('pre', identifier);
        break
      case 'preminor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc('pre', identifier);
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0;
        this.inc('patch', identifier);
        this.inc('pre', identifier);
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier);
        }
        this.inc('pre', identifier);
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (this.minor !== 0 ||
            this.patch !== 0 ||
            this.prerelease.length === 0) {
          this.major++;
        }
        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++;
        }
        this.patch = 0;
        this.prerelease = [];
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++;
        }
        this.prerelease = [];
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0];
        } else {
          var i = this.prerelease.length;
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++;
              i = -2;
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0);
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0];
            }
          } else {
            this.prerelease = [identifier, 0];
          }
        }
        break

      default:
        throw new Error('invalid increment argument: ' + release)
    }
    this.format();
    this.raw = this.version;
    return this
  };

  exports.inc = inc;
  function inc (version, release, loose, identifier) {
    if (typeof (loose) === 'string') {
      identifier = loose;
      loose = undefined;
    }

    try {
      return new SemVer(version, loose).inc(release, identifier).version
    } catch (er) {
      return null
    }
  }

  exports.diff = diff;
  function diff (version1, version2) {
    if (eq(version1, version2)) {
      return null
    } else {
      var v1 = parse(version1);
      var v2 = parse(version2);
      var prefix = '';
      if (v1.prerelease.length || v2.prerelease.length) {
        prefix = 'pre';
        var defaultResult = 'prerelease';
      }
      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return prefix + key
          }
        }
      }
      return defaultResult // may be undefined
    }
  }

  exports.compareIdentifiers = compareIdentifiers;

  var numeric = /^[0-9]+$/;
  function compareIdentifiers (a, b) {
    var anum = numeric.test(a);
    var bnum = numeric.test(b);

    if (anum && bnum) {
      a = +a;
      b = +b;
    }

    return a === b ? 0
      : (anum && !bnum) ? -1
      : (bnum && !anum) ? 1
      : a < b ? -1
      : 1
  }

  exports.rcompareIdentifiers = rcompareIdentifiers;
  function rcompareIdentifiers (a, b) {
    return compareIdentifiers(b, a)
  }

  exports.major = major;
  function major (a, loose) {
    return new SemVer(a, loose).major
  }

  exports.minor = minor;
  function minor (a, loose) {
    return new SemVer(a, loose).minor
  }

  exports.patch = patch;
  function patch (a, loose) {
    return new SemVer(a, loose).patch
  }

  exports.compare = compare;
  function compare (a, b, loose) {
    return new SemVer(a, loose).compare(new SemVer(b, loose))
  }

  exports.compareLoose = compareLoose;
  function compareLoose (a, b) {
    return compare(a, b, true)
  }

  exports.compareBuild = compareBuild;
  function compareBuild (a, b, loose) {
    var versionA = new SemVer(a, loose);
    var versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB)
  }

  exports.rcompare = rcompare;
  function rcompare (a, b, loose) {
    return compare(b, a, loose)
  }

  exports.sort = sort;
  function sort (list, loose) {
    return list.sort(function (a, b) {
      return exports.compareBuild(a, b, loose)
    })
  }

  exports.rsort = rsort;
  function rsort (list, loose) {
    return list.sort(function (a, b) {
      return exports.compareBuild(b, a, loose)
    })
  }

  exports.gt = gt;
  function gt (a, b, loose) {
    return compare(a, b, loose) > 0
  }

  exports.lt = lt;
  function lt (a, b, loose) {
    return compare(a, b, loose) < 0
  }

  exports.eq = eq;
  function eq (a, b, loose) {
    return compare(a, b, loose) === 0
  }

  exports.neq = neq;
  function neq (a, b, loose) {
    return compare(a, b, loose) !== 0
  }

  exports.gte = gte;
  function gte (a, b, loose) {
    return compare(a, b, loose) >= 0
  }

  exports.lte = lte;
  function lte (a, b, loose) {
    return compare(a, b, loose) <= 0
  }

  exports.cmp = cmp;
  function cmp (a, op, b, loose) {
    switch (op) {
      case '===':
        if (typeof a === 'object')
          a = a.version;
        if (typeof b === 'object')
          b = b.version;
        return a === b

      case '!==':
        if (typeof a === 'object')
          a = a.version;
        if (typeof b === 'object')
          b = b.version;
        return a !== b

      case '':
      case '=':
      case '==':
        return eq(a, b, loose)

      case '!=':
        return neq(a, b, loose)

      case '>':
        return gt(a, b, loose)

      case '>=':
        return gte(a, b, loose)

      case '<':
        return lt(a, b, loose)

      case '<=':
        return lte(a, b, loose)

      default:
        throw new TypeError('Invalid operator: ' + op)
    }
  }

  exports.Comparator = Comparator;
  function Comparator (comp, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value;
      }
    }

    if (!(this instanceof Comparator)) {
      return new Comparator(comp, options)
    }

    debug('comparator', comp, options);
    this.options = options;
    this.loose = !!options.loose;
    this.parse(comp);

    if (this.semver === ANY) {
      this.value = '';
    } else {
      this.value = this.operator + this.semver.version;
    }

    debug('comp', this);
  }

  var ANY = {};
  Comparator.prototype.parse = function (comp) {
    var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
    var m = comp.match(r);

    if (!m) {
      throw new TypeError('Invalid comparator: ' + comp)
    }

    this.operator = m[1] !== undefined ? m[1] : '';
    if (this.operator === '=') {
      this.operator = '';
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY;
    } else {
      this.semver = new SemVer(m[2], this.options.loose);
    }
  };

  Comparator.prototype.toString = function () {
    return this.value
  };

  Comparator.prototype.test = function (version) {
    debug('Comparator.test', version, this.options.loose);

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options);
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  };

  Comparator.prototype.intersects = function (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    var rangeTmp;

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      rangeTmp = new Range(comp.value, options);
      return satisfies(this.value, rangeTmp, options)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      rangeTmp = new Range(this.value, options);
      return satisfies(comp.semver, rangeTmp, options)
    }

    var sameDirectionIncreasing =
      (this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '>=' || comp.operator === '>');
    var sameDirectionDecreasing =
      (this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '<=' || comp.operator === '<');
    var sameSemVer = this.semver.version === comp.semver.version;
    var differentDirectionsInclusive =
      (this.operator === '>=' || this.operator === '<=') &&
      (comp.operator === '>=' || comp.operator === '<=');
    var oppositeDirectionsLessThan =
      cmp(this.semver, '<', comp.semver, options) &&
      ((this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '<=' || comp.operator === '<'));
    var oppositeDirectionsGreaterThan =
      cmp(this.semver, '>', comp.semver, options) &&
      ((this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '>=' || comp.operator === '>'));

    return sameDirectionIncreasing || sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
  };

  exports.Range = Range;
  function Range (range, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    if (range instanceof Range) {
      if (range.loose === !!options.loose &&
          range.includePrerelease === !!options.includePrerelease) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      return new Range(range.value, options)
    }

    if (!(this instanceof Range)) {
      return new Range(range, options)
    }

    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;

    // First, split based on boolean or ||
    this.raw = range;
    this.set = range.split(/\s*\|\|\s*/).map(function (range) {
      return this.parseRange(range.trim())
    }, this).filter(function (c) {
      // throw out any that are not relevant for whatever reason
      return c.length
    });

    if (!this.set.length) {
      throw new TypeError('Invalid SemVer Range: ' + range)
    }

    this.format();
  }

  Range.prototype.format = function () {
    this.range = this.set.map(function (comps) {
      return comps.join(' ').trim()
    }).join('||').trim();
    return this.range
  };

  Range.prototype.toString = function () {
    return this.range
  };

  Range.prototype.parseRange = function (range) {
    var loose = this.options.loose;
    range = range.trim();
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
    range = range.replace(hr, hyphenReplace);
    debug('hyphen replace', range);
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
    debug('comparator trim', range, re[t.COMPARATORTRIM]);

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace);

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace);

    // normalize spaces
    range = range.split(/\s+/).join(' ');

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
    var set = range.split(' ').map(function (comp) {
      return parseComparator(comp, this.options)
    }, this).join(' ').split(/\s+/);
    if (this.options.loose) {
      // in loose mode, throw out any that are not valid comparators
      set = set.filter(function (comp) {
        return !!comp.match(compRe)
      });
    }
    set = set.map(function (comp) {
      return new Comparator(comp, this.options)
    }, this);

    return set
  };

  Range.prototype.intersects = function (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some(function (thisComparators) {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some(function (rangeComparators) {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every(function (thisComparator) {
              return rangeComparators.every(function (rangeComparator) {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  };

  // take a set of comparators and determine whether there
  // exists a version which can satisfy it
  function isSatisfiable (comparators, options) {
    var result = true;
    var remainingComparators = comparators.slice();
    var testComparator = remainingComparators.pop();

    while (result && remainingComparators.length) {
      result = remainingComparators.every(function (otherComparator) {
        return testComparator.intersects(otherComparator, options)
      });

      testComparator = remainingComparators.pop();
    }

    return result
  }

  // Mostly just for testing and legacy API reasons
  exports.toComparators = toComparators;
  function toComparators (range, options) {
    return new Range(range, options).set.map(function (comp) {
      return comp.map(function (c) {
        return c.value
      }).join(' ').trim().split(' ')
    })
  }

  // comprised of xranges, tildes, stars, and gtlt's at this point.
  // already replaced the hyphen ranges
  // turn into a set of JUST comparators.
  function parseComparator (comp, options) {
    debug('comp', comp, options);
    comp = replaceCarets(comp, options);
    debug('caret', comp);
    comp = replaceTildes(comp, options);
    debug('tildes', comp);
    comp = replaceXRanges(comp, options);
    debug('xrange', comp);
    comp = replaceStars(comp, options);
    debug('stars', comp);
    return comp
  }

  function isX (id) {
    return !id || id.toLowerCase() === 'x' || id === '*'
  }

  // ~, ~> --> * (any, kinda silly)
  // ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
  // ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
  // ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
  // ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
  // ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
  function replaceTildes (comp, options) {
    return comp.trim().split(/\s+/).map(function (comp) {
      return replaceTilde(comp, options)
    }).join(' ')
  }

  function replaceTilde (comp, options) {
    var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    return comp.replace(r, function (_, M, m, p, pr) {
      debug('tilde', comp, _, M, m, p, pr);
      var ret;

      if (isX(M)) {
        ret = '';
      } else if (isX(m)) {
        ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
      } else if (isX(p)) {
        // ~1.2 == >=1.2.0 <1.3.0
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      } else if (pr) {
        debug('replaceTilde pr', pr);
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + M + '.' + (+m + 1) + '.0';
      } else {
        // ~1.2.3 == >=1.2.3 <1.3.0
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + M + '.' + (+m + 1) + '.0';
      }

      debug('tilde return', ret);
      return ret
    })
  }

  // ^ --> * (any, kinda silly)
  // ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
  // ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
  // ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
  // ^1.2.3 --> >=1.2.3 <2.0.0
  // ^1.2.0 --> >=1.2.0 <2.0.0
  function replaceCarets (comp, options) {
    return comp.trim().split(/\s+/).map(function (comp) {
      return replaceCaret(comp, options)
    }).join(' ')
  }

  function replaceCaret (comp, options) {
    debug('caret', comp, options);
    var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    return comp.replace(r, function (_, M, m, p, pr) {
      debug('caret', comp, _, M, m, p, pr);
      var ret;

      if (isX(M)) {
        ret = '';
      } else if (isX(m)) {
        ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
      } else if (isX(p)) {
        if (M === '0') {
          ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
        } else {
          ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
        }
      } else if (pr) {
        debug('replaceCaret pr', pr);
        if (M === '0') {
          if (m === '0') {
            ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                  ' <' + M + '.' + m + '.' + (+p + 1);
          } else {
            ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                  ' <' + M + '.' + (+m + 1) + '.0';
          }
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + (+M + 1) + '.0.0';
        }
      } else {
        debug('no pr');
        if (M === '0') {
          if (m === '0') {
            ret = '>=' + M + '.' + m + '.' + p +
                  ' <' + M + '.' + m + '.' + (+p + 1);
          } else {
            ret = '>=' + M + '.' + m + '.' + p +
                  ' <' + M + '.' + (+m + 1) + '.0';
          }
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + (+M + 1) + '.0.0';
        }
      }

      debug('caret return', ret);
      return ret
    })
  }

  function replaceXRanges (comp, options) {
    debug('replaceXRanges', comp, options);
    return comp.split(/\s+/).map(function (comp) {
      return replaceXRange(comp, options)
    }).join(' ')
  }

  function replaceXRange (comp, options) {
    comp = comp.trim();
    var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
      debug('xRange', comp, ret, gtlt, M, m, p, pr);
      var xM = isX(M);
      var xm = xM || isX(m);
      var xp = xm || isX(p);
      var anyX = xp;

      if (gtlt === '=' && anyX) {
        gtlt = '';
      }

      // if we're including prereleases in the match, then we need
      // to fix this to -0, the lowest possible prerelease value
      pr = options.includePrerelease ? '-0' : '';

      if (xM) {
        if (gtlt === '>' || gtlt === '<') {
          // nothing is allowed
          ret = '<0.0.0-0';
        } else {
          // nothing is forbidden
          ret = '*';
        }
      } else if (gtlt && anyX) {
        // we know patch is an x, because we have any x at all.
        // replace X with 0
        if (xm) {
          m = 0;
        }
        p = 0;

        if (gtlt === '>') {
          // >1 => >=2.0.0
          // >1.2 => >=1.3.0
          // >1.2.3 => >= 1.2.4
          gtlt = '>=';
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === '<=') {
          // <=0.7.x is actually <0.8.0, since any 0.7.x should
          // pass.  Similarly, <=7.x is actually <8.0.0, etc.
          gtlt = '<';
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }

        ret = gtlt + M + '.' + m + '.' + p + pr;
      } else if (xm) {
        ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr;
      } else if (xp) {
        ret = '>=' + M + '.' + m + '.0' + pr +
          ' <' + M + '.' + (+m + 1) + '.0' + pr;
      }

      debug('xRange return', ret);

      return ret
    })
  }

  // Because * is AND-ed with everything else in the comparator,
  // and '' means "any version", just remove the *s entirely.
  function replaceStars (comp, options) {
    debug('replaceStars', comp, options);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[t.STAR], '')
  }

  // This function is passed to string.replace(re[t.HYPHENRANGE])
  // M, m, patch, prerelease, build
  // 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
  // 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
  // 1.2 - 3.4 => >=1.2.0 <3.5.0
  function hyphenReplace ($0,
    from, fM, fm, fp, fpr, fb,
    to, tM, tm, tp, tpr, tb) {
    if (isX(fM)) {
      from = '';
    } else if (isX(fm)) {
      from = '>=' + fM + '.0.0';
    } else if (isX(fp)) {
      from = '>=' + fM + '.' + fm + '.0';
    } else {
      from = '>=' + from;
    }

    if (isX(tM)) {
      to = '';
    } else if (isX(tm)) {
      to = '<' + (+tM + 1) + '.0.0';
    } else if (isX(tp)) {
      to = '<' + tM + '.' + (+tm + 1) + '.0';
    } else if (tpr) {
      to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
    } else {
      to = '<=' + to;
    }

    return (from + ' ' + to).trim()
  }

  // if ANY of the sets match ALL of its comparators, then pass
  Range.prototype.test = function (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options);
      } catch (er) {
        return false
      }
    }

    for (var i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  };

  function testSet (set, version, options) {
    for (var i = 0; i < set.length; i++) {
      if (!set[i].test(version)) {
        return false
      }
    }

    if (version.prerelease.length && !options.includePrerelease) {
      // Find the set of versions that are allowed to have prereleases
      // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
      // That should allow `1.2.3-pr.2` to pass.
      // However, `1.2.4-alpha.notready` should NOT be allowed,
      // even though it's within the range set by the comparators.
      for (i = 0; i < set.length; i++) {
        debug(set[i].semver);
        if (set[i].semver === ANY) {
          continue
        }

        if (set[i].semver.prerelease.length > 0) {
          var allowed = set[i].semver;
          if (allowed.major === version.major &&
              allowed.minor === version.minor &&
              allowed.patch === version.patch) {
            return true
          }
        }
      }

      // Version has a -pre, but it's not one of the ones we like.
      return false
    }

    return true
  }

  exports.satisfies = satisfies;
  function satisfies (version, range, options) {
    try {
      range = new Range(range, options);
    } catch (er) {
      return false
    }
    return range.test(version)
  }

  exports.maxSatisfying = maxSatisfying;
  function maxSatisfying (versions, range, options) {
    var max = null;
    var maxSV = null;
    try {
      var rangeObj = new Range(range, options);
    } catch (er) {
      return null
    }
    versions.forEach(function (v) {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!max || maxSV.compare(v) === -1) {
          // compare(max, v, true)
          max = v;
          maxSV = new SemVer(max, options);
        }
      }
    });
    return max
  }

  exports.minSatisfying = minSatisfying;
  function minSatisfying (versions, range, options) {
    var min = null;
    var minSV = null;
    try {
      var rangeObj = new Range(range, options);
    } catch (er) {
      return null
    }
    versions.forEach(function (v) {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!min || minSV.compare(v) === 1) {
          // compare(min, v, true)
          min = v;
          minSV = new SemVer(min, options);
        }
      }
    });
    return min
  }

  exports.minVersion = minVersion;
  function minVersion (range, loose) {
    range = new Range(range, loose);

    var minver = new SemVer('0.0.0');
    if (range.test(minver)) {
      return minver
    }

    minver = new SemVer('0.0.0-0');
    if (range.test(minver)) {
      return minver
    }

    minver = null;
    for (var i = 0; i < range.set.length; ++i) {
      var comparators = range.set[i];

      comparators.forEach(function (comparator) {
        // Clone to avoid manipulating the comparator's semver object.
        var compver = new SemVer(comparator.semver.version);
        switch (comparator.operator) {
          case '>':
            if (compver.prerelease.length === 0) {
              compver.patch++;
            } else {
              compver.prerelease.push(0);
            }
            compver.raw = compver.format();
            /* fallthrough */
          case '':
          case '>=':
            if (!minver || gt(minver, compver)) {
              minver = compver;
            }
            break
          case '<':
          case '<=':
            /* Ignore maximum versions */
            break
          /* istanbul ignore next */
          default:
            throw new Error('Unexpected operation: ' + comparator.operator)
        }
      });
    }

    if (minver && range.test(minver)) {
      return minver
    }

    return null
  }

  exports.validRange = validRange;
  function validRange (range, options) {
    try {
      // Return '*' instead of '' so that truthiness works.
      // This will throw if it's invalid anyway
      return new Range(range, options).range || '*'
    } catch (er) {
      return null
    }
  }

  // Determine if version is less than all the versions possible in the range
  exports.ltr = ltr;
  function ltr (version, range, options) {
    return outside(version, range, '<', options)
  }

  // Determine if version is greater than all the versions possible in the range.
  exports.gtr = gtr;
  function gtr (version, range, options) {
    return outside(version, range, '>', options)
  }

  exports.outside = outside;
  function outside (version, range, hilo, options) {
    version = new SemVer(version, options);
    range = new Range(range, options);

    var gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
      case '>':
        gtfn = gt;
        ltefn = lte;
        ltfn = lt;
        comp = '>';
        ecomp = '>=';
        break
      case '<':
        gtfn = lt;
        ltefn = gte;
        ltfn = gt;
        comp = '<';
        ecomp = '<=';
        break
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"')
    }

    // If it satisifes the range it is not outside
    if (satisfies(version, range, options)) {
      return false
    }

    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.

    for (var i = 0; i < range.set.length; ++i) {
      var comparators = range.set[i];

      var high = null;
      var low = null;

      comparators.forEach(function (comparator) {
        if (comparator.semver === ANY) {
          comparator = new Comparator('>=0.0.0');
        }
        high = high || comparator;
        low = low || comparator;
        if (gtfn(comparator.semver, high.semver, options)) {
          high = comparator;
        } else if (ltfn(comparator.semver, low.semver, options)) {
          low = comparator;
        }
      });

      // If the edge version comparator has a operator then our version
      // isn't outside it
      if (high.operator === comp || high.operator === ecomp) {
        return false
      }

      // If the lowest version comparator has an operator and our version
      // is less than it then it isn't higher than the range
      if ((!low.operator || low.operator === comp) &&
          ltefn(version, low.semver)) {
        return false
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false
      }
    }
    return true
  }

  exports.prerelease = prerelease;
  function prerelease (version, options) {
    var parsed = parse(version, options);
    return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
  }

  exports.intersects = intersects;
  function intersects (r1, r2, options) {
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2)
  }

  exports.coerce = coerce;
  function coerce (version, options) {
    if (version instanceof SemVer) {
      return version
    }

    if (typeof version === 'number') {
      version = String(version);
    }

    if (typeof version !== 'string') {
      return null
    }

    options = options || {};

    var match = null;
    if (!options.rtl) {
      match = version.match(re[t.COERCE]);
    } else {
      // Find the right-most coercible string that does not share
      // a terminus with a more left-ward coercible string.
      // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
      //
      // Walk through the string checking with a /g regexp
      // Manually set the index so as to pick up overlapping matches.
      // Stop when we get a match that ends at the string end, since no
      // coercible string can be more right-ward without the same terminus.
      var next;
      while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
      ) {
        if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
          match = next;
        }
        re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
      }
      // leave it in a clean state
      re[t.COERCERTL].lastIndex = -1;
    }

    if (match === null) {
      return null
    }

    return parse(match[2] +
      '.' + (match[3] || '0') +
      '.' + (match[4] || '0'), options)
  }
  });
  var semver_1 = semver.SEMVER_SPEC_VERSION;
  var semver_2 = semver.re;
  var semver_3 = semver.src;
  var semver_4 = semver.tokens;
  var semver_5 = semver.parse;
  var semver_6 = semver.valid;
  var semver_7 = semver.clean;
  var semver_8 = semver.SemVer;
  var semver_9 = semver.inc;
  var semver_10 = semver.diff;
  var semver_11 = semver.compareIdentifiers;
  var semver_12 = semver.rcompareIdentifiers;
  var semver_13 = semver.major;
  var semver_14 = semver.minor;
  var semver_15 = semver.patch;
  var semver_16 = semver.compare;
  var semver_17 = semver.compareLoose;
  var semver_18 = semver.compareBuild;
  var semver_19 = semver.rcompare;
  var semver_20 = semver.sort;
  var semver_21 = semver.rsort;
  var semver_22 = semver.gt;
  var semver_23 = semver.lt;
  var semver_24 = semver.eq;
  var semver_25 = semver.neq;
  var semver_26 = semver.gte;
  var semver_27 = semver.lte;
  var semver_28 = semver.cmp;
  var semver_29 = semver.Comparator;
  var semver_30 = semver.Range;
  var semver_31 = semver.toComparators;
  var semver_32 = semver.satisfies;
  var semver_33 = semver.maxSatisfying;
  var semver_34 = semver.minSatisfying;
  var semver_35 = semver.minVersion;
  var semver_36 = semver.validRange;
  var semver_37 = semver.ltr;
  var semver_38 = semver.gtr;
  var semver_39 = semver.outside;
  var semver_40 = semver.prerelease;
  var semver_41 = semver.intersects;
  var semver_42 = semver.coerce;

  var filterPluginsByType = function filterPluginsByType(plugins, type) {
    if (!plugins || !type) return {};
    return Object.entries(plugins).filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          value = _ref2[1];

      return value.type === type;
    }).reduce(function (obj, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];

      return obj[key] = value, obj;
    }, {});
  };
  /**
   * It keeps a list of the default plugins (playback, container, core) and it merges external plugins with its internals.
   * @class Loader
   * @constructor
   * @extends BaseObject
   * @module components
   */


  var Loader = (function () {
    var registry = {
      plugins: {},
      playbacks: []
    };
    var currentVersion = "0.4.5";
    return (
      /*#__PURE__*/
      function () {
        _createClass(Loader, null, [{
          key: "checkVersionSupport",
          value: function checkVersionSupport(entry) {
            var _entry$prototype = entry.prototype,
                supportedVersion = _entry$prototype.supportedVersion,
                name = _entry$prototype.name;

            if (!supportedVersion || !supportedVersion.min) {
              Log.warn('Loader', "missing version information for ".concat(name));
              return false;
            }

            var maxVersion = supportedVersion.max || semver.parse(supportedVersion.min).inc('minor');
            var versionRange = ">=".concat(supportedVersion.min, " <").concat(maxVersion);

            if (!semver.satisfies(currentVersion, versionRange)) {
              Log.warn('Loader', "unsupported plugin (".concat(currentVersion, " does not match required range ").concat(versionRange, "): ").concat(name));
              return false;
            }

            return true;
          }
        }, {
          key: "registerPlugin",
          value: function registerPlugin(pluginEntry) {
            if (!pluginEntry || !pluginEntry.prototype.name) {
              Log.warn('Loader', "missing information to register plugin: ".concat(pluginEntry));
              return false;
            }

            Loader.checkVersionSupport(pluginEntry);
            var pluginRegistry = registry.plugins;
            if (!pluginRegistry) return false;
            var previousEntry = pluginRegistry[pluginEntry.prototype.name];
            if (previousEntry) Log.warn('Loader', "overriding plugin entry: ".concat(pluginEntry.prototype.name, " - ").concat(previousEntry));
            pluginRegistry[pluginEntry.prototype.name] = pluginEntry;
            return true;
          }
        }, {
          key: "registerPlayback",
          value: function registerPlayback(playbackEntry) {
            if (!playbackEntry || !playbackEntry.prototype.name) return false;
            Loader.checkVersionSupport(playbackEntry);
            var playbacks = registry.playbacks;
            var previousEntryIdx = playbacks.findIndex(function (entry) {
              return entry.name === playbackEntry.prototype.name;
            });

            if (previousEntryIdx >= 0) {
              var previousEntry = playbacks[previousEntryIdx];
              playbacks.splice(previousEntryIdx, 1);
              Log.warn('Loader', "overriding playback entry: ".concat(previousEntry.name, " - ").concat(previousEntry));
            }

            registry.playbacks = [playbackEntry].concat(_toConsumableArray(playbacks));
            return true;
          }
        }, {
          key: "unregisterPlugin",
          value: function unregisterPlugin(name) {
            if (!name) return false;
            var plugins = registry.plugins;
            var plugin = plugins[name];
            if (!plugin) return false;
            delete plugins[name];
            return true;
          }
        }, {
          key: "unregisterPlayback",
          value: function unregisterPlayback(name) {
            if (!name) return false;
            var playbacks = registry.playbacks;
            var index = playbacks.findIndex(function (entry) {
              return entry.prototype.name === name;
            });
            if (index < 0) return false;
            playbacks.splice(index, 1);
            registry.playbacks = playbacks;
            return true;
          }
        }, {
          key: "clearPlugins",
          value: function clearPlugins() {
            registry.plugins = {};
          }
        }, {
          key: "clearPlaybacks",
          value: function clearPlaybacks() {
            registry.playbacks = [];
          }
          /**
           * builds the loader
           * @method constructor
           * @param {Object} externalPlugins the external plugins
           * @param {Number} playerId you can embed multiple instances of clappr, therefore this is the unique id of each one.
           */

        }, {
          key: "registeredPlaybacks",
          get: function get() {
            return _toConsumableArray(registry.playbacks);
          }
        }, {
          key: "registeredPlugins",
          get: function get() {
            var plugins = registry.plugins;
            var core = filterPluginsByType(plugins, 'core');
            var container = filterPluginsByType(plugins, 'container');
            return {
              core: core,
              container: container
            };
          }
        }]);

        function Loader() {
          var externalPlugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          var playerId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

          _classCallCheck(this, Loader);

          this.playerId = playerId;
          this.playbackPlugins = _toConsumableArray(registry.playbacks);
          var _Loader$registeredPlu = Loader.registeredPlugins,
              core = _Loader$registeredPlu.core,
              container = _Loader$registeredPlu.container;
          this.containerPlugins = Object.values(container);
          this.corePlugins = Object.values(core);
          if (!Array.isArray(externalPlugins)) this.validateExternalPluginsType(externalPlugins);
          this.addExternalPlugins(externalPlugins);
        }
        /**
         * groups by type the external plugins that were passed through `options.plugins` it they're on a flat array
         * @method addExternalPlugins
         * @private
         * @param {Object} an config object or an array of plugins
         * @return {Object} plugins the config object with the plugins separated by type
         */


        _createClass(Loader, [{
          key: "groupPluginsByType",
          value: function groupPluginsByType(plugins) {
            if (Array.isArray(plugins)) {
              plugins = plugins.reduce(function (memo, plugin) {
                memo[plugin.type] || (memo[plugin.type] = []);
                memo[plugin.type].push(plugin);
                return memo;
              }, {});
            }

            return plugins;
          }
        }, {
          key: "removeDups",
          value: function removeDups(list) {
            var groupUp = function groupUp(plugins, plugin) {
              plugins[plugin.prototype.name] && delete plugins[plugin.prototype.name];
              plugins[plugin.prototype.name] = plugin;
              return plugins;
            };

            var pluginsMap = list.reduceRight(groupUp, Object.create(null));
            var plugins = [];

            for (var key in pluginsMap) {
              plugins.unshift(pluginsMap[key]);
            }

            return plugins;
          }
          /**
           * adds all the external plugins that were passed through `options.plugins`
           * @method addExternalPlugins
           * @private
           * @param {Object} plugins the config object with all plugins
           */

        }, {
          key: "addExternalPlugins",
          value: function addExternalPlugins(plugins) {
            plugins = this.groupPluginsByType(plugins);

            if (plugins.playback) {
              var playbacks = plugins.playback.filter(function (playback) {
                return Loader.checkVersionSupport(playback), true;
              });
              this.playbackPlugins = this.removeDups(playbacks.concat(this.playbackPlugins));
            }

            if (plugins.container) {
              var containerPlugins = plugins.container.filter(function (plugin) {
                return Loader.checkVersionSupport(plugin), true;
              });
              this.containerPlugins = this.removeDups(containerPlugins.concat(this.containerPlugins));
            }

            if (plugins.core) {
              var corePlugins = plugins.core.filter(function (plugin) {
                return Loader.checkVersionSupport(plugin), true;
              });
              this.corePlugins = this.removeDups(corePlugins.concat(this.corePlugins));
            }
          }
          /**
           * validate if the external plugins that were passed through `options.plugins` are associated to the correct type
           * @method validateExternalPluginsType
           * @private
           * @param {Object} plugins the config object with all plugins
           */

        }, {
          key: "validateExternalPluginsType",
          value: function validateExternalPluginsType(plugins) {
            var plugintypes = ['playback', 'container', 'core'];
            plugintypes.forEach(function (type) {
              (plugins[type] || []).forEach(function (el) {
                var errorMessage = 'external ' + el.type + ' plugin on ' + type + ' array';
                if (el.type !== type) throw new ReferenceError(errorMessage);
              });
            });
          }
        }]);

        return Loader;
      }()
    );
  })();

  var baseUrl = currentScriptUrl().replace(/\/[^/]+$/, '');
  /**
   * @class Player
   * @constructor
   * @extends BaseObject
   * @module components
   * @example
   * ### Using the Player
   *
   * Add the following script on your HTML:
   * ```html
   * <head>
   *   <script type="text/javascript" src="http://cdn.clappr.io/latest/clappr.min.js"></script>
   * </head>
   * ```
   * Now, create the player:
   * ```html
   * <body>
   *   <div id="player"></div>
   *   <script>
   *     var player = new Clappr.Player({source: "http://your.video/here.mp4", parentId: "#player"});
   *   </script>
   * </body>
   * ```
   */

  var Player =
  /*#__PURE__*/
  function (_BaseObject) {
    _inherits(Player, _BaseObject);

    _createClass(Player, [{
      key: "loader",
      set: function set(loader) {
        this._loader = loader;
      },
      get: function get() {
        if (!this._loader) this._loader = new Loader(this.options.plugins || {}, this.options.playerId);
        return this._loader;
      }
      /**
       * Determine if the playback has ended.
       * @property ended
       * @type Boolean
       */

    }, {
      key: "ended",
      get: function get() {
        return this.core.activeContainer.ended;
      }
      /**
       * Determine if the playback is having to buffer in order for
       * playback to be smooth.
       * (i.e if a live stream is playing smoothly, this will be false)
       * @property buffering
       * @type Boolean
       */

    }, {
      key: "buffering",
      get: function get() {
        return this.core.activeContainer.buffering;
      }
      /*
       * determine if the player is ready.
       * @property isReady
       * @type {Boolean} `true` if the player is ready. ie PLAYER_READY event has fired
       */

    }, {
      key: "isReady",
      get: function get() {
        return !!this._ready;
      }
      /**
       * An events map that allows the user to add custom callbacks in player's options.
       * @property eventsMapping
       * @type {Object}
       */

    }, {
      key: "eventsMapping",
      get: function get() {
        return {
          onReady: Events.PLAYER_READY,
          onResize: Events.PLAYER_RESIZE,
          onPlay: Events.PLAYER_PLAY,
          onPause: Events.PLAYER_PAUSE,
          onStop: Events.PLAYER_STOP,
          onEnded: Events.PLAYER_ENDED,
          onSeek: Events.PLAYER_SEEK,
          onError: Events.PLAYER_ERROR,
          onTimeUpdate: Events.PLAYER_TIMEUPDATE,
          onVolumeUpdate: Events.PLAYER_VOLUMEUPDATE,
          onSubtitleAvailable: Events.PLAYER_SUBTITLE_AVAILABLE
        };
      }
      /**
       * @typedef {Object} PlaybackConfig
       * @prop {boolean} disableContextMenu
       * disables the context menu (right click) on the video element if a HTML5Video playback is used.
       * @prop {boolean} preload
       * video will be preloaded according to `preload` attribute options **default**: `'metadata'`
       * @prop {boolean} controls
       * enabled/disables displaying controls
       * @prop {boolean} crossOrigin
       * enables cross-origin capability for media-resources
       * @prop {boolean} playInline
       * enables in-line video elements
       * @prop {boolean} audioOnly
       * enforce audio-only playback (when possible)
       * @prop {Object} externalTracks
       * pass externaly loaded track to playback
       * @prop {Number} [maxBufferLength]
       * The default behavior for the **HLS playback** is to keep buffering indefinitely, even on VoD.
       * This replicates the behavior for progressive download, which continues buffering when pausing the video, thus making the video available for playback even on slow networks.
       * To change this behavior use `maxBufferLength` where **value is in seconds**.
       * @prop {Number} [maxBackBufferLength]
       * After how much distance of the playhead data should be pruned from the buffer (influences memory consumption
       * of adaptive media-engines like Hls.js or Shaka)
       * @prop {Number} [minBufferLength]
       * After how much data in the buffer at least we attempt to consume it (influences QoS-related behavior
       * of adaptive media-engines like Hls.js or Shaka). If this is too low, and the available bandwidth is varying a lot
       * and too close to the streamed bitrate, we may continuously hit under-runs.
       * @prop {Number} [initialBandwidthEstimate]
       * define an initial bandwidth "guess" (or previously stored/established value) for underlying adaptive-bitreate engines
       * of adaptive playback implementations, like Hls.js or Shaka
       * @prop {Number} [maxAdaptiveBitrate]
       * Limits the streamed bitrate (for adaptive media-engines in underlying playback implementations)
       * @prop {Object} [maxAdaptiveVideoDimensions]
       * Limits the video dimensions in adaptive media-engines. Should be a literal object with `height` and `width`.
       * @prop {Boolean}[enableAutomaticABR] **default**: `true`
       * Allows to enable/disable automatic bitrate switching in adaptive media-engines
       * @prop {String} [preferredTextLanguage] **default**: `'pt-BR'`
       * Allows to set a preferred text language, that may be enabled by the media-engine if available.
       * @prop {String} [preferredAudioLanguage] **default**: `'pt-BR'`
       * Allows to set a preferred audio language, that may be enabled by the media-engine if available.
       */

      /**
       * ## Player's constructor
       *
       * You might pass the options object to build the player.
       * ```javascript
       * var options = {source: "http://example.com/video.mp4", param1: "val1"};
       * var player = new Clappr.Player(options);
       * ```
       *
       * @method constructor
       * @param {Object} options Data
       * options to build a player instance
       * @param {Number} [options.width]
       * player's width **default**: `640`
       * @param {Number} [options.height]
       * player's height **default**: `360`
       * @param {String} [options.parentId]
       * the id of the element on the page that the player should be inserted into
       * @param {Object} [options.parent]
       * a reference to a dom element that the player should be inserted into
       * @param {String} [options.source]
       * The media source URL, or {source: <<source URL>>, mimeType: <<source mime type>>}
       * @param {Object} [options.sources]
       * An array of media source URL's, or an array of {source: <<source URL>>, mimeType: <<source mime type>>}
       * @param {Boolean} [options.autoPlay]
       * automatically play after page load **default**: `false`
       * @param {Boolean} [options.loop]
       * automatically replay after it ends **default**: `false`
       * @param {Boolean} [options.chromeless]
       * player acts in chromeless mode **default**: `false`
       * @param {Boolean} [options.allowUserInteraction]
       * whether or not the player should handle click events when in chromeless mode **default**: `false` on desktops browsers, `true` on mobile.
       * @param {Boolean} [options.disableKeyboardShortcuts]
       * disable keyboard shortcuts. **default**: `false`. `true` if `allowUserInteraction` is `false`.
       * @param {Boolean} [options.mute]
       * start the video muted **default**: `false`
       * @param {String} [options.mimeType]
       * add `mimeType: "application/vnd.apple.mpegurl"` if you need to use a url without extension.
       * @param {Boolean} [options.actualLiveTime]
       * show duration and seek time relative to actual time.
       * @param {String} [options.actualLiveServerTime]
       * specify server time as a string, format: "2015/11/26 06:01:03". This option is meant to be used with actualLiveTime.
       * @param {Boolean} [options.persistConfig]
       * persist player's settings (volume) through the same domain **default**: `true`
       * @param {String} [options.preload] @deprecated
       * video will be preloaded according to `preload` attribute options **default**: `'metadata'`
       * @param {Number} [options.maxBufferLength] @deprecated
       * the default behavior for the **HLS playback** is to keep buffering indefinitely, even on VoD.
       * This replicates the behavior for progressive download, which continues buffering when pausing the video, thus making the video available for playback even on slow networks.
       * To change this behavior use `maxBufferLength` where **value is in seconds**.
       * @param {String} [options.gaAccount]
       * enable Google Analytics events dispatch **(play/pause/stop/buffering/etc)** by adding your `gaAccount`
       * @param {String} [options.gaTrackerName]
       * besides `gaAccount` you can optionally, pass your favorite trackerName as `gaTrackerName`
       * @param {Object} [options.mediacontrol]
       * customize control bar colors, example: `mediacontrol: {seekbar: "#E113D3", buttons: "#66B2FF"}`
       * @param {Boolean} [options.hideMediaControl]
       * control media control auto hide **default**: `true`
       * @param {Boolean} [options.hideVolumeBar]
       * when embedded with width less than 320, volume bar will hide. You can force this behavior for all sizes by adding `true` **default**: `false`
       * @param {String} [options.watermark]
       * put `watermark: 'http://url/img.png'` on your embed parameters to automatically add watermark on your video.
       * You can customize corner position by defining position parameter. Positions can be `bottom-left`, `bottom-right`, `top-left` and `top-right`.
       * @param {String} [options.watermarkLink]
       * `watermarkLink: 'http://example.net/'` - define URL to open when the watermark is clicked. If not provided watermark will not be clickable.
       * @param {Boolean} [options.disableVideoTagContextMenu] @deprecated
       * disables the context menu (right click) on the video element if a HTML5Video playback is used.
       * @param {Boolean} [options.autoSeekFromUrl]
       * Automatically seek to the seconds provided in the url (e.g example.com?t=100) **default**: `true`
       * @param {Boolean} [options.exitFullscreenOnEnd]
       * Automatically exit full screen when the media finishes. **default**: `true`
       * @param {String} [options.poster]
       * define a poster by adding its address `poster: 'http://url/img.png'`. It will appear after video embed, disappear on play and go back when user stops the video.
       * @param {String} [options.playbackNotSupportedMessage]
       * define a custom message to be displayed when a playback is not supported.
       * @param {Object} [options.events]
       * Specify listeners which will be registered with their corresponding player events.
       * E.g. onReady -> "PLAYER_READY", onTimeUpdate -> "PLAYER_TIMEUPDATE"
       * @param {PlaybackConfig} [options.playback]
       * Generic `Playback` component related configuration
       * @param {Boolean} [options.disableErrorScreen]
       * disables the error screen plugin.
       * @param {Number} [options.autoPlayTimeout]
       * autoplay check timeout.
       */

    }]);

    function Player(options) {
      var _this;

      _classCallCheck(this, Player);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Player).call(this, options));
      var playbackDefaultOptions = {
        recycleVideo: true
      };
      var defaultOptions = {
        playerId: uniqueId(''),
        persistConfig: true,
        width: 640,
        height: 360,
        baseUrl: baseUrl,
        allowUserInteraction: Browser.isMobile,
        playback: playbackDefaultOptions
      };
      _this._options = zepto.extend(defaultOptions, options);
      _this.options.sources = _this._normalizeSources(options);

      if (!_this.options.chromeless) {
        // "allowUserInteraction" cannot be false if not in chromeless mode.
        _this.options.allowUserInteraction = true;
      }

      if (!_this.options.allowUserInteraction) {
        // if user iteraction is not allowed ensure keyboard shortcuts are disabled
        _this.options.disableKeyboardShortcuts = true;
      }

      _this._registerOptionEventListeners(_this.options.events);

      _this._coreFactory = new CoreFactory(_assertThisInitialized(_this));
      if (_this.options.parentId) _this.setParentId(_this.options.parentId);else if (_this.options.parent) _this.attachTo(_this.options.parent);
      return _this;
    }
    /**
     * Specify a `parentId` to the player.
     * @method setParentId
     * @param {String} parentId the element parent id.
     * @return {Player} itself
     */


    _createClass(Player, [{
      key: "setParentId",
      value: function setParentId(parentId) {
        var el = document.querySelector(parentId);
        if (el) this.attachTo(el);
        return this;
      }
      /**
       * You can use this method to attach the player to a given element. You don't need to do this when you specify it during the player instantiation passing the `parentId` param.
       * @method attachTo
       * @param {Object} element a given element.
       * @return {Player} itself
       */

    }, {
      key: "attachTo",
      value: function attachTo(element) {
        this.options.parentElement = element;
        this.core = this._coreFactory.create();

        this._addEventListeners();

        return this;
      }
    }, {
      key: "_addEventListeners",
      value: function _addEventListeners() {
        if (!this.core.isReady) this.listenToOnce(this.core, Events.CORE_READY, this._onReady);else this._onReady();
        this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, this._containerChanged);
        this.listenTo(this.core, Events.CORE_FULLSCREEN, this._onFullscreenChange);
        this.listenTo(this.core, Events.CORE_RESIZE, this._onResize);
        return this;
      }
    }, {
      key: "_addContainerEventListeners",
      value: function _addContainerEventListeners() {
        var container = this.core.activeContainer;

        if (container) {
          this.listenTo(container, Events.CONTAINER_PLAY, this._onPlay);
          this.listenTo(container, Events.CONTAINER_PAUSE, this._onPause);
          this.listenTo(container, Events.CONTAINER_STOP, this._onStop);
          this.listenTo(container, Events.CONTAINER_ENDED, this._onEnded);
          this.listenTo(container, Events.CONTAINER_SEEK, this._onSeek);
          this.listenTo(container, Events.CONTAINER_ERROR, this._onError);
          this.listenTo(container, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate);
          this.listenTo(container, Events.CONTAINER_VOLUME, this._onVolumeUpdate);
          this.listenTo(container, Events.CONTAINER_SUBTITLE_AVAILABLE, this._onSubtitleAvailable);
        }

        return this;
      }
    }, {
      key: "_registerOptionEventListeners",
      value: function _registerOptionEventListeners() {
        var _this2 = this;

        var newEvents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var hasNewEvents = Object.keys(newEvents).length > 0;
        hasNewEvents && Object.keys(events).forEach(function (userEvent) {
          var eventType = _this2.eventsMapping[userEvent];
          eventType && _this2.off(eventType, events[userEvent]);
        });
        Object.keys(newEvents).forEach(function (userEvent) {
          var eventType = _this2.eventsMapping[userEvent];

          if (eventType) {
            var eventFunction = newEvents[userEvent];
            eventFunction = typeof eventFunction === 'function' && eventFunction;
            eventFunction && _this2.on(eventType, eventFunction);
          }
        });
        return this;
      }
    }, {
      key: "_containerChanged",
      value: function _containerChanged() {
        this.stopListening();

        this._addEventListeners();
      }
    }, {
      key: "_onReady",
      value: function _onReady() {
        this._ready = true;

        this._addContainerEventListeners();

        this.trigger(Events.PLAYER_READY);
      }
    }, {
      key: "_onFullscreenChange",
      value: function _onFullscreenChange(fullscreen) {
        this.trigger(Events.PLAYER_FULLSCREEN, fullscreen);
      }
    }, {
      key: "_onVolumeUpdate",
      value: function _onVolumeUpdate(volume) {
        this.trigger(Events.PLAYER_VOLUMEUPDATE, volume);
      }
    }, {
      key: "_onSubtitleAvailable",
      value: function _onSubtitleAvailable() {
        this.trigger(Events.PLAYER_SUBTITLE_AVAILABLE);
      }
    }, {
      key: "_onResize",
      value: function _onResize(size) {
        this.trigger(Events.PLAYER_RESIZE, size);
      }
    }, {
      key: "_onPlay",
      value: function _onPlay() {
        this.trigger(Events.PLAYER_PLAY);
      }
    }, {
      key: "_onPause",
      value: function _onPause() {
        this.trigger(Events.PLAYER_PAUSE);
      }
    }, {
      key: "_onStop",
      value: function _onStop() {
        this.trigger(Events.PLAYER_STOP, this.getCurrentTime());
      }
    }, {
      key: "_onEnded",
      value: function _onEnded() {
        this.trigger(Events.PLAYER_ENDED);
      }
    }, {
      key: "_onSeek",
      value: function _onSeek(time) {
        this.trigger(Events.PLAYER_SEEK, time);
      }
    }, {
      key: "_onTimeUpdate",
      value: function _onTimeUpdate(timeProgress) {
        this.trigger(Events.PLAYER_TIMEUPDATE, timeProgress);
      }
    }, {
      key: "_onError",
      value: function _onError(error) {
        this.trigger(Events.PLAYER_ERROR, error);
      }
    }, {
      key: "_normalizeSources",
      value: function _normalizeSources(options) {
        var sources = options.sources || (options.source !== undefined ? [options.source] : []);
        return sources.length === 0 ? [{
          source: '',
          mimeType: ''
        }] : sources;
      }
      /**
       * resizes the current player canvas.
       * @method resize
       * @param {Object} size should be a literal object with `height` and `width`.
       * @return {Player} itself
       * @example
       * ```javascript
       * player.resize({height: 360, width: 640})
       * ```
       */

    }, {
      key: "resize",
      value: function resize(size) {
        this.core.resize(size);
        return this;
      }
      /**
       * loads a new source.
       * @method load
       * @param {Array|String} sources source or sources of video.
       * An array item can be a string or {source: <<source URL>>, mimeType: <<source mime type>>}
       * @param {String} mimeType a mime type, example: `'application/vnd.apple.mpegurl'`
       * @param {Boolean} [autoPlay=false] whether playing should be started immediately
       * @return {Player} itself
       */

    }, {
      key: "load",
      value: function load(sources, mimeType, autoPlay) {
        if (autoPlay !== undefined) this.configure({
          autoPlay: !!autoPlay
        });
        this.core.load(sources, mimeType);
        return this;
      }
      /**
       * destroys the current player and removes it from the DOM.
       * @method destroy
       * @return {Player} itself
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this.stopListening();
        this.core.destroy();
        return this;
      }
      /**
       * Gives user consent to playback. Required by mobile device after a click event before Player.load().
       * @method consent
       * @return {Player} itself
       */

    }, {
      key: "consent",
      value: function consent() {
        this.core.getCurrentPlayback().consent();
        return this;
      }
      /**
       * plays the current video (`source`).
       * @method play
       * @return {Player} itself
       */

    }, {
      key: "play",
      value: function play() {
        this.core.activeContainer.play();
        return this;
      }
      /**
       * pauses the current video (`source`).
       * @method pause
       * @return {Player} itself
       */

    }, {
      key: "pause",
      value: function pause() {
        this.core.activeContainer.pause();
        return this;
      }
      /**
       * stops the current video (`source`).
       * @method stop
       * @return {Player} itself
       */

    }, {
      key: "stop",
      value: function stop() {
        this.core.activeContainer.stop();
        return this;
      }
      /**
       * seeks the current video (`source`). For example, `player.seek(120)` will seek to second 120 (2minutes) of the current video.
       * @method seek
       * @param {Number} time should be a number between 0 and the video duration.
       * @return {Player} itself
       */

    }, {
      key: "seek",
      value: function seek(time) {
        this.core.activeContainer.seek(time);
        return this;
      }
      /**
       * seeks the current video (`source`). For example, `player.seek(50)` will seek to the middle of the current video.
       * @method seekPercentage
       * @param {Number} time should be a number between 0 and 100.
       * @return {Player} itself
       */

    }, {
      key: "seekPercentage",
      value: function seekPercentage(percentage) {
        this.core.activeContainer.seekPercentage(percentage);
        return this;
      }
      /**
       * mutes the current video (`source`).
       * @method mute
       * @return {Player} itself
       */

    }, {
      key: "mute",
      value: function mute() {
        this._mutedVolume = this.getVolume();
        this.setVolume(0);
        return this;
      }
      /**
       * unmutes the current video (`source`).
       * @method unmute
       * @return {Player} itself
       */

    }, {
      key: "unmute",
      value: function unmute() {
        this.setVolume(typeof this._mutedVolume === 'number' ? this._mutedVolume : 100);
        this._mutedVolume = null;
        return this;
      }
      /**
       * checks if the player is playing.
       * @method isPlaying
       * @return {Boolean} `true` if the current source is playing, otherwise `false`
       */

    }, {
      key: "isPlaying",
      value: function isPlaying() {
        return this.core.activeContainer.isPlaying();
      }
      /**
       * returns `true` if DVR is enable otherwise `false`.
       * @method isDvrEnabled
       * @return {Boolean}
       */

    }, {
      key: "isDvrEnabled",
      value: function isDvrEnabled() {
        return this.core.activeContainer.isDvrEnabled();
      }
      /**
       * returns `true` if DVR is in use otherwise `false`.
       * @method isDvrInUse
       * @return {Boolean}
       */

    }, {
      key: "isDvrInUse",
      value: function isDvrInUse() {
        return this.core.activeContainer.isDvrInUse();
      }
      /**
       * enables to configure a player after its creation
       * @method configure
       * @param {Object} options all the options to change in form of a javascript object
       * @return {Player} itself
       */

    }, {
      key: "configure",
      value: function configure() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this._registerOptionEventListeners(options.events, this.options.events);

        this.core.configure(options);
        return this;
      }
      /**
       * get a plugin by its name.
       * @method getPlugin
       * @param {String} name of the plugin.
       * @return {Object} the plugin instance
       * @example
       * ```javascript
       * var poster = player.getPlugin('poster');
       * poster.hidePlayButton();
       * ```
       */

    }, {
      key: "getPlugin",
      value: function getPlugin(name) {
        var plugins = this.core.plugins.concat(this.core.activeContainer.plugins);
        return plugins.filter(function (plugin) {
          return plugin.name === name;
        })[0];
      }
      /**
       * the current time in seconds.
       * @method getCurrentTime
       * @return {Number} current time (in seconds) of the current source
       */

    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        return this.core.activeContainer.getCurrentTime();
      }
      /**
       * The time that "0" now represents relative to when playback started.
       * For a stream with a sliding window this will increase as content is
       * removed from the beginning.
       * @method getStartTimeOffset
       * @return {Number} time (in seconds) that time "0" represents.
       */

    }, {
      key: "getStartTimeOffset",
      value: function getStartTimeOffset() {
        return this.core.activeContainer.getStartTimeOffset();
      }
      /**
       * the duration time in seconds.
       * @method getDuration
       * @return {Number} duration time (in seconds) of the current source
       */

    }, {
      key: "getDuration",
      value: function getDuration() {
        return this.core.activeContainer.getDuration();
      }
    }]);

    return Player;
  }(BaseObject);
  Object.assign(Player.prototype, ErrorMixin);

  /**
   * The base class for a container plugin
   * @class ContainerPlugin
   * @constructor
   * @extends BaseObject
   * @module base
   */

  var ContainerPlugin =
  /*#__PURE__*/
  function (_BaseObject) {
    _inherits(ContainerPlugin, _BaseObject);

    _createClass(ContainerPlugin, [{
      key: "playerError",
      get: function get() {
        return this.container.playerError;
      }
    }]);

    function ContainerPlugin(container) {
      var _this;

      _classCallCheck(this, ContainerPlugin);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ContainerPlugin).call(this, container.options));
      _this.container = container;
      _this.enabled = true;

      _this.bindEvents();

      return _this;
    }

    _createClass(ContainerPlugin, [{
      key: "enable",
      value: function enable() {
        if (!this.enabled) {
          this.bindEvents();
          this.enabled = true;
        }
      }
    }, {
      key: "disable",
      value: function disable() {
        if (this.enabled) {
          this.stopListening();
          this.enabled = false;
        }
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {}
    }, {
      key: "destroy",
      value: function destroy() {
        this.stopListening();
      }
    }]);

    return ContainerPlugin;
  }(BaseObject);
  Object.assign(ContainerPlugin.prototype, ErrorMixin);

  ContainerPlugin.extend = function (properties) {
    return extend(ContainerPlugin, properties);
  };

  ContainerPlugin.type = 'container';

  var CorePlugin =
  /*#__PURE__*/
  function (_BaseObject) {
    _inherits(CorePlugin, _BaseObject);

    _createClass(CorePlugin, [{
      key: "playerError",
      get: function get() {
        return this.core.playerError;
      }
    }]);

    function CorePlugin(core) {
      var _this;

      _classCallCheck(this, CorePlugin);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CorePlugin).call(this, core.options));
      _this.core = core;
      _this.enabled = true;

      _this.bindEvents();

      return _this;
    }

    _createClass(CorePlugin, [{
      key: "bindEvents",
      value: function bindEvents() {}
    }, {
      key: "enable",
      value: function enable() {
        if (!this.enabled) {
          this.bindEvents();
          this.enabled = true;
        }
      }
    }, {
      key: "disable",
      value: function disable() {
        if (this.enabled) {
          this.stopListening();
          this.enabled = false;
        }
      }
    }, {
      key: "getExternalInterface",
      value: function getExternalInterface() {
        return {};
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.stopListening();
      }
    }]);

    return CorePlugin;
  }(BaseObject);
  Object.assign(CorePlugin.prototype, ErrorMixin);

  CorePlugin.extend = function (properties) {
    return extend(CorePlugin, properties);
  };

  CorePlugin.type = 'core';

  /**
   * The base class for an ui container plugin
   * @class UIContainerPlugin
   * @constructor
   * @extends UIObject
   * @module base
   */

  var UIContainerPlugin =
  /*#__PURE__*/
  function (_UIObject) {
    _inherits(UIContainerPlugin, _UIObject);

    _createClass(UIContainerPlugin, [{
      key: "playerError",
      get: function get() {
        return this.container.playerError;
      }
    }]);

    function UIContainerPlugin(container) {
      var _this;

      _classCallCheck(this, UIContainerPlugin);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(UIContainerPlugin).call(this, container.options));
      _this.container = container;
      _this.enabled = true;

      _this.bindEvents();

      return _this;
    }

    _createClass(UIContainerPlugin, [{
      key: "enable",
      value: function enable() {
        if (!this.enabled) {
          this.bindEvents();
          this.$el.show();
          this.enabled = true;
        }
      }
    }, {
      key: "disable",
      value: function disable() {
        this.stopListening();
        this.$el.hide();
        this.enabled = false;
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {}
    }]);

    return UIContainerPlugin;
  }(UIObject);
  Object.assign(UIContainerPlugin.prototype, ErrorMixin);

  UIContainerPlugin.extend = function (properties) {
    return extend(UIContainerPlugin, properties);
  };

  UIContainerPlugin.type = 'container';

  /* eslint-disable no-var */
  // Simple JavaScript Templating
  // Paul Miller (http://paulmillr.com)
  // http://underscorejs.org
  // (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  var settings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  }; // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.

  var noMatch = /(.)^/; // Certain characters need to be escaped so that they can be put into a
  // string literal.

  var escapes = {
    '\'': '\'',
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\t': 't',
    "\u2028": 'u2028',
    "\u2029": 'u2029'
  };
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g; // List of HTML entities for escaping.

  var htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;'
  };
  var entityRe = new RegExp('[&<>"\']', 'g');

  var escapeExpr = function escapeExpr(string) {
    if (string === null) return '';
    return ('' + string).replace(entityRe, function (match) {
      return htmlEntities[match];
    });
  };

  var counter = 0; // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.

  var tmpl = function tmpl(text, data) {
    var render; // Combine delimiters into one regular expression via alternation.

    var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g'); // Compile the template source, escaping string literals appropriately.

    var index = 0;
    var source = '__p+=\'';
    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, function (match) {
        return '\\' + escapes[match];
      });
      if (escape) source += '\'+\n((__t=(' + escape + '))==null?\'\':escapeExpr(__t))+\n\'';
      if (interpolate) source += '\'+\n((__t=(' + interpolate + '))==null?\'\':__t)+\n\'';
      if (evaluate) source += '\';\n' + evaluate + '\n__p+=\'';
      index = offset + match.length;
      return match;
    });
    source += '\';\n'; // If a variable is not specified, place data values in local scope.

    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
    source = 'var __t,__p=\'\',__j=Array.prototype.join,' + 'print=function(){__p+=__j.call(arguments,\'\');};\n' + source + 'return __p;\n//# sourceURL=/microtemplates/source[' + counter++ + ']';

    try {
      /*jshint -W054 */
      // TODO: find a way to avoid eval
      render = new Function(settings.variable || 'obj', 'escapeExpr', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, escapeExpr);

    var template = function template(data) {
      return render.call(this, data, escapeExpr);
    }; // Provide the compiled function source as a convenience for precompilation.


    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
    return template;
  };

  tmpl.settings = settings;

  var tracksHTML = "<% for (var i = 0; i < tracks.length; i++) { %>\n  <track data-html5-video-track=\"<%= i %>\" kind=\"<%= tracks[i].kind %>\" label=\"<%= tracks[i].label %>\" srclang=\"<%= tracks[i].lang %>\" src=\"<%= tracks[i].src %>\">\n<% }; %>\n";

  var css$2 = "[data-html5-video] {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  display: block; }\n";
  styleInject(css$2);

  var MIMETYPES = {
    'mp4': ['avc1.42E01E', 'avc1.58A01E', 'avc1.4D401E', 'avc1.64001E', 'mp4v.20.8', 'mp4v.20.240', 'mp4a.40.2'].map(function (codec) {
      return 'video/mp4; codecs="' + codec + ', mp4a.40.2"';
    }),
    'ogg': ['video/ogg; codecs="theora, vorbis"', 'video/ogg; codecs="dirac"', 'video/ogg; codecs="theora, speex"'],
    '3gpp': ['video/3gpp; codecs="mp4v.20.8, samr"'],
    'webm': ['video/webm; codecs="vp8, vorbis"'],
    'mkv': ['video/x-matroska; codecs="theora, vorbis"'],
    'm3u8': ['application/x-mpegurl']
  };
  MIMETYPES['ogv'] = MIMETYPES['ogg'];
  MIMETYPES['3gp'] = MIMETYPES['3gpp'];
  var AUDIO_MIMETYPES = {
    'wav': ['audio/wav'],
    'mp3': ['audio/mp3', 'audio/mpeg;codecs="mp3"'],
    'aac': ['audio/mp4;codecs="mp4a.40.5"'],
    'oga': ['audio/ogg']
  };
  var KNOWN_AUDIO_MIMETYPES = Object.keys(AUDIO_MIMETYPES).reduce(function (acc, k) {
    return [].concat(_toConsumableArray(acc), _toConsumableArray(AUDIO_MIMETYPES[k]));
  }, []);
  var UNKNOWN_ERROR = {
    code: 'unknown',
    message: 'unknown'
  }; // TODO: rename this Playback to HTML5Playback (breaking change, only after 0.3.0)

  var HTML5Video =
  /*#__PURE__*/
  function (_Playback) {
    _inherits(HTML5Video, _Playback);

    _createClass(HTML5Video, [{
      key: "name",
      get: function get() {
        return 'html5_video';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "tagName",
      get: function get() {
        return this.isAudioOnly ? 'audio' : 'video';
      }
    }, {
      key: "isAudioOnly",
      get: function get() {
        var resourceUrl = this.options.src;

        var mimeTypes = HTML5Video._mimeTypesForUrl(resourceUrl, AUDIO_MIMETYPES, this.options.mimeType);

        return this.options.playback && this.options.playback.audioOnly || this.options.audioOnly || KNOWN_AUDIO_MIMETYPES.indexOf(mimeTypes[0]) >= 0;
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'data-html5-video': ''
        };
      }
    }, {
      key: "events",
      get: function get() {
        return {
          'canplay': '_onCanPlay',
          'canplaythrough': '_handleBufferingEvents',
          'durationchange': '_onDurationChange',
          'ended': '_onEnded',
          'error': '_onError',
          'loadeddata': '_onLoadedData',
          'loadedmetadata': '_onLoadedMetadata',
          'pause': '_onPause',
          'playing': '_onPlaying',
          'progress': '_onProgress',
          'seeking': '_onSeeking',
          'seeked': '_onSeeked',
          'stalled': '_handleBufferingEvents',
          'timeupdate': '_onTimeUpdate',
          'waiting': '_onWaiting'
        };
      }
      /**
       * Determine if the playback has ended.
       * @property ended
       * @type Boolean
       */

    }, {
      key: "ended",
      get: function get() {
        return this.el.ended;
      }
      /**
       * Determine if the playback is having to buffer in order for
       * playback to be smooth.
       * This is related to the PLAYBACK_BUFFERING and PLAYBACK_BUFFERFULL events
       * @property buffering
       * @type Boolean
       */

    }, {
      key: "buffering",
      get: function get() {
        return this._isBuffering;
      }
    }]);

    function HTML5Video() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, HTML5Video);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(HTML5Video)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._destroyed = false;
      _this._loadStarted = false;
      _this._isBuffering = false;
      _this._playheadMoving = false;
      _this._playheadMovingTimer = null;
      _this._stopped = false;
      _this._ccTrackId = -1;

      _this._setupSrc(_this.options.src); // backwards compatibility (TODO: remove on 0.3.0)


      _this.options.playback || (_this.options.playback = _this.options || {});
      _this.options.playback.disableContextMenu = _this.options.playback.disableContextMenu || _this.options.disableVideoTagContextMenu;
      var playbackConfig = _this.options.playback;
      var preload = playbackConfig.preload || (Browser.isSafari ? 'auto' : _this.options.preload);
      var posterUrl; // FIXME: poster plugin should always convert poster to object with expected properties ?

      if (_this.options.poster) {
        if (typeof _this.options.poster === 'string') posterUrl = _this.options.poster;else if (typeof _this.options.poster.url === 'string') posterUrl = _this.options.poster.url;
      }

      zepto.extend(_this.el, {
        muted: _this.options.mute,
        defaultMuted: _this.options.mute,
        loop: _this.options.loop,
        poster: posterUrl,
        preload: preload || 'metadata',
        controls: (playbackConfig.controls || _this.options.useVideoTagDefaultControls) && 'controls',
        crossOrigin: playbackConfig.crossOrigin,
        'x-webkit-playsinline': playbackConfig.playInline
      });
      playbackConfig.playInline && _this.$el.attr({
        playsinline: 'playsinline'
      });
      playbackConfig.crossOrigin && _this.$el.attr({
        crossorigin: playbackConfig.crossOrigin
      }); // TODO should settings be private?

      _this.settings = {
        "default": ['seekbar']
      };
      _this.settings.left = ['playpause', 'position', 'duration'];
      _this.settings.right = ['fullscreen', 'volume', 'hd-indicator'];
      playbackConfig.externalTracks && _this._setupExternalTracks(playbackConfig.externalTracks);
      _this.options.autoPlay && _this.attemptAutoPlay();
      return _this;
    }

    _createClass(HTML5Video, [{
      key: "configure",
      value: function configure(options) {
        _get(_getPrototypeOf(HTML5Video.prototype), "configure", this).call(this, options);

        this.el.loop = !!options.loop;
      } // See Playback.attemptAutoPlay()

    }, {
      key: "attemptAutoPlay",
      value: function attemptAutoPlay() {
        var _this2 = this;

        this.canAutoPlay(function (result, error) {
          error && Log.warn(_this2.name, 'autoplay error.', {
            result: result,
            error: error
          }); // https://github.com/clappr/clappr/issues/1076

          result && nextTick(function () {
            return !_this2._destroyed && _this2.play();
          });
        });
      } // See Playback.canAutoPlay()

    }, {
      key: "canAutoPlay",
      value: function canAutoPlay(cb) {
        if (this.options.disableCanAutoPlay) cb(true, null);
        var opts = {
          timeout: this.options.autoPlayTimeout || 500,
          inline: this.options.playback.playInline || false,
          muted: this.options.mute || false // Known issue: mediacontrols may asynchronously mute video

        }; // Use current video element if recycling feature enabled with mobile devices

        if (Browser.isMobile && DomRecycler.options.recycleVideo) opts.element = this.el; // Desktop browser autoplay policy may require user action
        // Mobile browser autoplay require user consent and video recycling feature enabled
        // It may returns a false positive with source-less player consent

        canAutoPlayMedia(cb, opts);
      }
    }, {
      key: "_setupExternalTracks",
      value: function _setupExternalTracks(tracks) {
        this._externalTracks = tracks.map(function (track) {
          return {
            kind: track.kind || 'subtitles',
            // Default is 'subtitles'
            label: track.label,
            lang: track.lang,
            src: track.src
          };
        });
      }
      /**
       * Sets the source url on the <video> element, and also the 'src' property.
       * @method setupSrc
       * @private
       * @param {String} srcUrl The source URL.
       */

    }, {
      key: "_setupSrc",
      value: function _setupSrc(srcUrl) {
        if (this.el.src === srcUrl) return;
        this._ccIsSetup = false;
        this.el.src = srcUrl;
        this._src = this.el.src;
      }
    }, {
      key: "_onLoadedMetadata",
      value: function _onLoadedMetadata(e) {
        this._handleBufferingEvents();

        this.trigger(Events.PLAYBACK_LOADEDMETADATA, {
          duration: e.target.duration,
          data: e
        });

        this._updateSettings();

        var autoSeekFromUrl = typeof this._options.autoSeekFromUrl === 'undefined' || this._options.autoSeekFromUrl;
        if (this.getPlaybackType() !== Playback.LIVE && autoSeekFromUrl) this._checkInitialSeek();
      }
    }, {
      key: "_onDurationChange",
      value: function _onDurationChange() {
        this._updateSettings();

        this._onTimeUpdate(); // onProgress uses the duration


        this._onProgress();
      }
    }, {
      key: "_updateSettings",
      value: function _updateSettings() {
        // we can't figure out if hls resource is VoD or not until it is being loaded or duration has changed.
        // that's why we check it again and update media control accordingly.
        if (this.getPlaybackType() === Playback.VOD || this.getPlaybackType() === Playback.AOD) this.settings.left = ['playpause', 'position', 'duration'];else this.settings.left = ['playstop'];
        this.settings.seekEnabled = this.isSeekEnabled();
        this.trigger(Events.PLAYBACK_SETTINGSUPDATE);
      }
    }, {
      key: "isSeekEnabled",
      value: function isSeekEnabled() {
        return isFinite(this.getDuration());
      }
    }, {
      key: "getPlaybackType",
      value: function getPlaybackType() {
        var onDemandType = this.tagName === 'audio' ? Playback.AOD : Playback.VOD;
        return [0, undefined, Infinity].indexOf(this.el.duration) >= 0 ? Playback.LIVE : onDemandType;
      }
    }, {
      key: "isHighDefinitionInUse",
      value: function isHighDefinitionInUse() {
        return false;
      } // On mobile device, HTML5 video element "retains" user action consent if
      // load() method is called. See Player.consent().

    }, {
      key: "consent",
      value: function consent() {
        if (!this.isPlaying()) {
          _get(_getPrototypeOf(HTML5Video.prototype), "consent", this).call(this);

          this.el.load();
        }
      }
    }, {
      key: "play",
      value: function play() {
        this.trigger(Events.PLAYBACK_PLAY_INTENT);
        this._stopped = false;

        this._setupSrc(this._src);

        this._handleBufferingEvents();

        var promise = this.el.play(); // For more details, see https://developers.google.com/web/updates/2016/03/play-returns-promise

        if (promise && promise["catch"]) promise["catch"](function () {});
      }
    }, {
      key: "pause",
      value: function pause() {
        this.el.pause();
      }
    }, {
      key: "stop",
      value: function stop() {
        this.pause();
        this._stopped = true; // src will be added again in play()

        this.el.removeAttribute('src');
        this.el.load(); // load with no src to stop loading of the previous source and avoid leaks

        this._stopPlayheadMovingChecks();

        this._handleBufferingEvents();

        this.trigger(Events.PLAYBACK_STOP);
      }
    }, {
      key: "volume",
      value: function volume(value) {
        if (value === 0) {
          this.$el.attr({
            muted: 'true'
          });
          this.el.muted = true;
        } else {
          this.$el.attr({
            muted: null
          });
          this.el.muted = false;
          this.el.volume = value / 100;
        }
      }
      /**
       * @deprecated
       * @private
       */

    }, {
      key: "mute",
      value: function mute() {
        this.el.muted = true;
      }
      /**
       * @deprecated
       * @private
       */

    }, {
      key: "unmute",
      value: function unmute() {
        this.el.muted = false;
      }
    }, {
      key: "isMuted",
      value: function isMuted() {
        return this.el.muted === true || this.el.volume === 0;
      }
    }, {
      key: "isPlaying",
      value: function isPlaying() {
        return !this.el.paused && !this.el.ended;
      }
    }, {
      key: "_startPlayheadMovingChecks",
      value: function _startPlayheadMovingChecks() {
        if (this._playheadMovingTimer !== null) return;
        this._playheadMovingTimeOnCheck = null;

        this._determineIfPlayheadMoving();

        this._playheadMovingTimer = setInterval(this._determineIfPlayheadMoving.bind(this), 500);
      }
    }, {
      key: "_stopPlayheadMovingChecks",
      value: function _stopPlayheadMovingChecks() {
        if (this._playheadMovingTimer === null) return;
        clearInterval(this._playheadMovingTimer);
        this._playheadMovingTimer = null;
        this._playheadMoving = false;
      }
    }, {
      key: "_determineIfPlayheadMoving",
      value: function _determineIfPlayheadMoving() {
        var before = this._playheadMovingTimeOnCheck;
        var now = this.el.currentTime;
        this._playheadMoving = before !== now;
        this._playheadMovingTimeOnCheck = now;

        this._handleBufferingEvents();
      } // this seems to happen when the user is having to wait
      // for something to happen AFTER A USER INTERACTION
      // e.g the player might be buffering, but when `play()` is called
      // only at this point will this be called.
      // Or the user may seek somewhere but the new area requires buffering,
      // so it will fire then as well.
      // On devices where playing is blocked until requested with a user action,
      // buffering may start, but never finish until the user initiates a play,
      // but this only happens when play is actually requested

    }, {
      key: "_onWaiting",
      value: function _onWaiting() {
        this._loadStarted = true;

        this._handleBufferingEvents();
      } // called after the first frame has loaded
      // note this doesn't fire on ios before the user has requested play
      // ideally the "loadstart" event would be used instead, but this fires
      // before a user has requested play on iOS, and also this is always fired
      // even if the preload setting is "none". In both these cases this causes
      // infinite buffering until the user does something which isn't great.

    }, {
      key: "_onLoadedData",
      value: function _onLoadedData() {
        this._loadStarted = true;

        this._handleBufferingEvents();
      } // note this doesn't fire on ios before user has requested play

    }, {
      key: "_onCanPlay",
      value: function _onCanPlay() {
        this._handleBufferingEvents();
      }
    }, {
      key: "_onPlaying",
      value: function _onPlaying() {
        this._checkForClosedCaptions();

        this._startPlayheadMovingChecks();

        this._handleBufferingEvents();

        this.trigger(Events.PLAYBACK_PLAY);
      }
    }, {
      key: "_onPause",
      value: function _onPause() {
        this._stopPlayheadMovingChecks();

        this._handleBufferingEvents();

        this.trigger(Events.PLAYBACK_PAUSE);
      }
    }, {
      key: "_onSeeking",
      value: function _onSeeking() {
        this._handleBufferingEvents();

        this.trigger(Events.PLAYBACK_SEEK);
      }
    }, {
      key: "_onSeeked",
      value: function _onSeeked() {
        this._handleBufferingEvents();

        this.trigger(Events.PLAYBACK_SEEKED);
      }
    }, {
      key: "_onEnded",
      value: function _onEnded() {
        this._handleBufferingEvents();

        this.trigger(Events.PLAYBACK_ENDED, this.name);
      } // The playback should be classed as buffering if the following are true:
      // - the ready state is less then HAVE_FUTURE_DATA or the playhead isn't moving and it should be
      // - the media hasn't "ended",
      // - the media hasn't been stopped
      // - loading has started

    }, {
      key: "_handleBufferingEvents",
      value: function _handleBufferingEvents() {
        var playheadShouldBeMoving = !this.el.ended && !this.el.paused;
        var buffering = this._loadStarted && !this.el.ended && !this._stopped && (playheadShouldBeMoving && !this._playheadMoving || this.el.readyState < this.el.HAVE_FUTURE_DATA);

        if (this._isBuffering !== buffering) {
          this._isBuffering = buffering;
          if (buffering) this.trigger(Events.PLAYBACK_BUFFERING, this.name);else this.trigger(Events.PLAYBACK_BUFFERFULL, this.name);
        }
      }
    }, {
      key: "_onError",
      value: function _onError() {
        var _ref = this.el.error || UNKNOWN_ERROR,
            code = _ref.code,
            message = _ref.message;

        var isUnknownError = code === UNKNOWN_ERROR.code;
        var formattedError = this.createError({
          code: code,
          description: message,
          raw: this.el.error,
          level: isUnknownError ? PlayerError.Levels.WARN : PlayerError.Levels.FATAL
        });
        if (isUnknownError) Log.warn(this.name, 'HTML5 unknown error: ', formattedError);else this.trigger(Events.PLAYBACK_ERROR, formattedError);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._destroyed = true;
        this.handleTextTrackChange && this.el.textTracks.removeEventListener('change', this.handleTextTrackChange);

        _get(_getPrototypeOf(HTML5Video.prototype), "destroy", this).call(this);

        this.el.removeAttribute('src');
        this.el.load(); // load with no src to stop loading of the previous source and avoid leaks

        this._src = null;
        DomRecycler.garbage(this.$el);
      }
    }, {
      key: "seek",
      value: function seek(time) {
        this.el.currentTime = time;
      }
    }, {
      key: "seekPercentage",
      value: function seekPercentage(percentage) {
        var time = this.el.duration * (percentage / 100);
        this.seek(time);
      }
    }, {
      key: "_checkInitialSeek",
      value: function _checkInitialSeek() {
        var seekTime = seekStringToSeconds();
        if (seekTime !== 0) this.seek(seekTime);
      }
    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        return this.el.currentTime;
      }
    }, {
      key: "getDuration",
      value: function getDuration() {
        return this.el.duration;
      }
    }, {
      key: "_onTimeUpdate",
      value: function _onTimeUpdate() {
        if (this.getPlaybackType() === Playback.LIVE) this.trigger(Events.PLAYBACK_TIMEUPDATE, {
          current: 1,
          total: 1
        }, this.name);else this.trigger(Events.PLAYBACK_TIMEUPDATE, {
          current: this.el.currentTime,
          total: this.el.duration
        }, this.name);
      }
    }, {
      key: "_onProgress",
      value: function _onProgress() {
        if (!this.el.buffered.length) return;
        var buffered = [];
        var bufferedPos = 0;

        for (var i = 0; i < this.el.buffered.length; i++) {
          buffered = [].concat(_toConsumableArray(buffered), [{
            start: this.el.buffered.start(i),
            end: this.el.buffered.end(i)
          }]);
          if (this.el.currentTime >= buffered[i].start && this.el.currentTime <= buffered[i].end) bufferedPos = i;
        }

        var progress = {
          start: buffered[bufferedPos].start,
          current: buffered[bufferedPos].end,
          total: this.el.duration
        };
        this.trigger(Events.PLAYBACK_PROGRESS, progress, buffered);
      }
    }, {
      key: "_typeFor",
      value: function _typeFor(src) {
        var mimeTypes = HTML5Video._mimeTypesForUrl(src, MIMETYPES, this.options.mimeType);

        if (mimeTypes.length === 0) mimeTypes = HTML5Video._mimeTypesForUrl(src, AUDIO_MIMETYPES, this.options.mimeType);
        var mimeType = mimeTypes[0] || '';
        return mimeType.split(';')[0];
      }
    }, {
      key: "_ready",
      value: function _ready() {
        if (this._isReadyState) return;
        this._isReadyState = true;
        this.trigger(Events.PLAYBACK_READY, this.name);
      }
    }, {
      key: "_checkForClosedCaptions",
      value: function _checkForClosedCaptions() {
        // Check if CC available only if current playback is HTML5Video
        if (this.isHTML5Video && !this._ccIsSetup) {
          if (this.hasClosedCaptionsTracks) {
            this.trigger(Events.PLAYBACK_SUBTITLE_AVAILABLE);
            var trackId = this.closedCaptionsTrackId;
            this.closedCaptionsTrackId = trackId;
            this.handleTextTrackChange = this._handleTextTrackChange.bind(this);
            this.el.textTracks.addEventListener('change', this.handleTextTrackChange);
          }

          this._ccIsSetup = true;
        }
      }
    }, {
      key: "_handleTextTrackChange",
      value: function _handleTextTrackChange() {
        var tracks = this.closedCaptionsTracks;
        var track = tracks.find(function (track) {
          return track.track.mode === 'showing';
        }) || {
          id: -1
        };

        if (this._ccTrackId !== track.id) {
          this._ccTrackId = track.id;
          this.trigger(Events.PLAYBACK_SUBTITLE_CHANGED, {
            id: track.id
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        if (this.options.playback.disableContextMenu) {
          this.$el.on('contextmenu', function () {
            return false;
          });
        }

        if (this._externalTracks && this._externalTracks.length > 0) {
          this.$el.html(this.template({
            tracks: this._externalTracks
          }));
        }

        this._ready();

        return this;
      }
    }, {
      key: "isReady",
      get: function get() {
        return this._isReadyState;
      }
    }, {
      key: "isHTML5Video",
      get: function get() {
        return this.name === HTML5Video.prototype.name;
      }
    }, {
      key: "closedCaptionsTracks",
      get: function get() {
        var id = 0;

        var trackId = function trackId() {
          return id++;
        };

        var textTracks = this.el.textTracks ? Array.from(this.el.textTracks) : [];
        return textTracks.filter(function (track) {
          return track.kind === 'subtitles' || track.kind === 'captions';
        }).map(function (track) {
          return {
            id: trackId(),
            name: track.label,
            track: track
          };
        });
      }
    }, {
      key: "closedCaptionsTrackId",
      get: function get() {
        return this._ccTrackId;
      },
      set: function set(trackId) {
        if (!isNumber(trackId)) return;
        var tracks = this.closedCaptionsTracks;
        var showingTrack; // Note: -1 is for hide all tracks

        if (trackId !== -1) {
          showingTrack = tracks.find(function (track) {
            return track.id === trackId;
          });
          if (!showingTrack) return; // Track id not found

          if (showingTrack.track.mode === 'showing') return; // Track already showing
        } // Since it is possible to display multiple tracks,
        // ensure that all tracks are hidden.


        tracks.filter(function (track) {
          return track.track.mode !== 'hidden';
        }).forEach(function (track) {
          return track.track.mode = 'hidden';
        });
        showingTrack && (showingTrack.track.mode = 'showing');
        this._ccTrackId = trackId;
        this.trigger(Events.PLAYBACK_SUBTITLE_CHANGED, {
          id: trackId
        });
      }
    }, {
      key: "template",
      get: function get() {
        return tmpl(tracksHTML);
      }
    }]);

    return HTML5Video;
  }(Playback);

  HTML5Video._mimeTypesForUrl = function (resourceUrl, mimeTypesByExtension, mimeType) {
    var extension = (resourceUrl.split('?')[0].match(/.*\.(.*)$/) || [])[1];
    var mimeTypes = mimeType || extension && mimeTypesByExtension[extension.toLowerCase()] || [];
    return mimeTypes.constructor === Array ? mimeTypes : [mimeTypes];
  };

  HTML5Video._canPlay = function (type, mimeTypesByExtension, resourceUrl, mimeType) {
    var mimeTypes = HTML5Video._mimeTypesForUrl(resourceUrl, mimeTypesByExtension, mimeType);

    var media = document.createElement(type);
    return !!mimeTypes.filter(function (mediaType) {
      return !!media.canPlayType(mediaType).replace(/no/, '');
    })[0];
  };

  HTML5Video.canPlay = function (resourceUrl, mimeType) {
    return HTML5Video._canPlay('audio', AUDIO_MIMETYPES, resourceUrl, mimeType) || HTML5Video._canPlay('video', MIMETYPES, resourceUrl, mimeType);
  };

  var HTML5Audio =
  /*#__PURE__*/
  function (_HTML5Video) {
    _inherits(HTML5Audio, _HTML5Video);

    function HTML5Audio() {
      _classCallCheck(this, HTML5Audio);

      return _possibleConstructorReturn(this, _getPrototypeOf(HTML5Audio).apply(this, arguments));
    }

    _createClass(HTML5Audio, [{
      key: "updateSettings",
      value: function updateSettings() {
        this.settings.left = ['playpause', 'position', 'duration'];
        this.settings.seekEnabled = this.isSeekEnabled();
        this.trigger(Events.PLAYBACK_SETTINGSUPDATE);
      }
    }, {
      key: "getPlaybackType",
      value: function getPlaybackType() {
        return Playback.AOD;
      }
    }, {
      key: "name",
      get: function get() {
        return 'html5_audio';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "tagName",
      get: function get() {
        return 'audio';
      }
    }, {
      key: "isAudioOnly",
      get: function get() {
        return true;
      }
    }]);

    return HTML5Audio;
  }(HTML5Video);

  HTML5Audio.canPlay = function (resourceUrl, mimeType) {
    var mimetypes = {
      'wav': ['audio/wav'],
      'mp3': ['audio/mp3', 'audio/mpeg;codecs="mp3"'],
      'aac': ['audio/mp4;codecs="mp4a.40.5"'],
      'oga': ['audio/ogg']
    };
    return HTML5Video._canPlay('audio', mimetypes, resourceUrl, mimeType);
  };

  var css$3 = "[data-html-img] {\n  max-width: 100%;\n  max-height: 100%; }\n";
  styleInject(css$3);

  var HTMLImg =
  /*#__PURE__*/
  function (_Playback) {
    _inherits(HTMLImg, _Playback);

    _createClass(HTMLImg, [{
      key: "getPlaybackType",
      value: function getPlaybackType() {
        return Playback.NO_OP;
      }
    }, {
      key: "name",
      get: function get() {
        return 'html_img';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "tagName",
      get: function get() {
        return 'img';
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'data-html-img': ''
        };
      }
    }, {
      key: "events",
      get: function get() {
        return {
          'load': '_onLoad',
          'abort': '_onError',
          'error': '_onError'
        };
      }
    }]);

    function HTMLImg(params) {
      var _this;

      _classCallCheck(this, HTMLImg);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(HTMLImg).call(this, params));
      _this.el.src = params.src;
      return _this;
    }

    _createClass(HTMLImg, [{
      key: "render",
      value: function render() {
        this.trigger(Events.PLAYBACK_READY, this.name);
        return this;
      }
    }, {
      key: "_onLoad",
      value: function _onLoad() {
        this.trigger(Events.PLAYBACK_ENDED, this.name);
      }
    }, {
      key: "_onError",
      value: function _onError(evt) {
        var m = evt.type === 'error' ? 'load error' : 'loading aborted';
        this.trigger(Events.PLAYBACK_ERROR, {
          message: m
        }, this.name);
      }
    }]);

    return HTMLImg;
  }(Playback);

  HTMLImg.canPlay = function (resource) {
    return /\.(png|jpg|jpeg|gif|bmp|tiff|pgm|pnm|webp)(|\?.*)$/i.test(resource);
  };

  var noOpHTML = "<canvas data-no-op-canvas></canvas>\n<p data-no-op-msg><%=message%></p><p>\n</p>";

  var css$4 = "[data-no-op] {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  text-align: center; }\n\n[data-no-op] p[data-no-op-msg] {\n  position: absolute;\n  text-align: center;\n  font-size: 25px;\n  left: 0;\n  right: 0;\n  color: white;\n  padding: 10px;\n  /* center vertically */\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n  max-height: 100%;\n  overflow: auto; }\n\n[data-no-op] canvas[data-no-op-canvas] {\n  background-color: #777;\n  height: 100%;\n  width: 100%; }\n";
  styleInject(css$4);

  var NoOp =
  /*#__PURE__*/
  function (_Playback) {
    _inherits(NoOp, _Playback);

    _createClass(NoOp, [{
      key: "name",
      get: function get() {
        return 'no_op';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "template",
      get: function get() {
        return tmpl(noOpHTML);
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'data-no-op': ''
        };
      }
    }]);

    function NoOp() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, NoOp);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(NoOp)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._noiseFrameNum = -1;
      return _this;
    }

    _createClass(NoOp, [{
      key: "render",
      value: function render() {
        var playbackNotSupported = this.options.playbackNotSupportedMessage || this.i18n.t('playback_not_supported');
        this.$el.html(this.template({
          message: playbackNotSupported
        }));
        this.trigger(Events.PLAYBACK_READY, this.name);
        var showForNoOp = !!(this.options.poster && this.options.poster.showForNoOp);
        if (this.options.autoPlay || !showForNoOp) this._animate();
        return this;
      }
    }, {
      key: "_noise",
      value: function _noise() {
        this._noiseFrameNum = (this._noiseFrameNum + 1) % 5;

        if (this._noiseFrameNum) {
          // only update noise every 5 frames to save cpu
          return;
        }

        var idata = this.context.createImageData(this.context.canvas.width, this.context.canvas.height);
        var buffer32;

        try {
          buffer32 = new Uint32Array(idata.data.buffer);
        } catch (err) {
          buffer32 = new Uint32Array(this.context.canvas.width * this.context.canvas.height * 4);
          var data = idata.data;

          for (var i = 0; i < data.length; i++) {
            buffer32[i] = data[i];
          }
        }

        var len = buffer32.length,
            m = Math.random() * 6 + 4;
        var run = 0,
            color = 0;

        for (var _i = 0; _i < len;) {
          if (run < 0) {
            run = m * Math.random();
            var p = Math.pow(Math.random(), 0.4);
            color = 255 * p << 24;
          }

          run -= 1;
          buffer32[_i++] = color;
        }

        this.context.putImageData(idata, 0, 0);
      }
    }, {
      key: "_loop",
      value: function _loop() {
        var _this2 = this;

        if (this._stop) return;

        this._noise();

        this._animationHandle = requestAnimationFrame(function () {
          return _this2._loop();
        });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._animationHandle) {
          cancelAnimationFrame(this._animationHandle);
          this._stop = true;
        }
      }
    }, {
      key: "_animate",
      value: function _animate() {
        this.canvas = this.$el.find('canvas[data-no-op-canvas]')[0];
        this.context = this.canvas.getContext('2d');

        this._loop();
      }
    }]);

    return NoOp;
  }(Playback);

  NoOp.canPlay = function (source) {
    // eslint-disable-line no-unused-vars
    return true;
  };

  // Copyright 2014 Globo.com Player authors. All rights reserved.
  var Styler = {
    getStyleFor: function getStyleFor(style) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        baseUrl: ''
      };
      return zepto('<style class="clappr-style"></style>').html(tmpl(style.toString())(options));
    }
  };

  /**
   * The internationalization (i18n) plugin
   * @class Strings
   * @constructor
   * @extends CorePlugin
   * @module plugins
   */

  var Strings =
  /*#__PURE__*/
  function (_CorePlugin) {
    _inherits(Strings, _CorePlugin);

    _createClass(Strings, [{
      key: "name",
      get: function get() {
        return 'strings';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }]);

    function Strings(core) {
      var _this;

      _classCallCheck(this, Strings);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Strings).call(this, core));

      _this._initializeMessages();

      return _this;
    }
    /**
     * Gets a translated string for the given key.
     * @method t
     * @param {String} key the key to all messages
     * @return {String} translated label
     */


    _createClass(Strings, [{
      key: "t",
      value: function t(key) {
        var lang = this._language();

        var fallbackLang = this._messages['en'];
        var i18n = lang && this._messages[lang] || fallbackLang;
        return i18n[key] || fallbackLang[key] || key;
      }
    }, {
      key: "_language",
      value: function _language() {
        return this.core.options.language || getBrowserLanguage();
      }
    }, {
      key: "_initializeMessages",
      value: function _initializeMessages() {
        var defaultMessages = {
          'en': {
            'live': 'live',
            'back_to_live': 'back to live',
            'disabled': 'Disabled',
            'playback_not_supported': 'Your browser does not support the playback of this video. Please try using a different browser.',
            'default_error_title': 'Could not play video.',
            'default_error_message': 'There was a problem trying to load the video.'
          },
          'pt': {
            'live': 'ao vivo',
            'back_to_live': 'voltar para o ao vivo',
            'disabled': 'Desativado',
            'playback_not_supported': 'Seu navegador não supporta a reprodução deste video. Por favor, tente usar um navegador diferente.',
            'default_error_title': 'Não foi possível reproduzir o vídeo.',
            'default_error_message': 'Ocorreu um problema ao tentar carregar o vídeo.'
          },
          'es': {
            'live': 'vivo',
            'back_to_live': 'volver en vivo',
            'disabled': 'Discapacitado',
            'playback_not_supported': 'Su navegador no soporta la reproducción de un video. Por favor, trate de usar un navegador diferente.'
          },
          'ru': {
            'live': 'прямой эфир',
            'back_to_live': 'к прямому эфиру',
            'disabled': 'Отключено',
            'playback_not_supported': 'Ваш браузер не поддерживает воспроизведение этого видео. Пожалуйста, попробуйте другой браузер.'
          },
          'fr': {
            'live': 'en direct',
            'back_to_live': 'retour au direct',
            'disabled': 'Désactivé',
            'playback_not_supported': 'Votre navigateur ne supporte pas la lecture de cette vidéo. Merci de tenter sur un autre navigateur.',
            'default_error_title': 'Impossible de lire la vidéo.',
            'default_error_message': 'Un problème est survenu lors du chargement de la vidéo.'
          },
          'tr': {
            'live': 'canlı',
            'back_to_live': 'canlı yayına dön',
            'disabled': 'Engelli',
            'playback_not_supported': 'Tarayıcınız bu videoyu oynatma desteğine sahip değil. Lütfen farklı bir tarayıcı ile deneyin.'
          },
          'et': {
            'live': 'Otseülekanne',
            'back_to_live': 'Tagasi otseülekande juurde',
            'disabled': 'Keelatud',
            'playback_not_supported': 'Teie brauser ei toeta selle video taasesitust. Proovige kasutada muud brauserit.'
          },
          'ar': {
            'live': 'مباشر',
            'back_to_live': 'الرجوع إلى المباشر',
            'disabled': 'معطّل',
            'playback_not_supported': 'المتصفح الذي تستخدمه لا يدعم تشغيل هذا الفيديو. الرجاء إستخدام متصفح آخر.',
            'default_error_title': 'غير قادر الى التشغيل.',
            'default_error_message': 'حدثت مشكلة أثناء تحميل الفيديو.'
          }
        };
        this._messages = zepto.extend(true, defaultMessages, this.core.options.strings || {});
        this._messages['pt-BR'] = this._messages['pt'];
        this._messages['en-US'] = this._messages['en'];
        this._messages['es-419'] = this._messages['es'];
        this._messages['fr-FR'] = this._messages['fr'];
        this._messages['tr-TR'] = this._messages['tr'];
        this._messages['et-EE'] = this._messages['et'];
        this._messages['ar-IQ'] = this._messages['ar'];
      }
    }]);

    return Strings;
  }(CorePlugin);

  // Copyright 2014 Globo.com Player authors. All rights reserved.
  var version$1 = "0.4.5"; // Built-in Plugins/Playbacks

  Loader.registerPlugin(Strings);
  Loader.registerPlayback(NoOp);
  Loader.registerPlayback(HTMLImg);
  Loader.registerPlayback(HTML5Audio);
  Loader.registerPlayback(HTML5Video);
  var main = {
    Player: Player,
    Events: Events,
    Browser: Browser,
    ContainerPlugin: ContainerPlugin,
    UIContainerPlugin: UIContainerPlugin,
    CorePlugin: CorePlugin,
    UICorePlugin: UICorePlugin,
    Playback: Playback,
    Container: Container,
    Core: Core,
    PlayerError: PlayerError,
    Loader: Loader,
    BaseObject: BaseObject,
    UIObject: UIObject,
    Utils: Utils,
    HTML5Audio: HTML5Audio,
    HTML5Video: HTML5Video,
    HTMLImg: HTMLImg,
    Log: Log,
    Styler: Styler,
    version: version$1,
    template: tmpl,
    $: zepto
  };

  exports.$ = zepto;
  exports.BaseObject = BaseObject;
  exports.Browser = Browser;
  exports.Container = Container;
  exports.ContainerPlugin = ContainerPlugin;
  exports.Core = Core;
  exports.CorePlugin = CorePlugin;
  exports.Events = Events;
  exports.HTML5Audio = HTML5Audio;
  exports.HTML5Video = HTML5Video;
  exports.HTMLImg = HTMLImg;
  exports.Loader = Loader;
  exports.Log = Log;
  exports.Playback = Playback;
  exports.Player = Player;
  exports.PlayerError = PlayerError;
  exports.Styler = Styler;
  exports.UIContainerPlugin = UIContainerPlugin;
  exports.UICorePlugin = UICorePlugin;
  exports.UIObject = UIObject;
  exports.Utils = Utils;
  exports.default = main;
  exports.template = tmpl;
  exports.version = version$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
