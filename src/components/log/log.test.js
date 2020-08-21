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

})
