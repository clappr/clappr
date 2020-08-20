// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/* istanbul ignore file */

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
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null)
        throw new TypeError('"this" is null or not defined')


      let o = Object(this)

      // 2. Let len be ? ToLength(? Get(O, "length")).
      let len = o.length >>> 0

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function')
        throw new TypeError('predicate must be a function')


      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      let thisArg = arguments[1]

      // 5. Let k be 0.
      let k = 0

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        let kValue = o[k]
        if (predicate.call(thisArg, kValue, k, o))
          return kValue

        // e. Increase k by 1.
        k++
      }

      // 7. Return undefined.
      return undefined
    }
  })
}

// polyfills for smart TVs

if (!Object.entries) {
  Object.entries = function( obj ) {
    let ownProps = Object.keys( obj ),
      i = ownProps.length,
      resArray = new Array(i) // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]]

    return resArray
  }
}

if (!Object.values) {
  Object.values = function (obj) {
    let ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i) // preallocate the Array
    while (i--)
      resArray[i] = obj[ownProps[i]]

    return resArray
  }
}

/**
 * Object.assign
 * This polyfill doesn't support symbol properties, since ES5 doesn't have symbols anyway
 *
 * Original source : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    // length of function is 2.
    value: function assign(target, varArgs) { //eslint-disable-line no-unused-vars
      'use strict'
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object')
      }

      let to = Object(target)

      for (let index = 1; index < arguments.length; index++) {
        let nextSource = arguments[index]

        if (nextSource != null) { // Skip over if undefined or null
          for (let nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
    configurable: true
  })
}

// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
    configurable: true,
    writable: true
  });
}
