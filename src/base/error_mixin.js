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
    !this.name && (this.name = this.constructor && this.constructor.type || 'errorMixin')
    if (!this.playerError) {
      Log.warn(this.name, 'PlayerError is not defined. Error: ', error)
      return error
    }

    const defaultError = {
      description: '',
      level: PlayerError.Levels.FATAL,
      origin: this.name,
      scope: this.name,
      raw: {},
    }

    const errorData = Object.assign({}, defaultError, error, {
      code: `${this.name}:${error && error.code || 'unknown'}`
    })

    this.playerError.error(errorData)

    return errorData
  }
}

export default ErrorMixin
