import Log from '../plugins/log'
import PlayerError from '../components/error'

const ErrorMixin = {
  /**
   * creates an error.
   * @method createError
   * @param {Object} error should be an object with code, description, level and raw error.
   * @return {Object} Object with formatted error data including origin and scope
   */
  createError(error, options = { useCodePrefix: true }) {
    const scope = this.constructor && this.constructor.type || ''
    const origin = this.name || scope
    const i18n = this.i18n || this.core && this.core.i18n || this.container && this.container.i18n

    const prefixedCode = `${origin}:${error && error.code || 'unknown'}`
    const defaultError = {
      description: '',
      level: PlayerError.Levels.FATAL,
      origin,
      scope,
      raw: {},
    }

    const errorData = Object.assign({}, defaultError, error, {
      code: options.useCodePrefix ? prefixedCode : error.code
    })

    if (i18n && errorData.level == PlayerError.Levels.FATAL && !errorData.UI) {
      const defaultUI = {
        title: i18n.t('default_error_title'),
        message: i18n.t('default_error_message')
      }
      errorData.UI = defaultUI
    }

    if (this.playerError)
      this.playerError.error(errorData)
    else
      Log.warn(origin, 'PlayerError is not defined. Error: ', errorData)

    return errorData
  }
}

export default ErrorMixin
