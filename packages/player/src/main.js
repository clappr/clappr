import BaseExports from './base_bundle'

import HLS from '@clappr/hlsjs-playback'

BaseExports.Loader.registerPlayback(HLS)

export default {
  ...BaseExports,
  HLS,
}
