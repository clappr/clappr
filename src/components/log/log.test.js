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
})
