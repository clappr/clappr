var Playback = require('../base/playback')

class NoOp extends Playback {

}

NoOp.canPlay = (source) => {
  return true
}

module.exports = NoOp
