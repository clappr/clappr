import Log from '../plugins/log'
import PlayerError from '../components/error'

const ErrorMixin = {
  /**
   * creates an error.
   * @method createError
   * @param {Object} error should be an object with code, description, level and raw error.
   * @return {Object} Object with formatted error data including origin and scope
   */
  createError(error) {
    const scope = this.constructor && this.constructor.type || 'errorMixin'
    const origin = this.name || scope

    const defaultError = {
      description: '',
      level: PlayerError.Levels.FATAL,
      origin,
      scope,
      raw: {},
    }

    const errorData = Object.assign({}, defaultError, error, {
      code: `${origin}:${error && error.code || 'unknown'}`
    })

    if (this.playerError)
      this.playerError.error(errorData)
    else
      Log.warn(origin, 'PlayerError is not defined. Error: ', errorData)

    return errorData
  }
}

export default ErrorMixin
