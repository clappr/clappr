import HTMLImg from './html_img'

describe('HTMLImg playback', () => {
  test('checks if it can play an image resource', () => {
    expect(HTMLImg.canPlay('http://example.com/poster.png')).toBeTruthy()
    expect(HTMLImg.canPlay('http://example.com/poster.jpg?x=1')).toBeTruthy()
    expect(HTMLImg.canPlay('http://example.com/video.mp4')).toBeFalsy()
    expect(HTMLImg.canPlay('resource_without_dots')).toBeFalsy()
  })
})
