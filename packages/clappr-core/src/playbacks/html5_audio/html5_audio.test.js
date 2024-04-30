import HTML5Audio from './html5_audio'

describe('HTML5Audio playback', function() {
  test('should check if canPlay resource', function() {
    expect(HTML5Audio.canPlay('')).toBeFalsy()
    expect(HTML5Audio.canPlay('resource_without_dots')).toBeFalsy()
    // expect(HTML5Audio.canPlay('http://domain.com/Audio.oga')).toBeTruthy()
    // expect(HTML5Audio.canPlay('http://domain.com/Audio.mp3?query_string=here')).toBeTruthy()
    // expect(HTML5Audio.canPlay('/relative/Audio.oga')).toBeTruthy()
  })
})
