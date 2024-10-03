import HTML5Audio from './html5_audio'
import Playback from '../../base/playback/playback'

describe('HTML5Audio playback', function () {
  test('should return false for invalid resources', function () {
    expect(HTML5Audio.canPlay('')).toBeFalsy()
    expect(HTML5Audio.canPlay('resource_without_dots')).toBeFalsy()
    expect(HTML5Audio.canPlay('invalid_format.txt')).toBeFalsy()
    expect(HTML5Audio.canPlay('http://domain.com/audio.mp4')).toBeFalsy()
  })

  test('should return true for valid resources', function () {
    const audio = new Audio()
    const canPlayOga = audio.canPlayType('audio/ogg') !== ''
    const canPlayMp3 = audio.canPlayType('audio/mp3') !== ''
    const canPlayAac = audio.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== ''
    const canPlayWav = audio.canPlayType('audio/wav') !== ''

    if (canPlayOga) {
      expect(HTML5Audio.canPlay('http://domain.com/Audio.oga')).toBeTruthy()
      expect(HTML5Audio.canPlay('/relative/Audio.oga')).toBeTruthy()
    }

    if (canPlayMp3) {
      expect(HTML5Audio.canPlay('http://domain.com/Audio.mp3')).toBeTruthy()
      expect(HTML5Audio.canPlay('http://domain.com/Audio.mp3?query_string=here')).toBeTruthy()
      expect(HTML5Audio.canPlay('http://domain.com/audio file.mp3')).toBeTruthy()
      expect(HTML5Audio.canPlay('http://domain.com/audio%20file.mp3')).toBeTruthy()
      expect(HTML5Audio.canPlay('http://domain.com/audio.mp3#fragment')).toBeTruthy()
    }

    if (canPlayAac)
      expect(HTML5Audio.canPlay('http://domain.com/Audio.aac')).toBeTruthy()

    if (canPlayWav)
      expect(HTML5Audio.canPlay('http://domain.com/Audio.wav')).toBeTruthy()
  })

  test('should return AOD', function () {
    const audioInstance = new HTML5Audio()
    expect(audioInstance.getPlaybackType()).toBe(Playback.AOD)
  })

  test('should return html5_audio', function () {
    const audioInstance = new HTML5Audio()
    expect(audioInstance.name).toBe('html5_audio')
  })

  test('should return min version', function () {
    const audioInstance = new HTML5Audio()
    expect(audioInstance.supportedVersion).toEqual({ min: VERSION })
  })

  test('should return audio', function () {
    const audioInstance = new HTML5Audio()
    expect(audioInstance.tagName).toBe('audio')
  })

  test('should return true', function () {
    const audioInstance = new HTML5Audio()
    expect(audioInstance.isAudioOnly).toBeTruthy()
  })

  test('should update settings', function () {
    const audioElementMock = {
      _duration: 10,
      get duration() {
        return this._duration
      },
    }

    const audioInstance = new HTML5Audio()
    audioInstance.el = audioElementMock

    audioInstance.updateSettings()
    expect(audioInstance.settings.left).toEqual(['playpause', 'position', 'duration'])
    expect(audioInstance.settings.seekEnabled).toBeTruthy()
  })
})
