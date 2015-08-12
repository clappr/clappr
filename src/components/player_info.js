// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

class PlayerInfo {
  constructor() {
    this.options = {}
    this.playbackPlugins = []
    this.currentSize = { width: 0, height: 0 }
  }
}

PlayerInfo._players = {}

PlayerInfo.getInstance = (playerId) => {
  return PlayerInfo._players[playerId] || (PlayerInfo._players[playerId] = new PlayerInfo())
}

export default PlayerInfo
