// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Player = require('./components/player')
var IframePlayer = require('./components/iframe_player')
var Mediator = require('mediator')
var version = require('../package.json').version

global.DEBUG = false

window.Clappr = { Player: Player, Mediator: Mediator, IframePlayer: IframePlayer }
window.Clappr.version = version

module.exports = window.Clappr
