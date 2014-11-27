// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Player = require('./components/player')
var Mediator = require('mediator')

global.DEBUG = false

window.Clappr = { Player: Player, Mediator: Mediator }

module.exports = window.Clappr
