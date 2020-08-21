import Log from './log'

describe('Log', () => {
  test('is created with default level', () => {
    const logger = new Log()

    expect(logger.level).toEqual(Log.LEVEL_INFO)
  })

  test('is created with default offLevel', () => {
    const logger = new Log()

    expect(logger.offLevel).toEqual(Log.LEVEL_ERROR)
  })

  test('have a getter and a setter called level', () => {
    const logger = new Log()

    expect(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(logger), 'level').get).toBeTruthy()
    expect(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(logger), 'level').set).toBeTruthy()
  })

  test('level getter returns current level', () => {
    const logger = new Log(Log.LEVEL_DEBUG)

    expect(logger.level).toEqual(Log.LEVEL_DEBUG)
  })

  test('can configure level after the creation', () => {
    const logger = new Log()
    logger.level = Log.LEVEL_WARN

    expect(logger.level).toEqual(Log.LEVEL_WARN)
  })

  test('can change from current level to offLevel', () => {
    const logger = new Log()

    expect(logger.level).toEqual(Log.LEVEL_INFO)

    logger.onOff()

    expect(logger.level).toEqual(Log.LEVEL_ERROR)
  })

  test('can change from offLevel to current level', () => {
    const logger = new Log()

    expect(logger.level).toEqual(Log.LEVEL_INFO)

    logger.onOff()

    expect(logger.level).toEqual(Log.LEVEL_ERROR)

    logger.onOff()

    expect(logger.level).toEqual(Log.LEVEL_INFO)
  })

  describe('prints log', function() {
    test('indicating level and class with the message', () => {
      const logger = new Log()
      logger.log('class test', Log.LEVEL_ERROR, 'test message.')

      expect(console.log).toHaveBeenCalledWith('%c[error][class test]', 'color: #ff0000;font-weight: bold; font-size: 13px;', 'test message.')
    })

    test('without the class attribute', () => {
      const logger = new Log()
      logger.log('test message.', Log.LEVEL_ERROR, '')

      expect(console.log).toHaveBeenCalledWith('%c[error]', 'color: #ff0000;font-weight: bold; font-size: 13px;', 'test message.')
    })

  })

  describe('don\'t print log', function() {
    test('without the level attribute', () => {
      const logger = new Log()
      logger.log('test message.', '', '')

      expect(console.log).not.toHaveBeenCalled()
    })

    test('if the message is registered on the block list', () => {
      const logger = new Log()
      logger.log('class test', Log.LEVEL_ERROR, ['timeupdate'])

      expect(console.log).not.toHaveBeenCalled()
    })
  })
})
