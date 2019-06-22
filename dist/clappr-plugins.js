(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("clappr"));
	else if(typeof define === 'function' && define.amd)
		define(["clappr"], factory);
	else if(typeof exports === 'object')
		exports["ClapprPlugins"] = factory(require("clappr"));
	else
		root["ClapprPlugins"] = factory(root["Clappr"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_clappr__) {
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

/***/ "./node_modules/babel-runtime/core-js/json/stringify.js":
/*!**************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/json/stringify.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/json/stringify */ "./node_modules/core-js/library/fn/json/stringify.js"), __esModule: true };

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

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/dvr_controls/public/dvr_controls.scss":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js??ref--5-3!./src/plugins/dvr_controls/public/dvr_controls.scss ***!
  \**************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".dvr-controls[data-dvr-controls] {\n  display: inline-block;\n  float: left;\n  color: #fff;\n  line-height: 32px;\n  font-size: 10px;\n  font-weight: bold;\n  margin-left: 6px; }\n  .dvr-controls[data-dvr-controls] .live-info {\n    cursor: default;\n    font-family: \"Roboto\", \"Open Sans\", Arial, sans-serif;\n    text-transform: uppercase; }\n    .dvr-controls[data-dvr-controls] .live-info:before {\n      content: \"\";\n      display: inline-block;\n      position: relative;\n      width: 7px;\n      height: 7px;\n      border-radius: 3.5px;\n      margin-right: 3.5px;\n      background-color: #ff0101; }\n    .dvr-controls[data-dvr-controls] .live-info.disabled {\n      opacity: 0.3; }\n      .dvr-controls[data-dvr-controls] .live-info.disabled:before {\n        background-color: #fff; }\n  .dvr-controls[data-dvr-controls] .live-button {\n    cursor: pointer;\n    outline: none;\n    display: none;\n    border: 0;\n    color: #fff;\n    background-color: transparent;\n    height: 32px;\n    padding: 0;\n    opacity: 0.7;\n    font-family: \"Roboto\", \"Open Sans\", Arial, sans-serif;\n    text-transform: uppercase;\n    transition: all 0.1s ease; }\n    .dvr-controls[data-dvr-controls] .live-button:before {\n      content: \"\";\n      display: inline-block;\n      position: relative;\n      width: 7px;\n      height: 7px;\n      border-radius: 3.5px;\n      margin-right: 3.5px;\n      background-color: #fff; }\n    .dvr-controls[data-dvr-controls] .live-button:hover {\n      opacity: 1;\n      text-shadow: rgba(255, 255, 255, 0.75) 0 0 5px; }\n\n.dvr .dvr-controls[data-dvr-controls] .live-info {\n  display: none; }\n\n.dvr .dvr-controls[data-dvr-controls] .live-button {\n  display: block; }\n\n.dvr.media-control.live[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] .bar-fill-2[data-seekbar] {\n  background-color: #005aff; }\n\n.media-control.live[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] .bar-fill-2[data-seekbar] {\n  background-color: #ff0101; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/error_screen/public/error_screen.scss":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js??ref--5-3!./src/plugins/error_screen/public/error_screen.scss ***!
  \**************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "div.player-error-screen {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  color: #CCCACA;\n  position: absolute;\n  top: 0;\n  height: 100%;\n  width: 100%;\n  background-color: rgba(0, 0, 0, 0.7);\n  z-index: 2000;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center; }\n  div.player-error-screen__content[data-error-screen] {\n    font-size: 14px;\n    color: #CCCACA;\n    margin-top: 45px; }\n  div.player-error-screen__title[data-error-screen] {\n    font-weight: bold;\n    line-height: 30px;\n    font-size: 18px; }\n  div.player-error-screen__message[data-error-screen] {\n    width: 90%;\n    margin: 0 auto; }\n  div.player-error-screen__code[data-error-screen] {\n    font-size: 13px;\n    margin-top: 15px; }\n  div.player-error-screen__reload {\n    cursor: pointer;\n    width: 30px;\n    margin: 15px auto 0; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/media_control/public/media-control.scss":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js??ref--5-3!./src/plugins/media_control/public/media-control.scss ***!
  \****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/url/escape.js */ "./node_modules/css-loader/lib/url/escape.js");
exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".media-control-notransition {\n  transition: none !important; }\n\n.media-control[data-media-control] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 9999;\n  pointer-events: none; }\n  .media-control[data-media-control].dragging {\n    pointer-events: auto;\n    cursor: -webkit-grabbing !important;\n    cursor: grabbing !important;\n    cursor: url(" + escape(__webpack_require__(/*! ./closed-hand.cur */ "./src/plugins/media_control/public/closed-hand.cur")) + "), move; }\n    .media-control[data-media-control].dragging * {\n      cursor: -webkit-grabbing !important;\n      cursor: grabbing !important;\n      cursor: url(" + escape(__webpack_require__(/*! ./closed-hand.cur */ "./src/plugins/media_control/public/closed-hand.cur")) + "), move; }\n  .media-control[data-media-control] .media-control-background[data-background] {\n    position: absolute;\n    height: 40%;\n    width: 100%;\n    bottom: 0;\n    background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));\n    transition: opacity 0.6s ease-out; }\n  .media-control[data-media-control] .media-control-icon {\n    line-height: 0;\n    letter-spacing: 0;\n    speak: none;\n    color: #fff;\n    opacity: 0.5;\n    vertical-align: middle;\n    text-align: left;\n    transition: all 0.1s ease; }\n  .media-control[data-media-control] .media-control-icon:hover {\n    color: white;\n    opacity: 0.75;\n    text-shadow: rgba(255, 255, 255, 0.8) 0 0 5px; }\n  .media-control[data-media-control].media-control-hide .media-control-background[data-background] {\n    opacity: 0; }\n  .media-control[data-media-control].media-control-hide .media-control-layer[data-controls] {\n    bottom: -50px; }\n    .media-control[data-media-control].media-control-hide .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-scrubber[data-seekbar] {\n      opacity: 0; }\n  .media-control[data-media-control] .media-control-layer[data-controls] {\n    position: absolute;\n    bottom: 7px;\n    width: 100%;\n    height: 32px;\n    font-size: 0;\n    vertical-align: middle;\n    pointer-events: auto;\n    transition: bottom 0.4s ease-out; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-left-panel[data-media-control] {\n      position: absolute;\n      top: 0;\n      left: 4px;\n      height: 100%; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-center-panel[data-media-control] {\n      height: 100%;\n      text-align: center;\n      line-height: 32px; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-right-panel[data-media-control] {\n      position: absolute;\n      top: 0;\n      right: 4px;\n      height: 100%; }\n    .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button {\n      background-color: transparent;\n      border: 0;\n      margin: 0 6px;\n      padding: 0;\n      cursor: pointer;\n      display: inline-block;\n      width: 32px;\n      height: 100%; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button svg {\n        width: 100%;\n        height: 22px; }\n        .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button svg path {\n          fill: white; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button:focus {\n        outline: none; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-play] {\n        float: left;\n        height: 100%; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-pause] {\n        float: left;\n        height: 100%; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-stop] {\n        float: left;\n        height: 100%; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-fullscreen] {\n        float: right;\n        background-color: transparent;\n        border: 0;\n        height: 100%; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-hd-indicator] {\n        background-color: transparent;\n        border: 0;\n        cursor: default;\n        display: none;\n        float: right;\n        height: 100%; }\n        .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-hd-indicator].enabled {\n          display: block;\n          opacity: 1.0; }\n          .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-hd-indicator].enabled:hover {\n            opacity: 1.0;\n            text-shadow: none; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-playpause] {\n        float: left; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-playstop] {\n        float: left; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-position], .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-duration] {\n      display: inline-block;\n      font-size: 10px;\n      color: white;\n      cursor: default;\n      line-height: 32px;\n      position: relative; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-position] {\n      margin: 0 6px 0 7px; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-duration] {\n      color: rgba(255, 255, 255, 0.5);\n      margin-right: 6px; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-duration]:before {\n        content: \"|\";\n        margin-right: 7px; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] {\n      position: absolute;\n      top: -20px;\n      left: 0;\n      display: inline-block;\n      vertical-align: middle;\n      width: 100%;\n      height: 25px;\n      cursor: pointer; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] {\n        width: 100%;\n        height: 1px;\n        position: relative;\n        top: 12px;\n        background-color: #666666; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] .bar-fill-1[data-seekbar] {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 0;\n          height: 100%;\n          background-color: #c2c2c2;\n          transition: all 0.1s ease-out; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] .bar-fill-2[data-seekbar] {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 0;\n          height: 100%;\n          background-color: #005aff;\n          transition: all 0.1s ease-out; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] .bar-hover[data-seekbar] {\n          opacity: 0;\n          position: absolute;\n          top: -3px;\n          width: 5px;\n          height: 7px;\n          background-color: rgba(255, 255, 255, 0.5);\n          transition: opacity 0.1s ease; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar]:hover .bar-background[data-seekbar] .bar-hover[data-seekbar] {\n        opacity: 1; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar].seek-disabled {\n        cursor: default; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar].seek-disabled:hover .bar-background[data-seekbar] .bar-hover[data-seekbar] {\n          opacity: 0; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-scrubber[data-seekbar] {\n        position: absolute;\n        -webkit-transform: translateX(-50%);\n                transform: translateX(-50%);\n        top: 2px;\n        left: 0;\n        width: 20px;\n        height: 20px;\n        opacity: 1;\n        transition: all 0.1s ease-out; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-scrubber[data-seekbar] .bar-scrubber-icon[data-seekbar] {\n          position: absolute;\n          left: 6px;\n          top: 6px;\n          width: 8px;\n          height: 8px;\n          border-radius: 10px;\n          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.2);\n          background-color: white; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] {\n      float: right;\n      display: inline-block;\n      height: 32px;\n      cursor: pointer;\n      margin: 0 6px;\n      box-sizing: border-box; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] {\n        float: left;\n        bottom: 0; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] .drawer-icon[data-volume] {\n          background-color: transparent;\n          border: 0;\n          box-sizing: content-box;\n          width: 32px;\n          height: 32px;\n          opacity: 0.5; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] .drawer-icon[data-volume]:hover {\n            opacity: 0.75; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] .drawer-icon[data-volume] svg {\n            height: 24px;\n            position: relative;\n            top: 3px; }\n            .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] .drawer-icon[data-volume] svg path {\n              fill: white; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] .drawer-icon[data-volume].muted svg {\n            margin-left: 2px; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] {\n        float: left;\n        position: relative;\n        overflow: hidden;\n        top: 6px;\n        width: 42px;\n        height: 18px;\n        padding: 3px 0;\n        transition: width .2s ease-out; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-background[data-volume] {\n          height: 1px;\n          position: relative;\n          top: 7px;\n          margin: 0 3px;\n          background-color: #666666; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-background[data-volume] .bar-fill-1[data-volume] {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 0;\n            height: 100%;\n            background-color: #c2c2c2;\n            transition: all 0.1s ease-out; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-background[data-volume] .bar-fill-2[data-volume] {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 0;\n            height: 100%;\n            background-color: #005aff;\n            transition: all 0.1s ease-out; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-background[data-volume] .bar-hover[data-volume] {\n            opacity: 0;\n            position: absolute;\n            top: -3px;\n            width: 5px;\n            height: 7px;\n            background-color: rgba(255, 255, 255, 0.5);\n            transition: opacity 0.1s ease; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-scrubber[data-volume] {\n          position: absolute;\n          -webkit-transform: translateX(-50%);\n                  transform: translateX(-50%);\n          top: 0px;\n          left: 0;\n          width: 20px;\n          height: 20px;\n          opacity: 1;\n          transition: all 0.1s ease-out; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-scrubber[data-volume] .bar-scrubber-icon[data-volume] {\n            position: absolute;\n            left: 6px;\n            top: 6px;\n            width: 8px;\n            height: 8px;\n            border-radius: 10px;\n            box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.2);\n            background-color: white; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .segmented-bar-element[data-volume] {\n          float: left;\n          width: 4px;\n          padding-left: 2px;\n          height: 12px;\n          opacity: 0.5;\n          box-shadow: inset 2px 0 0 white;\n          transition: -webkit-transform .2s ease-out;\n          transition: transform .2s ease-out;\n          transition: transform .2s ease-out, -webkit-transform .2s ease-out; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .segmented-bar-element[data-volume].fill {\n            box-shadow: inset 2px 0 0 #fff;\n            opacity: 1; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .segmented-bar-element[data-volume]:nth-of-type(1) {\n            padding-left: 0; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .segmented-bar-element[data-volume]:hover {\n            -webkit-transform: scaleY(1.5);\n                    transform: scaleY(1.5); }\n  .media-control[data-media-control].w320 .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume].volume-bar-hide {\n    width: 0;\n    height: 12px;\n    top: 9px;\n    padding: 0; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/poster/public/poster.scss":
/*!**************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js??ref--5-3!./src/plugins/poster/public/poster.scss ***!
  \**************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".player-poster[data-poster] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  z-index: 998;\n  top: 0;\n  left: 0;\n  background-color: #000;\n  background-size: cover;\n  background-repeat: no-repeat;\n  background-position: 50% 50%; }\n  .player-poster[data-poster].clickable {\n    cursor: pointer; }\n  .player-poster[data-poster]:hover .play-wrapper[data-poster] {\n    opacity: 1; }\n  .player-poster[data-poster] .play-wrapper[data-poster] {\n    width: 100%;\n    height: 25%;\n    margin: 0 auto;\n    opacity: 0.75;\n    transition: opacity 0.1s ease; }\n    .player-poster[data-poster] .play-wrapper[data-poster] svg {\n      height: 100%; }\n      .player-poster[data-poster] .play-wrapper[data-poster] svg path {\n        fill: #fff; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/spinner_three_bounce/public/spinner.scss":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js??ref--5-3!./src/plugins/spinner_three_bounce/public/spinner.scss ***!
  \*****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".spinner-three-bounce[data-spinner] {\n  position: absolute;\n  margin: 0 auto;\n  width: 70px;\n  text-align: center;\n  z-index: 999;\n  left: 0;\n  right: 0;\n  margin-left: auto;\n  margin-right: auto;\n  /* center vertically */\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%); }\n  .spinner-three-bounce[data-spinner] > div {\n    width: 18px;\n    height: 18px;\n    background-color: #FFFFFF;\n    border-radius: 100%;\n    display: inline-block;\n    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;\n            animation: bouncedelay 1.4s infinite ease-in-out;\n    /* Prevent first frame from flickering when animation starts */\n    -webkit-animation-fill-mode: both;\n            animation-fill-mode: both; }\n  .spinner-three-bounce[data-spinner] [data-bounce1] {\n    -webkit-animation-delay: -0.32s;\n            animation-delay: -0.32s; }\n  .spinner-three-bounce[data-spinner] [data-bounce2] {\n    -webkit-animation-delay: -0.16s;\n            animation-delay: -0.16s; }\n\n@-webkit-keyframes bouncedelay {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n            transform: scale(0); }\n  40% {\n    -webkit-transform: scale(1);\n            transform: scale(1); } }\n\n@keyframes bouncedelay {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n            transform: scale(0); }\n  40% {\n    -webkit-transform: scale(1);\n            transform: scale(1); } }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/watermark/public/watermark.scss":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/sass-loader/lib/loader.js??ref--5-3!./src/plugins/watermark/public/watermark.scss ***!
  \********************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".clappr-watermark[data-watermark] {\n  position: absolute;\n  min-width: 70px;\n  max-width: 200px;\n  width: 12%;\n  text-align: center;\n  z-index: 10; }\n\n.clappr-watermark[data-watermark] a {\n  outline: none;\n  cursor: pointer; }\n\n.clappr-watermark[data-watermark] img {\n  max-width: 100%; }\n\n.clappr-watermark[data-watermark-bottom-left] {\n  bottom: 10px;\n  left: 10px; }\n\n.clappr-watermark[data-watermark-bottom-right] {\n  bottom: 10px;\n  right: 42px; }\n\n.clappr-watermark[data-watermark-top-left] {\n  top: 10px;\n  left: 10px; }\n\n.clappr-watermark[data-watermark-top-right] {\n  top: 10px;\n  right: 37px; }\n", ""]);

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

/***/ "./node_modules/css-loader/lib/url/escape.js":
/*!***************************************************!*\
  !*** ./node_modules/css-loader/lib/url/escape.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
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

/***/ "./src/icons/01-play.svg":
/*!*******************************!*\
  !*** ./src/icons/01-play.svg ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"#010101\" d=\"M1.425.35L14.575 8l-13.15 7.65V.35z\"></path></svg>"

/***/ }),

/***/ "./src/icons/02-pause.svg":
/*!********************************!*\
  !*** ./src/icons/02-pause.svg ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#010101\" d=\"M1.712 14.76H6.43V1.24H1.71v13.52zm7.86-13.52v13.52h4.716V1.24H9.573z\"></path></svg>"

/***/ }),

/***/ "./src/icons/03-stop.svg":
/*!*******************************!*\
  !*** ./src/icons/03-stop.svg ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#010101\" d=\"M1.712 1.24h12.6v13.52h-12.6z\"></path></svg>"

/***/ }),

/***/ "./src/icons/04-volume.svg":
/*!*********************************!*\
  !*** ./src/icons/04-volume.svg ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#010101\" d=\"M11.5 11h-.002v1.502L7.798 10H4.5V6h3.297l3.7-2.502V4.5h.003V11zM11 4.49L7.953 6.5H5v3h2.953L11 11.51V4.49z\"></path></svg>"

/***/ }),

/***/ "./src/icons/05-mute.svg":
/*!*******************************!*\
  !*** ./src/icons/05-mute.svg ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#010101\" d=\"M9.75 11.51L6.7 9.5H3.75v-3H6.7L9.75 4.49v.664l.497.498V3.498L6.547 6H3.248v4h3.296l3.7 2.502v-2.154l-.497.5v.662zm3-5.165L12.404 6l-1.655 1.653L9.093 6l-.346.345L10.402 8 8.747 9.654l.346.347 1.655-1.653L12.403 10l.348-.346L11.097 8l1.655-1.655z\"></path></svg>"

/***/ }),

/***/ "./src/icons/06-expand.svg":
/*!*********************************!*\
  !*** ./src/icons/06-expand.svg ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"#010101\" d=\"M7.156 8L4 11.156V8.5H3V13h4.5v-1H4.844L8 8.844 7.156 8zM8.5 3v1h2.657L8 7.157 8.846 8 12 4.844V7.5h1V3H8.5z\"></path></svg>"

/***/ }),

/***/ "./src/icons/07-shrink.svg":
/*!*********************************!*\
  !*** ./src/icons/07-shrink.svg ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"#010101\" d=\"M13.5 3.344l-.844-.844L9.5 5.656V3h-1v4.5H13v-1h-2.656L13.5 3.344zM3 9.5h2.656L2.5 12.656l.844.844L6.5 10.344V13h1V8.5H3v1z\"></path></svg>"

/***/ }),

/***/ "./src/icons/08-hd.svg":
/*!*****************************!*\
  !*** ./src/icons/08-hd.svg ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"#010101\" d=\"M5.375 7.062H2.637V4.26H.502v7.488h2.135V8.9h2.738v2.848h2.133V4.26H5.375v2.802zm5.97-2.81h-2.84v7.496h2.798c2.65 0 4.195-1.607 4.195-3.77v-.022c0-2.162-1.523-3.704-4.154-3.704zm2.06 3.758c0 1.21-.81 1.896-2.03 1.896h-.83V6.093h.83c1.22 0 2.03.696 2.03 1.896v.02z\"></path></svg>"

/***/ }),

/***/ "./src/icons/10-reload.svg":
/*!*********************************!*\
  !*** ./src/icons/10-reload.svg ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg fill=\"#FFFFFF\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z\"></path><path d=\"M0 0h24v24H0z\" fill=\"none\"></path></svg>"

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

var _media_control = __webpack_require__(/*! ./plugins/media_control */ "./src/plugins/media_control/index.js");

var _media_control2 = _interopRequireDefault(_media_control);

var _click_to_pause = __webpack_require__(/*! ./plugins/click_to_pause */ "./src/plugins/click_to_pause/index.js");

var _click_to_pause2 = _interopRequireDefault(_click_to_pause);

var _dvr_controls = __webpack_require__(/*! ./plugins/dvr_controls */ "./src/plugins/dvr_controls/index.js");

var _dvr_controls2 = _interopRequireDefault(_dvr_controls);

var _error_screen = __webpack_require__(/*! ./plugins/error_screen */ "./src/plugins/error_screen/index.js");

var _error_screen2 = _interopRequireDefault(_error_screen);

var _favicon = __webpack_require__(/*! ./plugins/favicon */ "./src/plugins/favicon/index.js");

var _favicon2 = _interopRequireDefault(_favicon);

var _poster = __webpack_require__(/*! ./plugins/poster */ "./src/plugins/poster/index.js");

var _poster2 = _interopRequireDefault(_poster);

var _spinner_three_bounce = __webpack_require__(/*! ./plugins/spinner_three_bounce */ "./src/plugins/spinner_three_bounce/index.js");

var _spinner_three_bounce2 = _interopRequireDefault(_spinner_three_bounce);

var _watermark = __webpack_require__(/*! ./plugins/watermark */ "./src/plugins/watermark/index.js");

var _watermark2 = _interopRequireDefault(_watermark);

var _vendor = __webpack_require__(/*! ./vendor */ "./src/vendor/index.js");

var _vendor2 = _interopRequireDefault(_vendor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = "0.3.6"; // Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

exports.default = {
  Plugins: {
    MediaControl: _media_control2.default,
    ClickToPausePlugin: _click_to_pause2.default,
    DVRControls: _dvr_controls2.default,
    ErrorScreen: _error_screen2.default,
    Favicon: _favicon2.default,
    Poster: _poster2.default,
    SpinnerThreeBouncePlugin: _spinner_three_bounce2.default,
    WaterMarkPlugin: _watermark2.default
  },
  Vendor: _vendor2.default,
  version: version
};
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/click_to_pause/click_to_pause.js":
/*!******************************************************!*\
  !*** ./src/plugins/click_to_pause/click_to_pause.js ***!
  \******************************************************/
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

var _clappr = __webpack_require__(/*! clappr */ "clappr");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClickToPausePlugin = function (_ContainerPlugin) {
  (0, _inherits3.default)(ClickToPausePlugin, _ContainerPlugin);
  (0, _createClass3.default)(ClickToPausePlugin, [{
    key: 'name',
    get: function get() {
      return 'click_to_pause';
    }
  }]);

  function ClickToPausePlugin(container) {
    (0, _classCallCheck3.default)(this, ClickToPausePlugin);
    return (0, _possibleConstructorReturn3.default)(this, _ContainerPlugin.call(this, container));
  }

  ClickToPausePlugin.prototype.bindEvents = function bindEvents() {
    this.listenTo(this.container, _clappr.Events.CONTAINER_CLICK, this.click);
    this.listenTo(this.container, _clappr.Events.CONTAINER_SETTINGSUPDATE, this.settingsUpdate);
  };

  ClickToPausePlugin.prototype.click = function click() {
    if (this.container.getPlaybackType() !== _clappr.Playback.LIVE || this.container.isDvrEnabled()) {
      if (this.container.isPlaying()) this.container.pause();else this.container.play();
    }
  };

  ClickToPausePlugin.prototype.settingsUpdate = function settingsUpdate() {
    var pointerEnabled = this.container.getPlaybackType() !== _clappr.Playback.LIVE || this.container.isDvrEnabled();
    if (pointerEnabled === this.pointerEnabled) return;

    var method = pointerEnabled ? 'addClass' : 'removeClass';
    this.container.$el[method]('pointer-enabled');
    this.pointerEnabled = pointerEnabled;
  };

  return ClickToPausePlugin;
}(_clappr.ContainerPlugin); //Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

exports.default = ClickToPausePlugin;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/click_to_pause/index.js":
/*!*********************************************!*\
  !*** ./src/plugins/click_to_pause/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _click_to_pause = __webpack_require__(/*! ./click_to_pause */ "./src/plugins/click_to_pause/click_to_pause.js");

var _click_to_pause2 = _interopRequireDefault(_click_to_pause);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _click_to_pause2.default;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/dvr_controls/dvr_controls.js":
/*!**************************************************!*\
  !*** ./src/plugins/dvr_controls/dvr_controls.js ***!
  \**************************************************/
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

var _clappr = __webpack_require__(/*! clappr */ "clappr");

var _index = __webpack_require__(/*! ./public/index.html */ "./src/plugins/dvr_controls/public/index.html");

var _index2 = _interopRequireDefault(_index);

__webpack_require__(/*! ./public/dvr_controls.scss */ "./src/plugins/dvr_controls/public/dvr_controls.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DVRControls = function (_UICorePlugin) {
  (0, _inherits3.default)(DVRControls, _UICorePlugin);
  (0, _createClass3.default)(DVRControls, [{
    key: 'template',
    get: function get() {
      return (0, _clappr.template)(_index2.default);
    }
  }, {
    key: 'name',
    get: function get() {
      return 'dvr_controls';
    }
  }, {
    key: 'events',
    get: function get() {
      return {
        'click .live-button': 'click'
      };
    }
  }, {
    key: 'attributes',
    get: function get() {
      return {
        'class': 'dvr-controls',
        'data-dvr-controls': ''
      };
    }
  }]);

  function DVRControls(core) {
    (0, _classCallCheck3.default)(this, DVRControls);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UICorePlugin.call(this, core));

    _this.settingsUpdate();
    return _this;
  }

  DVRControls.prototype.bindEvents = function bindEvents() {
    this.listenTo(this.core.mediaControl, _clappr.Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged);
    this.listenTo(this.core.mediaControl, _clappr.Events.MEDIACONTROL_RENDERED, this.settingsUpdate);
    this.listenTo(this.core, _clappr.Events.CORE_OPTIONS_CHANGE, this.render);
    if (this.core.getCurrentContainer()) {
      this.listenToOnce(this.core.getCurrentContainer(), _clappr.Events.CONTAINER_TIMEUPDATE, this.render);
      this.listenTo(this.core.getCurrentContainer(), _clappr.Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.dvrChanged);
    }
  };

  DVRControls.prototype.containerChanged = function containerChanged() {
    this.stopListening();
    this.bindEvents();
  };

  DVRControls.prototype.dvrChanged = function dvrChanged(dvrEnabled) {
    if (this.core.getPlaybackType() !== _clappr.Playback.LIVE) return;
    this.settingsUpdate();
    this.core.mediaControl.$el.addClass('live');
    if (dvrEnabled) {
      this.core.mediaControl.$el.addClass('dvr');
      this.core.mediaControl.$el.find('.media-control-indicator[data-position], .media-control-indicator[data-duration]').hide();
    } else {
      this.core.mediaControl.$el.removeClass('dvr');
    }
  };

  DVRControls.prototype.click = function click() {
    var mediaControl = this.core.mediaControl;
    var container = mediaControl.container;
    if (!container.isPlaying()) container.play();

    if (mediaControl.$el.hasClass('dvr')) container.seek(container.getDuration());
  };

  DVRControls.prototype.settingsUpdate = function settingsUpdate() {
    var _this2 = this;

    this.stopListening();
    this.core.mediaControl.$el.removeClass('live');
    if (this.shouldRender()) {
      this.render();
      this.$el.click(function () {
        return _this2.click();
      });
    }
    this.bindEvents();
  };

  DVRControls.prototype.shouldRender = function shouldRender() {
    var useDvrControls = this.core.options.useDvrControls === undefined || !!this.core.options.useDvrControls;
    return useDvrControls && this.core.getPlaybackType() === _clappr.Playback.LIVE;
  };

  DVRControls.prototype.render = function render() {
    this.$el.html(this.template({
      live: this.core.i18n.t('live'),
      backToLive: this.core.i18n.t('back_to_live')
    }));
    if (this.shouldRender()) {
      this.core.mediaControl.$el.addClass('live');
      this.core.mediaControl.$('.media-control-left-panel[data-media-control]').append(this.$el);
    }
    return this;
  };

  return DVRControls;
}(_clappr.UICorePlugin);

exports.default = DVRControls;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/dvr_controls/index.js":
/*!*******************************************!*\
  !*** ./src/plugins/dvr_controls/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dvr_controls = __webpack_require__(/*! ./dvr_controls */ "./src/plugins/dvr_controls/dvr_controls.js");

var _dvr_controls2 = _interopRequireDefault(_dvr_controls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _dvr_controls2.default;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/dvr_controls/public/dvr_controls.scss":
/*!***********************************************************!*\
  !*** ./src/plugins/dvr_controls/public/dvr_controls.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js??ref--5-3!./dvr_controls.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/dvr_controls/public/dvr_controls.scss");

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

/***/ "./src/plugins/dvr_controls/public/index.html":
/*!****************************************************!*\
  !*** ./src/plugins/dvr_controls/public/index.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"live-info\"><%= live %></div>\n<button type=\"button\" class=\"live-button\" aria-label=\"<%= backToLive %>\"><%= backToLive %></button>\n";

/***/ }),

/***/ "./src/plugins/error_screen/error_screen.js":
/*!**************************************************!*\
  !*** ./src/plugins/error_screen/error_screen.js ***!
  \**************************************************/
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

var _clappr = __webpack_require__(/*! clappr */ "clappr");

var _reload = __webpack_require__(/*! ../../icons/10-reload.svg */ "./src/icons/10-reload.svg");

var _reload2 = _interopRequireDefault(_reload);

var _error_screen = __webpack_require__(/*! ./public/error_screen.html */ "./src/plugins/error_screen/public/error_screen.html");

var _error_screen2 = _interopRequireDefault(_error_screen);

__webpack_require__(/*! ./public/error_screen.scss */ "./src/plugins/error_screen/public/error_screen.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorScreen = function (_UICorePlugin) {
  (0, _inherits3.default)(ErrorScreen, _UICorePlugin);
  (0, _createClass3.default)(ErrorScreen, [{
    key: 'name',
    get: function get() {
      return 'error_screen';
    }
  }, {
    key: 'template',
    get: function get() {
      return (0, _clappr.template)(_error_screen2.default);
    }
  }, {
    key: 'container',
    get: function get() {
      return this.core.getCurrentContainer();
    }
  }, {
    key: 'attributes',
    get: function get() {
      return {
        'class': 'player-error-screen',
        'data-error-screen': ''
      };
    }
  }]);

  function ErrorScreen(core) {
    var _ret;

    (0, _classCallCheck3.default)(this, ErrorScreen);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UICorePlugin.call(this, core));

    if (_this.options.disableErrorScreen) return _ret = _this.disable(), (0, _possibleConstructorReturn3.default)(_this, _ret);
    return _this;
  }

  ErrorScreen.prototype.bindEvents = function bindEvents() {
    this.listenTo(this.core, _clappr.Events.ERROR, this.onError);
    this.listenTo(this.core, _clappr.Events.CORE_ACTIVE_CONTAINER_CHANGED, this.onContainerChanged);
  };

  ErrorScreen.prototype.bindReload = function bindReload() {
    this.reloadButton = this.$el.find('.player-error-screen__reload');
    this.reloadButton && this.reloadButton.on('click', this.reload.bind(this));
  };

  ErrorScreen.prototype.reload = function reload() {
    var _this2 = this;

    this.listenToOnce(this.core, _clappr.Events.CORE_READY, function () {
      return _this2.container.play();
    });
    this.core.load(this.options.sources, this.options.mimeType);
    this.unbindReload();
  };

  ErrorScreen.prototype.unbindReload = function unbindReload() {
    this.reloadButton && this.reloadButton.off('click');
  };

  ErrorScreen.prototype.onContainerChanged = function onContainerChanged() {
    this.err = null;
    this.unbindReload();
    this.hide();
  };

  ErrorScreen.prototype.onError = function onError() {
    var err = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (err.level === _clappr.PlayerError.Levels.FATAL) {
      this.err = err;
      this.container.disableMediaControl();
      this.container.stop();
      this.show();
    }
  };

  ErrorScreen.prototype.show = function show() {
    this.render();
    this.$el.show();
  };

  ErrorScreen.prototype.hide = function hide() {
    this.$el.hide();
  };

  ErrorScreen.prototype.render = function render() {
    if (!this.err) return;

    this.$el.html(this.template({
      title: this.err.UI.title,
      message: this.err.UI.message,
      code: this.err.code,
      icon: this.err.UI.icon || '',
      reloadIcon: _reload2.default
    }));

    this.core.$el.append(this.el);

    this.bindReload();

    return this;
  };

  return ErrorScreen;
}(_clappr.UICorePlugin);

exports.default = ErrorScreen;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/error_screen/index.js":
/*!*******************************************!*\
  !*** ./src/plugins/error_screen/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _error_screen = __webpack_require__(/*! ./error_screen */ "./src/plugins/error_screen/error_screen.js");

var _error_screen2 = _interopRequireDefault(_error_screen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _error_screen2.default;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/error_screen/public/error_screen.html":
/*!***********************************************************!*\
  !*** ./src/plugins/error_screen/public/error_screen.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"player-error-screen__content\" data-error-screen>\n  <% if (icon) { %>\n  <div class=\"player-error-screen__icon\" data-error-screen><%= icon %></div>\n  <% } %>\n  <div class=\"player-error-screen__title\" data-error-screen><%= title %></div>\n  <div class=\"player-error-screen__message\" data-error-screen><%= message %></div>\n  <div class=\"player-error-screen__code\" data-error-screen>Error code: <%= code %></div>\n  <div class=\"player-error-screen__reload\" data-error-screen><%= reloadIcon %></div>\n</div>\n";

/***/ }),

/***/ "./src/plugins/error_screen/public/error_screen.scss":
/*!***********************************************************!*\
  !*** ./src/plugins/error_screen/public/error_screen.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js??ref--5-3!./error_screen.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/error_screen/public/error_screen.scss");

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

/***/ "./src/plugins/favicon/favicon.js":
/*!****************************************!*\
  !*** ./src/plugins/favicon/favicon.js ***!
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

var _clappr = __webpack_require__(/*! clappr */ "clappr");

var _play = __webpack_require__(/*! ../../icons/01-play.svg */ "./src/icons/01-play.svg");

var _play2 = _interopRequireDefault(_play);

var _pause = __webpack_require__(/*! ../../icons/02-pause.svg */ "./src/icons/02-pause.svg");

var _pause2 = _interopRequireDefault(_pause);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oldIcon = (0, _clappr.$)('link[rel="shortcut icon"]');

var Favicon = function (_CorePlugin) {
  (0, _inherits3.default)(Favicon, _CorePlugin);
  (0, _createClass3.default)(Favicon, [{
    key: 'name',
    get: function get() {
      return 'favicon';
    }
  }, {
    key: 'oldIcon',
    get: function get() {
      return oldIcon;
    }
  }]);

  function Favicon(core) {
    (0, _classCallCheck3.default)(this, Favicon);

    var _this = (0, _possibleConstructorReturn3.default)(this, _CorePlugin.call(this, core));

    _this._container = null;
    _this.configure();
    return _this;
  }

  Favicon.prototype.configure = function configure() {
    if (this.core.options.changeFavicon) {
      if (!this.enabled) {
        this.stopListening(this.core, _clappr.Events.CORE_OPTIONS_CHANGE);
        this.enable();
      }
    } else if (this.enabled) {
      this.disable();
      this.listenTo(this.core, _clappr.Events.CORE_OPTIONS_CHANGE, this.configure);
    }
  };

  Favicon.prototype.bindEvents = function bindEvents() {
    this.listenTo(this.core, _clappr.Events.CORE_OPTIONS_CHANGE, this.configure);
    this.listenTo(this.core, _clappr.Events.CORE_ACTIVE_CONTAINER_CHANGED, this.containerChanged);
    this.core.activeContainer && this.containerChanged();
  };

  Favicon.prototype.containerChanged = function containerChanged() {
    this._container && this.stopListening(this._container);
    this._container = this.core.activeContainer;
    this.listenTo(this._container, _clappr.Events.CONTAINER_PLAY, this.setPlayIcon);
    this.listenTo(this._container, _clappr.Events.CONTAINER_PAUSE, this.setPauseIcon);
    this.listenTo(this._container, _clappr.Events.CONTAINER_STOP, this.resetIcon);
    this.listenTo(this._container, _clappr.Events.CONTAINER_ENDED, this.resetIcon);
    this.listenTo(this._container, _clappr.Events.CONTAINER_ERROR, this.resetIcon);
    this.resetIcon();
  };

  Favicon.prototype.disable = function disable() {
    _CorePlugin.prototype.disable.call(this);
    this.resetIcon();
  };

  Favicon.prototype.destroy = function destroy() {
    _CorePlugin.prototype.destroy.call(this);
    this.resetIcon();
  };

  Favicon.prototype.createIcon = function createIcon(svg) {
    var canvas = (0, _clappr.$)('<canvas/>');
    canvas[0].width = 16;
    canvas[0].height = 16;
    var ctx = canvas[0].getContext('2d');
    ctx.fillStyle = '#000';
    var d = (0, _clappr.$)(svg).find('path').attr('d');
    var path = new Path2D(d);
    ctx.fill(path);
    var icon = (0, _clappr.$)('<link rel="shortcut icon" type="image/png"/>');
    icon.attr('href', canvas[0].toDataURL('image/png'));
    return icon;
  };

  Favicon.prototype.setPlayIcon = function setPlayIcon() {
    if (!this.playIcon) this.playIcon = this.createIcon(_play2.default);

    this.changeIcon(this.playIcon);
  };

  Favicon.prototype.setPauseIcon = function setPauseIcon() {
    if (!this.pauseIcon) this.pauseIcon = this.createIcon(_pause2.default);

    this.changeIcon(this.pauseIcon);
  };

  Favicon.prototype.resetIcon = function resetIcon() {
    (0, _clappr.$)('link[rel="shortcut icon"]').remove();
    (0, _clappr.$)('head').append(this.oldIcon);
  };

  Favicon.prototype.changeIcon = function changeIcon(icon) {
    if (icon) {
      (0, _clappr.$)('link[rel="shortcut icon"]').remove();
      (0, _clappr.$)('head').append(icon);
    }
  };

  return Favicon;
}(_clappr.CorePlugin);

exports.default = Favicon;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/favicon/index.js":
/*!**************************************!*\
  !*** ./src/plugins/favicon/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _favicon = __webpack_require__(/*! ./favicon.js */ "./src/plugins/favicon/favicon.js");

var _favicon2 = _interopRequireDefault(_favicon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _favicon2.default;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/media_control/index.js":
/*!********************************************!*\
  !*** ./src/plugins/media_control/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _media_control = __webpack_require__(/*! ./media_control */ "./src/plugins/media_control/media_control.js");

var _media_control2 = _interopRequireDefault(_media_control);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _media_control2.default;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/media_control/media_control.js":
/*!****************************************************!*\
  !*** ./src/plugins/media_control/media_control.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ "./node_modules/babel-runtime/core-js/json/stringify.js");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _vendor = __webpack_require__(/*! ../../vendor */ "./src/vendor/index.js");

var _clappr = __webpack_require__(/*! clappr */ "clappr");

__webpack_require__(/*! ./public/media-control.scss */ "./src/plugins/media_control/public/media-control.scss");

var _mediaControl = __webpack_require__(/*! ./public/media-control.html */ "./src/plugins/media_control/public/media-control.html");

var _mediaControl2 = _interopRequireDefault(_mediaControl);

var _play = __webpack_require__(/*! ../../icons/01-play.svg */ "./src/icons/01-play.svg");

var _play2 = _interopRequireDefault(_play);

var _pause = __webpack_require__(/*! ../../icons/02-pause.svg */ "./src/icons/02-pause.svg");

var _pause2 = _interopRequireDefault(_pause);

var _stop = __webpack_require__(/*! ../../icons/03-stop.svg */ "./src/icons/03-stop.svg");

var _stop2 = _interopRequireDefault(_stop);

var _volume = __webpack_require__(/*! ../../icons/04-volume.svg */ "./src/icons/04-volume.svg");

var _volume2 = _interopRequireDefault(_volume);

var _mute = __webpack_require__(/*! ../../icons/05-mute.svg */ "./src/icons/05-mute.svg");

var _mute2 = _interopRequireDefault(_mute);

var _expand = __webpack_require__(/*! ../../icons/06-expand.svg */ "./src/icons/06-expand.svg");

var _expand2 = _interopRequireDefault(_expand);

var _shrink = __webpack_require__(/*! ../../icons/07-shrink.svg */ "./src/icons/07-shrink.svg");

var _shrink2 = _interopRequireDefault(_shrink);

var _hd = __webpack_require__(/*! ../../icons/08-hd.svg */ "./src/icons/08-hd.svg");

var _hd2 = _interopRequireDefault(_hd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The MediaControl is responsible for displaying the Player controls.
 */

var Config = _clappr.Utils.Config,
    Fullscreen = _clappr.Utils.Fullscreen,
    formatTime = _clappr.Utils.formatTime,
    extend = _clappr.Utils.extend,
    removeArrayItem = _clappr.Utils.removeArrayItem;

var MediaControl = function (_UICorePlugin) {
  (0, _inherits3.default)(MediaControl, _UICorePlugin);
  (0, _createClass3.default)(MediaControl, [{
    key: 'name',
    get: function get() {
      return 'media_control';
    }
  }, {
    key: 'disabled',
    get: function get() {
      var playbackIsNOOP = this.container && this.container.getPlaybackType() === _clappr.Playback.NO_OP;
      return this.userDisabled || playbackIsNOOP;
    }
  }, {
    key: 'container',
    get: function get() {
      return this.core && this.core.activeContainer;
    }
  }, {
    key: 'playback',
    get: function get() {
      return this.core && this.core.activePlayback;
    }
  }, {
    key: 'attributes',
    get: function get() {
      return {
        'class': 'media-control',
        'data-media-control': ''
      };
    }
  }, {
    key: 'events',
    get: function get() {
      return {
        'click [data-play]': 'play',
        'click [data-pause]': 'pause',
        'click [data-playpause]': 'togglePlayPause',
        'click [data-stop]': 'stop',
        'click [data-playstop]': 'togglePlayStop',
        'click [data-fullscreen]': 'toggleFullscreen',
        'click .bar-container[data-seekbar]': 'seek',
        'click .bar-container[data-volume]': 'onVolumeClick',
        'click .drawer-icon[data-volume]': 'toggleMute',
        'mouseenter .drawer-container[data-volume]': 'showVolumeBar',
        'mouseleave .drawer-container[data-volume]': 'hideVolumeBar',
        'mousedown .bar-container[data-volume]': 'startVolumeDrag',
        'mousemove .bar-container[data-volume]': 'mousemoveOnVolumeBar',
        'mousedown .bar-scrubber[data-seekbar]': 'startSeekDrag',
        'mousemove .bar-container[data-seekbar]': 'mousemoveOnSeekBar',
        'mouseleave .bar-container[data-seekbar]': 'mouseleaveOnSeekBar',
        'mouseenter .media-control-layer[data-controls]': 'setUserKeepVisible',
        'mouseleave .media-control-layer[data-controls]': 'resetUserKeepVisible'
      };
    }
  }, {
    key: 'template',
    get: function get() {
      return (0, _clappr.template)(_mediaControl2.default);
    }
  }, {
    key: 'volume',
    get: function get() {
      return this.container && this.container.isReady ? this.container.volume : this.intendedVolume;
    }
  }, {
    key: 'muted',
    get: function get() {
      return this.volume === 0;
    }
  }]);

  function MediaControl(core) {
    (0, _classCallCheck3.default)(this, MediaControl);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UICorePlugin.call(this, core));

    _this.persistConfig = _this.options.persistConfig;
    _this.currentPositionValue = null;
    _this.currentDurationValue = null;
    _this.keepVisible = false;
    _this.fullScreenOnVideoTagSupported = null; // unknown
    _this.setInitialVolume();
    _this.settings = {
      left: ['play', 'stop', 'pause'],
      right: ['volume'],
      default: ['position', 'seekbar', 'duration']
    };
    _this.kibo = new _vendor.Kibo(_this.options.focusElement);
    _this.bindKeyEvents();

    if (_this.container) {
      if (!_clappr.$.isEmptyObject(_this.container.settings)) _this.settings = _clappr.$.extend({}, _this.container.settings);
    } else {
      _this.settings = {};
    }

    _this.userDisabled = false;
    if (_this.container && _this.container.mediaControlDisabled || _this.options.chromeless) _this.disable();

    _this.stopDragHandler = function (event) {
      return _this.stopDrag(event);
    };
    _this.updateDragHandler = function (event) {
      return _this.updateDrag(event);
    };
    (0, _clappr.$)(document).bind('mouseup', _this.stopDragHandler);
    (0, _clappr.$)(document).bind('mousemove', _this.updateDragHandler);
    return _this;
  }

  MediaControl.prototype.getExternalInterface = function getExternalInterface() {
    var _this2 = this;

    return {
      setVolume: this.setVolume,
      getVolume: function getVolume() {
        return _this2.volume;
      }
    };
  };

  MediaControl.prototype.bindEvents = function bindEvents() {
    var _this3 = this;

    this.stopListening();
    this.listenTo(this.core, _clappr.Events.CORE_ACTIVE_CONTAINER_CHANGED, this.onActiveContainerChanged);
    this.listenTo(this.core, _clappr.Events.CORE_MOUSE_MOVE, this.show);
    this.listenTo(this.core, _clappr.Events.CORE_MOUSE_LEAVE, function () {
      return _this3.hide(_this3.options.hideMediaControlDelay);
    });
    this.listenTo(this.core, _clappr.Events.CORE_FULLSCREEN, this.show);
    this.listenTo(this.core, _clappr.Events.CORE_OPTIONS_CHANGE, this.configure);
    _clappr.Mediator.on(this.options.playerId + ':' + _clappr.Events.PLAYER_RESIZE, this.playerResize, this);
    this.bindContainerEvents();
  };

  MediaControl.prototype.bindContainerEvents = function bindContainerEvents() {
    if (!this.container) return;
    this.listenTo(this.container, _clappr.Events.CONTAINER_PLAY, this.changeTogglePlay);
    this.listenTo(this.container, _clappr.Events.CONTAINER_PAUSE, this.changeTogglePlay);
    this.listenTo(this.container, _clappr.Events.CONTAINER_STOP, this.changeTogglePlay);
    this.listenTo(this.container, _clappr.Events.CONTAINER_DBLCLICK, this.toggleFullscreen);
    this.listenTo(this.container, _clappr.Events.CONTAINER_TIMEUPDATE, this.onTimeUpdate);
    this.listenTo(this.container, _clappr.Events.CONTAINER_PROGRESS, this.updateProgressBar);
    this.listenTo(this.container, _clappr.Events.CONTAINER_SETTINGSUPDATE, this.settingsUpdate);
    this.listenTo(this.container, _clappr.Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.settingsUpdate);
    this.listenTo(this.container, _clappr.Events.CONTAINER_HIGHDEFINITIONUPDATE, this.highDefinitionUpdate);
    this.listenTo(this.container, _clappr.Events.CONTAINER_MEDIACONTROL_DISABLE, this.disable);
    this.listenTo(this.container, _clappr.Events.CONTAINER_MEDIACONTROL_ENABLE, this.enable);
    this.listenTo(this.container, _clappr.Events.CONTAINER_ENDED, this.ended);
    this.listenTo(this.container, _clappr.Events.CONTAINER_VOLUME, this.onVolumeChanged);
    this.listenTo(this.container, _clappr.Events.CONTAINER_OPTIONS_CHANGE, this.setInitialVolume);
    if (this.container.playback.el.nodeName.toLowerCase() === 'video') {
      // wait until the metadata has loaded and then check if fullscreen on video tag is supported
      this.listenToOnce(this.container, _clappr.Events.CONTAINER_LOADEDMETADATA, this.onLoadedMetadataOnVideoTag);
    }
  };

  MediaControl.prototype.disable = function disable() {
    this.userDisabled = true;
    this.hide();
    this.unbindKeyEvents();
    this.$el.hide();
  };

  MediaControl.prototype.enable = function enable() {
    if (this.options.chromeless) return;
    this.userDisabled = false;
    this.bindKeyEvents();
    this.show();
  };

  MediaControl.prototype.play = function play() {
    this.container && this.container.play();
  };

  MediaControl.prototype.pause = function pause() {
    this.container && this.container.pause();
  };

  MediaControl.prototype.stop = function stop() {
    this.container && this.container.stop();
  };

  MediaControl.prototype.setInitialVolume = function setInitialVolume() {
    var initialVolume = this.persistConfig ? Config.restore('volume') : 100;
    var options = this.container && this.container.options || this.options;
    this.setVolume(options.mute ? 0 : initialVolume, true);
  };

  MediaControl.prototype.onVolumeChanged = function onVolumeChanged() {
    this.updateVolumeUI();
  };

  MediaControl.prototype.onLoadedMetadataOnVideoTag = function onLoadedMetadataOnVideoTag() {
    var video = this.playback && this.playback.el;
    // video.webkitSupportsFullscreen is deprecated but iOS appears to only use this
    // see https://github.com/clappr/clappr/issues/1127
    if (!Fullscreen.fullscreenEnabled() && video.webkitSupportsFullscreen) {
      this.fullScreenOnVideoTagSupported = true;
      this.settingsUpdate();
    }
  };

  MediaControl.prototype.updateVolumeUI = function updateVolumeUI() {
    // this will be called after a render
    if (!this.rendered) return;

    // update volume bar scrubber/fill on bar mode
    this.$volumeBarContainer.find('.bar-fill-2').css({});
    var containerWidth = this.$volumeBarContainer.width();
    var barWidth = this.$volumeBarBackground.width();
    var offset = (containerWidth - barWidth) / 2.0;
    var pos = barWidth * this.volume / 100.0 + offset;
    this.$volumeBarFill.css({ width: this.volume + '%' });
    this.$volumeBarScrubber.css({ left: pos });

    // update volume bar segments on segmented bar mode
    this.$volumeBarContainer.find('.segmented-bar-element').removeClass('fill');
    var item = Math.ceil(this.volume / 10.0);
    this.$volumeBarContainer.find('.segmented-bar-element').slice(0, item).addClass('fill');
    this.$volumeIcon.html('');
    this.$volumeIcon.removeClass('muted');
    if (!this.muted) {
      this.$volumeIcon.append(_volume2.default);
    } else {
      this.$volumeIcon.append(_mute2.default);
      this.$volumeIcon.addClass('muted');
    }
    this.applyButtonStyle(this.$volumeIcon);
  };

  MediaControl.prototype.changeTogglePlay = function changeTogglePlay() {
    this.$playPauseToggle.html('');
    this.$playStopToggle.html('');
    if (this.container && this.container.isPlaying()) {
      this.$playPauseToggle.append(_pause2.default);
      this.$playStopToggle.append(_stop2.default);
      this.trigger(_clappr.Events.MEDIACONTROL_PLAYING);
    } else {
      this.$playPauseToggle.append(_play2.default);
      this.$playStopToggle.append(_play2.default);
      this.trigger(_clappr.Events.MEDIACONTROL_NOTPLAYING);
      _clappr.Browser.isMobile && this.show();
    }
    this.applyButtonStyle(this.$playPauseToggle);
    this.applyButtonStyle(this.$playStopToggle);
  };

  MediaControl.prototype.mousemoveOnSeekBar = function mousemoveOnSeekBar(event) {
    if (this.settings.seekEnabled) {
      var offsetX = event.pageX - this.$seekBarContainer.offset().left - this.$seekBarHover.width() / 2;
      this.$seekBarHover.css({ left: offsetX });
    }
    this.trigger(_clappr.Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR, event);
  };

  MediaControl.prototype.mouseleaveOnSeekBar = function mouseleaveOnSeekBar(event) {
    this.trigger(_clappr.Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR, event);
  };

  MediaControl.prototype.onVolumeClick = function onVolumeClick(event) {
    this.setVolume(this.getVolumeFromUIEvent(event));
  };

  MediaControl.prototype.mousemoveOnVolumeBar = function mousemoveOnVolumeBar(event) {
    this.draggingVolumeBar && this.setVolume(this.getVolumeFromUIEvent(event));
  };

  MediaControl.prototype.playerResize = function playerResize(size) {
    this.$fullscreenToggle.html('');
    var icon = Fullscreen.isFullscreen() ? _shrink2.default : _expand2.default;
    this.$fullscreenToggle.append(icon);
    this.applyButtonStyle(this.$fullscreenToggle);
    this.$el.find('.media-control').length !== 0 && this.$el.removeClass('w320');
    if (size.width <= 320 || this.options.hideVolumeBar) this.$el.addClass('w320');
  };

  MediaControl.prototype.togglePlayPause = function togglePlayPause() {
    this.container.isPlaying() ? this.container.pause() : this.container.play();
    return false;
  };

  MediaControl.prototype.togglePlayStop = function togglePlayStop() {
    this.container.isPlaying() ? this.container.stop() : this.container.play();
  };

  MediaControl.prototype.startSeekDrag = function startSeekDrag(event) {
    if (!this.settings.seekEnabled) return;
    this.draggingSeekBar = true;
    this.$el.addClass('dragging');
    this.$seekBarLoaded.addClass('media-control-notransition');
    this.$seekBarPosition.addClass('media-control-notransition');
    this.$seekBarScrubber.addClass('media-control-notransition');
    event && event.preventDefault();
  };

  MediaControl.prototype.startVolumeDrag = function startVolumeDrag(event) {
    this.draggingVolumeBar = true;
    this.$el.addClass('dragging');
    event && event.preventDefault();
  };

  MediaControl.prototype.stopDrag = function stopDrag(event) {
    this.draggingSeekBar && this.seek(event);
    this.$el.removeClass('dragging');
    this.$seekBarLoaded.removeClass('media-control-notransition');
    this.$seekBarPosition.removeClass('media-control-notransition');
    this.$seekBarScrubber.removeClass('media-control-notransition dragging');
    this.draggingSeekBar = false;
    this.draggingVolumeBar = false;
  };

  MediaControl.prototype.updateDrag = function updateDrag(event) {
    if (this.draggingSeekBar) {
      event.preventDefault();
      var offsetX = event.pageX - this.$seekBarContainer.offset().left;
      var pos = offsetX / this.$seekBarContainer.width() * 100;
      pos = Math.min(100, Math.max(pos, 0));
      this.setSeekPercentage(pos);
    } else if (this.draggingVolumeBar) {
      event.preventDefault();
      this.setVolume(this.getVolumeFromUIEvent(event));
    }
  };

  MediaControl.prototype.getVolumeFromUIEvent = function getVolumeFromUIEvent(event) {
    var offsetY = event.pageX - this.$volumeBarContainer.offset().left;
    var volumeFromUI = offsetY / this.$volumeBarContainer.width() * 100;
    return volumeFromUI;
  };

  MediaControl.prototype.toggleMute = function toggleMute() {
    this.setVolume(this.muted ? 100 : 0);
  };

  MediaControl.prototype.setVolume = function setVolume(value) {
    var _this4 = this;

    var isInitialVolume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    value = Math.min(100, Math.max(value, 0));
    // this will hold the intended volume
    // it may not actually get set to this straight away
    // if the container is not ready etc
    this.intendedVolume = value;
    this.persistConfig && !isInitialVolume && Config.persist('volume', value);
    var setWhenContainerReady = function setWhenContainerReady() {
      if (_this4.container && _this4.container.isReady) {
        _this4.container.setVolume(value);
      } else {
        _this4.listenToOnce(_this4.container, _clappr.Events.CONTAINER_READY, function () {
          _this4.container.setVolume(value);
        });
      }
    };

    if (!this.container) this.listenToOnce(this, _clappr.Events.MEDIACONTROL_CONTAINERCHANGED, function () {
      return setWhenContainerReady();
    });else setWhenContainerReady();
  };

  MediaControl.prototype.toggleFullscreen = function toggleFullscreen() {
    this.trigger(_clappr.Events.MEDIACONTROL_FULLSCREEN, this.name);
    this.container.fullscreen();
    this.core.toggleFullscreen();
    this.resetUserKeepVisible();
  };

  MediaControl.prototype.onActiveContainerChanged = function onActiveContainerChanged() {
    this.fullScreenOnVideoTagSupported = null;
    this.bindEvents();
    _clappr.Mediator.off(this.options.playerId + ':' + _clappr.Events.PLAYER_RESIZE, this.playerResize, this);
    // set the new container to match the volume of the last one
    this.setInitialVolume();
    this.changeTogglePlay();
    this.bindContainerEvents();
    this.settingsUpdate();
    this.container && this.container.trigger(_clappr.Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.container.isDvrInUse());
    this.container && this.container.mediaControlDisabled && this.disable();
    this.trigger(_clappr.Events.MEDIACONTROL_CONTAINERCHANGED);
  };

  MediaControl.prototype.showVolumeBar = function showVolumeBar() {
    this.hideVolumeId && clearTimeout(this.hideVolumeId);
    this.$volumeBarContainer.removeClass('volume-bar-hide');
  };

  MediaControl.prototype.hideVolumeBar = function hideVolumeBar() {
    var _this5 = this;

    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;

    if (!this.$volumeBarContainer) return;
    if (this.draggingVolumeBar) {
      this.hideVolumeId = setTimeout(function () {
        return _this5.hideVolumeBar();
      }, timeout);
    } else {
      this.hideVolumeId && clearTimeout(this.hideVolumeId);
      this.hideVolumeId = setTimeout(function () {
        return _this5.$volumeBarContainer.addClass('volume-bar-hide');
      }, timeout);
    }
  };

  MediaControl.prototype.ended = function ended() {
    this.changeTogglePlay();
  };

  MediaControl.prototype.updateProgressBar = function updateProgressBar(progress) {
    var loadedStart = progress.start / progress.total * 100;
    var loadedEnd = progress.current / progress.total * 100;
    this.$seekBarLoaded.css({ left: loadedStart + '%', width: loadedEnd - loadedStart + '%' });
  };

  MediaControl.prototype.onTimeUpdate = function onTimeUpdate(timeProgress) {
    if (this.draggingSeekBar) return;
    // TODO why should current time ever be negative?
    var position = timeProgress.current < 0 ? timeProgress.total : timeProgress.current;

    this.currentPositionValue = position;
    this.currentDurationValue = timeProgress.total;
    this.renderSeekBar();
  };

  MediaControl.prototype.renderSeekBar = function renderSeekBar() {
    // this will be triggered as soon as these become available
    if (this.currentPositionValue === null || this.currentDurationValue === null) return;

    // default to 100%
    this.currentSeekBarPercentage = 100;
    if (this.container && (this.container.getPlaybackType() !== _clappr.Playback.LIVE || this.container.isDvrInUse())) this.currentSeekBarPercentage = this.currentPositionValue / this.currentDurationValue * 100;

    this.setSeekPercentage(this.currentSeekBarPercentage);

    var newPosition = formatTime(this.currentPositionValue);
    var newDuration = formatTime(this.currentDurationValue);
    if (newPosition !== this.displayedPosition) {
      this.$position.text(newPosition);
      this.displayedPosition = newPosition;
    }
    if (newDuration !== this.displayedDuration) {
      this.$duration.text(newDuration);
      this.displayedDuration = newDuration;
    }
  };

  MediaControl.prototype.seek = function seek(event) {
    if (!this.settings.seekEnabled) return;
    var offsetX = event.pageX - this.$seekBarContainer.offset().left;
    var pos = offsetX / this.$seekBarContainer.width() * 100;
    pos = Math.min(100, Math.max(pos, 0));
    this.container && this.container.seekPercentage(pos);
    this.setSeekPercentage(pos);
    return false;
  };

  MediaControl.prototype.setKeepVisible = function setKeepVisible() {
    this.keepVisible = true;
  };

  MediaControl.prototype.resetKeepVisible = function resetKeepVisible() {
    this.keepVisible = false;
  };

  MediaControl.prototype.setUserKeepVisible = function setUserKeepVisible() {
    this.userKeepVisible = true;
  };

  MediaControl.prototype.resetUserKeepVisible = function resetUserKeepVisible() {
    this.userKeepVisible = false;
  };

  MediaControl.prototype.isVisible = function isVisible() {
    return !this.$el.hasClass('media-control-hide');
  };

  MediaControl.prototype.show = function show(event) {
    var _this6 = this;

    if (this.disabled) return;

    var timeout = 2000;
    var mousePointerMoved = event && event.clientX !== this.lastMouseX && event.clientY !== this.lastMouseY;
    if (!event || mousePointerMoved || navigator.userAgent.match(/firefox/i)) {
      clearTimeout(this.hideId);
      this.$el.show();
      this.trigger(_clappr.Events.MEDIACONTROL_SHOW, this.name);
      this.container && this.container.trigger(_clappr.Events.CONTAINER_MEDIACONTROL_SHOW, this.name);
      this.$el.removeClass('media-control-hide');
      this.hideId = setTimeout(function () {
        return _this6.hide();
      }, timeout);
      if (event) {
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
      }
    }
    var showing = true;
    this.updateCursorStyle(showing);
  };

  MediaControl.prototype.hide = function hide() {
    var _this7 = this;

    var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (!this.isVisible()) return;

    var timeout = delay || 2000;
    clearTimeout(this.hideId);
    if (!this.disabled && this.options.hideMediaControl === false) return;

    var hasKeepVisibleRequested = this.userKeepVisible || this.keepVisible;
    var hasDraggingAction = this.draggingSeekBar || this.draggingVolumeBar;

    if (!this.disabled && (delay || hasKeepVisibleRequested || hasDraggingAction)) {
      this.hideId = setTimeout(function () {
        return _this7.hide();
      }, timeout);
    } else {
      this.trigger(_clappr.Events.MEDIACONTROL_HIDE, this.name);
      this.container && this.container.trigger(_clappr.Events.CONTAINER_MEDIACONTROL_HIDE, this.name);
      this.$el.addClass('media-control-hide');
      this.hideVolumeBar(0);
      var showing = false;
      this.updateCursorStyle(showing);
    }
  };

  MediaControl.prototype.updateCursorStyle = function updateCursorStyle(showing) {
    if (showing) this.core.$el.removeClass('nocursor');else if (Fullscreen.isFullscreen()) this.core.$el.addClass('nocursor');
  };

  MediaControl.prototype.settingsUpdate = function settingsUpdate() {
    var newSettings = this.getSettings();
    if (newSettings && !this.fullScreenOnVideoTagSupported && !Fullscreen.fullscreenEnabled()) {
      // remove fullscreen from settings if it is present
      newSettings.default && removeArrayItem(newSettings.default, 'fullscreen');
      newSettings.left && removeArrayItem(newSettings.left, 'fullscreen');
      newSettings.right && removeArrayItem(newSettings.right, 'fullscreen');
    }
    var settingsChanged = (0, _stringify2.default)(this.settings) !== (0, _stringify2.default)(newSettings);
    if (settingsChanged) {
      this.settings = newSettings;
      this.render();
    }
  };

  MediaControl.prototype.getSettings = function getSettings() {
    return _clappr.$.extend(true, {}, this.container && this.container.settings);
  };

  MediaControl.prototype.highDefinitionUpdate = function highDefinitionUpdate(isHD) {
    this.isHD = isHD;
    var method = isHD ? 'addClass' : 'removeClass';
    this.$hdIndicator[method]('enabled');
  };

  MediaControl.prototype.createCachedElements = function createCachedElements() {
    var $layer = this.$el.find('.media-control-layer');
    this.$duration = $layer.find('.media-control-indicator[data-duration]');
    this.$fullscreenToggle = $layer.find('button.media-control-button[data-fullscreen]');
    this.$playPauseToggle = $layer.find('button.media-control-button[data-playpause]');
    this.$playStopToggle = $layer.find('button.media-control-button[data-playstop]');
    this.$position = $layer.find('.media-control-indicator[data-position]');
    this.$seekBarContainer = $layer.find('.bar-container[data-seekbar]');
    this.$seekBarHover = $layer.find('.bar-hover[data-seekbar]');
    this.$seekBarLoaded = $layer.find('.bar-fill-1[data-seekbar]');
    this.$seekBarPosition = $layer.find('.bar-fill-2[data-seekbar]');
    this.$seekBarScrubber = $layer.find('.bar-scrubber[data-seekbar]');
    this.$volumeBarContainer = $layer.find('.bar-container[data-volume]');
    this.$volumeContainer = $layer.find('.drawer-container[data-volume]');
    this.$volumeIcon = $layer.find('.drawer-icon[data-volume]');
    this.$volumeBarBackground = this.$el.find('.bar-background[data-volume]');
    this.$volumeBarFill = this.$el.find('.bar-fill-1[data-volume]');
    this.$volumeBarScrubber = this.$el.find('.bar-scrubber[data-volume]');
    this.$hdIndicator = this.$el.find('button.media-control-button[data-hd-indicator]');
    this.resetIndicators();
    this.initializeIcons();
  };

  MediaControl.prototype.resetIndicators = function resetIndicators() {
    this.displayedPosition = this.$position.text();
    this.displayedDuration = this.$duration.text();
  };

  MediaControl.prototype.initializeIcons = function initializeIcons() {
    var $layer = this.$el.find('.media-control-layer');
    $layer.find('button.media-control-button[data-play]').append(_play2.default);
    $layer.find('button.media-control-button[data-pause]').append(_pause2.default);
    $layer.find('button.media-control-button[data-stop]').append(_stop2.default);
    this.$playPauseToggle.append(_play2.default);
    this.$playStopToggle.append(_play2.default);
    this.$volumeIcon.append(_volume2.default);
    this.$fullscreenToggle.append(_expand2.default);
    this.$hdIndicator.append(_hd2.default);
  };

  MediaControl.prototype.setSeekPercentage = function setSeekPercentage(value) {
    value = Math.max(Math.min(value, 100.0), 0);
    // not changed since last update
    if (this.displayedSeekBarPercentage === value) return;

    this.displayedSeekBarPercentage = value;
    this.$seekBarPosition.removeClass('media-control-notransition');
    this.$seekBarScrubber.removeClass('media-control-notransition');
    this.$seekBarPosition.css({ width: value + '%' });
    this.$seekBarScrubber.css({ left: value + '%' });
  };

  MediaControl.prototype.seekRelative = function seekRelative(delta) {
    if (!this.settings.seekEnabled) return;

    var currentTime = this.container.getCurrentTime();
    var duration = this.container.getDuration();
    var position = Math.min(Math.max(currentTime + delta, 0), duration);
    position = Math.min(position * 100 / duration, 100);
    this.container.seekPercentage(position);
  };

  MediaControl.prototype.bindKeyAndShow = function bindKeyAndShow(key, callback) {
    var _this8 = this;

    this.kibo.down(key, function () {
      _this8.show();
      return callback();
    });
  };

  MediaControl.prototype.bindKeyEvents = function bindKeyEvents() {
    var _this9 = this;

    if (_clappr.Browser.isMobile || this.options.disableKeyboardShortcuts) return;

    this.unbindKeyEvents();
    this.kibo = new _vendor.Kibo(this.options.focusElement || this.options.parentElement);
    this.bindKeyAndShow('space', function () {
      return _this9.togglePlayPause();
    });
    this.bindKeyAndShow('left', function () {
      return _this9.seekRelative(-5);
    });
    this.bindKeyAndShow('right', function () {
      return _this9.seekRelative(5);
    });
    this.bindKeyAndShow('shift left', function () {
      return _this9.seekRelative(-10);
    });
    this.bindKeyAndShow('shift right', function () {
      return _this9.seekRelative(10);
    });
    this.bindKeyAndShow('shift ctrl left', function () {
      return _this9.seekRelative(-15);
    });
    this.bindKeyAndShow('shift ctrl right', function () {
      return _this9.seekRelative(15);
    });
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    keys.forEach(function (i) {
      _this9.bindKeyAndShow(i, function () {
        _this9.settings.seekEnabled && _this9.container && _this9.container.seekPercentage(i * 10);
      });
    });
  };

  MediaControl.prototype.unbindKeyEvents = function unbindKeyEvents() {
    if (this.kibo) {
      this.kibo.off('space');
      this.kibo.off('left');
      this.kibo.off('right');
      this.kibo.off('shift left');
      this.kibo.off('shift right');
      this.kibo.off('shift ctrl left');
      this.kibo.off('shift ctrl right');
      this.kibo.off(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
    }
  };

  MediaControl.prototype.parseColors = function parseColors() {
    if (this.options.mediacontrol) {
      this.buttonsColor = this.options.mediacontrol.buttons;
      var seekbarColor = this.options.mediacontrol.seekbar;
      this.$el.find('.bar-fill-2[data-seekbar]').css('background-color', seekbarColor);
      this.$el.find('.media-control-icon svg path').css('fill', this.buttonsColor);
      this.$el.find('.segmented-bar-element[data-volume]').css('boxShadow', 'inset 2px 0 0 ' + this.buttonsColor);
    }
  };

  MediaControl.prototype.applyButtonStyle = function applyButtonStyle(element) {
    this.buttonsColor && element && (0, _clappr.$)(element).find('svg path').css('fill', this.buttonsColor);
  };

  MediaControl.prototype.destroy = function destroy() {
    (0, _clappr.$)(document).unbind('mouseup', this.stopDragHandler);
    (0, _clappr.$)(document).unbind('mousemove', this.updateDragHandler);
    this.unbindKeyEvents();
    this.stopListening();
    _UICorePlugin.prototype.destroy.call(this);
  };

  /**
   * enables to configure the media control after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   */


  MediaControl.prototype.configure = function configure() {
    this.options.chromeless ? this.disable() : this.enable();
    this.trigger(_clappr.Events.MEDIACONTROL_OPTIONS_CHANGE);
  };

  MediaControl.prototype.render = function render() {
    var _this10 = this;

    var timeout = this.options.hideMediaControlDelay || 2000;
    this.settings && this.$el.html(this.template({ settings: this.settings }));
    this.createCachedElements();
    this.$playPauseToggle.addClass('paused');
    this.$playStopToggle.addClass('stopped');

    this.changeTogglePlay();

    if (this.container) {
      this.hideId = setTimeout(function () {
        return _this10.hide();
      }, timeout);
      this.disabled && this.hide();
    }

    // Video volume cannot be changed with Safari on mobile devices
    // Display mute/unmute icon only if Safari version >= 10
    if (_clappr.Browser.isSafari && _clappr.Browser.isMobile) {
      if (_clappr.Browser.version < 10) this.$volumeContainer.css('display', 'none');else this.$volumeBarContainer.css('display', 'none');
    }

    this.$seekBarPosition.addClass('media-control-notransition');
    this.$seekBarScrubber.addClass('media-control-notransition');

    var previousSeekPercentage = 0;
    if (this.displayedSeekBarPercentage) previousSeekPercentage = this.displayedSeekBarPercentage;

    this.displayedSeekBarPercentage = null;
    this.setSeekPercentage(previousSeekPercentage);

    process.nextTick(function () {
      !_this10.settings.seekEnabled && _this10.$seekBarContainer.addClass('seek-disabled');
      !_clappr.Browser.isMobile && !_this10.options.disableKeyboardShortcuts && _this10.bindKeyEvents();
      _this10.playerResize({ width: _this10.options.width, height: _this10.options.height });
      _this10.hideVolumeBar(0);
    });

    this.parseColors();
    this.highDefinitionUpdate(this.isHD);

    this.core.$el.append(this.el);

    this.rendered = true;
    this.updateVolumeUI();
    this.trigger(_clappr.Events.MEDIACONTROL_RENDERED);
    return this;
  };

  return MediaControl;
}(_clappr.UICorePlugin);

exports.default = MediaControl;


MediaControl.extend = function (properties) {
  return extend(MediaControl, properties);
};
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/node-libs-browser/node_modules/process/browser.js */ "./node_modules/node-libs-browser/node_modules/process/browser.js")))

/***/ }),

/***/ "./src/plugins/media_control/public/closed-hand.cur":
/*!**********************************************************!*\
  !*** ./src/plugins/media_control/public/closed-hand.cur ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<%=baseUrl%>/a8c874b93b3d848f39a71260c57e3863.cur";

/***/ }),

/***/ "./src/plugins/media_control/public/media-control.html":
/*!*************************************************************!*\
  !*** ./src/plugins/media_control/public/media-control.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"media-control-background\" data-background></div>\n<div class=\"media-control-layer\" data-controls>\n  <%  var renderBar = function(name) { %>\n      <div class=\"bar-container\" data-<%= name %>>\n        <div class=\"bar-background\" data-<%= name %>>\n          <div class=\"bar-fill-1\" data-<%= name %>></div>\n          <div class=\"bar-fill-2\" data-<%= name %>></div>\n          <div class=\"bar-hover\" data-<%= name %>></div>\n        </div>\n        <div class=\"bar-scrubber\" data-<%= name %>>\n          <div class=\"bar-scrubber-icon\" data-<%= name %>></div>\n        </div>\n      </div>\n  <%  }; %>\n  <%  var renderSegmentedBar = function(name, segments) {\n      segments = segments || 10; %>\n    <div class=\"bar-container\" data-<%= name %>>\n    <% for (var i = 0; i < segments; i++) { %>\n      <div class=\"segmented-bar-element\" data-<%= name %>></div>\n    <% } %>\n    </div>\n  <% }; %>\n  <% var renderDrawer = function(name, renderContent) { %>\n      <div class=\"drawer-container\" data-<%= name %>>\n        <div class=\"drawer-icon-container\" data-<%= name %>>\n          <div class=\"drawer-icon media-control-icon\" data-<%= name %>></div>\n          <span class=\"drawer-text\" data-<%= name %>></span>\n        </div>\n        <% renderContent(name); %>\n      </div>\n  <% }; %>\n  <% var renderIndicator = function(name) { %>\n      <div class=\"media-control-indicator\" data-<%= name %>></div>\n  <% }; %>\n  <% var renderButton = function(name) { %>\n    <button type=\"button\" class=\"media-control-button media-control-icon\" data-<%= name %> aria-label=\"<%= name %>\"></button>\n  <% }; %>\n  <%  var templates = {\n        bar: renderBar,\n        segmentedBar: renderSegmentedBar,\n      };\n      var render = function(settingsList) {\n        settingsList.forEach(function(setting) {\n          if(setting === \"seekbar\") {\n            renderBar(setting);\n          } else if (setting === \"volume\") {\n            renderDrawer(setting, settings.volumeBarTemplate ? templates[settings.volumeBarTemplate] : function(name) { return renderSegmentedBar(name); });\n          } else if (setting === \"duration\" || setting === \"position\") {\n            renderIndicator(setting);\n          } else {\n            renderButton(setting);\n          }\n        });\n      }; %>\n  <% if (settings.default && settings.default.length) { %>\n  <div class=\"media-control-center-panel\" data-media-control>\n    <% render(settings.default); %>\n  </div>\n  <% } %>\n  <% if (settings.left && settings.left.length) { %>\n  <div class=\"media-control-left-panel\" data-media-control>\n    <% render(settings.left); %>\n  </div>\n  <% } %>\n  <% if (settings.right && settings.right.length) { %>\n  <div class=\"media-control-right-panel\" data-media-control>\n    <% render(settings.right); %>\n  </div>\n  <% } %>\n</div>\n";

/***/ }),

/***/ "./src/plugins/media_control/public/media-control.scss":
/*!*************************************************************!*\
  !*** ./src/plugins/media_control/public/media-control.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js??ref--5-3!./media-control.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/media_control/public/media-control.scss");

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

/***/ "./src/plugins/poster/index.js":
/*!*************************************!*\
  !*** ./src/plugins/poster/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _poster = __webpack_require__(/*! ./poster */ "./src/plugins/poster/poster.js");

var _poster2 = _interopRequireDefault(_poster);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _poster2.default;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/poster/poster.js":
/*!**************************************!*\
  !*** ./src/plugins/poster/poster.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

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

var _clappr = __webpack_require__(/*! clappr */ "clappr");

var _poster = __webpack_require__(/*! ./public/poster.html */ "./src/plugins/poster/public/poster.html");

var _poster2 = _interopRequireDefault(_poster);

var _play = __webpack_require__(/*! ../../icons/01-play.svg */ "./src/icons/01-play.svg");

var _play2 = _interopRequireDefault(_play);

__webpack_require__(/*! ./public/poster.scss */ "./src/plugins/poster/public/poster.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var PosterPlugin = function (_UIContainerPlugin) {
  (0, _inherits3.default)(PosterPlugin, _UIContainerPlugin);
  (0, _createClass3.default)(PosterPlugin, [{
    key: 'name',
    get: function get() {
      return 'poster';
    }
  }, {
    key: 'template',
    get: function get() {
      return (0, _clappr.template)(_poster2.default);
    }
  }, {
    key: 'shouldRender',
    get: function get() {
      var showForNoOp = !!(this.options.poster && this.options.poster.showForNoOp);
      return this.container.playback.name !== 'html_img' && (this.container.playback.getPlaybackType() !== _clappr.Playback.NO_OP || showForNoOp);
    }
  }, {
    key: 'attributes',
    get: function get() {
      return {
        'class': 'player-poster',
        'data-poster': ''
      };
    }
  }, {
    key: 'events',
    get: function get() {
      return {
        'click': 'clicked'
      };
    }
  }, {
    key: 'showOnVideoEnd',
    get: function get() {
      return !this.options.poster || this.options.poster.showOnVideoEnd || this.options.poster.showOnVideoEnd === undefined;
    }
  }]);

  function PosterPlugin(container) {
    (0, _classCallCheck3.default)(this, PosterPlugin);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UIContainerPlugin.call(this, container));

    _this.hasStartedPlaying = false;
    _this.playRequested = false;
    _this.render();
    process.nextTick(function () {
      return _this.update();
    });
    return _this;
  }

  PosterPlugin.prototype.bindEvents = function bindEvents() {
    this.listenTo(this.container, _clappr.Events.CONTAINER_STOP, this.onStop);
    this.listenTo(this.container, _clappr.Events.CONTAINER_PLAY, this.onPlay);
    this.listenTo(this.container, _clappr.Events.CONTAINER_STATE_BUFFERING, this.update);
    this.listenTo(this.container, _clappr.Events.CONTAINER_STATE_BUFFERFULL, this.update);
    this.listenTo(this.container, _clappr.Events.CONTAINER_OPTIONS_CHANGE, this.render);
    this.listenTo(this.container, _clappr.Events.CONTAINER_ERROR, this.onError);
    this.showOnVideoEnd && this.listenTo(this.container, _clappr.Events.CONTAINER_ENDED, this.onStop);
  };

  PosterPlugin.prototype.onError = function onError(error) {
    this.hasFatalError = error.level === _clappr.PlayerError.Levels.FATAL;

    if (this.hasFatalError) {
      this.hasStartedPlaying = false;
      this.playRequested = false;
      this.showPlayButton();
    }
  };

  PosterPlugin.prototype.onPlay = function onPlay() {
    this.hasStartedPlaying = true;
    this.update();
  };

  PosterPlugin.prototype.onStop = function onStop() {
    this.hasStartedPlaying = false;
    this.playRequested = false;
    this.update();
  };

  PosterPlugin.prototype.updatePlayButton = function updatePlayButton(show) {
    if (show && (!this.options.chromeless || this.options.allowUserInteraction)) this.showPlayButton();else this.hidePlayButton();
  };

  PosterPlugin.prototype.showPlayButton = function showPlayButton() {
    if (this.hasFatalError && !this.options.disableErrorScreen) return;

    this.$playButton.show();
    this.$el.addClass('clickable');
  };

  PosterPlugin.prototype.hidePlayButton = function hidePlayButton() {
    this.$playButton.hide();
    this.$el.removeClass('clickable');
  };

  PosterPlugin.prototype.clicked = function clicked() {
    if (!this.options.chromeless || this.options.allowUserInteraction) {
      this.playRequested = true;
      this.update();
      this.container.play();
    }
    return false;
  };

  PosterPlugin.prototype.shouldHideOnPlay = function shouldHideOnPlay() {
    // Audio broadcasts should keep the poster up; video should hide poster while playing.
    return !this.container.playback.isAudioOnly;
  };

  PosterPlugin.prototype.update = function update() {
    if (!this.shouldRender) return;

    var showPlayButton = !this.playRequested && !this.hasStartedPlaying && !this.container.buffering;
    this.updatePlayButton(showPlayButton);
    this.updatePoster();
  };

  PosterPlugin.prototype.updatePoster = function updatePoster() {
    if (!this.hasStartedPlaying) this.showPoster();else this.hidePoster();
  };

  PosterPlugin.prototype.showPoster = function showPoster() {
    this.container.disableMediaControl();
    this.$el.show();
  };

  PosterPlugin.prototype.hidePoster = function hidePoster() {
    this.container.enableMediaControl();
    if (this.shouldHideOnPlay()) this.$el.hide();
  };

  PosterPlugin.prototype.render = function render() {
    if (!this.shouldRender) return;

    this.$el.html(this.template());

    var isRegularPoster = this.options.poster && this.options.poster.custom === undefined;

    if (isRegularPoster) {
      var posterUrl = this.options.poster.url || this.options.poster;
      this.$el.css({ 'background-image': 'url(' + posterUrl + ')' });
    } else if (this.options.poster) {
      this.$el.css({ 'background': this.options.poster.custom });
    }

    this.container.$el.append(this.el);
    this.$playWrapper = this.$el.find('.play-wrapper');
    this.$playWrapper.append(_play2.default);
    this.$playButton = this.$playWrapper.find('svg');
    this.$playButton.addClass('poster-icon');
    this.$playButton.attr('data-poster', '');

    var buttonsColor = this.options.mediacontrol && this.options.mediacontrol.buttons;
    if (buttonsColor) this.$el.find('svg path').css('fill', buttonsColor);

    if (this.options.mediacontrol && this.options.mediacontrol.buttons) {
      buttonsColor = this.options.mediacontrol.buttons;
      this.$playButton.css('color', buttonsColor);
    }
    this.update();
    return this;
  };

  return PosterPlugin;
}(_clappr.UIContainerPlugin);

exports.default = PosterPlugin;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/node-libs-browser/node_modules/process/browser.js */ "./node_modules/node-libs-browser/node_modules/process/browser.js")))

/***/ }),

/***/ "./src/plugins/poster/public/poster.html":
/*!***********************************************!*\
  !*** ./src/plugins/poster/public/poster.html ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"play-wrapper\" data-poster></div>\n";

/***/ }),

/***/ "./src/plugins/poster/public/poster.scss":
/*!***********************************************!*\
  !*** ./src/plugins/poster/public/poster.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js??ref--5-3!./poster.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/poster/public/poster.scss");

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

/***/ "./src/plugins/spinner_three_bounce/index.js":
/*!***************************************************!*\
  !*** ./src/plugins/spinner_three_bounce/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _spinner_three_bounce = __webpack_require__(/*! ./spinner_three_bounce */ "./src/plugins/spinner_three_bounce/spinner_three_bounce.js");

var _spinner_three_bounce2 = _interopRequireDefault(_spinner_three_bounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _spinner_three_bounce2.default;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/spinner_three_bounce/public/spinner.html":
/*!**************************************************************!*\
  !*** ./src/plugins/spinner_three_bounce/public/spinner.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div data-bounce1></div><div data-bounce2></div><div data-bounce3></div>\n";

/***/ }),

/***/ "./src/plugins/spinner_three_bounce/public/spinner.scss":
/*!**************************************************************!*\
  !*** ./src/plugins/spinner_three_bounce/public/spinner.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js??ref--5-3!./spinner.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/spinner_three_bounce/public/spinner.scss");

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

/***/ "./src/plugins/spinner_three_bounce/spinner_three_bounce.js":
/*!******************************************************************!*\
  !*** ./src/plugins/spinner_three_bounce/spinner_three_bounce.js ***!
  \******************************************************************/
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

var _clappr = __webpack_require__(/*! clappr */ "clappr");

var _spinner = __webpack_require__(/*! ./public/spinner.html */ "./src/plugins/spinner_three_bounce/public/spinner.html");

var _spinner2 = _interopRequireDefault(_spinner);

__webpack_require__(/*! ./public/spinner.scss */ "./src/plugins/spinner_three_bounce/public/spinner.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SpinnerThreeBouncePlugin = function (_UIContainerPlugin) {
  (0, _inherits3.default)(SpinnerThreeBouncePlugin, _UIContainerPlugin);
  (0, _createClass3.default)(SpinnerThreeBouncePlugin, [{
    key: 'name',
    get: function get() {
      return 'spinner';
    }
  }, {
    key: 'attributes',
    get: function get() {
      return {
        'data-spinner': '',
        'class': 'spinner-three-bounce'
      };
    }
  }]);

  function SpinnerThreeBouncePlugin(container) {
    (0, _classCallCheck3.default)(this, SpinnerThreeBouncePlugin);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UIContainerPlugin.call(this, container));

    _this.template = (0, _clappr.template)(_spinner2.default);
    _this.showTimeout = null;
    _this.listenTo(_this.container, _clappr.Events.CONTAINER_STATE_BUFFERING, _this.onBuffering);
    _this.listenTo(_this.container, _clappr.Events.CONTAINER_STATE_BUFFERFULL, _this.onBufferFull);
    _this.listenTo(_this.container, _clappr.Events.CONTAINER_STOP, _this.onStop);
    _this.listenTo(_this.container, _clappr.Events.CONTAINER_ENDED, _this.onStop);
    _this.listenTo(_this.container, _clappr.Events.CONTAINER_ERROR, _this.onStop);
    _this.render();
    return _this;
  }

  SpinnerThreeBouncePlugin.prototype.onBuffering = function onBuffering() {
    this.show();
  };

  SpinnerThreeBouncePlugin.prototype.onBufferFull = function onBufferFull() {
    this.hide();
  };

  SpinnerThreeBouncePlugin.prototype.onStop = function onStop() {
    this.hide();
  };

  SpinnerThreeBouncePlugin.prototype.show = function show() {
    var _this2 = this;

    if (this.showTimeout === null) this.showTimeout = setTimeout(function () {
      return _this2.$el.show();
    }, 300);
  };

  SpinnerThreeBouncePlugin.prototype.hide = function hide() {
    if (this.showTimeout !== null) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    this.$el.hide();
  };

  SpinnerThreeBouncePlugin.prototype.render = function render() {
    this.$el.html(this.template());
    this.container.$el.append(this.$el);
    this.$el.hide();
    if (this.container.buffering) this.onBuffering();

    return this;
  };

  return SpinnerThreeBouncePlugin;
}(_clappr.UIContainerPlugin); // Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

exports.default = SpinnerThreeBouncePlugin;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/watermark/index.js":
/*!****************************************!*\
  !*** ./src/plugins/watermark/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _watermark = __webpack_require__(/*! ./watermark */ "./src/plugins/watermark/watermark.js");

var _watermark2 = _interopRequireDefault(_watermark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _watermark2.default;
module.exports = exports['default'];

/***/ }),

/***/ "./src/plugins/watermark/public/watermark.html":
/*!*****************************************************!*\
  !*** ./src/plugins/watermark/public/watermark.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"clappr-watermark\" data-watermark data-watermark-<%=position %>>\n<% if(typeof imageLink !== 'undefined') { %>\n<a target=_blank href=\"<%= imageLink %>\">\n<% } %>\n<img src=\"<%= imageUrl %>\">\n<% if(typeof imageLink !== 'undefined') { %>\n</a>\n<% } %>\n</div>\n";

/***/ }),

/***/ "./src/plugins/watermark/public/watermark.scss":
/*!*****************************************************!*\
  !*** ./src/plugins/watermark/public/watermark.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/postcss-loader/lib!../../../../node_modules/sass-loader/lib/loader.js??ref--5-3!./watermark.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js!./node_modules/sass-loader/lib/loader.js?!./src/plugins/watermark/public/watermark.scss");

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

/***/ "./src/plugins/watermark/watermark.js":
/*!********************************************!*\
  !*** ./src/plugins/watermark/watermark.js ***!
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

var _clappr = __webpack_require__(/*! clappr */ "clappr");

var _watermark = __webpack_require__(/*! ./public/watermark.html */ "./src/plugins/watermark/public/watermark.html");

var _watermark2 = _interopRequireDefault(_watermark);

__webpack_require__(/*! ./public/watermark.scss */ "./src/plugins/watermark/public/watermark.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WaterMarkPlugin = function (_UIContainerPlugin) {
  (0, _inherits3.default)(WaterMarkPlugin, _UIContainerPlugin);
  (0, _createClass3.default)(WaterMarkPlugin, [{
    key: 'name',
    get: function get() {
      return 'watermark';
    }
  }, {
    key: 'template',
    get: function get() {
      return (0, _clappr.template)(_watermark2.default);
    }
  }]);

  function WaterMarkPlugin(container) {
    (0, _classCallCheck3.default)(this, WaterMarkPlugin);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UIContainerPlugin.call(this, container));

    _this.configure();
    return _this;
  }

  WaterMarkPlugin.prototype.bindEvents = function bindEvents() {
    this.listenTo(this.container, _clappr.Events.CONTAINER_PLAY, this.onPlay);
    this.listenTo(this.container, _clappr.Events.CONTAINER_STOP, this.onStop);
    this.listenTo(this.container, _clappr.Events.CONTAINER_OPTIONS_CHANGE, this.configure);
  };

  WaterMarkPlugin.prototype.configure = function configure() {
    this.position = this.options.position || 'bottom-right';
    if (this.options.watermark) {
      this.imageUrl = this.options.watermark;
      this.imageLink = this.options.watermarkLink;
      this.render();
    } else {
      this.$el.remove();
    }
  };

  WaterMarkPlugin.prototype.onPlay = function onPlay() {
    if (!this.hidden) this.$el.show();
  };

  WaterMarkPlugin.prototype.onStop = function onStop() {
    this.$el.hide();
  };

  WaterMarkPlugin.prototype.render = function render() {
    this.$el.hide();
    var templateOptions = { position: this.position, imageUrl: this.imageUrl, imageLink: this.imageLink };
    this.$el.html(this.template(templateOptions));
    this.container.$el.append(this.$el);
    return this;
  };

  return WaterMarkPlugin;
}(_clappr.UIContainerPlugin); // Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

exports.default = WaterMarkPlugin;
module.exports = exports['default'];

/***/ }),

/***/ "./src/vendor/index.js":
/*!*****************************!*\
  !*** ./src/vendor/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _kibo = __webpack_require__(/*! ./kibo */ "./src/vendor/kibo.js");

var _kibo2 = _interopRequireDefault(_kibo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { Kibo: _kibo2.default };
module.exports = exports['default'];

/***/ }),

/***/ "./src/vendor/kibo.js":
/*!****************************!*\
  !*** ./src/vendor/kibo.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable */
// Kibo is released under the MIT License. Copyright (c) 2013 marquete.
// see https://github.com/marquete/kibo

var Kibo = function Kibo(element) {
  this.element = element || window.document;
  this.initialize();
};

Kibo.KEY_NAMES_BY_CODE = {
  8: 'backspace', 9: 'tab', 13: 'enter',
  16: 'shift', 17: 'ctrl', 18: 'alt',
  20: 'caps_lock',
  27: 'esc',
  32: 'space',
  37: 'left', 38: 'up', 39: 'right', 40: 'down',
  48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
  65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j',
  75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't',
  85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z', 112: 'f1', 113: 'f2', 114: 'f3',
  115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10', 122: 'f11', 123: 'f12'
};

Kibo.KEY_CODES_BY_NAME = {};
(function () {
  for (var key in Kibo.KEY_NAMES_BY_CODE) {
    if (Object.prototype.hasOwnProperty.call(Kibo.KEY_NAMES_BY_CODE, key)) {
      Kibo.KEY_CODES_BY_NAME[Kibo.KEY_NAMES_BY_CODE[key]] = +key;
    }
  }
})();

Kibo.MODIFIERS = ['shift', 'ctrl', 'alt'];

Kibo.registerEvent = function () {
  if (document.addEventListener) {
    return function (element, eventName, func) {
      element.addEventListener(eventName, func, false);
    };
  } else if (document.attachEvent) {
    return function (element, eventName, func) {
      element.attachEvent('on' + eventName, func);
    };
  }
}();

Kibo.unregisterEvent = function () {
  if (document.removeEventListener) {
    return function (element, eventName, func) {
      element.removeEventListener(eventName, func, false);
    };
  } else if (document.detachEvent) {
    return function (element, eventName, func) {
      element.detachEvent('on' + eventName, func);
    };
  }
}();

Kibo.stringContains = function (string, substring) {
  return string.indexOf(substring) !== -1;
};

Kibo.neatString = function (string) {
  return string.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
};

Kibo.capitalize = function (string) {
  return string.toLowerCase().replace(/^./, function (match) {
    return match.toUpperCase();
  });
};

Kibo.isString = function (what) {
  return Kibo.stringContains(Object.prototype.toString.call(what), 'String');
};

Kibo.arrayIncludes = function () {
  if (Array.prototype.indexOf) {
    return function (haystack, needle) {
      return haystack.indexOf(needle) !== -1;
    };
  } else {
    return function (haystack, needle) {
      for (var i = 0; i < haystack.length; i++) {
        if (haystack[i] === needle) {
          return true;
        }
      }
      return false;
    };
  }
}();

Kibo.extractModifiers = function (keyCombination) {
  var modifiers, i;
  modifiers = [];
  for (i = 0; i < Kibo.MODIFIERS.length; i++) {
    if (Kibo.stringContains(keyCombination, Kibo.MODIFIERS[i])) {
      modifiers.push(Kibo.MODIFIERS[i]);
    }
  }
  return modifiers;
};

Kibo.extractKey = function (keyCombination) {
  var keys, i;
  keys = Kibo.neatString(keyCombination).split(' ');
  for (i = 0; i < keys.length; i++) {
    if (!Kibo.arrayIncludes(Kibo.MODIFIERS, keys[i])) {
      return keys[i];
    }
  }
};

Kibo.modifiersAndKey = function (keyCombination) {
  var result, key;

  if (Kibo.stringContains(keyCombination, 'any')) {
    return Kibo.neatString(keyCombination).split(' ').slice(0, 2).join(' ');
  }

  result = Kibo.extractModifiers(keyCombination);

  key = Kibo.extractKey(keyCombination);
  if (key && !Kibo.arrayIncludes(Kibo.MODIFIERS, key)) {
    result.push(key);
  }

  return result.join(' ');
};

Kibo.keyName = function (keyCode) {
  return Kibo.KEY_NAMES_BY_CODE[keyCode + ''];
};

Kibo.keyCode = function (keyName) {
  return +Kibo.KEY_CODES_BY_NAME[keyName];
};

Kibo.prototype.initialize = function () {
  var i,
      that = this;

  this.lastKeyCode = -1;
  this.lastModifiers = {};
  for (i = 0; i < Kibo.MODIFIERS.length; i++) {
    this.lastModifiers[Kibo.MODIFIERS[i]] = false;
  }

  this.keysDown = { any: [] };
  this.keysUp = { any: [] };
  this.downHandler = this.handler('down');
  this.upHandler = this.handler('up');

  Kibo.registerEvent(this.element, 'keydown', this.downHandler);
  Kibo.registerEvent(this.element, 'keyup', this.upHandler);
  Kibo.registerEvent(window, 'unload', function unloader() {
    Kibo.unregisterEvent(that.element, 'keydown', that.downHandler);
    Kibo.unregisterEvent(that.element, 'keyup', that.upHandler);
    Kibo.unregisterEvent(window, 'unload', unloader);
  });
};

Kibo.prototype.handler = function (upOrDown) {
  var that = this;
  return function (e) {
    var i, registeredKeys, lastModifiersAndKey;

    e = e || window.event;

    that.lastKeyCode = e.keyCode;
    for (i = 0; i < Kibo.MODIFIERS.length; i++) {
      that.lastModifiers[Kibo.MODIFIERS[i]] = e[Kibo.MODIFIERS[i] + 'Key'];
    }
    if (Kibo.arrayIncludes(Kibo.MODIFIERS, Kibo.keyName(that.lastKeyCode))) {
      that.lastModifiers[Kibo.keyName(that.lastKeyCode)] = true;
    }

    registeredKeys = that['keys' + Kibo.capitalize(upOrDown)];

    for (i = 0; i < registeredKeys.any.length; i++) {
      if (registeredKeys.any[i](e) === false && e.preventDefault) {
        e.preventDefault();
      }
    }

    lastModifiersAndKey = that.lastModifiersAndKey();
    if (registeredKeys[lastModifiersAndKey]) {
      for (i = 0; i < registeredKeys[lastModifiersAndKey].length; i++) {
        if (registeredKeys[lastModifiersAndKey][i](e) === false && e.preventDefault) {
          e.preventDefault();
        }
      }
    }
  };
};

Kibo.prototype.registerKeys = function (upOrDown, newKeys, func) {
  var i,
      keys,
      registeredKeys = this['keys' + Kibo.capitalize(upOrDown)];

  if (Kibo.isString(newKeys)) {
    newKeys = [newKeys];
  }

  for (i = 0; i < newKeys.length; i++) {
    keys = newKeys[i];
    keys = Kibo.modifiersAndKey(keys + '');

    if (registeredKeys[keys]) {
      registeredKeys[keys].push(func);
    } else {
      registeredKeys[keys] = [func];
    }
  }

  return this;
};

// jshint maxdepth:5
Kibo.prototype.unregisterKeys = function (upOrDown, newKeys, func) {
  var i,
      j,
      keys,
      registeredKeys = this['keys' + Kibo.capitalize(upOrDown)];

  if (Kibo.isString(newKeys)) {
    newKeys = [newKeys];
  }

  for (i = 0; i < newKeys.length; i++) {
    keys = newKeys[i];
    keys = Kibo.modifiersAndKey(keys + '');

    if (func === null) {
      delete registeredKeys[keys];
    } else {
      if (registeredKeys[keys]) {
        for (j = 0; j < registeredKeys[keys].length; j++) {
          if (String(registeredKeys[keys][j]) === String(func)) {
            registeredKeys[keys].splice(j, 1);
            break;
          }
        }
      }
    }
  }

  return this;
};

Kibo.prototype.off = function (keys) {
  return this.unregisterKeys('down', keys, null);
};

Kibo.prototype.delegate = function (upOrDown, keys, func) {
  return func !== null || func !== undefined ? this.registerKeys(upOrDown, keys, func) : this.unregisterKeys(upOrDown, keys, func);
};

Kibo.prototype.down = function (keys, func) {
  return this.delegate('down', keys, func);
};

Kibo.prototype.up = function (keys, func) {
  return this.delegate('up', keys, func);
};

Kibo.prototype.lastKey = function (modifier) {
  if (!modifier) {
    return Kibo.keyName(this.lastKeyCode);
  }

  return this.lastModifiers[modifier];
};

Kibo.prototype.lastModifiersAndKey = function () {
  var result, i;

  result = [];
  for (i = 0; i < Kibo.MODIFIERS.length; i++) {
    if (this.lastKey(Kibo.MODIFIERS[i])) {
      result.push(Kibo.MODIFIERS[i]);
    }
  }

  if (!Kibo.arrayIncludes(result, this.lastKey())) {
    result.push(this.lastKey());
  }

  return result.join(' ');
};

exports.default = Kibo;
module.exports = exports['default'];

/***/ }),

/***/ "clappr":
/*!******************************************************************************************!*\
  !*** external {"amd":"clappr","commonjs":"clappr","commonjs2":"clappr","root":"Clappr"} ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_clappr__;

/***/ })

/******/ });
});
//# sourceMappingURL=clappr-plugins.js.map