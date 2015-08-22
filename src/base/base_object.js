// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {uniqueId} from './utils'
import Events from './events'

/**
 * @class BaseObject
 * @constructor
 * @extends Events
 * @module base
 */
export default class BaseObject extends Events {
  /**
   * @method constructor
   * @param {Object} options
   */
  constructor(options={}) {
    super(options)
    this.uniqueId = uniqueId('o')
  }
  /**
  * a unique id prefixed with `'o'`, `o1, o232`
  *
  * @property uniqueId
  * @type String
  */
}

