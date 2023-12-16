/* eslint-disable no-console */

import Log from './log'
import mockConsole from 'jest-mock-console'

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
    beforeEach(() => { this.restoreConsole = mockConsole() })
    afterEach(() => this.restoreConsole())

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

    test('on debug level without passing the level attribute', () => {
      const logger = new Log(Log.LEVEL_DEBUG)
      logger.debug('class test', 'test message.')

      expect(console.log).toHaveBeenCalledWith('%c[debug][class test]', 'color: #0000ff;font-weight: bold; font-size: 13px;', 'test message.')
    })

    test('on info level without passing the level attribute', () => {
      const logger = new Log(Log.LEVEL_INFO)
      logger.info('class test', 'test message.')

      expect(console.log).toHaveBeenCalledWith('%c[info][class test]', 'color: #006600;font-weight: bold; font-size: 13px;', 'test message.')
    })

    test('on warn level without passing the level attribute', () => {
      const logger = new Log(Log.LEVEL_WARN)
      logger.warn('class test', 'test message.')

      expect(console.log).toHaveBeenCalledWith('%c[warn][class test]', 'color: #ff8000;font-weight: bold; font-size: 13px;', 'test message.')
    })

    test('on error level without passing the level attribute', () => {
      const logger = new Log(Log.LEVEL_ERROR)
      logger.error('class test', 'test message.')

      expect(console.log).toHaveBeenCalledWith('%c[error][class test]', 'color: #ff0000;font-weight: bold; font-size: 13px;', 'test message.')
    })
  })

  describe('don\'t print log', function() {
    beforeEach(() => { this.restoreConsole = mockConsole() })
    afterEach(() => this.restoreConsole())

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

  describe('have a static method', function() {
    beforeEach(() => { this.restoreConsole = mockConsole() })
    afterEach(() => this.restoreConsole())

    test('to get one Log instance', () => {
      const logger = Log.getInstance()

      expect(logger instanceof Log).toBeTruthy()

      logger.testReference = true

      let anotherLogger = Log.getInstance()

      expect(anotherLogger).toEqual(logger)
      expect(anotherLogger.testReference).toBeTruthy()
    })

    test('to set one Log level', () => {
      const logger = Log.getInstance()

      expect(logger.level).toEqual(Log.LEVEL_INFO)

      Log.setLevel(Log.LEVEL_WARN)

      expect(logger.level).toEqual(Log.LEVEL_WARN)
    })

    test('to print messages on Log debug level', () => {
      Log.setLevel(Log.LEVEL_DEBUG)
      Log.debug('class test', 'test message.')

      expect(console.log).toHaveBeenCalledWith('%c[debug][class test]', 'color: #0000ff;font-weight: bold; font-size: 13px;', 'test message.')
    })

    test('to print messages on Log info level', () => {
      Log.info('class test', 'test message.')

      expect(console.log).toHaveBeenCalledWith('%c[info][class test]', 'color: #006600;font-weight: bold; font-size: 13px;', 'test message.')
    })

    test('to print messages on Log warn level', () => {
      Log.warn('class test', 'test message.')

      expect(console.log).toHaveBeenCalledWith('%c[warn][class test]', 'color: #ff8000;font-weight: bold; font-size: 13px;', 'test message.')
    })

    test('to print messages on Log error level', () => {
      Log.error('class test', 'test message.')

      expect(console.log).toHaveBeenCalledWith('%c[error][class test]', 'color: #ff0000;font-weight: bold; font-size: 13px;', 'test message.')
    })
  })
})
