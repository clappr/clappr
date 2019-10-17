(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("hls.js"));
	else if(typeof define === 'function' && define.amd)
		define(["hls.js"], factory);
	else if(typeof exports === 'object')
		exports["HlsjsPlayback"] = factory(require("hls.js"));
	else
		root["HlsjsPlayback"] = factory(root["Hls"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_hls_js__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/hls.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@clappr/core/dist/clappr-core.js":
/*!*******************************************************!*\
  !*** ./node_modules/@clappr/core/dist/clappr-core.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-runtime/core-js/array/from.js":
/*!**********************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/array/from.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/array/from */ "./node_modules/core-js/library/fn/array/from.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/get-iterator.js":
/*!************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/get-iterator.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/get-iterator */ "./node_modules/core-js/library/fn/get-iterator.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/is-iterable.js":
/*!***********************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/is-iterable.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/is-iterable */ "./node_modules/core-js/library/fn/is-iterable.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/assign.js":
/*!*************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/assign.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/assign */ "./node_modules/core-js/library/fn/object/assign.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/create.js":
/*!*************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/create.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/create */ "./node_modules/core-js/library/fn/object/create.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/define-property.js":
/*!**********************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/define-property.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/define-property */ "./node_modules/core-js/library/fn/object/define-property.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/entries.js":
/*!**************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/entries.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/entries */ "./node_modules/core-js/library/fn/object/entries.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/get-own-property-descriptor.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/get-own-property-descriptor.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/get-own-property-descriptor */ "./node_modules/core-js/library/fn/object/get-own-property-descriptor.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/keys.js":
/*!***********************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/keys.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/keys */ "./node_modules/core-js/library/fn/object/keys.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/set-prototype-of.js":
/*!***********************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/set-prototype-of.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/set-prototype-of */ "./node_modules/core-js/library/fn/object/set-prototype-of.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/values.js":
/*!*************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/values.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/values */ "./node_modules/core-js/library/fn/object/values.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/symbol.js":
/*!******************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/symbol.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol */ "./node_modules/core-js/library/fn/symbol/index.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/symbol/iterator.js":
/*!***************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/symbol/iterator.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol/iterator */ "./node_modules/core-js/library/fn/symbol/iterator.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/classCallCheck.js":
/*!**************************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/classCallCheck.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/createClass.js":
/*!***********************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/createClass.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(/*! ../core-js/object/define-property */ "./node_modules/babel-runtime/core-js/object/define-property.js");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/inherits.js":
/*!********************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/inherits.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(/*! ../core-js/object/set-prototype-of */ "./node_modules/babel-runtime/core-js/object/set-prototype-of.js");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(/*! ../core-js/object/create */ "./node_modules/babel-runtime/core-js/object/create.js");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ "./node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js":
/*!*************************************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/possibleConstructorReturn.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ "./node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/slicedToArray.js":
/*!*************************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/slicedToArray.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isIterable2 = __webpack_require__(/*! ../core-js/is-iterable */ "./node_modules/babel-runtime/core-js/is-iterable.js");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = __webpack_require__(/*! ../core-js/get-iterator */ "./node_modules/babel-runtime/core-js/get-iterator.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/toConsumableArray.js":
/*!*****************************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/toConsumableArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(/*! ../core-js/array/from */ "./node_modules/babel-runtime/core-js/array/from.js");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/typeof.js":
/*!******************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/typeof.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(/*! ../core-js/symbol/iterator */ "./node_modules/babel-runtime/core-js/symbol/iterator.js");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(/*! ../core-js/symbol */ "./node_modules/babel-runtime/core-js/symbol.js");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),

/***/ "./node_modules/clappr-zepto/zepto.js":
/*!********************************************!*\
  !*** ./node_modules/clappr-zepto/zepto.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Zepto v1.2.0 - zepto ajax callbacks deferred event ie selector - zeptojs.com/license */


var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
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
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.matches || element.webkitMatchesSelector ||
                          element.mozMatchesSelector || element.oMatchesSelector ||
                          element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }

  function likeArray(obj) {
    var length = !!obj && 'length' in obj && obj.length,
      type = $.type(obj)

    return 'function' != type && !isWindow(obj) && (
      'array' == type || length === 0 ||
        (typeof length == 'number' && length > 0 && (length - 1) in obj)
    )
  }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  function Z(dom, selector) {
    var i, len = dom ? dom.length : 0
    for (i = 0; i < len; i++) this[i] = dom[i]
    this.length = len
    this.selector = selector || ''
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overridden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. This method can be overridden in plugins.
  zepto.Z = function(dom, selector) {
    return new Z(dom, selector)
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overridden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overridden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overridden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
      slice.call(
        isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = document.documentElement.contains ?
    function(parent, node) {
      return parent !== node && parent.contains(node)
    } :
    function(parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true
      return false
    }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className || '',
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          +value + "" == value ? +value :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.isNumeric = function(val) {
    var num = Number(val), type = typeof val
    return val != null && type != 'boolean' &&
      (type != 'string' || val.length) &&
      !isNaN(num) && isFinite(num) || false
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }
  $.noop = function() {}

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
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
    concat: function(){
      var i, value, args = []
      for (i = 0; i < arguments.length; i++) {
        value = arguments[i]
        args[i] = zepto.isZ(value) ? value.toArray() : value
      }
      return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
    },

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = $()
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var nodes = [], collection = typeof selector == 'object' && $(selector)
      this.each(function(_, node){
        while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
          node = node !== context && !isDocument(node) && node.parentNode
        if (node && nodes.indexOf(node) < 0) nodes.push(node)
      })
      return $(nodes)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this.pluck('textContent').join("") : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
        setAttribute(this, attribute)
      }, this)})
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (1 in arguments) ?
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        }) :
        (this[0] && this[0][name])
    },
    removeProp: function(name){
      name = propMap[name] || name
      return this.each(function(){ delete this[name] })
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      if (0 in arguments) {
        if (value == null) value = ""
        return this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        })
      } else {
        return this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
      }
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
        return {top: 0, left: 0}
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var element = this[0]
        if (typeof property == 'string') {
          if (!element) return
          return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
        } else if (isArray(property)) {
          if (!element) return
          var props = {}
          var computedStyle = getComputedStyle(element, '')
          $.each(property, function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        if (!('className' in this)) return
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (!('className' in this)) return
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            var arr = []
            argType = type(arg)
            if (argType == "array") {
              arg.forEach(function(el) {
                if (el.nodeType !== undefined) return arr.push(el)
                else if ($.zepto.isZ(el)) return arr = arr.concat(el.get())
                arr = arr.concat(zepto.fragment(el))
              })
              return arr
            }
            return argType == "object" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = $.contains(document.documentElement, parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src){
              var target = el.ownerDocument ? el.ownerDocument.defaultView : window
              target['eval'].call(target, el.innerHTML)
            }
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)

;(function($){
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
      originAnchor = document.createElement('a')

  originAnchor.href = window.location.href

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.isDefaultPrevented()
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    if (deferred) deferred.resolveWith(context, [data, status, xhr])
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    if (deferred) deferred.rejectWith(context, [xhr, type, error])
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  function ajaxDataFilter(data, type, settings) {
    if (settings.dataFilter == empty) return data
    var context = settings.context
    return settings.dataFilter.call(context, data, type)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options, deferred){
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('Zepto' + (jsonpID++)),
      script = document.createElement('script'),
      originalCallback = window[callbackName],
      responseData,
      abort = function(errorType) {
        $(script).triggerHandler('error', errorType || 'abort')
      },
      xhr = { abort: abort }, abortTimeout

    if (deferred) deferred.promise(xhr)

    $(script).on('load error', function(e, errorType){
      clearTimeout(abortTimeout)
      $(script).off().remove()

      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred)
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred)
      }

      window[callbackName] = originalCallback
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0])

      originalCallback = responseData = undefined
    })

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return xhr
    }

    window[callbackName] = function(){
      responseData = arguments
    }

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
    document.head.appendChild(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

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
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
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
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType))
      options.url = appendQuery(options.url, options.data), options.data = undefined
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred(),
        urlAnchor, hashIndex
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) {
      urlAnchor = document.createElement('a')
      urlAnchor.href = settings.url
      // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
      urlAnchor.href = urlAnchor.href
      settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
    }

    if (!settings.url) settings.url = window.location.toString()
    if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
    serializeData(settings)

    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
    if (hasPlaceholder) dataType = 'jsonp'

    if (settings.cache === false || (
         (!options || options.cache !== true) &&
         ('script' == dataType || 'jsonp' == dataType)
        ))
      settings.url = appendQuery(settings.url, '_=' + Date.now())

    if ('jsonp' == dataType) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
      return $.ajaxJSONP(settings, deferred)
    }

    var mime = settings.accepts[dataType],
        headers = { },
        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout

    if (deferred) deferred.promise(xhr)

    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
    setHeader('Accept', mime || '*/*')
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
    xhr.setRequestHeader = setHeader

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))

          if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob')
            result = xhr.response
          else {
            result = xhr.responseText

            try {
              // http://perfectionkills.com/global-eval-what-are-the-options/
              // sanitize response accordingly if data filter callback provided
              result = ajaxDataFilter(result, dataType, settings)
              if (dataType == 'script')    (1,eval)(result)
              else if (dataType == 'xml')  result = xhr.responseXML
              else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
            } catch (e) { error = e }

            if (error) return ajaxError(error, 'parsererror', xhr, settings, deferred)
          }

          ajaxSuccess(result, xhr, settings, deferred)
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
        }
      }
    }

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      ajaxError(null, 'abort', xhr, settings, deferred)
      return xhr
    }

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings, deferred)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data)) dataType = success, success = data, data = undefined
    if (!$.isFunction(success)) dataType = success, success = undefined
    return {
      url: url
    , data: data
    , success: success
    , dataType: dataType
    }
  }

  $.get = function(/* url, data, success, dataType */){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(/* url, data, success, dataType */){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(/* url, data, success */){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(key, value) {
      if ($.isFunction(value)) value = value()
      if (value == null) value = ""
      this.push(escape(key) + '=' + escape(value))
    }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)

;(function($){
  // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
  // Option flags:
  //   - once: Callbacks fired at most one time.
  //   - memory: Remember the most recent context and arguments
  //   - stopOnFalse: Cease iterating over callback list
  //   - unique: Permit adding at most one instance of the same callback
  $.Callbacks = function(options) {
    options = $.extend({}, options)

    var memory, // Last fire value (for non-forgettable lists)
        fired,  // Flag to know if list was already fired
        firing, // Flag to know if list is currently firing
        firingStart, // First callback to fire (used internally by add and fireWith)
        firingLength, // End of the loop when firing
        firingIndex, // Index of currently firing callback (modified by remove if needed)
        list = [], // Actual callback list
        stack = !options.once && [], // Stack of fire calls for repeatable lists
        fire = function(data) {
          memory = options.memory && data
          fired = true
          firingIndex = firingStart || 0
          firingStart = 0
          firingLength = list.length
          firing = true
          for ( ; list && firingIndex < firingLength ; ++firingIndex ) {
            if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
              memory = false
              break
            }
          }
          firing = false
          if (list) {
            if (stack) stack.length && fire(stack.shift())
            else if (memory) list.length = 0
            else Callbacks.disable()
          }
        },

        Callbacks = {
          add: function() {
            if (list) {
              var start = list.length,
                  add = function(args) {
                    $.each(args, function(_, arg){
                      if (typeof arg === "function") {
                        if (!options.unique || !Callbacks.has(arg)) list.push(arg)
                      }
                      else if (arg && arg.length && typeof arg !== 'string') add(arg)
                    })
                  }
              add(arguments)
              if (firing) firingLength = list.length
              else if (memory) {
                firingStart = start
                fire(memory)
              }
            }
            return this
          },
          remove: function() {
            if (list) {
              $.each(arguments, function(_, arg){
                var index
                while ((index = $.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1)
                  // Handle firing indexes
                  if (firing) {
                    if (index <= firingLength) --firingLength
                    if (index <= firingIndex) --firingIndex
                  }
                }
              })
            }
            return this
          },
          has: function(fn) {
            return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
          },
          empty: function() {
            firingLength = list.length = 0
            return this
          },
          disable: function() {
            list = stack = memory = undefined
            return this
          },
          disabled: function() {
            return !list
          },
          lock: function() {
            stack = undefined
            if (!memory) Callbacks.disable()
            return this
          },
          locked: function() {
            return !stack
          },
          fireWith: function(context, args) {
            if (list && (!fired || stack)) {
              args = args || []
              args = [context, args.slice ? args.slice() : args]
              if (firing) stack.push(args)
              else fire(args)
            }
            return this
          },
          fire: function() {
            return Callbacks.fireWith(this, arguments)
          },
          fired: function() {
            return !!fired
          }
        }

    return Callbacks
  }
})(Zepto)

;(function($){
  var slice = Array.prototype.slice

  function Deferred(func) {
    var tuples = [
          // action, add listener, listener list, final state
          [ "resolve", "done", $.Callbacks({once:1, memory:1}), "resolved" ],
          [ "reject", "fail", $.Callbacks({once:1, memory:1}), "rejected" ],
          [ "notify", "progress", $.Callbacks({memory:1}) ]
        ],
        state = "pending",
        promise = {
          state: function() {
            return state
          },
          always: function() {
            deferred.done(arguments).fail(arguments)
            return this
          },
          then: function(/* fnDone [, fnFailed [, fnProgress]] */) {
            var fns = arguments
            return Deferred(function(defer){
              $.each(tuples, function(i, tuple){
                var fn = $.isFunction(fns[i]) && fns[i]
                deferred[tuple[1]](function(){
                  var returned = fn && fn.apply(this, arguments)
                  if (returned && $.isFunction(returned.promise)) {
                    returned.promise()
                      .done(defer.resolve)
                      .fail(defer.reject)
                      .progress(defer.notify)
                  } else {
                    var context = this === promise ? defer.promise() : this,
                        values = fn ? [returned] : arguments
                    defer[tuple[0] + "With"](context, values)
                  }
                })
              })
              fns = null
            }).promise()
          },

          promise: function(obj) {
            return obj != null ? $.extend( obj, promise ) : promise
          }
        },
        deferred = {}

    $.each(tuples, function(i, tuple){
      var list = tuple[2],
          stateString = tuple[3]

      promise[tuple[1]] = list.add

      if (stateString) {
        list.add(function(){
          state = stateString
        }, tuples[i^1][2].disable, tuples[2][2].lock)
      }

      deferred[tuple[0]] = function(){
        deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
        return this
      }
      deferred[tuple[0] + "With"] = list.fireWith
    })

    promise.promise(deferred)
    if (func) func.call(deferred, deferred)
    return deferred
  }

  $.when = function(sub) {
    var resolveValues = slice.call(arguments),
        len = resolveValues.length,
        i = 0,
        remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
        deferred = remain === 1 ? sub : Deferred(),
        progressValues, progressContexts, resolveContexts,
        updateFn = function(i, ctx, val){
          return function(value){
            ctx[i] = this
            val[i] = arguments.length > 1 ? slice.call(arguments) : value
            if (val === progressValues) {
              deferred.notifyWith(ctx, val)
            } else if (!(--remain)) {
              deferred.resolveWith(ctx, val)
            }
          }
        }

    if (len > 1) {
      progressValues = new Array(len)
      progressContexts = new Array(len)
      resolveContexts = new Array(len)
      for ( ; i < len; ++i ) {
        if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
          resolveValues[i].promise()
            .done(updateFn(i, resolveContexts, resolveValues))
            .fail(deferred.reject)
            .progress(updateFn(i, progressContexts, progressValues))
        } else {
          --remain
        }
      }
    }
    if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
    return deferred.promise()
  }

  $.Deferred = Deferred
})(Zepto)

;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      event.timeStamp || (event.timeStamp = Date.now())

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (callback === undefined || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // handle focus(), blur() by calling them directly
      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
      // items in the collection might not be DOM elements
      else if ('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return (0 in arguments) ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)

;(function(){
  // getComputedStyle shouldn't freak out when called
  // without a valid element as argument
  try {
    getComputedStyle(undefined)
  } catch(e) {
    var nativeGetComputedStyle = getComputedStyle
    window.getComputedStyle = function(element, pseudoElement){
      try {
        return nativeGetComputedStyle(element, pseudoElement)
      } catch(e) {
        return null
      }
    }
  }
})()

;(function($){
  var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches

  function visible(elem){
    elem = $(elem)
    return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
  }

  // Implements a subset from:
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
    visible:  function(){ if (visible(this)) return this },
    hidden:   function(){ if (!visible(this)) return this },
    selected: function(){ if (this.selected) return this },
    checked:  function(){ if (this.checked) return this },
    parent:   function(){ return this.parentNode },
    first:    function(idx){ if (idx === 0) return this },
    last:     function(idx, nodes){ if (idx === nodes.length - 1) return this },
    eq:       function(idx, _, value){ if (idx === value) return this },
    contains: function(idx, _, text){ if ($(this).text().indexOf(text) > -1) return this },
    has:      function(idx, _, sel){ if (zepto.qsa(this, sel).length) return this }
  }

  var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
      childRe  = /^\s*>/,
      classTag = 'Zepto' + (+new Date())

  function process(sel, fn) {
    // quote the hash in `a[href^=#]` expression
    sel = sel.replace(/=#\]/g, '="#"]')
    var filter, arg, match = filterRe.exec(sel)
    if (match && match[2] in filters) {
      filter = filters[match[2]], arg = match[3]
      sel = match[1]
      if (arg) {
        var num = Number(arg)
        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
        else arg = num
      }
    }
    return fn(sel, filter, arg)
  }

  zepto.qsa = function(node, selector) {
    return process(selector, function(sel, filter, arg){
      try {
        var taggedParent
        if (!sel && filter) sel = '*'
        else if (childRe.test(sel))
          // support "> *" child queries by tagging the parent node with a
          // unique class and prepending that classname onto the selector
          taggedParent = $(node).addClass(classTag), sel = '.'+classTag+' '+sel

        var nodes = oldQsa(node, sel)
      } catch(e) {
        console.error('error performing selector: %o', selector)
        throw e
      } finally {
        if (taggedParent) taggedParent.removeClass(classTag)
      }
      return !filter ? nodes :
        zepto.uniq($.map(nodes, function(n, i){ return filter.call(n, i, nodes, arg) }))
    })
  }

  zepto.matches = function(node, selector){
    return process(selector, function(sel, filter, arg){
      return (!sel || oldMatches(node, sel)) &&
        (!filter || filter.call(node, null, arg) === node)
    })
  }
})(Zepto)
module.exports = Zepto


/***/ }),

/***/ "./node_modules/core-js/library/fn/array/from.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/fn/array/from.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.string.iterator */ "./node_modules/core-js/library/modules/es6.string.iterator.js");
__webpack_require__(/*! ../../modules/es6.array.from */ "./node_modules/core-js/library/modules/es6.array.from.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Array.from;

/***/ }),

/***/ "./node_modules/core-js/library/fn/get-iterator.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/fn/get-iterator.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../modules/web.dom.iterable */ "./node_modules/core-js/library/modules/web.dom.iterable.js");
__webpack_require__(/*! ../modules/es6.string.iterator */ "./node_modules/core-js/library/modules/es6.string.iterator.js");
module.exports = __webpack_require__(/*! ../modules/core.get-iterator */ "./node_modules/core-js/library/modules/core.get-iterator.js");

/***/ }),

/***/ "./node_modules/core-js/library/fn/is-iterable.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/fn/is-iterable.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../modules/web.dom.iterable */ "./node_modules/core-js/library/modules/web.dom.iterable.js");
__webpack_require__(/*! ../modules/es6.string.iterator */ "./node_modules/core-js/library/modules/es6.string.iterator.js");
module.exports = __webpack_require__(/*! ../modules/core.is-iterable */ "./node_modules/core-js/library/modules/core.is-iterable.js");

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/assign.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/assign.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.assign */ "./node_modules/core-js/library/modules/es6.object.assign.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.assign;

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/create.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/create.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.create */ "./node_modules/core-js/library/modules/es6.object.create.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/define-property.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/define-property.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.define-property */ "./node_modules/core-js/library/modules/es6.object.define-property.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/entries.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/entries.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es7.object.entries */ "./node_modules/core-js/library/modules/es7.object.entries.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.entries;

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/get-own-property-descriptor.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/get-own-property-descriptor.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.get-own-property-descriptor */ "./node_modules/core-js/library/modules/es6.object.get-own-property-descriptor.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/keys.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/keys.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.keys */ "./node_modules/core-js/library/modules/es6.object.keys.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.keys;

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/set-prototype-of.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/set-prototype-of.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.set-prototype-of */ "./node_modules/core-js/library/modules/es6.object.set-prototype-of.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.setPrototypeOf;

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/values.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/values.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es7.object.values */ "./node_modules/core-js/library/modules/es7.object.values.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.values;

/***/ }),

/***/ "./node_modules/core-js/library/fn/symbol/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/fn/symbol/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.symbol */ "./node_modules/core-js/library/modules/es6.symbol.js");
__webpack_require__(/*! ../../modules/es6.object.to-string */ "./node_modules/core-js/library/modules/es6.object.to-string.js");
__webpack_require__(/*! ../../modules/es7.symbol.async-iterator */ "./node_modules/core-js/library/modules/es7.symbol.async-iterator.js");
__webpack_require__(/*! ../../modules/es7.symbol.observable */ "./node_modules/core-js/library/modules/es7.symbol.observable.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Symbol;

/***/ }),

/***/ "./node_modules/core-js/library/fn/symbol/iterator.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/fn/symbol/iterator.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.string.iterator */ "./node_modules/core-js/library/modules/es6.string.iterator.js");
__webpack_require__(/*! ../../modules/web.dom.iterable */ "./node_modules/core-js/library/modules/web.dom.iterable.js");
module.exports = __webpack_require__(/*! ../../modules/_wks-ext */ "./node_modules/core-js/library/modules/_wks-ext.js").f('iterator');

/***/ }),

/***/ "./node_modules/core-js/library/modules/_a-function.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_a-function.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_add-to-unscopables.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_add-to-unscopables.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),

/***/ "./node_modules/core-js/library/modules/_an-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_an-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_array-includes.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_array-includes.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , toLength  = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/library/modules/_to-length.js")
  , toIndex   = __webpack_require__(/*! ./_to-index */ "./node_modules/core-js/library/modules/_to-index.js");
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_classof.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_classof.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/library/modules/_cof.js")
  , TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_cof.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_cof.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_core.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_core.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),

/***/ "./node_modules/core-js/library/modules/_create-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_create-property.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js")
  , createDesc      = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js");

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_ctx.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_ctx.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/library/modules/_a-function.js");
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_defined.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_defined.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_descriptors.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_descriptors.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),

/***/ "./node_modules/core-js/library/modules/_dom-create.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_dom-create.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js")
  , document = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_enum-bug-keys.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_enum-bug-keys.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),

/***/ "./node_modules/core-js/library/modules/_enum-keys.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_enum-keys.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js")
  , gOPS    = __webpack_require__(/*! ./_object-gops */ "./node_modules/core-js/library/modules/_object-gops.js")
  , pIE     = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js");
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_export.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_export.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js")
  , core      = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js")
  , ctx       = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/library/modules/_ctx.js")
  , hide      = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_fails.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_fails.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_global.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_global.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),

/***/ "./node_modules/core-js/library/modules/_has.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_has.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_hide.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_hide.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js")
  , createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js");
module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_html.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_html.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").document && document.documentElement;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_ie8-dom-define.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_ie8-dom-define.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") && !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function(){
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/library/modules/_dom-create.js")('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iobject.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iobject.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/library/modules/_cof.js");
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_is-array-iter.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_is-array-iter.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js")
  , ITERATOR   = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_is-array.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_is-array.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/library/modules/_cof.js");
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_is-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_is-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-call.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-call.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-create.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-create.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/library/modules/_object-create.js")
  , descriptor     = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js")
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/library/modules/_set-to-string-tag.js")
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")(IteratorPrototype, __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-define.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-define.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js")
  , $export        = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
  , redefine       = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/library/modules/_redefine.js")
  , hide           = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")
  , has            = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , Iterators      = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js")
  , $iterCreate    = __webpack_require__(/*! ./_iter-create */ "./node_modules/core-js/library/modules/_iter-create.js")
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/library/modules/_set-to-string-tag.js")
  , getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ "./node_modules/core-js/library/modules/_object-gpo.js")
  , ITERATOR       = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-detect.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-detect.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-step.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-step.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iterators.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iterators.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_keyof.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_keyof.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js")
  , toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_library.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_library.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_meta.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_meta.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js")('meta')
  , isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js")
  , has      = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , setDesc  = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-assign.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-assign.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js")
  , gOPS     = __webpack_require__(/*! ./_object-gops */ "./node_modules/core-js/library/modules/_object-gops.js")
  , pIE      = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js")
  , toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js")
  , IObject  = __webpack_require__(/*! ./_iobject */ "./node_modules/core-js/library/modules/_iobject.js")
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-create.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js")
  , dPs         = __webpack_require__(/*! ./_object-dps */ "./node_modules/core-js/library/modules/_object-dps.js")
  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js")
  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/library/modules/_dom-create.js")('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(/*! ./_html */ "./node_modules/core-js/library/modules/_html.js").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-dp.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-dp.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js")
  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/library/modules/_ie8-dom-define.js")
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/library/modules/_to-primitive.js")
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-dps.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-dps.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js")
  , anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js")
  , getKeys  = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js");

module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gopd.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gopd.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js")
  , createDesc     = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js")
  , toIObject      = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/library/modules/_to-primitive.js")
  , has            = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/library/modules/_ie8-dom-define.js")
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gopn-ext.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gopn-ext.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , gOPN      = __webpack_require__(/*! ./_object-gopn */ "./node_modules/core-js/library/modules/_object-gopn.js").f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gopn.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gopn.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/library/modules/_object-keys-internal.js")
  , hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gops.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gops.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gpo.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gpo.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , toObject    = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js")
  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-keys-internal.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-keys-internal.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , toIObject    = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , arrayIndexOf = __webpack_require__(/*! ./_array-includes */ "./node_modules/core-js/library/modules/_array-includes.js")(false)
  , IE_PROTO     = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-keys.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-keys.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/library/modules/_object-keys-internal.js")
  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js");

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-pie.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-pie.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-sap.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-sap.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
  , core    = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js")
  , fails   = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js");
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-to-array.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-to-array.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js")
  , toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , isEnum    = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js").f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_property-desc.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_property-desc.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_redefine.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_redefine.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js");

/***/ }),

/***/ "./node_modules/core-js/library/modules/_set-proto.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_set-proto.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js")
  , anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/library/modules/_ctx.js")(Function.call, __webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/library/modules/_object-gopd.js").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_set-to-string-tag.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_set-to-string-tag.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f
  , has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_shared-key.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_shared-key.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/library/modules/_shared.js")('keys')
  , uid    = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js");
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_shared.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_shared.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js")
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_string-at.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_string-at.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js")
  , defined   = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-index.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js")
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-integer.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-integer.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-iobject.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-iobject.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(/*! ./_iobject */ "./node_modules/core-js/library/modules/_iobject.js")
  , defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-length.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-length.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js")
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-primitive.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-primitive.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_uid.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_uid.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_wks-define.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_wks-define.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js")
  , core           = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js")
  , LIBRARY        = __webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js")
  , wksExt         = __webpack_require__(/*! ./_wks-ext */ "./node_modules/core-js/library/modules/_wks-ext.js")
  , defineProperty = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_wks-ext.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_wks-ext.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js");

/***/ }),

/***/ "./node_modules/core-js/library/modules/_wks.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_wks.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/library/modules/_shared.js")('wks')
  , uid        = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js")
  , Symbol     = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),

/***/ "./node_modules/core-js/library/modules/core.get-iterator-method.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/core.get-iterator-method.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/library/modules/_classof.js")
  , ITERATOR  = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator')
  , Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js");
module.exports = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js").getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/core.get-iterator.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/core.get-iterator.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js")
  , get      = __webpack_require__(/*! ./core.get-iterator-method */ "./node_modules/core-js/library/modules/core.get-iterator-method.js");
module.exports = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js").getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/core.is-iterable.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/core.is-iterable.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/library/modules/_classof.js")
  , ITERATOR  = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator')
  , Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js");
module.exports = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js").isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.array.from.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.array.from.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/library/modules/_ctx.js")
  , $export        = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
  , toObject       = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js")
  , call           = __webpack_require__(/*! ./_iter-call */ "./node_modules/core-js/library/modules/_iter-call.js")
  , isArrayIter    = __webpack_require__(/*! ./_is-array-iter */ "./node_modules/core-js/library/modules/_is-array-iter.js")
  , toLength       = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/library/modules/_to-length.js")
  , createProperty = __webpack_require__(/*! ./_create-property */ "./node_modules/core-js/library/modules/_create-property.js")
  , getIterFn      = __webpack_require__(/*! ./core.get-iterator-method */ "./node_modules/core-js/library/modules/core.get-iterator-method.js");

$export($export.S + $export.F * !__webpack_require__(/*! ./_iter-detect */ "./node_modules/core-js/library/modules/_iter-detect.js")(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.array.iterator.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.array.iterator.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ "./node_modules/core-js/library/modules/_add-to-unscopables.js")
  , step             = __webpack_require__(/*! ./_iter-step */ "./node_modules/core-js/library/modules/_iter-step.js")
  , Iterators        = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js")
  , toIObject        = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/library/modules/_iter-define.js")(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.assign.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.assign.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(/*! ./_object-assign */ "./node_modules/core-js/library/modules/_object-assign.js")});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.create.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.create.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/library/modules/_object-create.js")});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.define-property.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.define-property.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js"), 'Object', {defineProperty: __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.get-own-property-descriptor.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.get-own-property-descriptor.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , $getOwnPropertyDescriptor = __webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/library/modules/_object-gopd.js").f;

__webpack_require__(/*! ./_object-sap */ "./node_modules/core-js/library/modules/_object-sap.js")('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.keys.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.keys.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js")
  , $keys    = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js");

__webpack_require__(/*! ./_object-sap */ "./node_modules/core-js/library/modules/_object-sap.js")('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.set-prototype-of.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.set-prototype-of.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(/*! ./_set-proto */ "./node_modules/core-js/library/modules/_set-proto.js").set});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.to-string.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.to-string.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.string.iterator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.string.iterator.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(/*! ./_string-at */ "./node_modules/core-js/library/modules/_string-at.js")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/library/modules/_iter-define.js")(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.symbol.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.symbol.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js")
  , has            = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , DESCRIPTORS    = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js")
  , $export        = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
  , redefine       = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/library/modules/_redefine.js")
  , META           = __webpack_require__(/*! ./_meta */ "./node_modules/core-js/library/modules/_meta.js").KEY
  , $fails         = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")
  , shared         = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/library/modules/_shared.js")
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/library/modules/_set-to-string-tag.js")
  , uid            = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js")
  , wks            = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")
  , wksExt         = __webpack_require__(/*! ./_wks-ext */ "./node_modules/core-js/library/modules/_wks-ext.js")
  , wksDefine      = __webpack_require__(/*! ./_wks-define */ "./node_modules/core-js/library/modules/_wks-define.js")
  , keyOf          = __webpack_require__(/*! ./_keyof */ "./node_modules/core-js/library/modules/_keyof.js")
  , enumKeys       = __webpack_require__(/*! ./_enum-keys */ "./node_modules/core-js/library/modules/_enum-keys.js")
  , isArray        = __webpack_require__(/*! ./_is-array */ "./node_modules/core-js/library/modules/_is-array.js")
  , anObject       = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js")
  , toIObject      = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/library/modules/_to-primitive.js")
  , createDesc     = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js")
  , _create        = __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/library/modules/_object-create.js")
  , gOPNExt        = __webpack_require__(/*! ./_object-gopn-ext */ "./node_modules/core-js/library/modules/_object-gopn-ext.js")
  , $GOPD          = __webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/library/modules/_object-gopd.js")
  , $DP            = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js")
  , $keys          = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js")
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(/*! ./_object-gopn */ "./node_modules/core-js/library/modules/_object-gopn.js").f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js").f  = $propertyIsEnumerable;
  __webpack_require__(/*! ./_object-gops */ "./node_modules/core-js/library/modules/_object-gops.js").f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js")){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),

/***/ "./node_modules/core-js/library/modules/es7.object.entries.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es7.object.entries.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export  = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
  , $entries = __webpack_require__(/*! ./_object-to-array */ "./node_modules/core-js/library/modules/_object-to-array.js")(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es7.object.values.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es7.object.values.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
  , $values = __webpack_require__(/*! ./_object-to-array */ "./node_modules/core-js/library/modules/_object-to-array.js")(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es7.symbol.async-iterator.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es7.symbol.async-iterator.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./_wks-define */ "./node_modules/core-js/library/modules/_wks-define.js")('asyncIterator');

/***/ }),

/***/ "./node_modules/core-js/library/modules/es7.symbol.observable.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es7.symbol.observable.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./_wks-define */ "./node_modules/core-js/library/modules/_wks-define.js")('observable');

/***/ }),

/***/ "./node_modules/core-js/library/modules/web.dom.iterable.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/web.dom.iterable.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./es6.array.iterator */ "./node_modules/core-js/library/modules/es6.array.iterator.js");
var global        = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js")
  , hide          = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")
  , Iterators     = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js")
  , TO_STRING_TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/components/container/public/style.scss":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/components/container/public/style.scss ***!
  \********************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".container[data-container] {\n  position: absolute;\n  background-color: black;\n  height: 100%;\n  width: 100%;\n  max-width: 100%; }\n  .container[data-container] .chromeless {\n    cursor: default; }\n\n[data-player]:not(.nocursor) .container[data-container]:not(.chromeless).pointer-enabled {\n  cursor: pointer; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/components/core/public/style.scss":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/components/core/public/style.scss ***!
  \***************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "[data-player] {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n  position: relative;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-style: normal;\n  font-weight: normal;\n  text-align: center;\n  overflow: hidden;\n  font-size: 100%;\n  font-family: \"Roboto\", \"Open Sans\", Arial, sans-serif;\n  text-shadow: 0 0 0;\n  box-sizing: border-box; }\n  [data-player] div, [data-player] span, [data-player] applet, [data-player] object, [data-player] iframe,\n  [data-player] h1, [data-player] h2, [data-player] h3, [data-player] h4, [data-player] h5, [data-player] h6, [data-player] p, [data-player] blockquote, [data-player] pre,\n  [data-player] a, [data-player] abbr, [data-player] acronym, [data-player] address, [data-player] big, [data-player] cite, [data-player] code,\n  [data-player] del, [data-player] dfn, [data-player] em, [data-player] img, [data-player] ins, [data-player] kbd, [data-player] q, [data-player] s, [data-player] samp,\n  [data-player] small, [data-player] strike, [data-player] strong, [data-player] sub, [data-player] sup, [data-player] tt, [data-player] var,\n  [data-player] b, [data-player] u, [data-player] i, [data-player] center,\n  [data-player] dl, [data-player] dt, [data-player] dd, [data-player] ol, [data-player] ul, [data-player] li,\n  [data-player] fieldset, [data-player] form, [data-player] label, [data-player] legend,\n  [data-player] table, [data-player] caption, [data-player] tbody, [data-player] tfoot, [data-player] thead, [data-player] tr, [data-player] th, [data-player] td,\n  [data-player] article, [data-player] aside, [data-player] canvas, [data-player] details, [data-player] embed,\n  [data-player] figure, [data-player] figcaption, [data-player] footer, [data-player] header, [data-player] hgroup,\n  [data-player] menu, [data-player] nav, [data-player] output, [data-player] ruby, [data-player] section, [data-player] summary,\n  [data-player] time, [data-player] mark, [data-player] audio, [data-player] video {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    font: inherit;\n    font-size: 100%;\n    vertical-align: baseline; }\n  [data-player] table {\n    border-collapse: collapse;\n    border-spacing: 0; }\n  [data-player] caption, [data-player] th, [data-player] td {\n    text-align: left;\n    font-weight: normal;\n    vertical-align: middle; }\n  [data-player] q, [data-player] blockquote {\n    quotes: none; }\n    [data-player] q:before, [data-player] q:after, [data-player] blockquote:before, [data-player] blockquote:after {\n      content: \"\";\n      content: none; }\n  [data-player] a img {\n    border: none; }\n  [data-player]:focus {\n    outline: 0; }\n  [data-player] * {\n    max-width: none;\n    box-sizing: inherit;\n    float: none; }\n  [data-player] div {\n    display: block; }\n  [data-player].fullscreen {\n    width: 100% !important;\n    height: 100% !important;\n    top: 0;\n    left: 0; }\n  [data-player].nocursor {\n    cursor: none; }\n\n.clappr-style {\n  display: none !important; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/playbacks/html5_video/public/style.scss":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/playbacks/html5_video/public/style.scss ***!
  \*********************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "[data-html5-video] {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  display: block; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/playbacks/html_img/public/style.scss":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/playbacks/html_img/public/style.scss ***!
  \******************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "[data-html-img] {\n  max-width: 100%;\n  max-height: 100%; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/playbacks/no_op/public/style.scss":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/playbacks/no_op/public/style.scss ***!
  \***************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "[data-no-op] {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  text-align: center; }\n\n[data-no-op] p[data-no-op-msg] {\n  position: absolute;\n  text-align: center;\n  font-size: 25px;\n  left: 0;\n  right: 0;\n  color: white;\n  padding: 10px;\n  /* center vertically */\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n  max-height: 100%;\n  overflow: auto; }\n\n[data-no-op] canvas[data-no-op-canvas] {\n  background-color: #777;\n  height: 100%;\n  width: 100%; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/node-libs-browser/node_modules/process/browser.js":
/*!************************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/process/browser.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
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

process.nextTick = function (fun) {
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
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/semver/semver.js":
/*!***************************************!*\
  !*** ./node_modules/semver/semver.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var t = exports.tokens = {}
var R = 0

function tok (n) {
  t[n] = R++
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

tok('NUMERICIDENTIFIER')
src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*'
tok('NUMERICIDENTIFIERLOOSE')
src[t.NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

tok('NONNUMERICIDENTIFIER')
src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

tok('MAINVERSION')
src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')'

tok('MAINVERSIONLOOSE')
src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

tok('PRERELEASEIDENTIFIER')
src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] +
                            '|' + src[t.NONNUMERICIDENTIFIER] + ')'

tok('PRERELEASEIDENTIFIERLOOSE')
src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[t.NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

tok('PRERELEASE')
src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))'

tok('PRERELEASELOOSE')
src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

tok('BUILDIDENTIFIER')
src[t.BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

tok('BUILD')
src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] +
             '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

tok('FULL')
tok('FULLPLAIN')
src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] +
                  src[t.PRERELEASE] + '?' +
                  src[t.BUILD] + '?'

src[t.FULL] = '^' + src[t.FULLPLAIN] + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
tok('LOOSEPLAIN')
src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] +
                  src[t.PRERELEASELOOSE] + '?' +
                  src[t.BUILD] + '?'

tok('LOOSE')
src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$'

tok('GTLT')
src[t.GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
tok('XRANGEIDENTIFIERLOOSE')
src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
tok('XRANGEIDENTIFIER')
src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*'

tok('XRANGEPLAIN')
src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[t.PRERELEASE] + ')?' +
                   src[t.BUILD] + '?' +
                   ')?)?'

tok('XRANGEPLAINLOOSE')
src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[t.PRERELEASELOOSE] + ')?' +
                        src[t.BUILD] + '?' +
                        ')?)?'

tok('XRANGE')
src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$'
tok('XRANGELOOSE')
src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
tok('COERCE')
src[t.COERCE] = '(^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'
tok('COERCERTL')
re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g')

// Tilde ranges.
// Meaning is "reasonably at or greater than"
tok('LONETILDE')
src[t.LONETILDE] = '(?:~>?)'

tok('TILDETRIM')
src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+'
re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

tok('TILDE')
src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$'
tok('TILDELOOSE')
src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
tok('LONECARET')
src[t.LONECARET] = '(?:\\^)'

tok('CARETTRIM')
src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+'
re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g')
var caretTrimReplace = '$1^'

tok('CARET')
src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$'
tok('CARETLOOSE')
src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
tok('COMPARATORLOOSE')
src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$'
tok('COMPARATOR')
src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
tok('COMPARATORTRIM')
src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] +
                      '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
tok('HYPHENRANGE')
src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s*$'

tok('HYPHENRANGELOOSE')
src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
tok('STAR')
src[t.STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
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

  var r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
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

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

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
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
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
}

SemVer.prototype.compareBuild = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  var i = 0
  do {
    var a = this.build[i]
    var b = other.build[i]
    debug('prerelease compare', i, a, b)
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
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
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

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.compareBuild = compareBuild
function compareBuild (a, b, loose) {
  var versionA = new SemVer(a, loose)
  var versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(b, a, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
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

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1] !== undefined ? m[1] : ''
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY || version === ANY) {
    return true
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    if (this.value === '') {
      return true
    }
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    if (comp.value === '') {
      return true
    }
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
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

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[t.COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[t.CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

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
}

// take a set of comparators and determine whether there
// exists a version which can satisfy it
function isSatisfiable (comparators, options) {
  var result = true
  var remainingComparators = comparators.slice()
  var testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every(function (otherComparator) {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
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
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
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
  var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
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
  debug('caret', comp, options)
  var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p + pr
    } else if (xm) {
      ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0' + pr +
        ' <' + M + '.' + (+m + 1) + '.0' + pr
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
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
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
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
      version = new SemVer(version, this.options)
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
}

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
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
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

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
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
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
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
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
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
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

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

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version, options) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  var match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    var next
    while ((next = re[t.COERCERTL].exec(version)) &&
      (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
          next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(match[2] +
    '.' + (match[3] || '0') +
    '.' + (match[4] || '0'), options)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/node_modules/process/browser.js */ "./node_modules/node-libs-browser/node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./src/base/base_object.js":
/*!*********************************!*\
  !*** ./src/base/base_object.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(/*! ../utils */ "./src/utils/utils.js");

var _events = __webpack_require__(/*! ./events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class BaseObject
 * @constructor
 * @extends Events
 * @module base
 */
// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = function (_Events) {
  (0, _inherits3.default)(BaseObject, _Events);
  (0, _createClass3.default)(BaseObject, [{
    key: 'options',

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
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, BaseObject);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Events.call(this, options));

    _this._options = options;
    _this.uniqueId = (0, _utils.uniqueId)('o');
    return _this;
  }
  /**
  * a unique id prefixed with `'o'`, `o1, o232`
  *
  * @property uniqueId
  * @type String
  */


  return BaseObject;
}(_events2.default);

exports.default = BaseObject;
module.exports = exports['default'];

/***/ }),

/***/ "./src/base/container_plugin.js":
/*!**************************************!*\
  !*** ./src/base/container_plugin.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _base_object = __webpack_require__(/*! ./base_object */ "./src/base/base_object.js");

var _base_object2 = _interopRequireDefault(_base_object);

var _error_mixin = __webpack_require__(/*! ./error_mixin */ "./src/base/error_mixin.js");

var _error_mixin2 = _interopRequireDefault(_error_mixin);

var _utils = __webpack_require__(/*! ../utils */ "./src/utils/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The base class for a container plugin
 * @class ContainerPlugin
 * @constructor
 * @extends BaseObject
 * @module base
 */
var ContainerPlugin = function (_BaseObject) {
  (0, _inherits3.default)(ContainerPlugin, _BaseObject);
  (0, _createClass3.default)(ContainerPlugin, [{
    key: 'playerError',
    get: function get() {
      return this.container.playerError;
    }
  }]);

  function ContainerPlugin(container) {
    (0, _classCallCheck3.default)(this, ContainerPlugin);

    var _this = (0, _possibleConstructorReturn3.default)(this, _BaseObject.call(this, container.options));

    _this.container = container;
    _this.enabled = true;
    _this.bindEvents();
    return _this;
  }

  ContainerPlugin.prototype.enable = function enable() {
    if (!this.enabled) {
      this.bindEvents();
      this.enabled = true;
    }
  };

  ContainerPlugin.prototype.disable = function disable() {
    if (this.enabled) {
      this.stopListening();
      this.enabled = false;
    }
  };

  ContainerPlugin.prototype.bindEvents = function bindEvents() {};

  ContainerPlugin.prototype.destroy = function destroy() {
    this.stopListening();
  };

  return ContainerPlugin;
}(_base_object2.default);

exports.default = ContainerPlugin;


(0, _assign2.default)(ContainerPlugin.prototype, _error_mixin2.default);

ContainerPlugin.extend = function (properties) {
  return (0, _utils.extend)(ContainerPlugin, properties);
};

ContainerPlugin.type = 'container';
module.exports = exports['default'];

/***/ }),

/***/ "./src/base/core_plugin.js":
/*!*********************************!*\
  !*** ./src/base/core_plugin.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(/*! ../utils */ "./src/utils/utils.js");

var _base_object = __webpack_require__(/*! ./base_object */ "./src/base/base_object.js");

var _base_object2 = _interopRequireDefault(_base_object);

var _error_mixin = __webpack_require__(/*! ./error_mixin */ "./src/base/error_mixin.js");

var _error_mixin2 = _interopRequireDefault(_error_mixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CorePlugin = function (_BaseObject) {
  (0, _inherits3.default)(CorePlugin, _BaseObject);
  (0, _createClass3.default)(CorePlugin, [{
    key: 'playerError',
    get: function get() {
      return this.core.playerError;
    }
  }]);

  function CorePlugin(core) {
    (0, _classCallCheck3.default)(this, CorePlugin);

    var _this = (0, _possibleConstructorReturn3.default)(this, _BaseObject.call(this, core.options));

    _this.core = core;
    _this.enabled = true;
    _this.bindEvents();
    return _this;
  }

  CorePlugin.prototype.bindEvents = function bindEvents() {};

  CorePlugin.prototype.enable = function enable() {
    if (!this.enabled) {
      this.bindEvents();
      this.enabled = true;
    }
  };

  CorePlugin.prototype.disable = function disable() {
    if (this.enabled) {
      this.stopListening();
      this.enabled = false;
    }
  };

  CorePlugin.prototype.getExternalInterface = function getExternalInterface() {
    return {};
  };

  CorePlugin.prototype.destroy = function destroy() {
    this.stopListening();
  };

  return CorePlugin;
}(_base_object2.default);

exports.default = CorePlugin;


(0, _assign2.default)(CorePlugin.prototype, _error_mixin2.default);

CorePlugin.extend = function (properties) {
  return (0, _utils.extend)(CorePlugin, properties);
};

CorePlugin.type = 'core';
module.exports = exports['default'];

/***/ }),

/***/ "./src/base/error_mixin.js":
/*!*********************************!*\
  !*** ./src/base/error_mixin.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _log = __webpack_require__(/*! ../components/log */ "./src/components/log.js");

var _log2 = _interopRequireDefault(_log);

var _error = __webpack_require__(/*! ../components/error */ "./src/components/error.js");

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorMixin = {
  /**
   * creates an error.
   * @method createError
   * @param {Object} error should be an object with code, description, level and raw error.
   * @return {Object} Object with formatted error data including origin and scope
   */
  createError: function createError(error) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { useCodePrefix: true };

    var scope = this.constructor && this.constructor.type || '';
    var origin = this.name || scope;
    var i18n = this.i18n || this.core && this.core.i18n || this.container && this.container.i18n;

    var prefixedCode = origin + ':' + (error && error.code || 'unknown');
    var defaultError = {
      description: '',
      level: _error2.default.Levels.FATAL,
      origin: origin,
      scope: scope,
      raw: {}
    };

    var errorData = (0, _assign2.default)({}, defaultError, error, {
      code: options.useCodePrefix ? prefixedCode : error.code
    });

    if (i18n && errorData.level == _error2.default.Levels.FATAL && !errorData.UI) {
      var defaultUI = {
        title: i18n.t('default_error_title'),
        message: i18n.t('default_error_message')
      };
      errorData.UI = defaultUI;
    }

    if (this.playerError) this.playerError.createError(errorData);else _log2.default.warn(origin, 'PlayerError is not defined. Error: ', errorData);

    return errorData;
  }
};

exports.default = ErrorMixin;
module.exports = exports['default'];

/***/ }),

/***/ "./src/base/events.js":
/*!****************************!*\
  !*** ./src/base/events.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = __webpack_require__(/*! babel-runtime/core-js/object/keys */ "./node_modules/babel-runtime/core-js/object/keys.js");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ "./node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

var _log = __webpack_require__(/*! ../components/log */ "./src/components/log.js");

var _log2 = _interopRequireDefault(_log);

var _utils = __webpack_require__(/*! ../utils */ "./src/utils/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var slice = Array.prototype.slice;

var eventSplitter = /\s+/;

var eventsApi = function eventsApi(obj, action, name, rest) {
  if (!name) return true;

  // Handle event maps.
  if ((typeof name === 'undefined' ? 'undefined' : (0, _typeof3.default)(name)) === 'object') {
    for (var key in name) {
      obj[action].apply(obj, [key, name[key]].concat(rest));
    }return false;
  }

  // Handle space separated event names.
  if (eventSplitter.test(name)) {
    var names = name.split(eventSplitter);
    for (var i = 0, l = names.length; i < l; i++) {
      obj[action].apply(obj, [names[i]].concat(rest));
    }return false;
  }

  return true;
};

var triggerEvents = function triggerEvents(events, args, klass, name) {
  var ev = void 0,
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
          }return;
        case 1:
          while (++i < l) {
            (ev = events[i]).callback.call(ev.ctx, a1);
          }return;
        case 2:
          while (++i < l) {
            (ev = events[i]).callback.call(ev.ctx, a1, a2);
          }return;
        case 3:
          while (++i < l) {
            (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
          }return;
        default:
          while (++i < l) {
            (ev = events[i]).callback.apply(ev.ctx, args);
          }return;
      }
    } catch (exception) {
      _log2.default.error.apply(_log2.default, [klass, 'error on event', name, 'trigger', '-', exception]);
      run();
    }
  }
};

/**
 * @class Events
 * @constructor
 * @module base
 */

var Events = function () {
  function Events() {
    (0, _classCallCheck3.default)(this, Events);
  }

  /**
   * listen to an event indefinitely, if you want to stop you need to call `off`
   * @method on
   * @param {String} name
   * @param {Function} callback
   * @param {Object} context
   */
  Events.prototype.on = function on(name, callback, context) {
    if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
    this._events || (this._events = {});
    var events = this._events[name] || (this._events[name] = []);
    events.push({ callback: callback, context: context, ctx: context || this });
    return this;
  };

  /**
   * listen to an event only once
   * @method once
   * @param {String} name
   * @param {Function} callback
   * @param {Object} context
   */


  Events.prototype.once = function once(name, callback, context) {
    var _this = this;

    var _once = void 0;
    if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
    var off = function off() {
      return _this.off(name, _once);
    };
    _once = function once() {
      off(name, _once);
      callback.apply(this, arguments);
    };
    return this.on(name, _once, context);
  };

  /**
   * stop listening to an event
   * @method off
   * @param {String} name
   * @param {Function} callback
   * @param {Object} context
   */


  Events.prototype.off = function off(name, callback, context) {
    var retain = void 0,
        ev = void 0,
        events = void 0,
        names = void 0,
        i = void 0,
        l = void 0,
        j = void 0,
        k = void 0;
    if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
    if (!name && !callback && !context) {
      this._events = void 0;
      return this;
    }
    names = name ? [name] : (0, _keys2.default)(this._events);
    // jshint maxdepth:5
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
  };

  /**
   * triggers an event given its `name`
   * @method trigger
   * @param {String} name
   */


  Events.prototype.trigger = function trigger(name) {
    var klass = this.name || this.constructor.name;
    _log2.default.debug.apply(_log2.default, [klass].concat(Array.prototype.slice.call(arguments)));
    if (!this._events) return this;
    var args = slice.call(arguments, 1);
    if (!eventsApi(this, 'trigger', name, args)) return this;
    var events = this._events[name];
    var allEvents = this._events.all;
    if (events) triggerEvents(events, args, klass, name);
    if (allEvents) triggerEvents(allEvents, arguments, klass, name);
    return this;
  };

  /**
   * stop listening an event for a given object
   * @method stopListening
   * @param {Object} obj
   * @param {String} name
   * @param {Function} callback
   */


  Events.prototype.stopListening = function stopListening(obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;
    var remove = !name && !callback;
    if (!callback && (typeof name === 'undefined' ? 'undefined' : (0, _typeof3.default)(name)) === 'object') callback = this;
    if (obj) (listeningTo = {})[obj._listenId] = obj;
    for (var id in listeningTo) {
      obj = listeningTo[id];
      obj.off(name, callback, this);
      if (remove || (0, _keys2.default)(obj._events).length === 0) delete this._listeningTo[id];
    }
    return this;
  };

  Events.register = function register(eventName) {
    Events.Custom || (Events.Custom = {});
    var property = typeof eventName === 'string' && eventName.toUpperCase().trim();

    if (property && !Events.Custom[property]) {
      Events.Custom[property] = property.toLowerCase().split('_').map(function (value, index) {
        return index === 0 ? value : value = value[0].toUpperCase() + value.slice(1);
      }).join('');
    } else _log2.default.error('Events', 'Error when register event: ' + eventName);
  };

  Events.listAvailableCustomEvents = function listAvailableCustomEvents() {
    Events.Custom || (Events.Custom = {});
    return (0, _keys2.default)(Events.Custom).filter(function (property) {
      return typeof Events.Custom[property] === 'string';
    });
  };

  return Events;
}();

/**
 * listen to an event indefinitely for a given `obj`
 * @method listenTo
 * @param {Object} obj
 * @param {String} name
 * @param {Function} callback
 * @param {Object} context
 * @example
 * ```javascript
 * this.listenTo(this.core.playback, Events.PLAYBACK_PAUSE, this.callback)
 * ```
 */
/**
 * listen to an event once for a given `obj`
 * @method listenToOnce
 * @param {Object} obj
 * @param {String} name
 * @param {Function} callback
 * @param {Object} context
 * @example
 * ```javascript
 * this.listenToOnce(this.core.playback, Events.PLAYBACK_PAUSE, this.callback)
 * ```
 */


exports.default = Events;
var listenMethods = { listenTo: 'on', listenToOnce: 'once' };

(0, _keys2.default)(listenMethods).forEach(function (method) {
  Events.prototype[method] = function (obj, name, callback) {
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var id = obj._listenId || (obj._listenId = (0, _utils.uniqueId)('l'));
    listeningTo[id] = obj;
    if (!callback && (typeof name === 'undefined' ? 'undefined' : (0, _typeof3.default)(name)) === 'object') callback = this;
    obj[listenMethods[method]](name, callback, this);
    return this;
  };
});

// PLAYER EVENTS
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
Events.PLAYER_SUBTITLE_AVAILABLE = 'subtitleavailable';

// Playback Events
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
Events.PLAYBACK_DVR = 'playback:dvr';
// TODO doc
Events.PLAYBACK_MEDIACONTROL_DISABLE = 'playback:mediacontrol:disable';
// TODO doc
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
Events.PLAYBACK_ERROR = 'playback:error';
// TODO doc
Events.PLAYBACK_STATS_ADD = 'playback:stats:add';
// TODO doc
Events.PLAYBACK_FRAGMENT_LOADED = 'playback:fragment:loaded';
// TODO doc
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
Events.PLAYBACK_SUBTITLE_CHANGED = 'playback:subtitle:changed';

// Core Events
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
Events.CORE_MOUSE_LEAVE = 'core:mouseleave';

// Container Events
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
Events.CONTAINER_OPTIONS_CHANGE = 'container:options:change';

// MediaControl Events
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
module.exports = exports['default'];

/***/ }),

/***/ "./src/base/media.js":
/*!***************************!*\
  !*** ./src/base/media.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// https://github.com/mathiasbynens/small
var mp4 = exports.mp4 = 'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAC721kYXQhEAUgpBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBSCkG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAsJtb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAALwABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAB7HRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAIAAAAAAAAALwAAAAAAAAAAAAAAAQEAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAC8AAAAAAAEAAAAAAWRtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAAKxEAAAIAFXEAAAAAAAtaGRscgAAAAAAAAAAc291bgAAAAAAAAAAAAAAAFNvdW5kSGFuZGxlcgAAAAEPbWluZgAAABBzbWhkAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAADTc3RibAAAAGdzdHNkAAAAAAAAAAEAAABXbXA0YQAAAAAAAAABAAAAAAAAAAAAAgAQAAAAAKxEAAAAAAAzZXNkcwAAAAADgICAIgACAASAgIAUQBUAAAAAAfQAAAHz+QWAgIACEhAGgICAAQIAAAAYc3R0cwAAAAAAAAABAAAAAgAABAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAIAAAABAAAAHHN0c3oAAAAAAAAAAAAAAAIAAAFzAAABdAAAABRzdGNvAAAAAAAAAAEAAAAsAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1Ni40MC4xMDE=';

exports.default = {
  mp4: mp4
};

/***/ }),

/***/ "./src/base/playback.js":
/*!******************************!*\
  !*** ./src/base/playback.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(/*! ../utils */ "./src/utils/utils.js");

var _ui_object = __webpack_require__(/*! ./ui_object */ "./src/base/ui_object.js");

var _ui_object2 = _interopRequireDefault(_ui_object);

var _error_mixin = __webpack_require__(/*! ./error_mixin */ "./src/base/error_mixin.js");

var _error_mixin2 = _interopRequireDefault(_error_mixin);

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An abstraction to represent a generic playback, it's like an interface to be implemented by subclasses.
 * @class Playback
 * @constructor
 * @extends UIObject
 * @module base
 */
var Playback = function (_UIObject) {
  (0, _inherits3.default)(Playback, _UIObject);
  (0, _createClass3.default)(Playback, [{
    key: 'isAudioOnly',

    /**
    * Determine if the playback does not contain video/has video but video should be ignored.
    * @property isAudioOnly
    * @type Boolean
    */
    get: function get() {
      return false;
    }
  }, {
    key: 'isAdaptive',
    get: function get() {
      return false;
    }

    /**
     * Determine if the playback has ended.
     * @property ended
     * @type Boolean
     */

  }, {
    key: 'ended',
    get: function get() {
      return false;
    }

    /**
     * The internationalization plugin.
     * @property i18n
     * @type {Strings}
     */

  }, {
    key: 'i18n',
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
    key: 'buffering',
    get: function get() {
      return false;
    }

    /**
     * Determine if the playback has user consent.
     * @property consented
     * @type Boolean
     */

  }, {
    key: 'consented',
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
    (0, _classCallCheck3.default)(this, Playback);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UIObject.call(this, options));

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


  Playback.prototype.consent = function consent() {
    this._consented = true;
  };

  /**
   * plays the playback.
   * @method play
   */


  Playback.prototype.play = function play() {};

  /**
   * pauses the playback.
   * @method pause
   */


  Playback.prototype.pause = function pause() {};

  /**
   * stops the playback.
   * @method stop
   */


  Playback.prototype.stop = function stop() {};

  /**
   * seeks the playback to a given `time` in seconds
   * @method seek
   * @param {Number} time should be a number between 0 and the video duration
   */


  Playback.prototype.seek = function seek(time) {}; // eslint-disable-line no-unused-vars

  /**
   * seeks the playback to a given `percentage` in percentage
   * @method seekPercentage
   * @param {Number} time should be a number between 0 and 100
   */


  Playback.prototype.seekPercentage = function seekPercentage(percentage) {}; // eslint-disable-line no-unused-vars

  /**
   * The time that "0" now represents relative to when playback started.
   * For a stream with a sliding window this will increase as content is
   * removed from the beginning.
   * @method getStartTimeOffset
   * @return {Number} time (in seconds) that time "0" represents.
   */


  Playback.prototype.getStartTimeOffset = function getStartTimeOffset() {
    return 0;
  };

  /**
   * gets the duration in seconds
   * @method getDuration
   * @return {Number} duration (in seconds) of the current source
   */


  Playback.prototype.getDuration = function getDuration() {
    return 0;
  };

  /**
   * checks if the playback is playing.
   * @method isPlaying
   * @return {Boolean} `true` if the current playback is playing, otherwise `false`
   */


  Playback.prototype.isPlaying = function isPlaying() {
    return false;
  };

  /**
   * checks if the playback is ready.
   * @property isReady
   * @type {Boolean} `true` if the current playback is ready, otherwise `false`
   */


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
  Playback.prototype.getPlaybackType = function getPlaybackType() {
    return Playback.NO_OP;
  };

  /**
   * checks if the playback is in HD.
   * @method isHighDefinitionInUse
   * @return {Boolean} `true` if the playback is playing in HD, otherwise `false`
   */


  Playback.prototype.isHighDefinitionInUse = function isHighDefinitionInUse() {
    return false;
  };

  /**
   * sets the volume for the playback
   * @method volume
   * @param {Number} value a number between 0 (`muted`) to 100 (`max`)
   */


  Playback.prototype.volume = function volume(value) {}; // eslint-disable-line no-unused-vars

  /**
   * enables to configure the playback after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   */


  Playback.prototype.configure = function configure(options) {
    this._options = _clapprZepto2.default.extend(this._options, options);
  };

  /**
   * attempt to autoplays the playback.
   * @method attemptAutoPlay
   */


  Playback.prototype.attemptAutoPlay = function attemptAutoPlay() {
    var _this2 = this;

    this.canAutoPlay(function (result, error) {
      // eslint-disable-line no-unused-vars
      result && _this2.play();
    });
  };

  /**
   * checks if the playback can autoplay.
   * @method canAutoPlay
   * @param {Function} callback function where first param is Boolean and second param is playback Error or null
   */


  Playback.prototype.canAutoPlay = function canAutoPlay(cb) {
    cb(true, null); // Assume playback can autoplay by default
  };

  (0, _createClass3.default)(Playback, [{
    key: 'isReady',
    get: function get() {
      return false;
    }

    /**
     * checks if the playback has closed caption tracks.
     * @property hasClosedCaptionsTracks
     * @type {Boolean}
     */

  }, {
    key: 'hasClosedCaptionsTracks',
    get: function get() {
      return this.closedCaptionsTracks.length > 0;
    }

    /**
     * gets the playback available closed caption tracks.
     * @property closedCaptionsTracks
     * @type {Array} an array of objects with at least 'id' and 'name' properties
     */

  }, {
    key: 'closedCaptionsTracks',
    get: function get() {
      return [];
    }

    /**
     * gets the selected closed caption track index. (-1 is disabled)
     * @property closedCaptionsTrackId
     * @type {Number}
     */

  }, {
    key: 'closedCaptionsTrackId',
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
}(_ui_object2.default);

exports.default = Playback;


(0, _assign2.default)(Playback.prototype, _error_mixin2.default);

Playback.extend = function (properties) {
  return (0, _utils.extend)(Playback, properties);
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
module.exports = exports['default'];

/***/ }),

/***/ "./src/base/polyfills.js":
/*!*******************************!*\
  !*** ./src/base/polyfills.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) return kValue;

        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}

/***/ }),

/***/ "./src/base/styler.js":
/*!****************************!*\
  !*** ./src/base/styler.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

var _template = __webpack_require__(/*! ./template */ "./src/base/template.js");

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Styler = {
  getStyleFor: function getStyleFor(style) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { baseUrl: '' };

    return (0, _clapprZepto2.default)('<style class="clappr-style"></style>').html((0, _template2.default)(style.toString())(options));
  }
};

exports.default = Styler;
module.exports = exports['default'];

/***/ }),

/***/ "./src/base/template.js":
/*!******************************!*\
  !*** ./src/base/template.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
};var noMatch = /(.)^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
  '\'': '\'',
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  '\t': 't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

// List of HTML entities for escaping.
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

var counter = 0;

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
var tmpl = function tmpl(text, data) {
  var render;

  // Combine delimiters into one regular expression via alternation.
  var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

  // Compile the template source, escaping string literals appropriately.
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
  source += '\';\n';

  // If a variable is not specified, place data values in local scope.
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
  };

  // Provide the compiled function source as a convenience for precompilation.
  template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

  return template;
};
tmpl.settings = settings;

exports.default = tmpl;
module.exports = exports['default'];

/***/ }),

/***/ "./src/base/ui_container_plugin.js":
/*!*****************************************!*\
  !*** ./src/base/ui_container_plugin.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(/*! ../utils */ "./src/utils/utils.js");

var _ui_object = __webpack_require__(/*! ./ui_object */ "./src/base/ui_object.js");

var _ui_object2 = _interopRequireDefault(_ui_object);

var _error_mixin = __webpack_require__(/*! ./error_mixin */ "./src/base/error_mixin.js");

var _error_mixin2 = _interopRequireDefault(_error_mixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The base class for an ui container plugin
 * @class UIContainerPlugin
 * @constructor
 * @extends UIObject
 * @module base
 */
var UIContainerPlugin = function (_UIObject) {
  (0, _inherits3.default)(UIContainerPlugin, _UIObject);
  (0, _createClass3.default)(UIContainerPlugin, [{
    key: 'playerError',
    get: function get() {
      return this.container.playerError;
    }
  }]);

  function UIContainerPlugin(container) {
    (0, _classCallCheck3.default)(this, UIContainerPlugin);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UIObject.call(this, container.options));

    _this.container = container;
    _this.enabled = true;
    _this.bindEvents();
    return _this;
  }

  UIContainerPlugin.prototype.enable = function enable() {
    if (!this.enabled) {
      this.bindEvents();
      this.$el.show();
      this.enabled = true;
    }
  };

  UIContainerPlugin.prototype.disable = function disable() {
    this.stopListening();
    this.$el.hide();
    this.enabled = false;
  };

  UIContainerPlugin.prototype.bindEvents = function bindEvents() {};

  return UIContainerPlugin;
}(_ui_object2.default); // Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

exports.default = UIContainerPlugin;


(0, _assign2.default)(UIContainerPlugin.prototype, _error_mixin2.default);

UIContainerPlugin.extend = function (properties) {
  return (0, _utils.extend)(UIContainerPlugin, properties);
};

UIContainerPlugin.type = 'container';
module.exports = exports['default'];

/***/ }),

/***/ "./src/base/ui_core_plugin.js":
/*!************************************!*\
  !*** ./src/base/ui_core_plugin.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(/*! ../utils */ "./src/utils/utils.js");

var _ui_object = __webpack_require__(/*! ./ui_object */ "./src/base/ui_object.js");

var _ui_object2 = _interopRequireDefault(_ui_object);

var _error_mixin = __webpack_require__(/*! ./error_mixin */ "./src/base/error_mixin.js");

var _error_mixin2 = _interopRequireDefault(_error_mixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UICorePlugin = function (_UIObject) {
  (0, _inherits3.default)(UICorePlugin, _UIObject);
  (0, _createClass3.default)(UICorePlugin, [{
    key: 'playerError',
    get: function get() {
      return this.core.playerError;
    }
  }]);

  function UICorePlugin(core) {
    (0, _classCallCheck3.default)(this, UICorePlugin);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UIObject.call(this, core.options));

    _this.core = core;
    _this.enabled = true;
    _this.bindEvents();
    _this.render();
    return _this;
  }

  UICorePlugin.prototype.bindEvents = function bindEvents() {};

  UICorePlugin.prototype.getExternalInterface = function getExternalInterface() {
    return {};
  };

  UICorePlugin.prototype.enable = function enable() {
    if (!this.enabled) {
      this.bindEvents();
      this.$el.show();
      this.enabled = true;
    }
  };

  UICorePlugin.prototype.disable = function disable() {
    this.stopListening();
    this.$el.hide();
    this.enabled = false;
  };

  UICorePlugin.prototype.render = function render() {
    return this;
  };

  return UICorePlugin;
}(_ui_object2.default);

exports.default = UICorePlugin;


(0, _assign2.default)(UICorePlugin.prototype, _error_mixin2.default);

UICorePlugin.extend = function (properties) {
  return (0, _utils.extend)(UICorePlugin, properties);
};

UICorePlugin.type = 'core';
module.exports = exports['default'];

/***/ }),

/***/ "./src/base/ui_object.js":
/*!*******************************!*\
  !*** ./src/base/ui_object.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

var _utils = __webpack_require__(/*! ../utils */ "./src/utils/utils.js");

var _base_object = __webpack_require__(/*! ./base_object */ "./src/base/base_object.js");

var _base_object2 = _interopRequireDefault(_base_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var delegateEventSplitter = /^(\S+)\s*(.*)$/;

/**
 * A base class to create ui object.
 * @class UIObject
 * @constructor
 * @extends BaseObject
 * @module base
 */
// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = function (_BaseObject) {
  (0, _inherits3.default)(UIObject, _BaseObject);
  (0, _createClass3.default)(UIObject, [{
    key: 'tagName',

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
    key: 'events',
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
    key: 'attributes',
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
    (0, _classCallCheck3.default)(this, UIObject);

    var _this = (0, _possibleConstructorReturn3.default)(this, _BaseObject.call(this, options));

    _this.cid = (0, _utils.uniqueId)('c');
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


  UIObject.prototype.$ = function $(selector) {
    return this.$el.find(selector);
  };

  /**
   * render the component, usually attach it to a real existent `element`
   * @method render
   * @return {UIObject} itself
   */


  UIObject.prototype.render = function render() {
    return this;
  };

  /**
   * removes the ui component from DOM
   * @method destroy
   * @return {UIObject} itself
   */


  UIObject.prototype.destroy = function destroy() {
    this.$el.remove();
    this.stopListening();
    this.undelegateEvents();
    return this;
  };

  /**
   * set element to `el` and `$el`
   * @method setElement
   * @param {HTMLElement} element
   * @param {Boolean} delegate whether is delegate or not
   * @return {UIObject} itself
   */


  UIObject.prototype.setElement = function setElement(element, delegate) {
    if (this.$el) this.undelegateEvents();
    this.$el = _clapprZepto2.default.zepto.isZ(element) ? element : (0, _clapprZepto2.default)(element);
    this.el = this.$el[0];
    if (delegate !== false) this.delegateEvents();
    return this;
  };

  /**
   * delegates all the original `events` on `element` to its callbacks
   * @method delegateEvents
   * @param {Object} events
   * @return {UIObject} itself
   */


  UIObject.prototype.delegateEvents = function delegateEvents(events) {
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
  };

  /**
   * undelegats all the `events`
   * @method undelegateEvents
   * @return {UIObject} itself
   */


  UIObject.prototype.undelegateEvents = function undelegateEvents() {
    this.$el.off('.delegateEvents' + this.cid);
    return this;
  };

  /**
   * ensures the creation of this ui component
   * @method _ensureElement
   * @private
   */


  UIObject.prototype._ensureElement = function _ensureElement() {
    if (!this.el) {
      var attrs = _clapprZepto2.default.extend({}, this.attributes);
      if (this.id) attrs.id = this.id;
      if (this.className) attrs['class'] = this.className;
      var $el = _utils.DomRecycler.create(this.tagName).attr(attrs);
      this.setElement($el, false);
    } else {
      this.setElement(this.el, false);
    }
  };

  return UIObject;
}(_base_object2.default);

exports.default = UIObject;
module.exports = exports['default'];

/***/ }),

/***/ "./src/components/browser/browser.js":
/*!*******************************************!*\
  !*** ./src/components/browser/browser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevice = exports.getViewportSize = exports.getOsData = exports.getBrowserData = exports.getBrowserInfo = undefined;

var _getIterator2 = __webpack_require__(/*! babel-runtime/core-js/get-iterator */ "./node_modules/babel-runtime/core-js/get-iterator.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

var _browser_data = __webpack_require__(/*! ./browser_data */ "./src/components/browser/browser_data.js");

var _browser_data2 = _interopRequireDefault(_browser_data);

var _os_data = __webpack_require__(/*! ./os_data */ "./src/components/browser/os_data.js");

var _os_data2 = _interopRequireDefault(_os_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var getBrowserInfo = exports.getBrowserInfo = function getBrowserInfo(ua) {
  var parts = ua.match(/\b(playstation 4|nx|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [],
      extra = void 0;
  if (/trident/i.test(parts[1])) {
    extra = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {
      name: 'IE',
      version: parseInt(extra[1] || '')
    };
  } else if (parts[1] === 'Chrome') {
    extra = ua.match(/\bOPR\/(\d+)/);
    if (extra != null) return { name: 'Opera', version: parseInt(extra[1]) };

    extra = ua.match(/\bEdge\/(\d+)/);
    if (extra != null) return { name: 'Edge', version: parseInt(extra[1]) };
  } else if (/android/i.test(ua) && (extra = ua.match(/version\/(\d+)/i))) {
    parts.splice(1, 1, 'Android WebView');
    parts.splice(2, 1, extra[1]);
  }
  parts = parts[2] ? [parts[1], parts[2]] : [navigator.appName, navigator.appVersion, '-?'];

  return {
    name: parts[0],
    version: parseInt(parts[1])
  };
};

//  Get browser data
var getBrowserData = exports.getBrowserData = function getBrowserData() {
  var browserObject = {};
  var userAgent = Browser.userAgent.toLowerCase();

  // Check browser type
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(_browser_data2.default), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var browser = _step.value;

      var browserRegExp = new RegExp(browser.identifier.toLowerCase());
      var browserRegExpResult = browserRegExp.exec(userAgent);

      if (browserRegExpResult != null && browserRegExpResult[1]) {
        browserObject.name = browser.name;
        browserObject.group = browser.group;

        // Check version
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
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return browserObject;
};

// Set browser version
var setBrowserVersion = function setBrowserVersion(version, browserObject) {
  var splitVersion = version.split('.', 2);
  browserObject.fullVersion = version;

  // Major version
  if (splitVersion[0]) browserObject.majorVersion = parseInt(splitVersion[0]);

  // Minor version
  if (splitVersion[1]) browserObject.minorVersion = parseInt(splitVersion[1]);
};

//  Get OS data
var getOsData = exports.getOsData = function getOsData() {
  var osObject = {};
  var userAgent = Browser.userAgent.toLowerCase();

  // Check browser type
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _getIterator3.default)(_os_data2.default), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var os = _step2.value;

      var osRegExp = new RegExp(os.identifier.toLowerCase());
      var osRegExpResult = osRegExp.exec(userAgent);

      if (osRegExpResult != null) {
        osObject.name = os.name;
        osObject.group = os.group;

        // Version defined
        if (os.version) {
          setOsVersion(os.version, os.versionSeparator ? os.versionSeparator : '.', osObject);

          // Version detected
        } else if (osRegExpResult[1]) {
          setOsVersion(osRegExpResult[1], os.versionSeparator ? os.versionSeparator : '.', osObject);

          // Version identifier
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
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return osObject;
};

// Set OS version
var setOsVersion = function setOsVersion(version, separator, osObject) {
  var finalSeparator = separator.substr(0, 1) == '[' ? new RegExp(separator, 'g') : separator;
  var splitVersion = version.split(finalSeparator, 2);

  if (separator != '.') version = version.replace(new RegExp(separator, 'g'), '.');

  osObject.fullVersion = version;

  // Major version
  if (splitVersion && splitVersion[0]) osObject.majorVersion = parseInt(splitVersion[0]);

  // Minor version
  if (splitVersion && splitVersion[1]) osObject.minorVersion = parseInt(splitVersion[1]);
};

// Set viewport size
var getViewportSize = exports.getViewportSize = function getViewportSize() {
  var viewportObject = {};

  viewportObject.width = (0, _clapprZepto2.default)(window).width();
  viewportObject.height = (0, _clapprZepto2.default)(window).height();

  return viewportObject;
};

// Set viewport orientation
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

var getDevice = exports.getDevice = function getDevice(ua) {
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

exports.default = Browser;

/***/ }),

/***/ "./src/components/browser/browser_data.js":
/*!************************************************!*\
  !*** ./src/components/browser/browser_data.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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

exports.default = BROWSER_DATA;
module.exports = exports['default'];

/***/ }),

/***/ "./src/components/browser/os_data.js":
/*!*******************************************!*\
  !*** ./src/components/browser/os_data.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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

exports.default = OS_DATA;
module.exports = exports['default'];

/***/ }),

/***/ "./src/components/container/container.js":
/*!***********************************************!*\
  !*** ./src/components/container/container.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = __webpack_require__(/*! ../../base/events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

var _ui_object = __webpack_require__(/*! ../../base/ui_object */ "./src/base/ui_object.js");

var _ui_object2 = _interopRequireDefault(_ui_object);

var _error_mixin = __webpack_require__(/*! ../../base/error_mixin */ "./src/base/error_mixin.js");

var _error_mixin2 = _interopRequireDefault(_error_mixin);

var _utils = __webpack_require__(/*! ../../utils */ "./src/utils/utils.js");

__webpack_require__(/*! ./public/style.scss */ "./src/components/container/public/style.scss");

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An abstraction to represent a container for a given playback
 * TODO: describe its responsabilities
 * @class Container
 * @constructor
 * @extends UIObject
 * @module base
 */
// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * Container is responsible for the video rendering and state
 */

var Container = function (_UIObject) {
  (0, _inherits3.default)(Container, _UIObject);
  (0, _createClass3.default)(Container, [{
    key: 'name',

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
    key: 'attributes',
    get: function get() {
      return { class: 'container', 'data-container': '' };
    }
  }, {
    key: 'events',
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
    key: 'ended',
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
    key: 'buffering',
    get: function get() {
      return this.playback.buffering;
    }

    /**
     * The internationalization plugin.
     * @property i18n
     * @type {Strings}
     */

  }, {
    key: 'i18n',
    get: function get() {
      return this._i18n;
    }

    /**
     * checks if has closed caption tracks.
     * @property hasClosedCaptionsTracks
     * @type {Boolean}
     */

  }, {
    key: 'hasClosedCaptionsTracks',
    get: function get() {
      return this.playback.hasClosedCaptionsTracks;
    }

    /**
     * gets the available closed caption tracks.
     * @property closedCaptionsTracks
     * @type {Array} an array of objects with at least 'id' and 'name' properties
     */

  }, {
    key: 'closedCaptionsTracks',
    get: function get() {
      return this.playback.closedCaptionsTracks;
    }

    /**
     * gets the selected closed caption track index. (-1 is disabled)
     * @property closedCaptionsTrackId
     * @type {Number}
     */

  }, {
    key: 'closedCaptionsTrackId',
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
    (0, _classCallCheck3.default)(this, Container);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UIObject.call(this, options));

    _this._i18n = i18n;
    _this.currentTime = 0;
    _this.volume = 100;
    _this.playback = options.playback;
    _this.playerError = playerError;
    _this.settings = _clapprZepto2.default.extend({}, _this.playback.settings);
    _this.isReady = false;
    _this.mediaControlDisabled = false;
    _this.plugins = [_this.playback];
    _this.dblTapHandler = new _utils.DoubleEventHandler(500);
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


  Container.prototype.bindEvents = function bindEvents() {
    this.listenTo(this.playback, _events2.default.PLAYBACK_PROGRESS, this.onProgress);
    this.listenTo(this.playback, _events2.default.PLAYBACK_TIMEUPDATE, this.timeUpdated);
    this.listenTo(this.playback, _events2.default.PLAYBACK_READY, this.ready);
    this.listenTo(this.playback, _events2.default.PLAYBACK_BUFFERING, this.onBuffering);
    this.listenTo(this.playback, _events2.default.PLAYBACK_BUFFERFULL, this.bufferfull);
    this.listenTo(this.playback, _events2.default.PLAYBACK_SETTINGSUPDATE, this.settingsUpdate);
    this.listenTo(this.playback, _events2.default.PLAYBACK_LOADEDMETADATA, this.loadedMetadata);
    this.listenTo(this.playback, _events2.default.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinitionUpdate);
    this.listenTo(this.playback, _events2.default.PLAYBACK_BITRATE, this.updateBitrate);
    this.listenTo(this.playback, _events2.default.PLAYBACK_PLAYBACKSTATE, this.playbackStateChanged);
    this.listenTo(this.playback, _events2.default.PLAYBACK_DVR, this.playbackDvrStateChanged);
    this.listenTo(this.playback, _events2.default.PLAYBACK_MEDIACONTROL_DISABLE, this.disableMediaControl);
    this.listenTo(this.playback, _events2.default.PLAYBACK_MEDIACONTROL_ENABLE, this.enableMediaControl);
    this.listenTo(this.playback, _events2.default.PLAYBACK_SEEKED, this.onSeeked);
    this.listenTo(this.playback, _events2.default.PLAYBACK_ENDED, this.onEnded);
    this.listenTo(this.playback, _events2.default.PLAYBACK_PLAY, this.playing);
    this.listenTo(this.playback, _events2.default.PLAYBACK_PAUSE, this.paused);
    this.listenTo(this.playback, _events2.default.PLAYBACK_STOP, this.stopped);
    this.listenTo(this.playback, _events2.default.PLAYBACK_ERROR, this.error);
    this.listenTo(this.playback, _events2.default.PLAYBACK_SUBTITLE_AVAILABLE, this.subtitleAvailable);
    this.listenTo(this.playback, _events2.default.PLAYBACK_SUBTITLE_CHANGED, this.subtitleChanged);
  };

  Container.prototype.subtitleAvailable = function subtitleAvailable() {
    this.trigger(_events2.default.CONTAINER_SUBTITLE_AVAILABLE);
  };

  Container.prototype.subtitleChanged = function subtitleChanged(track) {
    this.trigger(_events2.default.CONTAINER_SUBTITLE_CHANGED, track);
  };

  Container.prototype.playbackStateChanged = function playbackStateChanged(state) {
    this.trigger(_events2.default.CONTAINER_PLAYBACKSTATE, state);
  };

  Container.prototype.playbackDvrStateChanged = function playbackDvrStateChanged(dvrInUse) {
    this.settings = this.playback.settings;
    this.dvrInUse = dvrInUse;
    this.trigger(_events2.default.CONTAINER_PLAYBACKDVRSTATECHANGED, dvrInUse);
  };

  Container.prototype.updateBitrate = function updateBitrate(newBitrate) {
    this.trigger(_events2.default.CONTAINER_BITRATE, newBitrate);
  };

  Container.prototype.statsReport = function statsReport(metrics) {
    this.trigger(_events2.default.CONTAINER_STATS_REPORT, metrics);
  };

  Container.prototype.getPlaybackType = function getPlaybackType() {
    return this.playback.getPlaybackType();
  };

  /**
   * returns `true` if DVR is enable otherwise `false`.
   * @method isDvrEnabled
   * @return {Boolean}
   */


  Container.prototype.isDvrEnabled = function isDvrEnabled() {
    return !!this.playback.dvrEnabled;
  };

  /**
   * returns `true` if DVR is in use otherwise `false`.
   * @method isDvrInUse
   * @return {Boolean}
   */


  Container.prototype.isDvrInUse = function isDvrInUse() {
    return !!this.dvrInUse;
  };

  /**
   * destroys the container
   * @method destroy
   */


  Container.prototype.destroy = function destroy() {
    this.trigger(_events2.default.CONTAINER_DESTROYED, this, this.name);
    this.stopListening();
    this.plugins.forEach(function (plugin) {
      return plugin.destroy();
    });
    this.$el.remove();
  };

  Container.prototype.setStyle = function setStyle(style) {
    this.$el.css(style);
  };

  Container.prototype.animate = function animate(style, duration) {
    return this.$el.animate(style, duration).promise();
  };

  Container.prototype.ready = function ready() {
    this.isReady = true;
    this.trigger(_events2.default.CONTAINER_READY, this.name);
  };

  Container.prototype.isPlaying = function isPlaying() {
    return this.playback.isPlaying();
  };

  Container.prototype.getStartTimeOffset = function getStartTimeOffset() {
    return this.playback.getStartTimeOffset();
  };

  Container.prototype.getCurrentTime = function getCurrentTime() {
    return this.currentTime;
  };

  Container.prototype.getDuration = function getDuration() {
    return this.playback.getDuration();
  };

  Container.prototype.error = function error(_error) {
    if (!this.isReady) this.ready();

    this.trigger(_events2.default.CONTAINER_ERROR, _error, this.name);
  };

  Container.prototype.loadedMetadata = function loadedMetadata(metadata) {
    this.trigger(_events2.default.CONTAINER_LOADEDMETADATA, metadata);
  };

  Container.prototype.timeUpdated = function timeUpdated(timeProgress) {
    this.currentTime = timeProgress.current;
    this.trigger(_events2.default.CONTAINER_TIMEUPDATE, timeProgress, this.name);
  };

  Container.prototype.onProgress = function onProgress() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.trigger.apply(this, [_events2.default.CONTAINER_PROGRESS].concat(args, [this.name]));
  };

  Container.prototype.playing = function playing() {
    this.trigger(_events2.default.CONTAINER_PLAY, this.name);
  };

  Container.prototype.paused = function paused() {
    this.trigger(_events2.default.CONTAINER_PAUSE, this.name);
  };

  /**
   * plays the playback
   * @method play
   */


  Container.prototype.play = function play() {
    this.playback.play();
  };

  /**
   * stops the playback
   * @method stop
   */


  Container.prototype.stop = function stop() {
    this.playback.stop();
    this.currentTime = 0;
  };

  /**
   * pauses the playback
   * @method pause
   */


  Container.prototype.pause = function pause() {
    this.playback.pause();
  };

  Container.prototype.onEnded = function onEnded() {
    this.trigger(_events2.default.CONTAINER_ENDED, this, this.name);
    this.currentTime = 0;
  };

  Container.prototype.stopped = function stopped() {
    this.trigger(_events2.default.CONTAINER_STOP);
  };

  Container.prototype.clicked = function clicked() {
    var _this2 = this;

    if (!this.options.chromeless || this.options.allowUserInteraction) {
      // The event is delayed because it can be canceled by a double-click event
      // An example of use is to prevent playback from pausing when switching to full screen
      this.clickTimer = setTimeout(function () {
        _this2.clickTimer && _this2.trigger(_events2.default.CONTAINER_CLICK, _this2, _this2.name);
      }, this.clickDelay);
    }
  };

  Container.prototype.cancelClicked = function cancelClicked() {
    clearTimeout(this.clickTimer);
    this.clickTimer = null;
  };

  Container.prototype.dblClicked = function dblClicked() {
    if (!this.options.chromeless || this.options.allowUserInteraction) {
      this.cancelClicked();
      this.trigger(_events2.default.CONTAINER_DBLCLICK, this, this.name);
    }
  };

  Container.prototype.dblTap = function dblTap(evt) {
    var _this3 = this;

    if (!this.options.chromeless || this.options.allowUserInteraction) {
      this.dblTapHandler.handle(evt, function () {
        _this3.cancelClicked();
        _this3.trigger(_events2.default.CONTAINER_DBLCLICK, _this3, _this3.name);
      });
    }
  };

  Container.prototype.onContextMenu = function onContextMenu(event) {
    if (!this.options.chromeless || this.options.allowUserInteraction) this.trigger(_events2.default.CONTAINER_CONTEXTMENU, event, this.name);
  };

  Container.prototype.seek = function seek(time) {
    this.trigger(_events2.default.CONTAINER_SEEK, time, this.name);
    this.playback.seek(time);
  };

  Container.prototype.onSeeked = function onSeeked() {
    this.trigger(_events2.default.CONTAINER_SEEKED, this.name);
  };

  Container.prototype.seekPercentage = function seekPercentage(percentage) {
    var duration = this.getDuration();
    if (percentage >= 0 && percentage <= 100) {
      var time = duration * (percentage / 100);
      this.seek(time);
    }
  };

  Container.prototype.setVolume = function setVolume(value) {
    this.volume = parseInt(value, 10);
    this.trigger(_events2.default.CONTAINER_VOLUME, value, this.name);
    this.playback.volume(value);
  };

  Container.prototype.fullscreen = function fullscreen() {
    this.trigger(_events2.default.CONTAINER_FULLSCREEN, this.name);
  };

  Container.prototype.onBuffering = function onBuffering() {
    this.trigger(_events2.default.CONTAINER_STATE_BUFFERING, this.name);
  };

  Container.prototype.bufferfull = function bufferfull() {
    this.trigger(_events2.default.CONTAINER_STATE_BUFFERFULL, this.name);
  };

  /**
   * adds plugin to the container
   * @method addPlugin
   * @param {Object} plugin
   */


  Container.prototype.addPlugin = function addPlugin(plugin) {
    this.plugins.push(plugin);
  };

  /**
   * checks if a plugin, given its name, exist
   * @method hasPlugin
   * @param {String} name
   * @return {Boolean}
   */


  Container.prototype.hasPlugin = function hasPlugin(name) {
    return !!this.getPlugin(name);
  };

  /**
   * get the plugin given its name
   * @method getPlugin
   * @param {String} name
   */


  Container.prototype.getPlugin = function getPlugin(name) {
    return this.plugins.filter(function (plugin) {
      return plugin.name === name;
    })[0];
  };

  Container.prototype.mouseEnter = function mouseEnter() {
    if (!this.options.chromeless || this.options.allowUserInteraction) this.trigger(_events2.default.CONTAINER_MOUSE_ENTER);
  };

  Container.prototype.mouseLeave = function mouseLeave() {
    if (!this.options.chromeless || this.options.allowUserInteraction) this.trigger(_events2.default.CONTAINER_MOUSE_LEAVE);
  };

  Container.prototype.settingsUpdate = function settingsUpdate() {
    this.settings = this.playback.settings;
    this.trigger(_events2.default.CONTAINER_SETTINGSUPDATE);
  };

  Container.prototype.highDefinitionUpdate = function highDefinitionUpdate(isHD) {
    this.trigger(_events2.default.CONTAINER_HIGHDEFINITIONUPDATE, isHD);
  };

  Container.prototype.isHighDefinitionInUse = function isHighDefinitionInUse() {
    return this.playback.isHighDefinitionInUse();
  };

  Container.prototype.disableMediaControl = function disableMediaControl() {
    if (!this.mediaControlDisabled) {
      this.mediaControlDisabled = true;
      this.trigger(_events2.default.CONTAINER_MEDIACONTROL_DISABLE);
    }
  };

  Container.prototype.enableMediaControl = function enableMediaControl() {
    if (this.mediaControlDisabled) {
      this.mediaControlDisabled = false;
      this.trigger(_events2.default.CONTAINER_MEDIACONTROL_ENABLE);
    }
  };

  Container.prototype.updateStyle = function updateStyle() {
    if (!this.options.chromeless || this.options.allowUserInteraction) this.$el.removeClass('chromeless');else this.$el.addClass('chromeless');
  };

  /**
   * enables to configure the container after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   */


  Container.prototype.configure = function configure(options) {
    this._options = _clapprZepto2.default.extend(this._options, options);
    this.updateStyle();
    this.playback.configure(this.options);
    this.trigger(_events2.default.CONTAINER_OPTIONS_CHANGE);
  };

  Container.prototype.render = function render() {
    this.$el.append(this.playback.render().el);
    this.updateStyle();
    return this;
  };

  return Container;
}(_ui_object2.default);

exports.default = Container;


(0, _assign2.default)(Container.prototype, _error_mixin2.default);
module.exports = exports['default'];

/***/ }),

/***/ "./src/components/container/public/style.scss":
/*!****************************************************!*\
  !*** ./src/components/container/public/style.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./style.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/components/container/public/style.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"singleton":true,"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/components/container_factory.js":
/*!*********************************************!*\
  !*** ./src/components/container_factory.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ "./node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _base_object = __webpack_require__(/*! ../base/base_object */ "./src/base/base_object.js");

var _base_object2 = _interopRequireDefault(_base_object);

var _events = __webpack_require__(/*! ../base/events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

var _container = __webpack_require__(/*! ./container */ "./src/components/container/container.js");

var _container2 = _interopRequireDefault(_container);

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

var _playback = __webpack_require__(/*! ../base/playback */ "./src/base/playback.js");

var _playback2 = _interopRequireDefault(_playback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContainerFactory = function (_BaseObject) {
  (0, _inherits3.default)(ContainerFactory, _BaseObject);
  (0, _createClass3.default)(ContainerFactory, [{
    key: 'options',
    get: function get() {
      return this._options;
    },
    set: function set(options) {
      this._options = options;
    }
  }]);

  function ContainerFactory(options, loader, i18n, playerError) {
    (0, _classCallCheck3.default)(this, ContainerFactory);

    var _this = (0, _possibleConstructorReturn3.default)(this, _BaseObject.call(this, options));

    _this._i18n = i18n;
    _this.loader = loader;
    _this.playerError = playerError;
    return _this;
  }

  ContainerFactory.prototype.createContainers = function createContainers() {
    var _this2 = this;

    return _clapprZepto2.default.Deferred(function (promise) {
      promise.resolve(_this2.options.sources.map(function (source) {
        return _this2.createContainer(source);
      }));
    });
  };

  ContainerFactory.prototype.findPlaybackPlugin = function findPlaybackPlugin(source, mimeType) {
    return this.loader.playbackPlugins.filter(function (p) {
      return p.canPlay(source, mimeType);
    })[0];
  };

  ContainerFactory.prototype.createContainer = function createContainer(source) {
    var resolvedSource = null,
        mimeType = this.options.mimeType;
    if ((typeof source === 'undefined' ? 'undefined' : (0, _typeof3.default)(source)) === 'object') {
      resolvedSource = source.source.toString();
      if (source.mimeType) mimeType = source.mimeType;
    } else {
      resolvedSource = source.toString();
    }

    if (resolvedSource.match(/^\/\//)) resolvedSource = window.location.protocol + resolvedSource;

    var options = _clapprZepto2.default.extend({}, this.options, {
      src: resolvedSource,
      mimeType: mimeType
    });
    var playbackPlugin = this.findPlaybackPlugin(resolvedSource, mimeType);

    // Fallback to empty playback object until we sort out unsupported sources error without NoOp playback
    var playback = playbackPlugin ? new playbackPlugin(options, this._i18n, this.playerError) : new _playback2.default();

    options = _clapprZepto2.default.extend({}, options, { playback: playback });

    var container = new _container2.default(options, this._i18n, this.playerError);
    var defer = _clapprZepto2.default.Deferred();
    defer.promise(container);
    this.addContainerPlugins(container);
    this.listenToOnce(container, _events2.default.CONTAINER_READY, function () {
      return defer.resolve(container);
    });
    return container;
  };

  ContainerFactory.prototype.addContainerPlugins = function addContainerPlugins(container) {
    this.loader.containerPlugins.forEach(function (Plugin) {
      container.addPlugin(new Plugin(container));
    });
  };

  return ContainerFactory;
}(_base_object2.default); // Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The ContainerFactory is responsible for manage playback bootstrap and create containers.
 */

exports.default = ContainerFactory;
module.exports = exports['default'];

/***/ }),

/***/ "./src/components/core/core.js":
/*!*************************************!*\
  !*** ./src/components/core/core.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(/*! ../../utils */ "./src/utils/utils.js");

var _events = __webpack_require__(/*! ../../base/events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

var _ui_object = __webpack_require__(/*! ../../base/ui_object */ "./src/base/ui_object.js");

var _ui_object2 = _interopRequireDefault(_ui_object);

var _ui_core_plugin = __webpack_require__(/*! ../../base/ui_core_plugin */ "./src/base/ui_core_plugin.js");

var _ui_core_plugin2 = _interopRequireDefault(_ui_core_plugin);

var _browser = __webpack_require__(/*! ../../components/browser */ "./src/components/browser/browser.js");

var _browser2 = _interopRequireDefault(_browser);

var _container_factory = __webpack_require__(/*! ../../components/container_factory */ "./src/components/container_factory.js");

var _container_factory2 = _interopRequireDefault(_container_factory);

var _error = __webpack_require__(/*! ../../components/error */ "./src/components/error.js");

var _error2 = _interopRequireDefault(_error);

var _error_mixin = __webpack_require__(/*! ../../base/error_mixin */ "./src/base/error_mixin.js");

var _error_mixin2 = _interopRequireDefault(_error_mixin);

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

__webpack_require__(/*! ./public/style.scss */ "./src/components/core/public/style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Core is responsible to manage Containers and the player state.
 * @class Core
 * @constructor
 * @extends UIObject
 * @module components
 */
// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Core = function (_UIObject) {
  (0, _inherits3.default)(Core, _UIObject);
  (0, _createClass3.default)(Core, [{
    key: 'events',
    get: function get() {
      return {
        'webkitfullscreenchange': 'handleFullscreenChange',
        'mousemove': 'onMouseMove',
        'mouseleave': 'onMouseLeave'
      };
    }
  }, {
    key: 'attributes',
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
    key: 'isReady',
    get: function get() {
      return !!this.ready;
    }

    /**
     * The internationalization plugin.
     * @property i18n
     * @type {Strings}
     */

  }, {
    key: 'i18n',
    get: function get() {
      return this.getPlugin('strings') || { t: function t(key) {
          return key;
        } };
    }

    /**
     * @deprecated
     * This property currently exists for retrocompatibility reasons.
     * If you want to access the media control instance, use the method getPlugin('media_control').
     */

  }, {
    key: 'mediaControl',
    get: function get() {
      return this.getPlugin('media_control') || this.dummyMediaControl;
    }
  }, {
    key: 'dummyMediaControl',
    get: function get() {
      if (this._dummyMediaControl) return this._dummyMediaControl;
      this._dummyMediaControl = new _ui_core_plugin2.default(this);
      return this._dummyMediaControl;
    }

    /**
     * gets the active container reference.
     * @property activeContainer
     * @type {Object}
     */

  }, {
    key: 'activeContainer',
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
      this.trigger(_events2.default.CORE_ACTIVE_CONTAINER_CHANGED, this._activeContainer);
    }

    /**
     * gets the active playback reference.
     * @property activePlayback
     * @type {Object}
     */

  }, {
    key: 'activePlayback',
    get: function get() {
      return this.activeContainer && this.activeContainer.playback;
    }
  }]);

  function Core(options) {
    (0, _classCallCheck3.default)(this, Core);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UIObject.call(this, options));

    _this.playerError = new _error2.default(options, _this);
    _this.configureDomRecycler();
    _this.firstResize = true;
    _this.plugins = [];
    _this.containers = [];
    //FIXME fullscreen api sucks
    _this._boundFullscreenHandler = function () {
      return _this.handleFullscreenChange();
    };
    (0, _clapprZepto2.default)(document).bind('fullscreenchange', _this._boundFullscreenHandler);
    (0, _clapprZepto2.default)(document).bind('MSFullscreenChange', _this._boundFullscreenHandler);
    (0, _clapprZepto2.default)(document).bind('mozfullscreenchange', _this._boundFullscreenHandler);
    _browser2.default.isMobile && (0, _clapprZepto2.default)(window).bind('resize', function (o) {
      _this.handleWindowResize(o);
    });
    return _this;
  }

  Core.prototype.configureDomRecycler = function configureDomRecycler() {
    var recycleVideo = this.options && this.options.playback && this.options.playback.recycleVideo;
    _utils.DomRecycler.configure({ recycleVideo: recycleVideo });
  };

  Core.prototype.createContainers = function createContainers(options) {
    this.defer = _clapprZepto2.default.Deferred();
    this.defer.promise(this);
    this.containerFactory = new _container_factory2.default(options, options.loader, this.i18n, this.playerError);
    this.prepareContainers();
  };

  Core.prototype.prepareContainers = function prepareContainers() {
    var _this2 = this;

    this.containerFactory.createContainers().then(function (containers) {
      return _this2.setupContainers(containers);
    }).then(function (containers) {
      return _this2.resolveOnContainersReady(containers);
    });
  };

  Core.prototype.updateSize = function updateSize() {
    this.isFullscreen() ? this.setFullscreen() : this.setPlayerSize();
  };

  Core.prototype.setFullscreen = function setFullscreen() {
    if (!_browser2.default.isiOS) {
      this.$el.addClass('fullscreen');
      this.$el.removeAttr('style');
      this.previousSize = { width: this.options.width, height: this.options.height };
      this.currentSize = { width: (0, _clapprZepto2.default)(window).width(), height: (0, _clapprZepto2.default)(window).height() };
    }
  };

  Core.prototype.setPlayerSize = function setPlayerSize() {
    this.$el.removeClass('fullscreen');
    this.currentSize = this.previousSize;
    this.previousSize = { width: (0, _clapprZepto2.default)(window).width(), height: (0, _clapprZepto2.default)(window).height() };
    this.resize(this.currentSize);
  };

  Core.prototype.resize = function resize(options) {
    if (!(0, _utils.isNumber)(options.height) && !(0, _utils.isNumber)(options.width)) {
      this.el.style.height = '' + options.height;
      this.el.style.width = '' + options.width;
    } else {
      this.el.style.height = options.height + 'px';
      this.el.style.width = options.width + 'px';
    }
    this.previousSize = { width: this.options.width, height: this.options.height };
    this.options.width = options.width;
    this.options.height = options.height;
    this.currentSize = options;
    this.triggerResize(this.currentSize);
  };

  Core.prototype.enableResizeObserver = function enableResizeObserver() {
    var _this3 = this;

    var checkSizeCallback = function checkSizeCallback() {
      _this3.triggerResize({ width: _this3.el.clientWidth, height: _this3.el.clientHeight });
    };
    this.resizeObserverInterval = setInterval(checkSizeCallback, 500);
  };

  Core.prototype.triggerResize = function triggerResize(newSize) {
    var thereWasChange = this.firstResize || this.oldHeight !== newSize.height || this.oldWidth !== newSize.width;
    if (thereWasChange) {
      this.oldHeight = newSize.height;
      this.oldWidth = newSize.width;
      this.computedSize = newSize;
      this.firstResize = false;
      this.trigger(_events2.default.CORE_RESIZE, newSize);
    }
  };

  Core.prototype.disableResizeObserver = function disableResizeObserver() {
    this.resizeObserverInterval && clearInterval(this.resizeObserverInterval);
  };

  Core.prototype.resolveOnContainersReady = function resolveOnContainersReady(containers) {
    var _this4 = this;

    _clapprZepto2.default.when.apply(_clapprZepto2.default, containers).done(function () {
      _this4.defer.resolve(_this4);
      _this4.ready = true;
      _this4.trigger(_events2.default.CORE_READY);
    });
  };

  Core.prototype.addPlugin = function addPlugin(plugin) {
    this.plugins.push(plugin);
  };

  Core.prototype.hasPlugin = function hasPlugin(name) {
    return !!this.getPlugin(name);
  };

  Core.prototype.getPlugin = function getPlugin(name) {
    return this.plugins.filter(function (plugin) {
      return plugin.name === name;
    })[0];
  };

  Core.prototype.load = function load(sources, mimeType) {
    this.options.mimeType = mimeType;
    sources = sources && sources.constructor === Array ? sources : [sources];
    this.options.sources = sources;
    this.containers.forEach(function (container) {
      return container.destroy();
    });
    this.containerFactory.options = _clapprZepto2.default.extend(this.options, { sources: sources });
    this.prepareContainers();
  };

  Core.prototype.destroy = function destroy() {
    this.disableResizeObserver();
    this.containers.forEach(function (container) {
      return container.destroy();
    });
    this.plugins.forEach(function (plugin) {
      return plugin.destroy();
    });
    this.$el.remove();
    (0, _clapprZepto2.default)(document).unbind('fullscreenchange', this._boundFullscreenHandler);
    (0, _clapprZepto2.default)(document).unbind('MSFullscreenChange', this._boundFullscreenHandler);
    (0, _clapprZepto2.default)(document).unbind('mozfullscreenchange', this._boundFullscreenHandler);
    this.stopListening();
  };

  Core.prototype.handleFullscreenChange = function handleFullscreenChange() {
    this.trigger(_events2.default.CORE_FULLSCREEN, this.isFullscreen());
    this.updateSize();
  };

  Core.prototype.handleWindowResize = function handleWindowResize(event) {
    var orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    if (this._screenOrientation === orientation) return;
    this._screenOrientation = orientation;
    this.triggerResize({ width: this.el.clientWidth, height: this.el.clientHeight });
    this.trigger(_events2.default.CORE_SCREEN_ORIENTATION_CHANGED, {
      event: event,
      orientation: this._screenOrientation
    });
  };

  Core.prototype.removeContainer = function removeContainer(container) {
    this.stopListening(container);
    this.containers = this.containers.filter(function (c) {
      return c !== container;
    });
  };

  Core.prototype.setupContainer = function setupContainer(container) {
    this.listenTo(container, _events2.default.CONTAINER_DESTROYED, this.removeContainer);
    this.containers.push(container);
  };

  Core.prototype.setupContainers = function setupContainers(containers) {
    containers.forEach(this.setupContainer.bind(this));
    this.trigger(_events2.default.CORE_CONTAINERS_CREATED);
    this.renderContainers();
    this.activeContainer = containers[0];
    this.render();
    this.appendToParent();
    return this.containers;
  };

  Core.prototype.renderContainers = function renderContainers() {
    var _this5 = this;

    this.containers.forEach(function (container) {
      return _this5.el.appendChild(container.render().el);
    });
  };

  Core.prototype.createContainer = function createContainer(source, options) {
    var container = this.containerFactory.createContainer(source, options);
    this.setupContainer(container);
    this.el.appendChild(container.render().el);
    return container;
  };

  /**
   * @deprecated
   * This method currently exists for retrocompatibility reasons.
   * If you want the current container reference, use the activeContainer getter.
   */


  Core.prototype.getCurrentContainer = function getCurrentContainer() {
    return this.activeContainer;
  };

  /**
   * @deprecated
   * This method currently exists for retrocompatibility reasons.
   * If you want the current playback reference, use the activePlayback getter.
   */


  Core.prototype.getCurrentPlayback = function getCurrentPlayback() {
    return this.activePlayback;
  };

  Core.prototype.getPlaybackType = function getPlaybackType() {
    return this.activeContainer && this.activeContainer.getPlaybackType();
  };

  Core.prototype.isFullscreen = function isFullscreen() {
    return _utils.Fullscreen.getFullscreenElement() === (_browser2.default.isiOS ? this.activeContainer.el : this.el);
  };

  Core.prototype.toggleFullscreen = function toggleFullscreen() {
    if (this.isFullscreen()) {
      _utils.Fullscreen.cancelFullscreen();
      !_browser2.default.isiOS && this.$el.removeClass('fullscreen nocursor');
    } else {
      _utils.Fullscreen.requestFullscreen(_browser2.default.isiOS ? this.activeContainer.el : this.el);
      !_browser2.default.isiOS && this.$el.addClass('fullscreen');
    }
  };

  Core.prototype.onMouseMove = function onMouseMove(event) {
    this.trigger(_events2.default.CORE_MOUSE_MOVE, event);
  };

  Core.prototype.onMouseLeave = function onMouseLeave(event) {
    this.trigger(_events2.default.CORE_MOUSE_LEAVE, event);
  };

  /**
   * enables to configure the container after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   */


  Core.prototype.configure = function configure(options) {
    var _this6 = this;

    this._options = _clapprZepto2.default.extend(this._options, options);
    this.configureDomRecycler();

    var sources = options.source || options.sources;
    sources && this.load(sources, options.mimeType || this.options.mimeType);

    this.trigger(_events2.default.CORE_OPTIONS_CHANGE, options); // Trigger with newly provided options
    this.containers.forEach(function (container) {
      return container.configure(_this6.options);
    });
  };

  Core.prototype.appendToParent = function appendToParent() {
    var hasCoreParent = this.$el.parent() && this.$el.parent().length;
    !hasCoreParent && this.$el.appendTo(this.options.parentElement);
  };

  Core.prototype.render = function render() {
    this.options.width = this.options.width || this.$el.width();
    this.options.height = this.options.height || this.$el.height();
    var size = { width: this.options.width, height: this.options.height };
    this.previousSize = this.currentSize = this.computedSize = size;
    this.updateSize();

    this.previousSize = { width: this.$el.width(), height: this.$el.height() };

    this.enableResizeObserver();

    return this;
  };

  return Core;
}(_ui_object2.default);

exports.default = Core;


(0, _assign2.default)(Core.prototype, _error_mixin2.default);
module.exports = exports['default'];

/***/ }),

/***/ "./src/components/core/public/style.scss":
/*!***********************************************!*\
  !*** ./src/components/core/public/style.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./style.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/components/core/public/style.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"singleton":true,"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/components/core_factory.js":
/*!****************************************!*\
  !*** ./src/components/core_factory.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _base_object = __webpack_require__(/*! ../base/base_object */ "./src/base/base_object.js");

var _base_object2 = _interopRequireDefault(_base_object);

var _core = __webpack_require__(/*! ./core */ "./src/components/core/core.js");

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Core Factory is responsible for instantiate the core and it's plugins.
 * @class CoreFactory
 * @constructor
 * @extends BaseObject
 * @module components
 */
// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var CoreFactory = function (_BaseObject) {
  (0, _inherits3.default)(CoreFactory, _BaseObject);
  (0, _createClass3.default)(CoreFactory, [{
    key: 'loader',
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
    (0, _classCallCheck3.default)(this, CoreFactory);

    var _this = (0, _possibleConstructorReturn3.default)(this, _BaseObject.call(this));

    _this.player = player;
    _this._options = player.options;
    return _this;
  }

  /**
   * creates a core and its plugins
   * @method create
   * @return {Core} created core
   */


  CoreFactory.prototype.create = function create() {
    this.options.loader = this.loader;
    this.core = new _core2.default(this.options);
    this.addCorePlugins();
    this.core.createContainers(this.options);
    return this.core;
  };

  /**
   * given the core plugins (`loader.corePlugins`) it builds each one
   * @method addCorePlugins
   * @return {Core} the core with all plugins
   */


  CoreFactory.prototype.addCorePlugins = function addCorePlugins() {
    var _this2 = this;

    this.loader.corePlugins.forEach(function (Plugin) {
      var plugin = new Plugin(_this2.core);
      _this2.core.addPlugin(plugin);
      _this2.setupExternalInterface(plugin);
    });
    return this.core;
  };

  CoreFactory.prototype.setupExternalInterface = function setupExternalInterface(plugin) {
    var externalFunctions = plugin.getExternalInterface();
    for (var key in externalFunctions) {
      this.player[key] = externalFunctions[key].bind(plugin);
    }
  };

  return CoreFactory;
}(_base_object2.default);

exports.default = CoreFactory;
module.exports = exports['default'];

/***/ }),

/***/ "./src/components/error.js":
/*!*********************************!*\
  !*** ./src/components/error.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = __webpack_require__(/*! ../base/events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

var _base_object = __webpack_require__(/*! ../base/base_object */ "./src/base/base_object.js");

var _base_object2 = _interopRequireDefault(_base_object);

var _log = __webpack_require__(/*! ./log */ "./src/components/log.js");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The PlayerError is responsible to receive and propagate errors.
 * @class PlayerError
 * @constructor
 * @extends BaseObject
 * @module components
 */
var PlayerError = function (_BaseObject) {
  (0, _inherits3.default)(PlayerError, _BaseObject);
  (0, _createClass3.default)(PlayerError, [{
    key: 'name',
    get: function get() {
      return 'error';
    }

    /**
     * @property Levels
     * @type {Object} object with error levels
     */

  }], [{
    key: 'Levels',
    get: function get() {
      return {
        FATAL: 'FATAL',
        WARN: 'WARN',
        INFO: 'INFO'
      };
    }
  }]);

  function PlayerError() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var core = arguments[1];
    (0, _classCallCheck3.default)(this, PlayerError);

    var _this = (0, _possibleConstructorReturn3.default)(this, _BaseObject.call(this, options));

    _this.core = core;
    return _this;
  }

  /**
   * creates and trigger an error.
   * @method createError
   * @param {Object} err should be an object with code, description, level, origin, scope and raw error.
   */


  PlayerError.prototype.createError = function createError(err) {
    if (!this.core) {
      _log2.default.warn(this.name, 'Core is not set. Error: ', err);
      return;
    }
    this.core.trigger(_events2.default.ERROR, err);
  };

  return PlayerError;
}(_base_object2.default);

exports.default = PlayerError;
module.exports = exports['default'];

/***/ }),

/***/ "./src/components/loader.js":
/*!**********************************!*\
  !*** ./src/components/loader.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create = __webpack_require__(/*! babel-runtime/core-js/object/create */ "./node_modules/babel-runtime/core-js/object/create.js");

var _create2 = _interopRequireDefault(_create);

var _values = __webpack_require__(/*! babel-runtime/core-js/object/values */ "./node_modules/babel-runtime/core-js/object/values.js");

var _values2 = _interopRequireDefault(_values);

var _toConsumableArray2 = __webpack_require__(/*! babel-runtime/helpers/toConsumableArray */ "./node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _slicedToArray2 = __webpack_require__(/*! babel-runtime/helpers/slicedToArray */ "./node_modules/babel-runtime/helpers/slicedToArray.js");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = __webpack_require__(/*! babel-runtime/core-js/object/entries */ "./node_modules/babel-runtime/core-js/object/entries.js");

var _entries2 = _interopRequireDefault(_entries);

var _semver = __webpack_require__(/*! semver */ "./node_modules/semver/semver.js");

var _semver2 = _interopRequireDefault(_semver);

var _log = __webpack_require__(/*! ./log */ "./src/components/log.js");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var filterPluginsByType = function filterPluginsByType(plugins, type) {
  if (!plugins || !type) return {};

  return (0, _entries2.default)(plugins).filter(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        value = _ref2[1];

    return value.type === type;
  }).reduce(function (obj, _ref3) {
    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
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

exports.default = function () {

  var registry = {
    plugins: {},
    playbacks: []
  };

  var currentVersion = "0.4.1";

  return function () {
    Loader.checkVersionSupport = function checkVersionSupport(entry) {
      var _entry$prototype = entry.prototype,
          supportedVersion = _entry$prototype.supportedVersion,
          name = _entry$prototype.name;


      if (!supportedVersion || !supportedVersion.min) {
        _log2.default.warn('Loader', 'missing version information for ' + name);
        return false;
      }

      var maxVersion = supportedVersion.max || _semver2.default.parse(supportedVersion.min).inc('minor');
      var versionRange = '>=' + supportedVersion.min + ' <' + maxVersion;

      if (!_semver2.default.satisfies(currentVersion, versionRange)) {
        _log2.default.warn('Loader', 'unsupported plugin (' + currentVersion + ' does not match required range ' + versionRange + '): ' + name);
        return false;
      }

      return true;
    };

    Loader.registerPlugin = function registerPlugin(pluginEntry) {
      if (!pluginEntry || !pluginEntry.prototype.name) {
        _log2.default.warn('Loader', 'missing information to register plugin: ' + pluginEntry);
        return false;
      }

      Loader.checkVersionSupport(pluginEntry);

      var pluginRegistry = registry.plugins;

      if (!pluginRegistry) return false;

      var previousEntry = pluginRegistry[pluginEntry.prototype.name];

      if (previousEntry) _log2.default.warn('Loader', 'overriding plugin entry: ' + pluginEntry.prototype.name + ' - ' + previousEntry);

      pluginRegistry[pluginEntry.prototype.name] = pluginEntry;

      return true;
    };

    Loader.registerPlayback = function registerPlayback(playbackEntry) {
      if (!playbackEntry || !playbackEntry.prototype.name) return false;

      Loader.checkVersionSupport(playbackEntry);

      var playbacks = registry.playbacks;


      var previousEntryIdx = playbacks.findIndex(function (entry) {
        return entry.name === playbackEntry.prototype.name;
      });

      if (previousEntryIdx >= 0) {
        var previousEntry = playbacks[previousEntryIdx];
        playbacks.splice(previousEntryIdx, 1);
        _log2.default.warn('Loader', 'overriding playback entry: ' + previousEntry.name + ' - ' + previousEntry);
      }

      registry.playbacks = [playbackEntry].concat((0, _toConsumableArray3.default)(playbacks));

      return true;
    };

    Loader.unregisterPlugin = function unregisterPlugin(name) {
      if (!name) return false;

      var plugins = registry.plugins;

      var plugin = plugins[name];

      if (!plugin) return false;

      delete plugins[name];
      return true;
    };

    Loader.unregisterPlayback = function unregisterPlayback(name) {
      if (!name) return false;

      var playbacks = registry.playbacks;


      var index = playbacks.findIndex(function (entry) {
        return entry.prototype.name === name;
      });

      if (index < 0) return false;

      playbacks.splice(index, 1);
      registry.playbacks = playbacks;

      return true;
    };

    Loader.clearPlugins = function clearPlugins() {
      registry.plugins = {};
    };

    Loader.clearPlaybacks = function clearPlaybacks() {
      registry.playbacks = [];
    };

    /**
     * builds the loader
     * @method constructor
     * @param {Object} externalPlugins the external plugins
     * @param {Number} playerId you can embed multiple instances of clappr, therefore this is the unique id of each one.
     */


    (0, _createClass3.default)(Loader, null, [{
      key: 'registeredPlaybacks',
      get: function get() {
        return [].concat((0, _toConsumableArray3.default)(registry.playbacks));
      }
    }, {
      key: 'registeredPlugins',
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
      (0, _classCallCheck3.default)(this, Loader);

      this.playerId = playerId;

      this.playbackPlugins = [].concat((0, _toConsumableArray3.default)(registry.playbacks));

      var _Loader$registeredPlu = Loader.registeredPlugins,
          core = _Loader$registeredPlu.core,
          container = _Loader$registeredPlu.container;

      this.containerPlugins = (0, _values2.default)(container);
      this.corePlugins = (0, _values2.default)(core);

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


    Loader.prototype.groupPluginsByType = function groupPluginsByType(plugins) {
      if (Array.isArray(plugins)) {
        plugins = plugins.reduce(function (memo, plugin) {
          memo[plugin.type] || (memo[plugin.type] = []);
          memo[plugin.type].push(plugin);
          return memo;
        }, {});
      }
      return plugins;
    };

    Loader.prototype.removeDups = function removeDups(list) {
      var groupUp = function groupUp(plugins, plugin) {
        plugins[plugin.prototype.name] && delete plugins[plugin.prototype.name];
        plugins[plugin.prototype.name] = plugin;
        return plugins;
      };
      var pluginsMap = list.reduceRight(groupUp, (0, _create2.default)(null));

      var plugins = [];
      for (var key in pluginsMap) {
        plugins.unshift(pluginsMap[key]);
      }return plugins;
    };

    /**
     * adds all the external plugins that were passed through `options.plugins`
     * @method addExternalPlugins
     * @private
     * @param {Object} plugins the config object with all plugins
     */


    Loader.prototype.addExternalPlugins = function addExternalPlugins(plugins) {
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
    };

    /**
     * validate if the external plugins that were passed through `options.plugins` are associated to the correct type
     * @method validateExternalPluginsType
     * @private
     * @param {Object} plugins the config object with all plugins
     */


    Loader.prototype.validateExternalPluginsType = function validateExternalPluginsType(plugins) {
      var plugintypes = ['playback', 'container', 'core'];
      plugintypes.forEach(function (type) {
        (plugins[type] || []).forEach(function (el) {
          var errorMessage = 'external ' + el.type + ' plugin on ' + type + ' array';
          if (el.type !== type) throw new ReferenceError(errorMessage);
        });
      });
    };

    return Loader;
  }();
}();

module.exports = exports['default'];

/***/ }),

/***/ "./src/components/log.js":
/*!*******************************!*\
  !*** ./src/components/log.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var Log = function () {
  function Log() {
    var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : LEVEL_INFO;
    var offLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : LEVEL_DISABLED;
    (0, _classCallCheck3.default)(this, Log);

    this.BLACKLIST = ['timeupdate', 'playback:timeupdate', 'playback:progress', 'container:hover', 'container:timeupdate', 'container:progress'];
    this.level = level;
    this.offLevel = offLevel;
  }

  Log.prototype.debug = function debug(klass) {
    this.log(klass, LEVEL_DEBUG, Array.prototype.slice.call(arguments, 1));
  };

  Log.prototype.info = function info(klass) {
    this.log(klass, LEVEL_INFO, Array.prototype.slice.call(arguments, 1));
  };

  Log.prototype.warn = function warn(klass) {
    this.log(klass, LEVEL_WARN, Array.prototype.slice.call(arguments, 1));
  };

  Log.prototype.error = function error(klass) {
    this.log(klass, LEVEL_ERROR, Array.prototype.slice.call(arguments, 1));
  };

  Log.prototype.onOff = function onOff() {
    if (this.level === this.offLevel) {
      this.level = this.previousLevel;
    } else {
      this.previousLevel = this.level;
      this.level = this.offLevel;
    }
    // handle instances where console.log is unavailable
    if (window.console && window.console.log) window.console.log('%c[Clappr.Log] set log level to ' + DESCRIPTIONS[this.level], WARN);
  };

  Log.prototype.level = function level(newLevel) {
    this.level = newLevel;
  };

  Log.prototype.log = function log(klass, level, message) {
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
  };

  return Log;
}();

exports.default = Log;


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
module.exports = exports['default'];

/***/ }),

/***/ "./src/components/player.js":
/*!**********************************!*\
  !*** ./src/components/player.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _keys = __webpack_require__(/*! babel-runtime/core-js/object/keys */ "./node_modules/babel-runtime/core-js/object/keys.js");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(/*! ../utils */ "./src/utils/utils.js");

var _base_object = __webpack_require__(/*! ../base/base_object */ "./src/base/base_object.js");

var _base_object2 = _interopRequireDefault(_base_object);

var _events = __webpack_require__(/*! ../base/events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

var _browser = __webpack_require__(/*! ./browser */ "./src/components/browser/browser.js");

var _browser2 = _interopRequireDefault(_browser);

var _core_factory = __webpack_require__(/*! ./core_factory */ "./src/components/core_factory.js");

var _core_factory2 = _interopRequireDefault(_core_factory);

var _loader = __webpack_require__(/*! ./loader */ "./src/components/loader.js");

var _loader2 = _interopRequireDefault(_loader);

var _error_mixin = __webpack_require__(/*! ../base/error_mixin */ "./src/base/error_mixin.js");

var _error_mixin2 = _interopRequireDefault(_error_mixin);

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var baseUrl = (0, _utils.currentScriptUrl)().replace(/\/[^/]+$/, '');

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

var Player = function (_BaseObject) {
  (0, _inherits3.default)(Player, _BaseObject);
  (0, _createClass3.default)(Player, [{
    key: 'loader',
    set: function set(loader) {
      this._loader = loader;
    },
    get: function get() {
      if (!this._loader) this._loader = new _loader2.default(this.options.plugins || {}, this.options.playerId);

      return this._loader;
    }

    /**
     * Determine if the playback has ended.
     * @property ended
     * @type Boolean
     */

  }, {
    key: 'ended',
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
    key: 'buffering',
    get: function get() {
      return this.core.activeContainer.buffering;
    }

    /*
     * determine if the player is ready.
     * @property isReady
     * @type {Boolean} `true` if the player is ready. ie PLAYER_READY event has fired
     */

  }, {
    key: 'isReady',
    get: function get() {
      return !!this._ready;
    }

    /**
     * An events map that allows the user to add custom callbacks in player's options.
     * @property eventsMapping
     * @type {Object}
     */

  }, {
    key: 'eventsMapping',
    get: function get() {
      return {
        onReady: _events2.default.PLAYER_READY,
        onResize: _events2.default.PLAYER_RESIZE,
        onPlay: _events2.default.PLAYER_PLAY,
        onPause: _events2.default.PLAYER_PAUSE,
        onStop: _events2.default.PLAYER_STOP,
        onEnded: _events2.default.PLAYER_ENDED,
        onSeek: _events2.default.PLAYER_SEEK,
        onError: _events2.default.PLAYER_ERROR,
        onTimeUpdate: _events2.default.PLAYER_TIMEUPDATE,
        onVolumeUpdate: _events2.default.PLAYER_VOLUMEUPDATE,
        onSubtitleAvailable: _events2.default.PLAYER_SUBTITLE_AVAILABLE
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
    (0, _classCallCheck3.default)(this, Player);

    var _this = (0, _possibleConstructorReturn3.default)(this, _BaseObject.call(this, options));

    var playbackDefaultOptions = { recycleVideo: true };
    var defaultOptions = {
      playerId: (0, _utils.uniqueId)(''),
      persistConfig: true,
      width: 640,
      height: 360,
      baseUrl: baseUrl,
      allowUserInteraction: _browser2.default.isMobile,
      playback: playbackDefaultOptions
    };
    _this._options = _clapprZepto2.default.extend(defaultOptions, options);
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
    _this._coreFactory = new _core_factory2.default(_this);
    if (_this.options.parentId) _this.setParentId(_this.options.parentId);else if (_this.options.parent) _this.attachTo(_this.options.parent);

    return _this;
  }

  /**
   * Specify a `parentId` to the player.
   * @method setParentId
   * @param {String} parentId the element parent id.
   * @return {Player} itself
   */


  Player.prototype.setParentId = function setParentId(parentId) {
    var el = document.querySelector(parentId);
    if (el) this.attachTo(el);

    return this;
  };

  /**
   * You can use this method to attach the player to a given element. You don't need to do this when you specify it during the player instantiation passing the `parentId` param.
   * @method attachTo
   * @param {Object} element a given element.
   * @return {Player} itself
   */


  Player.prototype.attachTo = function attachTo(element) {
    this.options.parentElement = element;
    this.core = this._coreFactory.create();
    this._addEventListeners();
    return this;
  };

  Player.prototype._addEventListeners = function _addEventListeners() {
    if (!this.core.isReady) this.listenToOnce(this.core, _events2.default.CORE_READY, this._onReady);else this._onReady();

    this.listenTo(this.core, _events2.default.CORE_ACTIVE_CONTAINER_CHANGED, this._containerChanged);
    this.listenTo(this.core, _events2.default.CORE_FULLSCREEN, this._onFullscreenChange);
    this.listenTo(this.core, _events2.default.CORE_RESIZE, this._onResize);
    return this;
  };

  Player.prototype._addContainerEventListeners = function _addContainerEventListeners() {
    var container = this.core.activeContainer;
    if (container) {
      this.listenTo(container, _events2.default.CONTAINER_PLAY, this._onPlay);
      this.listenTo(container, _events2.default.CONTAINER_PAUSE, this._onPause);
      this.listenTo(container, _events2.default.CONTAINER_STOP, this._onStop);
      this.listenTo(container, _events2.default.CONTAINER_ENDED, this._onEnded);
      this.listenTo(container, _events2.default.CONTAINER_SEEK, this._onSeek);
      this.listenTo(container, _events2.default.CONTAINER_ERROR, this._onError);
      this.listenTo(container, _events2.default.CONTAINER_TIMEUPDATE, this._onTimeUpdate);
      this.listenTo(container, _events2.default.CONTAINER_VOLUME, this._onVolumeUpdate);
      this.listenTo(container, _events2.default.CONTAINER_SUBTITLE_AVAILABLE, this._onSubtitleAvailable);
    }
    return this;
  };

  Player.prototype._registerOptionEventListeners = function _registerOptionEventListeners() {
    var _this2 = this;

    var newEvents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var hasNewEvents = (0, _keys2.default)(newEvents).length > 0;
    hasNewEvents && (0, _keys2.default)(events).forEach(function (userEvent) {
      var eventType = _this2.eventsMapping[userEvent];
      eventType && _this2.off(eventType, events[userEvent]);
    });

    (0, _keys2.default)(newEvents).forEach(function (userEvent) {
      var eventType = _this2.eventsMapping[userEvent];
      if (eventType) {
        var eventFunction = newEvents[userEvent];
        eventFunction = typeof eventFunction === 'function' && eventFunction;
        eventFunction && _this2.on(eventType, eventFunction);
      }
    });
    return this;
  };

  Player.prototype._containerChanged = function _containerChanged() {
    this.stopListening();
    this._addEventListeners();
  };

  Player.prototype._onReady = function _onReady() {
    this._ready = true;
    this._addContainerEventListeners();
    this.trigger(_events2.default.PLAYER_READY);
  };

  Player.prototype._onFullscreenChange = function _onFullscreenChange(fullscreen) {
    this.trigger(_events2.default.PLAYER_FULLSCREEN, fullscreen);
  };

  Player.prototype._onVolumeUpdate = function _onVolumeUpdate(volume) {
    this.trigger(_events2.default.PLAYER_VOLUMEUPDATE, volume);
  };

  Player.prototype._onSubtitleAvailable = function _onSubtitleAvailable() {
    this.trigger(_events2.default.PLAYER_SUBTITLE_AVAILABLE);
  };

  Player.prototype._onResize = function _onResize(size) {
    this.trigger(_events2.default.PLAYER_RESIZE, size);
  };

  Player.prototype._onPlay = function _onPlay() {
    this.trigger(_events2.default.PLAYER_PLAY);
  };

  Player.prototype._onPause = function _onPause() {
    this.trigger(_events2.default.PLAYER_PAUSE);
  };

  Player.prototype._onStop = function _onStop() {
    this.trigger(_events2.default.PLAYER_STOP, this.getCurrentTime());
  };

  Player.prototype._onEnded = function _onEnded() {
    this.trigger(_events2.default.PLAYER_ENDED);
  };

  Player.prototype._onSeek = function _onSeek(time) {
    this.trigger(_events2.default.PLAYER_SEEK, time);
  };

  Player.prototype._onTimeUpdate = function _onTimeUpdate(timeProgress) {
    this.trigger(_events2.default.PLAYER_TIMEUPDATE, timeProgress);
  };

  Player.prototype._onError = function _onError(error) {
    this.trigger(_events2.default.PLAYER_ERROR, error);
  };

  Player.prototype._normalizeSources = function _normalizeSources(options) {
    var sources = options.sources || (options.source !== undefined ? [options.source] : []);
    return sources.length === 0 ? [{ source: '', mimeType: '' }] : sources;
  };

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


  Player.prototype.resize = function resize(size) {
    this.core.resize(size);
    return this;
  };

  /**
   * loads a new source.
   * @method load
   * @param {Array|String} sources source or sources of video.
   * An array item can be a string or {source: <<source URL>>, mimeType: <<source mime type>>}
   * @param {String} mimeType a mime type, example: `'application/vnd.apple.mpegurl'`
   * @param {Boolean} [autoPlay=false] whether playing should be started immediately
   * @return {Player} itself
   */


  Player.prototype.load = function load(sources, mimeType, autoPlay) {
    if (autoPlay !== undefined) this.configure({ autoPlay: !!autoPlay });

    this.core.load(sources, mimeType);
    return this;
  };

  /**
   * destroys the current player and removes it from the DOM.
   * @method destroy
   * @return {Player} itself
   */


  Player.prototype.destroy = function destroy() {
    this.stopListening();
    this.core.destroy();
    return this;
  };

  /**
   * Gives user consent to playback. Required by mobile device after a click event before Player.load().
   * @method consent
   * @return {Player} itself
   */


  Player.prototype.consent = function consent() {
    this.core.getCurrentPlayback().consent();
    return this;
  };

  /**
   * plays the current video (`source`).
   * @method play
   * @return {Player} itself
   */


  Player.prototype.play = function play() {
    this.core.activeContainer.play();
    return this;
  };

  /**
   * pauses the current video (`source`).
   * @method pause
   * @return {Player} itself
   */


  Player.prototype.pause = function pause() {
    this.core.activeContainer.pause();
    return this;
  };

  /**
   * stops the current video (`source`).
   * @method stop
   * @return {Player} itself
   */


  Player.prototype.stop = function stop() {
    this.core.activeContainer.stop();
    return this;
  };

  /**
   * seeks the current video (`source`). For example, `player.seek(120)` will seek to second 120 (2minutes) of the current video.
   * @method seek
   * @param {Number} time should be a number between 0 and the video duration.
   * @return {Player} itself
   */


  Player.prototype.seek = function seek(time) {
    this.core.activeContainer.seek(time);
    return this;
  };

  /**
   * seeks the current video (`source`). For example, `player.seek(50)` will seek to the middle of the current video.
   * @method seekPercentage
   * @param {Number} time should be a number between 0 and 100.
   * @return {Player} itself
   */


  Player.prototype.seekPercentage = function seekPercentage(percentage) {
    this.core.activeContainer.seekPercentage(percentage);
    return this;
  };

  /**
   * mutes the current video (`source`).
   * @method mute
   * @return {Player} itself
   */


  Player.prototype.mute = function mute() {
    this._mutedVolume = this.getVolume();
    this.setVolume(0);
    return this;
  };

  /**
   * unmutes the current video (`source`).
   * @method unmute
   * @return {Player} itself
   */


  Player.prototype.unmute = function unmute() {
    this.setVolume(typeof this._mutedVolume === 'number' ? this._mutedVolume : 100);
    this._mutedVolume = null;
    return this;
  };

  /**
   * checks if the player is playing.
   * @method isPlaying
   * @return {Boolean} `true` if the current source is playing, otherwise `false`
   */


  Player.prototype.isPlaying = function isPlaying() {
    return this.core.activeContainer.isPlaying();
  };

  /**
   * returns `true` if DVR is enable otherwise `false`.
   * @method isDvrEnabled
   * @return {Boolean}
   */


  Player.prototype.isDvrEnabled = function isDvrEnabled() {
    return this.core.activeContainer.isDvrEnabled();
  };

  /**
   * returns `true` if DVR is in use otherwise `false`.
   * @method isDvrInUse
   * @return {Boolean}
   */


  Player.prototype.isDvrInUse = function isDvrInUse() {
    return this.core.activeContainer.isDvrInUse();
  };

  /**
   * enables to configure a player after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   * @return {Player} itself
   */


  Player.prototype.configure = function configure() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this._registerOptionEventListeners(options.events, this.options.events);
    this.core.configure(options);
    return this;
  };

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


  Player.prototype.getPlugin = function getPlugin(name) {
    var plugins = this.core.plugins.concat(this.core.activeContainer.plugins);
    return plugins.filter(function (plugin) {
      return plugin.name === name;
    })[0];
  };

  /**
   * the current time in seconds.
   * @method getCurrentTime
   * @return {Number} current time (in seconds) of the current source
   */


  Player.prototype.getCurrentTime = function getCurrentTime() {
    return this.core.activeContainer.getCurrentTime();
  };

  /**
   * The time that "0" now represents relative to when playback started.
   * For a stream with a sliding window this will increase as content is
   * removed from the beginning.
   * @method getStartTimeOffset
   * @return {Number} time (in seconds) that time "0" represents.
   */


  Player.prototype.getStartTimeOffset = function getStartTimeOffset() {
    return this.core.activeContainer.getStartTimeOffset();
  };

  /**
   * the duration time in seconds.
   * @method getDuration
   * @return {Number} duration time (in seconds) of the current source
   */


  Player.prototype.getDuration = function getDuration() {
    return this.core.activeContainer.getDuration();
  };

  return Player;
}(_base_object2.default);

exports.default = Player;


(0, _assign2.default)(Player.prototype, _error_mixin2.default);
module.exports = exports['default'];

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _player = __webpack_require__(/*! ./components/player */ "./src/components/player.js");

var _player2 = _interopRequireDefault(_player);

var _utils = __webpack_require__(/*! ./utils */ "./src/utils/utils.js");

var _utils2 = _interopRequireDefault(_utils);

var _events = __webpack_require__(/*! ./base/events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

var _playback = __webpack_require__(/*! ./base/playback */ "./src/base/playback.js");

var _playback2 = _interopRequireDefault(_playback);

var _container_plugin = __webpack_require__(/*! ./base/container_plugin */ "./src/base/container_plugin.js");

var _container_plugin2 = _interopRequireDefault(_container_plugin);

var _core_plugin = __webpack_require__(/*! ./base/core_plugin */ "./src/base/core_plugin.js");

var _core_plugin2 = _interopRequireDefault(_core_plugin);

var _ui_core_plugin = __webpack_require__(/*! ./base/ui_core_plugin */ "./src/base/ui_core_plugin.js");

var _ui_core_plugin2 = _interopRequireDefault(_ui_core_plugin);

var _ui_container_plugin = __webpack_require__(/*! ./base/ui_container_plugin */ "./src/base/ui_container_plugin.js");

var _ui_container_plugin2 = _interopRequireDefault(_ui_container_plugin);

var _base_object = __webpack_require__(/*! ./base/base_object */ "./src/base/base_object.js");

var _base_object2 = _interopRequireDefault(_base_object);

var _ui_object = __webpack_require__(/*! ./base/ui_object */ "./src/base/ui_object.js");

var _ui_object2 = _interopRequireDefault(_ui_object);

var _browser = __webpack_require__(/*! ./components/browser */ "./src/components/browser/browser.js");

var _browser2 = _interopRequireDefault(_browser);

var _container = __webpack_require__(/*! ./components/container */ "./src/components/container/container.js");

var _container2 = _interopRequireDefault(_container);

var _core = __webpack_require__(/*! ./components/core */ "./src/components/core/core.js");

var _core2 = _interopRequireDefault(_core);

var _error = __webpack_require__(/*! ./components/error */ "./src/components/error.js");

var _error2 = _interopRequireDefault(_error);

var _loader = __webpack_require__(/*! ./components/loader */ "./src/components/loader.js");

var _loader2 = _interopRequireDefault(_loader);

var _log = __webpack_require__(/*! ./components/log */ "./src/components/log.js");

var _log2 = _interopRequireDefault(_log);

var _html5_audio = __webpack_require__(/*! ./playbacks/html5_audio */ "./src/playbacks/html5_audio.js");

var _html5_audio2 = _interopRequireDefault(_html5_audio);

var _html5_video = __webpack_require__(/*! ./playbacks/html5_video */ "./src/playbacks/html5_video/html5_video.js");

var _html5_video2 = _interopRequireDefault(_html5_video);

var _html_img = __webpack_require__(/*! ./playbacks/html_img */ "./src/playbacks/html_img/html_img.js");

var _html_img2 = _interopRequireDefault(_html_img);

var _no_op = __webpack_require__(/*! ./playbacks/no_op */ "./src/playbacks/no_op/no_op.js");

var _no_op2 = _interopRequireDefault(_no_op);

var _styler = __webpack_require__(/*! ./base/styler */ "./src/base/styler.js");

var _styler2 = _interopRequireDefault(_styler);

var _template = __webpack_require__(/*! ./base/template */ "./src/base/template.js");

var _template2 = _interopRequireDefault(_template);

var _strings = __webpack_require__(/*! ./plugins/strings */ "./src/plugins/strings.js");

var _strings2 = _interopRequireDefault(_strings);

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var version = "0.4.1";

// Built-in Plugins/Playbacks

_loader2.default.registerPlugin(_strings2.default);

_loader2.default.registerPlayback(_no_op2.default);
_loader2.default.registerPlayback(_html_img2.default);
_loader2.default.registerPlayback(_html5_audio2.default);
_loader2.default.registerPlayback(_html5_video2.default);

exports.default = {
  Player: _player2.default,
  Events: _events2.default,
  Browser: _browser2.default,
  ContainerPlugin: _container_plugin2.default,
  UIContainerPlugin: _ui_container_plugin2.default,
  CorePlugin: _core_plugin2.default,
  UICorePlugin: _ui_core_plugin2.default,
  Playback: _playback2.default,
  Container: _container2.default,
  Core: _core2.default,
  PlayerError: _error2.default,
  Loader: _loader2.default,
  BaseObject: _base_object2.default,
  UIObject: _ui_object2.default,
  Utils: _utils2.default,
  HTML5Audio: _html5_audio2.default,
  HTML5Video: _html5_video2.default,
  HTMLImg: _html_img2.default,
  Log: _log2.default,
  Styler: _styler2.default,
  version: version,
  template: _template2.default,
  $: _clapprZepto2.default
};
module.exports = exports['default'];

/***/ }),

/***/ "./src/playbacks/html5_audio.js":
/*!**************************************!*\
  !*** ./src/playbacks/html5_audio.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = __webpack_require__(/*! ../base/events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

var _playback = __webpack_require__(/*! ../base/playback */ "./src/base/playback.js");

var _playback2 = _interopRequireDefault(_playback);

var _html5_video = __webpack_require__(/*! ./html5_video */ "./src/playbacks/html5_video/html5_video.js");

var _html5_video2 = _interopRequireDefault(_html5_video);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: remove this playback and change HTML5Video to HTML5Playback (breaking change, only after 0.3.0)
var HTML5Audio = function (_HTML5Video) {
  (0, _inherits3.default)(HTML5Audio, _HTML5Video);

  function HTML5Audio() {
    (0, _classCallCheck3.default)(this, HTML5Audio);
    return (0, _possibleConstructorReturn3.default)(this, _HTML5Video.apply(this, arguments));
  }

  HTML5Audio.prototype.updateSettings = function updateSettings() {
    this.settings.left = ['playpause', 'position', 'duration'];
    this.settings.seekEnabled = this.isSeekEnabled();
    this.trigger(_events2.default.PLAYBACK_SETTINGSUPDATE);
  };

  HTML5Audio.prototype.getPlaybackType = function getPlaybackType() {
    return _playback2.default.AOD;
  };

  (0, _createClass3.default)(HTML5Audio, [{
    key: 'name',
    get: function get() {
      return 'html5_audio';
    }
  }, {
    key: 'supportedVersion',
    get: function get() {
      return { min: "0.4.1" };
    }
  }, {
    key: 'tagName',
    get: function get() {
      return 'audio';
    }
  }, {
    key: 'isAudioOnly',
    get: function get() {
      return true;
    }
  }]);
  return HTML5Audio;
}(_html5_video2.default); // Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

exports.default = HTML5Audio;


HTML5Audio.canPlay = function (resourceUrl, mimeType) {
  var mimetypes = {
    'wav': ['audio/wav'],
    'mp3': ['audio/mp3', 'audio/mpeg;codecs="mp3"'],
    'aac': ['audio/mp4;codecs="mp4a.40.5"'],
    'oga': ['audio/ogg']
  };
  return _html5_video2.default._canPlay('audio', mimetypes, resourceUrl, mimeType);
};
module.exports = exports['default'];

/***/ }),

/***/ "./src/playbacks/html5_video/html5_video.js":
/*!**************************************************!*\
  !*** ./src/playbacks/html5_video/html5_video.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = __webpack_require__(/*! babel-runtime/core-js/array/from */ "./node_modules/babel-runtime/core-js/array/from.js");

var _from2 = _interopRequireDefault(_from);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _toConsumableArray2 = __webpack_require__(/*! babel-runtime/helpers/toConsumableArray */ "./node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = __webpack_require__(/*! babel-runtime/core-js/object/keys */ "./node_modules/babel-runtime/core-js/object/keys.js");

var _keys2 = _interopRequireDefault(_keys);

var _utils = __webpack_require__(/*! ../../utils */ "./src/utils/utils.js");

var _events = __webpack_require__(/*! ../../base/events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

var _playback = __webpack_require__(/*! ../../base/playback */ "./src/base/playback.js");

var _playback2 = _interopRequireDefault(_playback);

var _browser = __webpack_require__(/*! ../../components/browser */ "./src/components/browser/browser.js");

var _browser2 = _interopRequireDefault(_browser);

var _log = __webpack_require__(/*! ../../components/log */ "./src/components/log.js");

var _log2 = _interopRequireDefault(_log);

var _error = __webpack_require__(/*! ../../components/error */ "./src/components/error.js");

var _error2 = _interopRequireDefault(_error);

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

var _template = __webpack_require__(/*! ../../base/template */ "./src/base/template.js");

var _template2 = _interopRequireDefault(_template);

var _tracks = __webpack_require__(/*! ./public/tracks.html */ "./src/playbacks/html5_video/public/tracks.html");

var _tracks2 = _interopRequireDefault(_tracks);

__webpack_require__(/*! ./public/style.scss */ "./src/playbacks/html5_video/public/style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

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

var KNOWN_AUDIO_MIMETYPES = (0, _keys2.default)(AUDIO_MIMETYPES).reduce(function (acc, k) {
  return [].concat((0, _toConsumableArray3.default)(acc), (0, _toConsumableArray3.default)(AUDIO_MIMETYPES[k]));
}, []);

var UNKNOWN_ERROR = { code: 'unknown', message: 'unknown'

  // TODO: rename this Playback to HTML5Playback (breaking change, only after 0.3.0)
};
var HTML5Video = function (_Playback) {
  (0, _inherits3.default)(HTML5Video, _Playback);
  (0, _createClass3.default)(HTML5Video, [{
    key: 'name',
    get: function get() {
      return 'html5_video';
    }
  }, {
    key: 'supportedVersion',
    get: function get() {
      return { min: "0.4.1" };
    }
  }, {
    key: 'tagName',
    get: function get() {
      return this.isAudioOnly ? 'audio' : 'video';
    }
  }, {
    key: 'isAudioOnly',
    get: function get() {
      var resourceUrl = this.options.src;
      var mimeTypes = HTML5Video._mimeTypesForUrl(resourceUrl, AUDIO_MIMETYPES, this.options.mimeType);
      return this.options.playback && this.options.playback.audioOnly || this.options.audioOnly || KNOWN_AUDIO_MIMETYPES.indexOf(mimeTypes[0]) >= 0;
    }
  }, {
    key: 'attributes',
    get: function get() {
      return {
        'data-html5-video': ''
      };
    }
  }, {
    key: 'events',
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
    key: 'ended',
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
    key: 'buffering',
    get: function get() {
      return this._isBuffering;
    }
  }]);

  function HTML5Video() {
    (0, _classCallCheck3.default)(this, HTML5Video);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, _Playback.call.apply(_Playback, [this].concat(args)));

    _this._destroyed = false;
    _this._loadStarted = false;
    _this._isBuffering = false;
    _this._playheadMoving = false;
    _this._playheadMovingTimer = null;
    _this._stopped = false;
    _this._ccTrackId = -1;
    _this._setupSrc(_this.options.src);
    // backwards compatibility (TODO: remove on 0.3.0)
    _this.options.playback || (_this.options.playback = _this.options || {});
    _this.options.playback.disableContextMenu = _this.options.playback.disableContextMenu || _this.options.disableVideoTagContextMenu;

    var playbackConfig = _this.options.playback;
    var preload = playbackConfig.preload || (_browser2.default.isSafari ? 'auto' : _this.options.preload);

    var posterUrl = void 0; // FIXME: poster plugin should always convert poster to object with expected properties ?
    if (_this.options.poster) {
      if (typeof _this.options.poster === 'string') posterUrl = _this.options.poster;else if (typeof _this.options.poster.url === 'string') posterUrl = _this.options.poster.url;
    }

    _clapprZepto2.default.extend(_this.el, {
      muted: _this.options.mute,
      defaultMuted: _this.options.mute,
      loop: _this.options.loop,
      poster: posterUrl,
      preload: preload || 'metadata',
      controls: (playbackConfig.controls || _this.options.useVideoTagDefaultControls) && 'controls',
      crossOrigin: playbackConfig.crossOrigin,
      'x-webkit-playsinline': playbackConfig.playInline
    });

    playbackConfig.playInline && _this.$el.attr({ playsinline: 'playsinline' });
    playbackConfig.crossOrigin && _this.$el.attr({ crossorigin: playbackConfig.crossOrigin });

    // TODO should settings be private?
    _this.settings = { default: ['seekbar'] };
    _this.settings.left = ['playpause', 'position', 'duration'];
    _this.settings.right = ['fullscreen', 'volume', 'hd-indicator'];

    playbackConfig.externalTracks && _this._setupExternalTracks(playbackConfig.externalTracks);

    _this.options.autoPlay && _this.attemptAutoPlay();
    return _this;
  }

  HTML5Video.prototype.configure = function configure(options) {
    _Playback.prototype.configure.call(this, options);
    this.el.loop = !!options.loop;
  };

  // See Playback.attemptAutoPlay()


  HTML5Video.prototype.attemptAutoPlay = function attemptAutoPlay() {
    var _this2 = this;

    this.canAutoPlay(function (result, error) {
      error && _log2.default.warn(_this2.name, 'autoplay error.', { result: result, error: error });

      // https://github.com/clappr/clappr/issues/1076
      result && process.nextTick(function () {
        return !_this2._destroyed && _this2.play();
      });
    });
  };

  // See Playback.canAutoPlay()


  HTML5Video.prototype.canAutoPlay = function canAutoPlay(cb) {
    if (this.options.disableCanAutoPlay) cb(true, null);

    var opts = {
      timeout: this.options.autoPlayTimeout || 500,
      inline: this.options.playback.playInline || false,
      muted: this.options.mute || false // Known issue: mediacontrols may asynchronously mute video


      // Use current video element if recycling feature enabled with mobile devices
    };if (_browser2.default.isMobile && _utils.DomRecycler.options.recycleVideo) opts.element = this.el;

    // Desktop browser autoplay policy may require user action
    // Mobile browser autoplay require user consent and video recycling feature enabled
    // It may returns a false positive with source-less player consent
    (0, _utils.canAutoPlayMedia)(cb, opts);
  };

  HTML5Video.prototype._setupExternalTracks = function _setupExternalTracks(tracks) {
    this._externalTracks = tracks.map(function (track) {
      return {
        kind: track.kind || 'subtitles', // Default is 'subtitles'
        label: track.label,
        lang: track.lang,
        src: track.src
      };
    });
  };

  /**
   * Sets the source url on the <video> element, and also the 'src' property.
   * @method setupSrc
   * @private
   * @param {String} srcUrl The source URL.
   */


  HTML5Video.prototype._setupSrc = function _setupSrc(srcUrl) {
    if (this.el.src === srcUrl) return;

    this._ccIsSetup = false;
    this.el.src = srcUrl;
    this._src = this.el.src;
  };

  HTML5Video.prototype._onLoadedMetadata = function _onLoadedMetadata(e) {
    this._handleBufferingEvents();
    this.trigger(_events2.default.PLAYBACK_LOADEDMETADATA, { duration: e.target.duration, data: e });
    this._updateSettings();
    var autoSeekFromUrl = typeof this._options.autoSeekFromUrl === 'undefined' || this._options.autoSeekFromUrl;
    if (this.getPlaybackType() !== _playback2.default.LIVE && autoSeekFromUrl) this._checkInitialSeek();
  };

  HTML5Video.prototype._onDurationChange = function _onDurationChange() {
    this._updateSettings();
    this._onTimeUpdate();
    // onProgress uses the duration
    this._onProgress();
  };

  HTML5Video.prototype._updateSettings = function _updateSettings() {
    // we can't figure out if hls resource is VoD or not until it is being loaded or duration has changed.
    // that's why we check it again and update media control accordingly.
    if (this.getPlaybackType() === _playback2.default.VOD || this.getPlaybackType() === _playback2.default.AOD) this.settings.left = ['playpause', 'position', 'duration'];else this.settings.left = ['playstop'];

    this.settings.seekEnabled = this.isSeekEnabled();
    this.trigger(_events2.default.PLAYBACK_SETTINGSUPDATE);
  };

  HTML5Video.prototype.isSeekEnabled = function isSeekEnabled() {
    return isFinite(this.getDuration());
  };

  HTML5Video.prototype.getPlaybackType = function getPlaybackType() {
    var onDemandType = this.tagName === 'audio' ? _playback2.default.AOD : _playback2.default.VOD;
    return [0, undefined, Infinity].indexOf(this.el.duration) >= 0 ? _playback2.default.LIVE : onDemandType;
  };

  HTML5Video.prototype.isHighDefinitionInUse = function isHighDefinitionInUse() {
    return false;
  };

  // On mobile device, HTML5 video element "retains" user action consent if
  // load() method is called. See Player.consent().


  HTML5Video.prototype.consent = function consent() {
    if (!this.isPlaying()) {
      _Playback.prototype.consent.call(this);
      this.el.load();
    }
  };

  HTML5Video.prototype.play = function play() {
    this.trigger(_events2.default.PLAYBACK_PLAY_INTENT);
    this._stopped = false;
    this._setupSrc(this._src);
    this._handleBufferingEvents();
    var promise = this.el.play();
    // For more details, see https://developers.google.com/web/updates/2016/03/play-returns-promise
    if (promise && promise.catch) promise.catch(function () {});
  };

  HTML5Video.prototype.pause = function pause() {
    this.el.pause();
  };

  HTML5Video.prototype.stop = function stop() {
    this.pause();
    this._stopped = true;
    // src will be added again in play()
    this.el.removeAttribute('src');
    this.el.load(); // load with no src to stop loading of the previous source and avoid leaks
    this._stopPlayheadMovingChecks();
    this._handleBufferingEvents();
    this.trigger(_events2.default.PLAYBACK_STOP);
  };

  HTML5Video.prototype.volume = function volume(value) {
    if (value === 0) {
      this.$el.attr({ muted: 'true' });
      this.el.muted = true;
    } else {
      this.$el.attr({ muted: null });
      this.el.muted = false;
      this.el.volume = value / 100;
    }
  };

  /**
   * @deprecated
   * @private
   */


  HTML5Video.prototype.mute = function mute() {
    this.el.muted = true;
  };

  /**
   * @deprecated
   * @private
   */


  HTML5Video.prototype.unmute = function unmute() {
    this.el.muted = false;
  };

  HTML5Video.prototype.isMuted = function isMuted() {
    return this.el.muted === true || this.el.volume === 0;
  };

  HTML5Video.prototype.isPlaying = function isPlaying() {
    return !this.el.paused && !this.el.ended;
  };

  HTML5Video.prototype._startPlayheadMovingChecks = function _startPlayheadMovingChecks() {
    if (this._playheadMovingTimer !== null) return;

    this._playheadMovingTimeOnCheck = null;
    this._determineIfPlayheadMoving();
    this._playheadMovingTimer = setInterval(this._determineIfPlayheadMoving.bind(this), 500);
  };

  HTML5Video.prototype._stopPlayheadMovingChecks = function _stopPlayheadMovingChecks() {
    if (this._playheadMovingTimer === null) return;

    clearInterval(this._playheadMovingTimer);
    this._playheadMovingTimer = null;
    this._playheadMoving = false;
  };

  HTML5Video.prototype._determineIfPlayheadMoving = function _determineIfPlayheadMoving() {
    var before = this._playheadMovingTimeOnCheck;
    var now = this.el.currentTime;
    this._playheadMoving = before !== now;
    this._playheadMovingTimeOnCheck = now;
    this._handleBufferingEvents();
  };

  // this seems to happen when the user is having to wait
  // for something to happen AFTER A USER INTERACTION
  // e.g the player might be buffering, but when `play()` is called
  // only at this point will this be called.
  // Or the user may seek somewhere but the new area requires buffering,
  // so it will fire then as well.
  // On devices where playing is blocked until requested with a user action,
  // buffering may start, but never finish until the user initiates a play,
  // but this only happens when play is actually requested


  HTML5Video.prototype._onWaiting = function _onWaiting() {
    this._loadStarted = true;
    this._handleBufferingEvents();
  };

  // called after the first frame has loaded
  // note this doesn't fire on ios before the user has requested play
  // ideally the "loadstart" event would be used instead, but this fires
  // before a user has requested play on iOS, and also this is always fired
  // even if the preload setting is "none". In both these cases this causes
  // infinite buffering until the user does something which isn't great.


  HTML5Video.prototype._onLoadedData = function _onLoadedData() {
    this._loadStarted = true;
    this._handleBufferingEvents();
  };

  // note this doesn't fire on ios before user has requested play


  HTML5Video.prototype._onCanPlay = function _onCanPlay() {
    this._handleBufferingEvents();
  };

  HTML5Video.prototype._onPlaying = function _onPlaying() {
    this._checkForClosedCaptions();
    this._startPlayheadMovingChecks();
    this._handleBufferingEvents();
    this.trigger(_events2.default.PLAYBACK_PLAY);
  };

  HTML5Video.prototype._onPause = function _onPause() {
    this._stopPlayheadMovingChecks();
    this._handleBufferingEvents();
    this.trigger(_events2.default.PLAYBACK_PAUSE);
  };

  HTML5Video.prototype._onSeeking = function _onSeeking() {
    this._handleBufferingEvents();
    this.trigger(_events2.default.PLAYBACK_SEEK);
  };

  HTML5Video.prototype._onSeeked = function _onSeeked() {
    this._handleBufferingEvents();
    this.trigger(_events2.default.PLAYBACK_SEEKED);
  };

  HTML5Video.prototype._onEnded = function _onEnded() {
    this._handleBufferingEvents();
    this.trigger(_events2.default.PLAYBACK_ENDED, this.name);
  };

  // The playback should be classed as buffering if the following are true:
  // - the ready state is less then HAVE_FUTURE_DATA or the playhead isn't moving and it should be
  // - the media hasn't "ended",
  // - the media hasn't been stopped
  // - loading has started


  HTML5Video.prototype._handleBufferingEvents = function _handleBufferingEvents() {
    var playheadShouldBeMoving = !this.el.ended && !this.el.paused;
    var buffering = this._loadStarted && !this.el.ended && !this._stopped && (playheadShouldBeMoving && !this._playheadMoving || this.el.readyState < this.el.HAVE_FUTURE_DATA);
    if (this._isBuffering !== buffering) {
      this._isBuffering = buffering;
      if (buffering) this.trigger(_events2.default.PLAYBACK_BUFFERING, this.name);else this.trigger(_events2.default.PLAYBACK_BUFFERFULL, this.name);
    }
  };

  HTML5Video.prototype._onError = function _onError() {
    var _ref = this.el.error || UNKNOWN_ERROR,
        code = _ref.code,
        message = _ref.message;

    var isUnknownError = code === UNKNOWN_ERROR.code;

    var formattedError = this.createError({
      code: code,
      description: message,
      raw: this.el.error,
      level: isUnknownError ? _error2.default.Levels.WARN : _error2.default.Levels.FATAL
    });

    if (isUnknownError) _log2.default.warn(this.name, 'HTML5 unknown error: ', formattedError);else this.trigger(_events2.default.PLAYBACK_ERROR, formattedError);
  };

  HTML5Video.prototype.destroy = function destroy() {
    this._destroyed = true;
    this.handleTextTrackChange && this.el.textTracks.removeEventListener('change', this.handleTextTrackChange);
    _Playback.prototype.destroy.call(this);
    this.el.removeAttribute('src');
    this.el.load(); // load with no src to stop loading of the previous source and avoid leaks
    this._src = null;
    _utils.DomRecycler.garbage(this.$el);
  };

  HTML5Video.prototype.seek = function seek(time) {
    this.el.currentTime = time;
  };

  HTML5Video.prototype.seekPercentage = function seekPercentage(percentage) {
    var time = this.el.duration * (percentage / 100);
    this.seek(time);
  };

  HTML5Video.prototype._checkInitialSeek = function _checkInitialSeek() {
    var seekTime = (0, _utils.seekStringToSeconds)();
    if (seekTime !== 0) this.seek(seekTime);
  };

  HTML5Video.prototype.getCurrentTime = function getCurrentTime() {
    return this.el.currentTime;
  };

  HTML5Video.prototype.getDuration = function getDuration() {
    return this.el.duration;
  };

  HTML5Video.prototype._onTimeUpdate = function _onTimeUpdate() {
    if (this.getPlaybackType() === _playback2.default.LIVE) this.trigger(_events2.default.PLAYBACK_TIMEUPDATE, { current: 1, total: 1 }, this.name);else this.trigger(_events2.default.PLAYBACK_TIMEUPDATE, { current: this.el.currentTime, total: this.el.duration }, this.name);
  };

  HTML5Video.prototype._onProgress = function _onProgress() {
    if (!this.el.buffered.length) return;

    var buffered = [];
    var bufferedPos = 0;
    for (var i = 0; i < this.el.buffered.length; i++) {
      buffered = [].concat((0, _toConsumableArray3.default)(buffered), [{ start: this.el.buffered.start(i), end: this.el.buffered.end(i) }]);
      if (this.el.currentTime >= buffered[i].start && this.el.currentTime <= buffered[i].end) bufferedPos = i;
    }
    var progress = {
      start: buffered[bufferedPos].start,
      current: buffered[bufferedPos].end,
      total: this.el.duration
    };
    this.trigger(_events2.default.PLAYBACK_PROGRESS, progress, buffered);
  };

  HTML5Video.prototype._typeFor = function _typeFor(src) {
    var mimeTypes = HTML5Video._mimeTypesForUrl(src, MIMETYPES, this.options.mimeType);
    if (mimeTypes.length === 0) mimeTypes = HTML5Video._mimeTypesForUrl(src, AUDIO_MIMETYPES, this.options.mimeType);

    var mimeType = mimeTypes[0] || '';
    return mimeType.split(';')[0];
  };

  HTML5Video.prototype._ready = function _ready() {
    if (this._isReadyState) return;

    this._isReadyState = true;
    this.trigger(_events2.default.PLAYBACK_READY, this.name);
  };

  HTML5Video.prototype._checkForClosedCaptions = function _checkForClosedCaptions() {
    // Check if CC available only if current playback is HTML5Video
    if (this.isHTML5Video && !this._ccIsSetup) {
      if (this.hasClosedCaptionsTracks) {
        this.trigger(_events2.default.PLAYBACK_SUBTITLE_AVAILABLE);
        var trackId = this.closedCaptionsTrackId;
        this.closedCaptionsTrackId = trackId;
        this.handleTextTrackChange = this._handleTextTrackChange.bind(this);
        this.el.textTracks.addEventListener('change', this.handleTextTrackChange);
      }
      this._ccIsSetup = true;
    }
  };

  HTML5Video.prototype._handleTextTrackChange = function _handleTextTrackChange() {
    var tracks = this.closedCaptionsTracks;
    var track = tracks.find(function (track) {
      return track.track.mode === 'showing';
    }) || { id: -1 };

    if (this._ccTrackId !== track.id) {
      this._ccTrackId = track.id;
      this.trigger(_events2.default.PLAYBACK_SUBTITLE_CHANGED, {
        id: track.id
      });
    }
  };

  HTML5Video.prototype.render = function render() {
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
  };

  (0, _createClass3.default)(HTML5Video, [{
    key: 'isReady',
    get: function get() {
      return this._isReadyState;
    }
  }, {
    key: 'isHTML5Video',
    get: function get() {
      return this.name === HTML5Video.prototype.name;
    }
  }, {
    key: 'closedCaptionsTracks',
    get: function get() {
      var id = 0;
      var trackId = function trackId() {
        return id++;
      };
      var textTracks = this.el.textTracks ? (0, _from2.default)(this.el.textTracks) : [];

      return textTracks.filter(function (track) {
        return track.kind === 'subtitles' || track.kind === 'captions';
      }).map(function (track) {
        return { id: trackId(), name: track.label, track: track };
      });
    }
  }, {
    key: 'closedCaptionsTrackId',
    get: function get() {
      return this._ccTrackId;
    },
    set: function set(trackId) {
      if (!(0, _utils.isNumber)(trackId)) return;

      var tracks = this.closedCaptionsTracks;
      var showingTrack = void 0;

      // Note: -1 is for hide all tracks
      if (trackId !== -1) {
        showingTrack = tracks.find(function (track) {
          return track.id === trackId;
        });
        if (!showingTrack) return; // Track id not found

        if (showingTrack.track.mode === 'showing') return; // Track already showing
      }

      // Since it is possible to display multiple tracks,
      // ensure that all tracks are hidden.
      tracks.filter(function (track) {
        return track.track.mode !== 'hidden';
      }).forEach(function (track) {
        return track.track.mode = 'hidden';
      });

      showingTrack && (showingTrack.track.mode = 'showing');

      this._ccTrackId = trackId;
      this.trigger(_events2.default.PLAYBACK_SUBTITLE_CHANGED, {
        id: trackId
      });
    }
  }, {
    key: 'template',
    get: function get() {
      return (0, _template2.default)(_tracks2.default);
    }
  }]);
  return HTML5Video;
}(_playback2.default);

exports.default = HTML5Video;


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
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/node-libs-browser/node_modules/process/browser.js */ "./node_modules/node-libs-browser/node_modules/process/browser.js")))

/***/ }),

/***/ "./src/playbacks/html5_video/public/style.scss":
/*!*****************************************************!*\
  !*** ./src/playbacks/html5_video/public/style.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./style.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/playbacks/html5_video/public/style.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"singleton":true,"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/playbacks/html5_video/public/tracks.html":
/*!******************************************************!*\
  !*** ./src/playbacks/html5_video/public/tracks.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<% for (var i = 0; i < tracks.length; i++) { %>\n  <track data-html5-video-track=\"<%= i %>\" kind=\"<%= tracks[i].kind %>\" label=\"<%= tracks[i].label %>\" srclang=\"<%= tracks[i].lang %>\" src=\"<%= tracks[i].src %>\" />\n<% }; %>\n";

/***/ }),

/***/ "./src/playbacks/html_img/html_img.js":
/*!********************************************!*\
  !*** ./src/playbacks/html_img/html_img.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _playback = __webpack_require__(/*! ../../base/playback */ "./src/base/playback.js");

var _playback2 = _interopRequireDefault(_playback);

var _events = __webpack_require__(/*! ../../base/events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

__webpack_require__(/*! ./public/style.scss */ "./src/playbacks/html_img/public/style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HTMLImg = function (_Playback) {
  (0, _inherits3.default)(HTMLImg, _Playback);

  HTMLImg.prototype.getPlaybackType = function getPlaybackType() {
    return _playback2.default.NO_OP;
  };

  (0, _createClass3.default)(HTMLImg, [{
    key: 'name',
    get: function get() {
      return 'html_img';
    }
  }, {
    key: 'supportedVersion',
    get: function get() {
      return { min: "0.4.1" };
    }
  }, {
    key: 'tagName',
    get: function get() {
      return 'img';
    }
  }, {
    key: 'attributes',
    get: function get() {
      return {
        'data-html-img': ''
      };
    }
  }, {
    key: 'events',
    get: function get() {
      return {
        'load': '_onLoad',
        'abort': '_onError',
        'error': '_onError'
      };
    }
  }]);

  function HTMLImg(params) {
    (0, _classCallCheck3.default)(this, HTMLImg);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Playback.call(this, params));

    _this.el.src = params.src;
    return _this;
  }

  HTMLImg.prototype.render = function render() {
    this.trigger(_events2.default.PLAYBACK_READY, this.name);
    return this;
  };

  HTMLImg.prototype._onLoad = function _onLoad() {
    this.trigger(_events2.default.PLAYBACK_ENDED, this.name);
  };

  HTMLImg.prototype._onError = function _onError(evt) {
    var m = evt.type === 'error' ? 'load error' : 'loading aborted';
    this.trigger(_events2.default.PLAYBACK_ERROR, { message: m }, this.name);
  };

  return HTMLImg;
}(_playback2.default); // Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

exports.default = HTMLImg;


HTMLImg.canPlay = function (resource) {
  return (/\.(png|jpg|jpeg|gif|bmp|tiff|pgm|pnm|webp)(|\?.*)$/i.test(resource)
  );
};
module.exports = exports['default'];

/***/ }),

/***/ "./src/playbacks/html_img/public/style.scss":
/*!**************************************************!*\
  !*** ./src/playbacks/html_img/public/style.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./style.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/playbacks/html_img/public/style.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"singleton":true,"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/playbacks/no_op/no_op.js":
/*!**************************************!*\
  !*** ./src/playbacks/no_op/no_op.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(/*! ../../utils */ "./src/utils/utils.js");

var _playback = __webpack_require__(/*! ../../base/playback */ "./src/base/playback.js");

var _playback2 = _interopRequireDefault(_playback);

var _template = __webpack_require__(/*! ../../base/template */ "./src/base/template.js");

var _template2 = _interopRequireDefault(_template);

var _events = __webpack_require__(/*! ../../base/events */ "./src/base/events.js");

var _events2 = _interopRequireDefault(_events);

var _error = __webpack_require__(/*! ./public/error.html */ "./src/playbacks/no_op/public/error.html");

var _error2 = _interopRequireDefault(_error);

__webpack_require__(/*! ./public/style.scss */ "./src/playbacks/no_op/public/style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NoOp = function (_Playback) {
  (0, _inherits3.default)(NoOp, _Playback);
  (0, _createClass3.default)(NoOp, [{
    key: 'name',
    get: function get() {
      return 'no_op';
    }
  }, {
    key: 'supportedVersion',
    get: function get() {
      return { min: "0.4.1" };
    }
  }, {
    key: 'template',
    get: function get() {
      return (0, _template2.default)(_error2.default);
    }
  }, {
    key: 'attributes',
    get: function get() {
      return { 'data-no-op': '' };
    }
  }]);

  function NoOp() {
    (0, _classCallCheck3.default)(this, NoOp);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, _Playback.call.apply(_Playback, [this].concat(args)));

    _this._noiseFrameNum = -1;
    return _this;
  }

  NoOp.prototype.render = function render() {
    var playbackNotSupported = this.options.playbackNotSupportedMessage || this.i18n.t('playback_not_supported');
    this.$el.html(this.template({ message: playbackNotSupported }));
    this.trigger(_events2.default.PLAYBACK_READY, this.name);
    var showForNoOp = !!(this.options.poster && this.options.poster.showForNoOp);
    if (this.options.autoPlay || !showForNoOp) this._animate();

    return this;
  };

  NoOp.prototype._noise = function _noise() {
    this._noiseFrameNum = (this._noiseFrameNum + 1) % 5;
    if (this._noiseFrameNum) {
      // only update noise every 5 frames to save cpu
      return;
    }

    var idata = this.context.createImageData(this.context.canvas.width, this.context.canvas.height);
    var buffer32 = void 0;
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
  };

  NoOp.prototype._loop = function _loop() {
    var _this2 = this;

    if (this._stop) return;

    this._noise();
    this._animationHandle = (0, _utils.requestAnimationFrame)(function () {
      return _this2._loop();
    });
  };

  NoOp.prototype.destroy = function destroy() {
    if (this._animationHandle) {
      (0, _utils.cancelAnimationFrame)(this._animationHandle);
      this._stop = true;
    }
  };

  NoOp.prototype._animate = function _animate() {
    this.canvas = this.$el.find('canvas[data-no-op-canvas]')[0];
    this.context = this.canvas.getContext('2d');
    this._loop();
  };

  return NoOp;
}(_playback2.default);

exports.default = NoOp;


NoOp.canPlay = function (source) {
  // eslint-disable-line no-unused-vars
  return true;
};
module.exports = exports['default'];

/***/ }),

/***/ "./src/playbacks/no_op/public/error.html":
/*!***********************************************!*\
  !*** ./src/playbacks/no_op/public/error.html ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<canvas data-no-op-canvas></canvas>\n<p data-no-op-msg><%=message%><p>\n";

/***/ }),

/***/ "./src/playbacks/no_op/public/style.scss":
/*!***********************************************!*\
  !*** ./src/playbacks/no_op/public/style.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./style.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?includePaths[]=/Users/bruno/workspace/clappr/clappr-core/src/base/scss!./src/playbacks/no_op/public/style.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"singleton":true,"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/plugins/strings.js":
/*!********************************!*\
  !*** ./src/plugins/strings.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(/*! ../utils */ "./src/utils/utils.js");

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

var _core_plugin = __webpack_require__(/*! ../base/core_plugin */ "./src/base/core_plugin.js");

var _core_plugin2 = _interopRequireDefault(_core_plugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The internationalization (i18n) plugin
 * @class Strings
 * @constructor
 * @extends CorePlugin
 * @module plugins
 */
var Strings = function (_CorePlugin) {
  (0, _inherits3.default)(Strings, _CorePlugin);
  (0, _createClass3.default)(Strings, [{
    key: 'name',
    get: function get() {
      return 'strings';
    }
  }, {
    key: 'supportedVersion',
    get: function get() {
      return { min: "0.4.1" };
    }
  }]);

  function Strings(core) {
    (0, _classCallCheck3.default)(this, Strings);

    var _this = (0, _possibleConstructorReturn3.default)(this, _CorePlugin.call(this, core));

    _this._initializeMessages();
    return _this;
  }
  /**
   * Gets a translated string for the given key.
   * @method t
   * @param {String} key the key to all messages
   * @return {String} translated label
   */


  Strings.prototype.t = function t(key) {
    var lang = this._language();
    var fallbackLang = this._messages['en'];
    var i18n = lang && this._messages[lang] || fallbackLang;
    return i18n[key] || fallbackLang[key] || key;
  };

  Strings.prototype._language = function _language() {
    return this.core.options.language || (0, _utils.getBrowserLanguage)();
  };

  Strings.prototype._initializeMessages = function _initializeMessages() {
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

    this._messages = _clapprZepto2.default.extend(true, defaultMessages, this.core.options.strings || {});
    this._messages['pt-BR'] = this._messages['pt'];
    this._messages['en-US'] = this._messages['en'];
    this._messages['es-419'] = this._messages['es'];
    this._messages['fr-FR'] = this._messages['fr'];
    this._messages['tr-TR'] = this._messages['tr'];
    this._messages['et-EE'] = this._messages['et'];
    this._messages['ar-IQ'] = this._messages['ar'];
  };

  return Strings;
}(_core_plugin2.default);

exports.default = Strings;
module.exports = exports['default'];

/***/ }),

/***/ "./src/utils/utils.js":
/*!****************************!*\
  !*** ./src/utils/utils.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DoubleEventHandler = exports.DomRecycler = exports.cancelAnimationFrame = exports.requestAnimationFrame = exports.QueryString = exports.Config = exports.Fullscreen = undefined;

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _defineProperty = __webpack_require__(/*! babel-runtime/core-js/object/define-property */ "./node_modules/babel-runtime/core-js/object/define-property.js");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = __webpack_require__(/*! babel-runtime/core-js/object/get-own-property-descriptor */ "./node_modules/babel-runtime/core-js/object/get-own-property-descriptor.js");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

exports.assign = assign;
exports.extend = extend;
exports.formatTime = formatTime;
exports.seekStringToSeconds = seekStringToSeconds;
exports.uniqueId = uniqueId;
exports.isNumber = isNumber;
exports.currentScriptUrl = currentScriptUrl;
exports.getBrowserLanguage = getBrowserLanguage;
exports.now = now;
exports.removeArrayItem = removeArrayItem;
exports.listContainsIgnoreCase = listContainsIgnoreCase;
exports.canAutoPlayMedia = canAutoPlayMedia;

__webpack_require__(/*! ../base/polyfills */ "./src/base/polyfills.js");

var _media = __webpack_require__(/*! ../base/media */ "./src/base/media.js");

var _media2 = _interopRequireDefault(_media);

var _browser = __webpack_require__(/*! ../components/browser */ "./src/components/browser/browser.js");

var _browser2 = _interopRequireDefault(_browser);

var _clapprZepto = __webpack_require__(/*! clappr-zepto */ "./node_modules/clappr-zepto/zepto.js");

var _clapprZepto2 = _interopRequireDefault(_clapprZepto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
/*jshint -W079 */

function assign(obj, source) {
  if (source) {
    for (var prop in source) {
      var propDescriptor = (0, _getOwnPropertyDescriptor2.default)(source, prop);
      propDescriptor ? (0, _defineProperty2.default)(obj, prop, propDescriptor) : obj[prop] = source[prop];
    }
  }
  return obj;
}

function extend(parent, properties) {
  var Surrogate = function (_parent) {
    (0, _inherits3.default)(Surrogate, _parent);

    function Surrogate() {
      (0, _classCallCheck3.default)(this, Surrogate);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = (0, _possibleConstructorReturn3.default)(this, _parent.call.apply(_parent, [this].concat(args)));

      if (properties.initialize) properties.initialize.apply(_this, args);

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

var Fullscreen = exports.Fullscreen = {
  getFullscreenElement: function getFullscreenElement() {
    return document.webkitFullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement;
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

var Config = exports.Config = function () {
  function Config() {
    (0, _classCallCheck3.default)(this, Config);
  }

  Config._defaultConfig = function _defaultConfig() {
    return {
      volume: {
        value: 100,
        parse: parseInt
      }
    };
  };

  Config._defaultValueFor = function _defaultValueFor(key) {
    try {
      return this._defaultConfig()[key].parse(this._defaultConfig()[key].value);
    } catch (e) {
      return undefined;
    }
  };

  Config._createKeyspace = function _createKeyspace(key) {
    return 'clappr.' + document.domain + '.' + key;
  };

  Config.restore = function restore(key) {
    if (_browser2.default.hasLocalstorage && localStorage[this._createKeyspace(key)]) return this._defaultConfig()[key].parse(localStorage[this._createKeyspace(key)]);

    return this._defaultValueFor(key);
  };

  Config.persist = function persist(key, value) {
    if (_browser2.default.hasLocalstorage) {
      try {
        localStorage[this._createKeyspace(key)] = value;
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  return Config;
}();

var QueryString = exports.QueryString = function () {
  function QueryString() {
    (0, _classCallCheck3.default)(this, QueryString);
  }

  QueryString.parse = function parse(paramsString) {
    var match = void 0;
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
  };

  (0, _createClass3.default)(QueryString, null, [{
    key: 'params',
    get: function get() {
      var query = window.location.search.substring(1);
      if (query !== this.query) {
        this._urlParams = this.parse(query);
        this.query = query;
      }
      return this._urlParams;
    }
  }, {
    key: 'hashParams',
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
    var factor = { 'h': 3600, 'm': 60, 's': 1 };
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

var requestAnimationFrame = exports.requestAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
  window.setTimeout(fn, 1000 / 60);
}).bind(window);

var cancelAnimationFrame = exports.cancelAnimationFrame = (window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout).bind(window);

function getBrowserLanguage() {
  return window.navigator && window.navigator.language;
}

function now() {
  if (window.performance && window.performance.now) return performance.now();

  return Date.now();
}

// remove the item from the array if it exists in the array
function removeArrayItem(arr, item) {
  var i = arr.indexOf(item);
  if (i >= 0) arr.splice(i, 1);
}

// find an item regardless of its letter case
function listContainsIgnoreCase(item, items) {
  if (item === undefined || items === undefined) return false;
  return items.find(function (itemEach) {
    return item.toLowerCase() === itemEach.toLowerCase();
  }) !== undefined;
}

// https://github.com/video-dev/can-autoplay
function canAutoPlayMedia(cb, options) {
  options = (0, _assign2.default)({
    inline: false,
    muted: false,
    timeout: 250,
    type: 'video',
    source: _media2.default.mp4,
    element: null
  }, options);

  var element = options.element ? options.element : document.createElement(options.type);

  element.muted = options.muted;
  if (options.muted === true) element.setAttribute('muted', 'muted');

  if (options.inline === true) element.setAttribute('playsinline', 'playsinline');

  element.src = options.source;

  var promise = element.play();

  var timeoutId = setTimeout(function () {
    setResult(false, new Error('Timeout ' + options.timeout + ' ms has been reached'));
  }, options.timeout);

  var setResult = function setResult(result) {
    var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    clearTimeout(timeoutId);
    cb(result, error);
  };

  if (promise !== undefined) {
    promise.then(function () {
      return setResult(true);
    }).catch(function (err) {
      return setResult(false, err);
    });
  } else {
    setResult(true);
  }
}

// Simple Zepto element factory with video recycle feature.
var videoStack = [];

var DomRecycler = exports.DomRecycler = function () {
  function DomRecycler() {
    (0, _classCallCheck3.default)(this, DomRecycler);
  }

  DomRecycler.configure = function configure(options) {
    this.options = _clapprZepto2.default.extend(this.options, options);
  };

  DomRecycler.create = function create(name) {
    if (this.options.recycleVideo && name === 'video' && videoStack.length > 0) return videoStack.shift();

    return (0, _clapprZepto2.default)('<' + name + '>');
  };

  DomRecycler.garbage = function garbage($el) {
    // Expect Zepto collection with single element (does not iterate!)
    if (!this.options.recycleVideo || $el[0].tagName.toUpperCase() !== 'VIDEO') return;
    $el.children().remove();
    videoStack.push($el);
  };

  return DomRecycler;
}();

DomRecycler.options = { recycleVideo: false };

var DoubleEventHandler = exports.DoubleEventHandler = function () {
  function DoubleEventHandler() {
    var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
    (0, _classCallCheck3.default)(this, DoubleEventHandler);

    this.delay = delay;
    this.lastTime = 0;
  }

  DoubleEventHandler.prototype.handle = function handle(event, cb) {
    var prevented = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    // Based on http://jsfiddle.net/brettwp/J4djY/
    var currentTime = new Date().getTime();
    var diffTime = currentTime - this.lastTime;

    if (diffTime < this.delay && diffTime > 0) {
      cb();
      prevented && event.preventDefault();
    }

    this.lastTime = currentTime;
  };

  return DoubleEventHandler;
}();

exports.default = {
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
  Media: _media2.default,
  DoubleEventHandler: DoubleEventHandler
};

/***/ })

/******/ });
});
//# sourceMappingURL=clappr-core.js.map

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/array/from.js":
/*!**********************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/array/from.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/array/from */ "./node_modules/core-js/library/fn/array/from.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/json/stringify.js":
/*!**************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/json/stringify.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/json/stringify */ "./node_modules/core-js/library/fn/json/stringify.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/assign.js":
/*!*************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/assign.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/assign */ "./node_modules/core-js/library/fn/object/assign.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/create.js":
/*!*************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/create.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/create */ "./node_modules/core-js/library/fn/object/create.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/define-property.js":
/*!**********************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/define-property.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/define-property */ "./node_modules/core-js/library/fn/object/define-property.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/set-prototype-of.js":
/*!***********************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/set-prototype-of.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/set-prototype-of */ "./node_modules/core-js/library/fn/object/set-prototype-of.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/symbol.js":
/*!******************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/symbol.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol */ "./node_modules/core-js/library/fn/symbol/index.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/symbol/iterator.js":
/*!***************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/symbol/iterator.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol/iterator */ "./node_modules/core-js/library/fn/symbol/iterator.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/classCallCheck.js":
/*!**************************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/classCallCheck.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/createClass.js":
/*!***********************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/createClass.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(/*! ../core-js/object/define-property */ "./node_modules/babel-runtime/core-js/object/define-property.js");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/extends.js":
/*!*******************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/extends.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(/*! ../core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/inherits.js":
/*!********************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/inherits.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(/*! ../core-js/object/set-prototype-of */ "./node_modules/babel-runtime/core-js/object/set-prototype-of.js");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(/*! ../core-js/object/create */ "./node_modules/babel-runtime/core-js/object/create.js");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ "./node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js":
/*!*************************************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/possibleConstructorReturn.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ "./node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/toConsumableArray.js":
/*!*****************************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/toConsumableArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(/*! ../core-js/array/from */ "./node_modules/babel-runtime/core-js/array/from.js");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/typeof.js":
/*!******************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/typeof.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(/*! ../core-js/symbol/iterator */ "./node_modules/babel-runtime/core-js/symbol/iterator.js");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(/*! ../core-js/symbol */ "./node_modules/babel-runtime/core-js/symbol.js");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),

/***/ "./node_modules/core-js/library/fn/array/from.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/fn/array/from.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.string.iterator */ "./node_modules/core-js/library/modules/es6.string.iterator.js");
__webpack_require__(/*! ../../modules/es6.array.from */ "./node_modules/core-js/library/modules/es6.array.from.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Array.from;

/***/ }),

/***/ "./node_modules/core-js/library/fn/json/stringify.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/fn/json/stringify.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var core  = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js")
  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/assign.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/assign.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.assign */ "./node_modules/core-js/library/modules/es6.object.assign.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.assign;

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/create.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/create.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.create */ "./node_modules/core-js/library/modules/es6.object.create.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/define-property.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/define-property.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.define-property */ "./node_modules/core-js/library/modules/es6.object.define-property.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/set-prototype-of.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/set-prototype-of.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.set-prototype-of */ "./node_modules/core-js/library/modules/es6.object.set-prototype-of.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.setPrototypeOf;

/***/ }),

/***/ "./node_modules/core-js/library/fn/symbol/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/fn/symbol/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.symbol */ "./node_modules/core-js/library/modules/es6.symbol.js");
__webpack_require__(/*! ../../modules/es6.object.to-string */ "./node_modules/core-js/library/modules/es6.object.to-string.js");
__webpack_require__(/*! ../../modules/es7.symbol.async-iterator */ "./node_modules/core-js/library/modules/es7.symbol.async-iterator.js");
__webpack_require__(/*! ../../modules/es7.symbol.observable */ "./node_modules/core-js/library/modules/es7.symbol.observable.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Symbol;

/***/ }),

/***/ "./node_modules/core-js/library/fn/symbol/iterator.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/fn/symbol/iterator.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.string.iterator */ "./node_modules/core-js/library/modules/es6.string.iterator.js");
__webpack_require__(/*! ../../modules/web.dom.iterable */ "./node_modules/core-js/library/modules/web.dom.iterable.js");
module.exports = __webpack_require__(/*! ../../modules/_wks-ext */ "./node_modules/core-js/library/modules/_wks-ext.js").f('iterator');

/***/ }),

/***/ "./node_modules/core-js/library/modules/_a-function.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_a-function.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_add-to-unscopables.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_add-to-unscopables.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),

/***/ "./node_modules/core-js/library/modules/_an-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_an-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_array-includes.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_array-includes.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , toLength  = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/library/modules/_to-length.js")
  , toIndex   = __webpack_require__(/*! ./_to-index */ "./node_modules/core-js/library/modules/_to-index.js");
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_classof.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_classof.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/library/modules/_cof.js")
  , TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_cof.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_cof.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_core.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_core.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),

/***/ "./node_modules/core-js/library/modules/_create-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_create-property.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js")
  , createDesc      = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js");

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_ctx.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_ctx.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/library/modules/_a-function.js");
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_defined.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_defined.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_descriptors.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_descriptors.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),

/***/ "./node_modules/core-js/library/modules/_dom-create.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_dom-create.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js")
  , document = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_enum-bug-keys.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_enum-bug-keys.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),

/***/ "./node_modules/core-js/library/modules/_enum-keys.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_enum-keys.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js")
  , gOPS    = __webpack_require__(/*! ./_object-gops */ "./node_modules/core-js/library/modules/_object-gops.js")
  , pIE     = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js");
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_export.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_export.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js")
  , core      = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js")
  , ctx       = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/library/modules/_ctx.js")
  , hide      = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_fails.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_fails.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_global.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_global.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),

/***/ "./node_modules/core-js/library/modules/_has.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_has.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_hide.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_hide.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js")
  , createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js");
module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_html.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_html.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").document && document.documentElement;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_ie8-dom-define.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_ie8-dom-define.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") && !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function(){
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/library/modules/_dom-create.js")('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iobject.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iobject.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/library/modules/_cof.js");
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_is-array-iter.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_is-array-iter.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js")
  , ITERATOR   = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_is-array.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_is-array.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/library/modules/_cof.js");
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_is-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_is-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-call.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-call.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-create.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-create.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/library/modules/_object-create.js")
  , descriptor     = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js")
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/library/modules/_set-to-string-tag.js")
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")(IteratorPrototype, __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-define.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-define.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js")
  , $export        = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
  , redefine       = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/library/modules/_redefine.js")
  , hide           = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")
  , has            = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , Iterators      = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js")
  , $iterCreate    = __webpack_require__(/*! ./_iter-create */ "./node_modules/core-js/library/modules/_iter-create.js")
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/library/modules/_set-to-string-tag.js")
  , getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ "./node_modules/core-js/library/modules/_object-gpo.js")
  , ITERATOR       = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-detect.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-detect.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-step.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iter-step.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_iterators.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iterators.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_keyof.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_keyof.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js")
  , toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_library.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_library.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_meta.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_meta.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js")('meta')
  , isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js")
  , has      = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , setDesc  = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-assign.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-assign.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js")
  , gOPS     = __webpack_require__(/*! ./_object-gops */ "./node_modules/core-js/library/modules/_object-gops.js")
  , pIE      = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js")
  , toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js")
  , IObject  = __webpack_require__(/*! ./_iobject */ "./node_modules/core-js/library/modules/_iobject.js")
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-create.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js")
  , dPs         = __webpack_require__(/*! ./_object-dps */ "./node_modules/core-js/library/modules/_object-dps.js")
  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js")
  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/library/modules/_dom-create.js")('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(/*! ./_html */ "./node_modules/core-js/library/modules/_html.js").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-dp.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-dp.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js")
  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/library/modules/_ie8-dom-define.js")
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/library/modules/_to-primitive.js")
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-dps.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-dps.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js")
  , anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js")
  , getKeys  = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js");

module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gopd.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gopd.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js")
  , createDesc     = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js")
  , toIObject      = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/library/modules/_to-primitive.js")
  , has            = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/library/modules/_ie8-dom-define.js")
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gopn-ext.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gopn-ext.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , gOPN      = __webpack_require__(/*! ./_object-gopn */ "./node_modules/core-js/library/modules/_object-gopn.js").f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gopn.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gopn.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/library/modules/_object-keys-internal.js")
  , hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gops.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gops.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-gpo.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-gpo.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , toObject    = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js")
  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-keys-internal.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-keys-internal.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , toIObject    = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , arrayIndexOf = __webpack_require__(/*! ./_array-includes */ "./node_modules/core-js/library/modules/_array-includes.js")(false)
  , IE_PROTO     = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-keys.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-keys.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/library/modules/_object-keys-internal.js")
  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js");

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-pie.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-pie.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_property-desc.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_property-desc.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_redefine.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_redefine.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js");

/***/ }),

/***/ "./node_modules/core-js/library/modules/_set-proto.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_set-proto.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js")
  , anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/library/modules/_ctx.js")(Function.call, __webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/library/modules/_object-gopd.js").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_set-to-string-tag.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_set-to-string-tag.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f
  , has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_shared-key.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_shared-key.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/library/modules/_shared.js")('keys')
  , uid    = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js");
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_shared.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_shared.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js")
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_string-at.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_string-at.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js")
  , defined   = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-index.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js")
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-integer.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-integer.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-iobject.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-iobject.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(/*! ./_iobject */ "./node_modules/core-js/library/modules/_iobject.js")
  , defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-length.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-length.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js")
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-primitive.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-primitive.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_uid.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_uid.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_wks-define.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_wks-define.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js")
  , core           = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js")
  , LIBRARY        = __webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js")
  , wksExt         = __webpack_require__(/*! ./_wks-ext */ "./node_modules/core-js/library/modules/_wks-ext.js")
  , defineProperty = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/_wks-ext.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_wks-ext.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js");

/***/ }),

/***/ "./node_modules/core-js/library/modules/_wks.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_wks.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/library/modules/_shared.js")('wks')
  , uid        = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js")
  , Symbol     = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),

/***/ "./node_modules/core-js/library/modules/core.get-iterator-method.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/core.get-iterator-method.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/library/modules/_classof.js")
  , ITERATOR  = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('iterator')
  , Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js");
module.exports = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js").getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.array.from.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.array.from.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/library/modules/_ctx.js")
  , $export        = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
  , toObject       = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js")
  , call           = __webpack_require__(/*! ./_iter-call */ "./node_modules/core-js/library/modules/_iter-call.js")
  , isArrayIter    = __webpack_require__(/*! ./_is-array-iter */ "./node_modules/core-js/library/modules/_is-array-iter.js")
  , toLength       = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/library/modules/_to-length.js")
  , createProperty = __webpack_require__(/*! ./_create-property */ "./node_modules/core-js/library/modules/_create-property.js")
  , getIterFn      = __webpack_require__(/*! ./core.get-iterator-method */ "./node_modules/core-js/library/modules/core.get-iterator-method.js");

$export($export.S + $export.F * !__webpack_require__(/*! ./_iter-detect */ "./node_modules/core-js/library/modules/_iter-detect.js")(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.array.iterator.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.array.iterator.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ "./node_modules/core-js/library/modules/_add-to-unscopables.js")
  , step             = __webpack_require__(/*! ./_iter-step */ "./node_modules/core-js/library/modules/_iter-step.js")
  , Iterators        = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js")
  , toIObject        = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/library/modules/_iter-define.js")(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.assign.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.assign.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(/*! ./_object-assign */ "./node_modules/core-js/library/modules/_object-assign.js")});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.create.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.create.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/library/modules/_object-create.js")});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.define-property.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.define-property.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js"), 'Object', {defineProperty: __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js").f});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.set-prototype-of.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.set-prototype-of.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(/*! ./_set-proto */ "./node_modules/core-js/library/modules/_set-proto.js").set});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.to-string.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.to-string.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.string.iterator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.string.iterator.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(/*! ./_string-at */ "./node_modules/core-js/library/modules/_string-at.js")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/library/modules/_iter-define.js")(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.symbol.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.symbol.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js")
  , has            = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js")
  , DESCRIPTORS    = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js")
  , $export        = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js")
  , redefine       = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/library/modules/_redefine.js")
  , META           = __webpack_require__(/*! ./_meta */ "./node_modules/core-js/library/modules/_meta.js").KEY
  , $fails         = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")
  , shared         = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/library/modules/_shared.js")
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/library/modules/_set-to-string-tag.js")
  , uid            = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js")
  , wks            = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")
  , wksExt         = __webpack_require__(/*! ./_wks-ext */ "./node_modules/core-js/library/modules/_wks-ext.js")
  , wksDefine      = __webpack_require__(/*! ./_wks-define */ "./node_modules/core-js/library/modules/_wks-define.js")
  , keyOf          = __webpack_require__(/*! ./_keyof */ "./node_modules/core-js/library/modules/_keyof.js")
  , enumKeys       = __webpack_require__(/*! ./_enum-keys */ "./node_modules/core-js/library/modules/_enum-keys.js")
  , isArray        = __webpack_require__(/*! ./_is-array */ "./node_modules/core-js/library/modules/_is-array.js")
  , anObject       = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js")
  , toIObject      = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js")
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/library/modules/_to-primitive.js")
  , createDesc     = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js")
  , _create        = __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/library/modules/_object-create.js")
  , gOPNExt        = __webpack_require__(/*! ./_object-gopn-ext */ "./node_modules/core-js/library/modules/_object-gopn-ext.js")
  , $GOPD          = __webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/library/modules/_object-gopd.js")
  , $DP            = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js")
  , $keys          = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js")
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(/*! ./_object-gopn */ "./node_modules/core-js/library/modules/_object-gopn.js").f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/library/modules/_object-pie.js").f  = $propertyIsEnumerable;
  __webpack_require__(/*! ./_object-gops */ "./node_modules/core-js/library/modules/_object-gops.js").f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js")){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),

/***/ "./node_modules/core-js/library/modules/es7.symbol.async-iterator.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es7.symbol.async-iterator.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./_wks-define */ "./node_modules/core-js/library/modules/_wks-define.js")('asyncIterator');

/***/ }),

/***/ "./node_modules/core-js/library/modules/es7.symbol.observable.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es7.symbol.observable.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./_wks-define */ "./node_modules/core-js/library/modules/_wks-define.js")('observable');

/***/ }),

/***/ "./node_modules/core-js/library/modules/web.dom.iterable.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/web.dom.iterable.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./es6.array.iterator */ "./node_modules/core-js/library/modules/es6.array.iterator.js");
var global        = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js")
  , hide          = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js")
  , Iterators     = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/library/modules/_iterators.js")
  , TO_STRING_TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/library/modules/_wks.js")('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),

/***/ "./src/hls.js":
/*!********************!*\
  !*** ./src/hls.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__(/*! babel-runtime/helpers/toConsumableArray */ "./node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ "./node_modules/babel-runtime/core-js/json/stringify.js");

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ "./node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _core = __webpack_require__(/*! @clappr/core */ "./node_modules/@clappr/core/dist/clappr-core.js");

var _hls = __webpack_require__(/*! hls.js */ "hls.js");

var _hls2 = _interopRequireDefault(_hls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var now = _core.Utils.now,
    assign = _core.Utils.assign,
    listContainsIgnoreCase = _core.Utils.listContainsIgnoreCase;


var AUTO = -1;

var HlsjsPlayback = function (_HTML5Video) {
  (0, _inherits3.default)(HlsjsPlayback, _HTML5Video);
  (0, _createClass3.default)(HlsjsPlayback, [{
    key: 'name',
    get: function get() {
      return 'hls';
    }
  }, {
    key: 'supportedVersion',
    get: function get() {
      return { min: "0.4.1" };
    }
  }, {
    key: 'levels',
    get: function get() {
      return this._levels || [];
    }
  }, {
    key: 'currentLevel',
    get: function get() {
      if (this._currentLevel === null || this._currentLevel === undefined) return AUTO;else return this._currentLevel; //0 is a valid level ID
    },
    set: function set(id) {
      this._currentLevel = id;
      this.trigger(_core.Events.PLAYBACK_LEVEL_SWITCH_START);
      if (this.options.playback.hlsUseNextLevel) this._hls.nextLevel = this._currentLevel;else this._hls.currentLevel = this._currentLevel;
    }
  }, {
    key: 'isReady',
    get: function get() {
      return this._isReadyState;
    }
  }, {
    key: '_startTime',
    get: function get() {
      if (this._playbackType === _core.Playback.LIVE && this._playlistType !== 'EVENT') return this._extrapolatedStartTime;

      return this._playableRegionStartTime;
    }
  }, {
    key: '_now',
    get: function get() {
      return now();
    }

    // the time in the video element which should represent the start of the sliding window
    // extrapolated to increase in real time (instead of jumping as the early segments are removed)

  }, {
    key: '_extrapolatedStartTime',
    get: function get() {
      if (!this._localStartTimeCorrelation) return this._playableRegionStartTime;

      var corr = this._localStartTimeCorrelation;
      var timePassed = this._now - corr.local;
      var extrapolatedWindowStartTime = (corr.remote + timePassed) / 1000;
      // cap at the end of the extrapolated window duration
      return Math.min(extrapolatedWindowStartTime, this._playableRegionStartTime + this._extrapolatedWindowDuration);
    }

    // the time in the video element which should represent the end of the content
    // extrapolated to increase in real time (instead of jumping as segments are added)

  }, {
    key: '_extrapolatedEndTime',
    get: function get() {
      var actualEndTime = this._playableRegionStartTime + this._playableRegionDuration;
      if (!this._localEndTimeCorrelation) return actualEndTime;

      var corr = this._localEndTimeCorrelation;
      var timePassed = this._now - corr.local;
      var extrapolatedEndTime = (corr.remote + timePassed) / 1000;
      return Math.max(actualEndTime - this._extrapolatedWindowDuration, Math.min(extrapolatedEndTime, actualEndTime));
    }
  }, {
    key: '_duration',
    get: function get() {
      return this._extrapolatedEndTime - this._startTime;
    }

    // Returns the duration (seconds) of the window that the extrapolated start time is allowed
    // to move in before being capped.
    // The extrapolated start time should never reach the cap at the end of the window as the
    // window should slide as chunks are removed from the start.
    // This also applies to the extrapolated end time in the same way.
    //
    // If chunks aren't being removed for some reason that the start time will reach and remain fixed at
    // playableRegionStartTime + extrapolatedWindowDuration
    //
    //                                <-- window duration -->
    // I.e   playableRegionStartTime |-----------------------|
    //                               | -->   .       .       .
    //                               .   --> | -->   .       .
    //                               .       .   --> | -->   .
    //                               .       .       .   --> |
    //                               .       .       .       .
    //                                 extrapolatedStartTime

  }, {
    key: '_extrapolatedWindowDuration',
    get: function get() {
      if (this._segmentTargetDuration === null) return 0;

      return this._extrapolatedWindowNumSegments * this._segmentTargetDuration;
    }
  }], [{
    key: 'version',
    get: function get() {
      return "0.4.0";
    }
  }, {
    key: 'HLSJS',
    get: function get() {
      return _hls2.default;
    }
  }]);

  function HlsjsPlayback() {
    (0, _classCallCheck3.default)(this, HlsjsPlayback);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // backwards compatibility (TODO: remove on 0.3.0)
    var _this = (0, _possibleConstructorReturn3.default)(this, _HTML5Video.call.apply(_HTML5Video, [this].concat(args)));

    _this.options.playback = (0, _extends3.default)({}, _this.options, _this.options.playback);
    _this._minDvrSize = typeof _this.options.hlsMinimumDvrSize === 'undefined' ? 60 : _this.options.hlsMinimumDvrSize;
    // The size of the start time extrapolation window measured as a multiple of segments.
    // Should be 2 or higher, or 0 to disable. Should only need to be increased above 2 if more than one segment is
    // removed from the start of the playlist at a time. E.g if the playlist is cached for 10 seconds and new chunks are
    // added/removed every 5.
    _this._extrapolatedWindowNumSegments = !_this.options.playback || typeof _this.options.playback.extrapolatedWindowNumSegments === 'undefined' ? 2 : _this.options.playback.extrapolatedWindowNumSegments;

    _this._playbackType = _core.Playback.VOD;
    _this._lastTimeUpdate = { current: 0, total: 0 };
    _this._lastDuration = null;
    // for hls streams which have dvr with a sliding window,
    // the content at the start of the playlist is removed as new
    // content is appended at the end.
    // this means the actual playable start time will increase as the
    // start content is deleted
    // For streams with dvr where the entire recording is kept from the
    // beginning this should stay as 0
    _this._playableRegionStartTime = 0;
    // {local, remote} remote is the time in the video element that should represent 0
    //                 local is the system time when the 'remote' measurment took place
    _this._localStartTimeCorrelation = null;
    // {local, remote} remote is the time in the video element that should represents the end
    //                 local is the system time when the 'remote' measurment took place
    _this._localEndTimeCorrelation = null;
    // if content is removed from the beginning then this empty area should
    // be ignored. "playableRegionDuration" excludes the empty area
    _this._playableRegionDuration = 0;
    // #EXT-X-PROGRAM-DATE-TIME
    _this._programDateTime = 0;
    // true when the actual duration is longer than hlsjs's live sync point
    // when this is false playableRegionDuration will be the actual duration
    // when this is true playableRegionDuration will exclude the time after the sync point
    _this._durationExcludesAfterLiveSyncPoint = false;
    // #EXT-X-TARGETDURATION
    _this._segmentTargetDuration = null;
    // #EXT-X-PLAYLIST-TYPE
    _this._playlistType = null;
    _this._recoverAttemptsRemaining = _this.options.hlsRecoverAttempts || 16;
    return _this;
  }

  HlsjsPlayback.prototype._setup = function _setup() {
    var _this2 = this;

    this._ccIsSetup = false;
    this._ccTracksUpdated = false;
    this._hls = new _hls2.default(assign({}, this.options.playback.hlsjsConfig));
    this._hls.once(_hls2.default.Events.MEDIA_ATTACHED, function () {
      return _this2._hls.loadSource(_this2.options.src);
    });
    this._hls.on(_hls2.default.Events.LEVEL_LOADED, function (evt, data) {
      return _this2._updatePlaybackType(evt, data);
    });
    this._hls.on(_hls2.default.Events.LEVEL_UPDATED, function (evt, data) {
      return _this2._onLevelUpdated(evt, data);
    });
    this._hls.on(_hls2.default.Events.LEVEL_SWITCHING, function (evt, data) {
      return _this2._onLevelSwitch(evt, data);
    });
    this._hls.on(_hls2.default.Events.FRAG_LOADED, function (evt, data) {
      return _this2._onFragmentLoaded(evt, data);
    });
    this._hls.on(_hls2.default.Events.ERROR, function (evt, data) {
      return _this2._onHLSJSError(evt, data);
    });
    this._hls.on(_hls2.default.Events.SUBTITLE_TRACK_LOADED, function (evt, data) {
      return _this2._onSubtitleLoaded(evt, data);
    });
    this._hls.on(_hls2.default.Events.SUBTITLE_TRACKS_UPDATED, function () {
      return _this2._ccTracksUpdated = true;
    });
    this._hls.attachMedia(this.el);
  };

  HlsjsPlayback.prototype.render = function render() {
    this._ready();
    return _HTML5Video.prototype.render.call(this);
  };

  HlsjsPlayback.prototype._ready = function _ready() {
    this._isReadyState = true;
    this.trigger(_core.Events.PLAYBACK_READY, this.name);
  };

  HlsjsPlayback.prototype._recover = function _recover(evt, data, error) {
    if (!this._recoveredDecodingError) {
      this._recoveredDecodingError = true;
      this._hls.recoverMediaError();
    } else if (!this._recoveredAudioCodecError) {
      this._recoveredAudioCodecError = true;
      this._hls.swapAudioCodec();
      this._hls.recoverMediaError();
    } else {
      _core.Log.error('hlsjs: failed to recover', { evt: evt, data: data });
      error.level = _core.PlayerError.Levels.FATAL;
      var formattedError = this.createError(error);
      this.trigger(_core.Events.PLAYBACK_ERROR, formattedError);
      this.stop();
    }
  };

  // override


  HlsjsPlayback.prototype._setupSrc = function _setupSrc(srcUrl) {// eslint-disable-line no-unused-vars
    // this playback manages the src on the video element itself
  };

  HlsjsPlayback.prototype._startTimeUpdateTimer = function _startTimeUpdateTimer() {
    var _this3 = this;

    if (this._timeUpdateTimer) return;

    this._timeUpdateTimer = setInterval(function () {
      _this3._onDurationChange();
      _this3._onTimeUpdate();
    }, 100);
  };

  HlsjsPlayback.prototype._stopTimeUpdateTimer = function _stopTimeUpdateTimer() {
    if (!this._timeUpdateTimer) return;

    clearInterval(this._timeUpdateTimer);
    this._timeUpdateTimer = null;
  };

  HlsjsPlayback.prototype.getProgramDateTime = function getProgramDateTime() {
    return this._programDateTime;
  };
  // the duration on the video element itself should not be used
  // as this does not necesarily represent the duration of the stream
  // https://github.com/clappr/clappr/issues/668#issuecomment-157036678


  HlsjsPlayback.prototype.getDuration = function getDuration() {
    return this._duration;
  };

  HlsjsPlayback.prototype.getCurrentTime = function getCurrentTime() {
    // e.g. can be < 0 if user pauses near the start
    // eventually they will then be kicked to the end by hlsjs if they run out of buffer
    // before the official start time
    return Math.max(0, this.el.currentTime - this._startTime);
  };

  // the time that "0" now represents relative to when playback started
  // for a stream with a sliding window this will increase as content is
  // removed from the beginning


  HlsjsPlayback.prototype.getStartTimeOffset = function getStartTimeOffset() {
    return this._startTime;
  };

  HlsjsPlayback.prototype.seekPercentage = function seekPercentage(percentage) {
    var seekTo = this._duration;
    if (percentage > 0) seekTo = this._duration * (percentage / 100);

    this.seek(seekTo);
  };

  HlsjsPlayback.prototype.seek = function seek(time) {
    if (time < 0) {
      _core.Log.warn('Attempt to seek to a negative time. Resetting to live point. Use seekToLivePoint() to seek to the live point.');
      time = this.getDuration();
    }
    // assume live if time within 3 seconds of end of stream
    this.dvrEnabled && this._updateDvr(time < this.getDuration() - 3);
    time += this._startTime;
    _HTML5Video.prototype.seek.call(this, time);
  };

  HlsjsPlayback.prototype.seekToLivePoint = function seekToLivePoint() {
    this.seek(this.getDuration());
  };

  HlsjsPlayback.prototype._updateDvr = function _updateDvr(status) {
    this.trigger(_core.Events.PLAYBACK_DVR, status);
    this.trigger(_core.Events.PLAYBACK_STATS_ADD, { 'dvr': status });
  };

  HlsjsPlayback.prototype._updateSettings = function _updateSettings() {
    if (this._playbackType === _core.Playback.VOD) this.settings.left = ['playpause', 'position', 'duration'];else if (this.dvrEnabled) this.settings.left = ['playpause'];else this.settings.left = ['playstop'];

    this.settings.seekEnabled = this.isSeekEnabled();
    this.trigger(_core.Events.PLAYBACK_SETTINGSUPDATE);
  };

  HlsjsPlayback.prototype._onHLSJSError = function _onHLSJSError(evt, data) {
    var error = {
      code: data.type + '_' + data.details,
      description: this.name + ' error: type: ' + data.type + ', details: ' + data.details,
      raw: data
    };
    var formattedError = void 0;
    if (data.response) error.description += ', response: ' + (0, _stringify2.default)(data.response);
    // only report/handle errors if they are fatal
    // hlsjs should automatically handle non fatal errors
    if (data.fatal) {
      if (this._recoverAttemptsRemaining > 0) {
        this._recoverAttemptsRemaining -= 1;
        switch (data.type) {
          case _hls2.default.ErrorTypes.NETWORK_ERROR:
            switch (data.details) {
              // The following network errors cannot be recovered with HLS.startLoad()
              // For more details, see https://github.com/video-dev/hls.js/blob/master/doc/design.md#error-detection-and-handling
              // For "level load" fatal errors, see https://github.com/video-dev/hls.js/issues/1138
              case _hls2.default.ErrorDetails.MANIFEST_LOAD_ERROR:
              case _hls2.default.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
              case _hls2.default.ErrorDetails.MANIFEST_PARSING_ERROR:
              case _hls2.default.ErrorDetails.LEVEL_LOAD_ERROR:
              case _hls2.default.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                _core.Log.error('hlsjs: unrecoverable network fatal error.', { evt: evt, data: data });
                formattedError = this.createError(error);
                this.trigger(_core.Events.PLAYBACK_ERROR, formattedError);
                this.stop();
                break;
              default:
                _core.Log.warn('hlsjs: trying to recover from network error.', { evt: evt, data: data });
                error.level = _core.PlayerError.Levels.WARN;
                this._hls.startLoad();
                break;
            }
            break;
          case _hls2.default.ErrorTypes.MEDIA_ERROR:
            _core.Log.warn('hlsjs: trying to recover from media error.', { evt: evt, data: data });
            error.level = _core.PlayerError.Levels.WARN;
            this._recover(evt, data, error);
            break;
          default:
            _core.Log.error('hlsjs: could not recover from error.', { evt: evt, data: data });
            formattedError = this.createError(error);
            this.trigger(_core.Events.PLAYBACK_ERROR, formattedError);
            this.stop();
            break;
        }
      } else {
        _core.Log.error('hlsjs: could not recover from error after maximum number of attempts.', { evt: evt, data: data });
        formattedError = this.createError(error);
        this.trigger(_core.Events.PLAYBACK_ERROR, formattedError);
        this.stop();
      }
    } else {
      // Transforms HLSJS.ErrorDetails.KEY_LOAD_ERROR non-fatal error to
      // playback fatal error if triggerFatalErrorOnResourceDenied playback
      // option is set. HLSJS.ErrorTypes.KEY_SYSTEM_ERROR are fatal errors
      // and therefore already handled.
      if (this.options.playback.triggerFatalErrorOnResourceDenied && this._keyIsDenied(data)) {
        _core.Log.error('hlsjs: could not load decrypt key.', { evt: evt, data: data });
        formattedError = this.createError(error);
        this.trigger(_core.Events.PLAYBACK_ERROR, formattedError);
        this.stop();
        return;
      }

      error.level = _core.PlayerError.Levels.WARN;
      _core.Log.warn('hlsjs: non-fatal error occurred', { evt: evt, data: data });
    }
  };

  HlsjsPlayback.prototype._keyIsDenied = function _keyIsDenied(data) {
    return data.type === _hls2.default.ErrorTypes.NETWORK_ERROR && data.details === _hls2.default.ErrorDetails.KEY_LOAD_ERROR && data.response && data.response.code >= 400;
  };

  HlsjsPlayback.prototype._onTimeUpdate = function _onTimeUpdate() {
    var update = { current: this.getCurrentTime(), total: this.getDuration(), firstFragDateTime: this.getProgramDateTime() };
    var isSame = this._lastTimeUpdate && update.current === this._lastTimeUpdate.current && update.total === this._lastTimeUpdate.total;
    if (isSame) return;

    this._lastTimeUpdate = update;
    this.trigger(_core.Events.PLAYBACK_TIMEUPDATE, update, this.name);
  };

  HlsjsPlayback.prototype._onDurationChange = function _onDurationChange() {
    var duration = this.getDuration();
    if (this._lastDuration === duration) return;

    this._lastDuration = duration;
    _HTML5Video.prototype._onDurationChange.call(this);
  };

  HlsjsPlayback.prototype._onProgress = function _onProgress() {
    if (!this.el.buffered.length) return;

    var buffered = [];
    var bufferedPos = 0;
    for (var i = 0; i < this.el.buffered.length; i++) {
      buffered = [].concat((0, _toConsumableArray3.default)(buffered), [{
        // for a stream with sliding window dvr something that is buffered my slide off the start of the timeline
        start: Math.max(0, this.el.buffered.start(i) - this._playableRegionStartTime),
        end: Math.max(0, this.el.buffered.end(i) - this._playableRegionStartTime)
      }]);
      if (this.el.currentTime >= buffered[i].start && this.el.currentTime <= buffered[i].end) bufferedPos = i;
    }
    var progress = {
      start: buffered[bufferedPos].start,
      current: buffered[bufferedPos].end,
      total: this.getDuration()
    };
    this.trigger(_core.Events.PLAYBACK_PROGRESS, progress, buffered);
  };

  HlsjsPlayback.prototype.play = function play() {
    if (!this._hls) this._setup();

    _HTML5Video.prototype.play.call(this);
    this._startTimeUpdateTimer();
  };

  HlsjsPlayback.prototype.pause = function pause() {
    if (!this._hls) return;

    _HTML5Video.prototype.pause.call(this);
    if (this.dvrEnabled) this._updateDvr(true);
  };

  HlsjsPlayback.prototype.stop = function stop() {
    this._stopTimeUpdateTimer();
    if (this._hls) {
      _HTML5Video.prototype.stop.call(this);
      this._hls.destroy();
      delete this._hls;
    }
  };

  HlsjsPlayback.prototype.destroy = function destroy() {
    this._stopTimeUpdateTimer();
    if (this._hls) {
      this._hls.destroy();
      delete this._hls;
    }
    _HTML5Video.prototype.destroy.call(this);
  };

  HlsjsPlayback.prototype._updatePlaybackType = function _updatePlaybackType(evt, data) {
    this._playbackType = data.details.live ? _core.Playback.LIVE : _core.Playback.VOD;
    this._onLevelUpdated(evt, data);

    // Live stream subtitle tracks detection hack (may not immediately available)
    if (this._ccTracksUpdated && this._playbackType === _core.Playback.LIVE && this.hasClosedCaptionsTracks) this._onSubtitleLoaded();
  };

  HlsjsPlayback.prototype._fillLevels = function _fillLevels() {
    this._levels = this._hls.levels.map(function (level, index) {
      return { id: index, level: level, label: level.bitrate / 1000 + 'Kbps' };
    });
    this.trigger(_core.Events.PLAYBACK_LEVELS_AVAILABLE, this._levels);
  };

  HlsjsPlayback.prototype._onLevelUpdated = function _onLevelUpdated(evt, data) {
    this._segmentTargetDuration = data.details.targetduration;
    this._playlistType = data.details.type || null;

    var startTimeChanged = false;
    var durationChanged = false;
    var fragments = data.details.fragments;
    var previousPlayableRegionStartTime = this._playableRegionStartTime;
    var previousPlayableRegionDuration = this._playableRegionDuration;

    if (fragments.length === 0) return;

    // #EXT-X-PROGRAM-DATE-TIME
    if (fragments[0].rawProgramDateTime) this._programDateTime = fragments[0].rawProgramDateTime;

    if (this._playableRegionStartTime !== fragments[0].start) {
      startTimeChanged = true;
      this._playableRegionStartTime = fragments[0].start;
    }

    if (startTimeChanged) {
      if (!this._localStartTimeCorrelation) {
        // set the correlation to map to middle of the extrapolation window
        this._localStartTimeCorrelation = {
          local: this._now,
          remote: (fragments[0].start + this._extrapolatedWindowDuration / 2) * 1000
        };
      } else {
        // check if the correlation still works
        var corr = this._localStartTimeCorrelation;
        var timePassed = this._now - corr.local;
        // this should point to a time within the extrapolation window
        var startTime = (corr.remote + timePassed) / 1000;
        if (startTime < fragments[0].start) {
          // our start time is now earlier than the first chunk
          // (maybe the chunk was removed early)
          // reset correlation so that it sits at the beginning of the first available chunk
          this._localStartTimeCorrelation = {
            local: this._now,
            remote: fragments[0].start * 1000
          };
        } else if (startTime > previousPlayableRegionStartTime + this._extrapolatedWindowDuration) {
          // start time was past the end of the old extrapolation window (so would have been capped)
          // see if now that time would be inside the window, and if it would be set the correlation
          // so that it resumes from the time it was at at the end of the old window
          // update the correlation so that the time starts counting again from the value it's on now
          this._localStartTimeCorrelation = {
            local: this._now,
            remote: Math.max(fragments[0].start, previousPlayableRegionStartTime + this._extrapolatedWindowDuration) * 1000
          };
        }
      }
    }

    var newDuration = data.details.totalduration;
    // if it's a live stream then shorten the duration to remove access
    // to the area after hlsjs's live sync point
    // seeks to areas after this point sometimes have issues
    if (this._playbackType === _core.Playback.LIVE) {
      var fragmentTargetDuration = data.details.targetduration;
      var hlsjsConfig = this.options.playback.hlsjsConfig || {};
      var liveSyncDurationCount = hlsjsConfig.liveSyncDurationCount || _hls2.default.DefaultConfig.liveSyncDurationCount;
      var hiddenAreaDuration = fragmentTargetDuration * liveSyncDurationCount;
      if (hiddenAreaDuration <= newDuration) {
        newDuration -= hiddenAreaDuration;
        this._durationExcludesAfterLiveSyncPoint = true;
      } else {
        this._durationExcludesAfterLiveSyncPoint = false;
      }
    }

    if (newDuration !== this._playableRegionDuration) {
      durationChanged = true;
      this._playableRegionDuration = newDuration;
    }

    // Note the end time is not the playableRegionDuration
    // The end time will always increase even if content is removed from the beginning
    var endTime = fragments[0].start + newDuration;
    var previousEndTime = previousPlayableRegionStartTime + previousPlayableRegionDuration;
    var endTimeChanged = endTime !== previousEndTime;
    if (endTimeChanged) {
      if (!this._localEndTimeCorrelation) {
        // set the correlation to map to the end
        this._localEndTimeCorrelation = {
          local: this._now,
          remote: endTime * 1000
        };
      } else {
        // check if the correlation still works
        var _corr = this._localEndTimeCorrelation;
        var _timePassed = this._now - _corr.local;
        // this should point to a time within the extrapolation window from the end
        var extrapolatedEndTime = (_corr.remote + _timePassed) / 1000;
        if (extrapolatedEndTime > endTime) {
          this._localEndTimeCorrelation = {
            local: this._now,
            remote: endTime * 1000
          };
        } else if (extrapolatedEndTime < endTime - this._extrapolatedWindowDuration) {
          // our extrapolated end time is now earlier than the extrapolation window from the actual end time
          // (maybe a chunk became available early)
          // reset correlation so that it sits at the beginning of the extrapolation window from the end time
          this._localEndTimeCorrelation = {
            local: this._now,
            remote: (endTime - this._extrapolatedWindowDuration) * 1000
          };
        } else if (extrapolatedEndTime > previousEndTime) {
          // end time was past the old end time (so would have been capped)
          // set the correlation so that it resumes from the time it was at at the end of the old window
          this._localEndTimeCorrelation = {
            local: this._now,
            remote: previousEndTime * 1000
          };
        }
      }
    }

    // now that the values have been updated call any methods that use on them so they get the updated values
    // immediately
    durationChanged && this._onDurationChange();
    startTimeChanged && this._onProgress();
  };

  HlsjsPlayback.prototype._onFragmentLoaded = function _onFragmentLoaded(evt, data) {
    this.trigger(_core.Events.PLAYBACK_FRAGMENT_LOADED, data);
  };

  HlsjsPlayback.prototype._onSubtitleLoaded = function _onSubtitleLoaded() {
    // This event may be triggered multiple times
    // Setup CC only once (disable CC by default)
    if (!this._ccIsSetup) {
      this.trigger(_core.Events.PLAYBACK_SUBTITLE_AVAILABLE);
      var trackId = this._playbackType === _core.Playback.LIVE ? -1 : this.closedCaptionsTrackId;
      this.closedCaptionsTrackId = trackId;
      this._ccIsSetup = true;
    }
  };

  HlsjsPlayback.prototype._onLevelSwitch = function _onLevelSwitch(evt, data) {
    if (!this.levels.length) this._fillLevels();

    this.trigger(_core.Events.PLAYBACK_LEVEL_SWITCH_END);
    this.trigger(_core.Events.PLAYBACK_LEVEL_SWITCH, data);
    var currentLevel = this._hls.levels[data.level];
    if (currentLevel) {
      // TODO should highDefinition be private and maybe have a read only accessor if it's used somewhere
      this.highDefinition = currentLevel.height >= 720 || currentLevel.bitrate / 1000 >= 2000;
      this.trigger(_core.Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition);
      this.trigger(_core.Events.PLAYBACK_BITRATE, {
        height: currentLevel.height,
        width: currentLevel.width,
        bandwidth: currentLevel.bitrate,
        bitrate: currentLevel.bitrate,
        level: data.level
      });
    }
  };

  HlsjsPlayback.prototype.getPlaybackType = function getPlaybackType() {
    return this._playbackType;
  };

  HlsjsPlayback.prototype.isSeekEnabled = function isSeekEnabled() {
    return this._playbackType === _core.Playback.VOD || this.dvrEnabled;
  };

  (0, _createClass3.default)(HlsjsPlayback, [{
    key: 'dvrEnabled',
    get: function get() {
      // enabled when:
      // - the duration does not include content after hlsjs's live sync point
      // - the playable region duration is longer than the configured duration to enable dvr after
      // - the playback type is LIVE.
      return this._durationExcludesAfterLiveSyncPoint && this._duration >= this._minDvrSize && this.getPlaybackType() === _core.Playback.LIVE;
    }
  }]);
  return HlsjsPlayback;
}(_core.HTML5Video);

exports.default = HlsjsPlayback;


HlsjsPlayback.canPlay = function (resource, mimeType) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || [];
  var isHls = resourceParts.length > 1 && resourceParts[1].toLowerCase() === 'm3u8' || listContainsIgnoreCase(mimeType, ['application/vnd.apple.mpegurl', 'application/x-mpegURL']);

  return !!(_hls2.default.isSupported() && isHls);
};
module.exports = exports['default'];

/***/ }),

/***/ "hls.js":
/*!***************************************************************************************!*\
  !*** external {"amd":"hls.js","commonjs":"hls.js","commonjs2":"hls.js","root":"Hls"} ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_hls_js__;

/***/ })

/******/ });
});
//# sourceMappingURL=hlsjs-playback.external.js.map