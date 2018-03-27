import Events from '../../base/events'
import BaseObject from '../../base/base_object'

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
  get Levels() {
    return {
      FATAL: 'FATAL',
      WARN: 'WARN'
    }
  }

  constructor(options={}) {
    super(options)
  }

  /**
   * creates and trigger an error.
   * @method error
   * @param {Object} err should be an object with code, description, level, origin, scope and raw error.
   */
  error(err) {
    this.core.trigger(Events.ERROR, err)
  }

  setCore(core) {
    this.core = core
  }

}

const playerError = new PlayerError()

export default playerError
