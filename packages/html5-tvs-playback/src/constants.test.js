import { getExtension } from './constants'

describe('Utils', () => {
  describe('getExtension method', () => {
    test('returns source extension from received URL looking for (*.extension) pattern', () => {
      expect(getExtension('http://xpto/asset.mp4')).toEqual('mp4')
      expect(getExtension('http://xpto/asset.m3u8')).toEqual('m3u8')
    })

    test('returns source extension from received URL looking for (*/*.extension/*) pattern', () => {
      expect(getExtension('http://xpto/subfolder.ism/por.ism/manifest')).toEqual('ism')
    })
  })
})
