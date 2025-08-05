import Events from '../../base/events/events'
import BaseObject from '../../base/base_object/base_object'
import Log from '../log/log'

/**
 * The PlayerError is responsible to receive and propagate errors.
 * @class PlayerError
 * @constructor
 * @extends BaseObject
 * @module components
 */
class PlayerError extends BaseObject {
  get name() { return 'error' }

  /**
   * @property Levels
   * @type {Object} object with error levels
   */
  static get Levels() {
    return {
      FATAL: 'FATAL',
      WARN: 'WARN',
      INFO: 'INFO'
    }
  }

  constructor(options = {}, core) {
    super(options)
    this.core = core
  }

  /**
   * creates and trigger an error.
   * @method createError
   * @param {Object} err should be an object with code, description, level, origin, scope and raw error.
   */
  createError(err) {
    if (!this.core) {
      Log.warn(this.name, 'Core is not set. Error: ', err)
      return
    }
    this.core.trigger(Events.ERROR, err)
  }
}

export default PlayerError
