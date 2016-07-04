import {getBrowserLanguage} from 'base/utils'

import CorePlugin from 'base/core_plugin'
import merge from 'lodash.merge'

/**
 * The internationalization (i18n) plugin
 * @class Strings
 * @constructor
 * @extends CorePlugin
 * @module plugins
 */
export default class Strings extends CorePlugin {
  constructor(core) {
    super(core)
    this._initializeMessages()
  }
  /**
   * Gets a translated string for the given key.
   * @method t
   * @param {String} key the key to all messages
   * @return {String} translated label
   */
  t(key) {
    var lang = this._language()
    var i18n = lang && this._messages[lang] || this._messages['en']
    return i18n[key] || key
  }

  _language() {return this.core.options.language || getBrowserLanguage()}

  _initializeMessages() {
    this._messages = merge({
      'en': {
        'live': 'live',
        'back_to_live': 'back to live',
        'playback_not_supported': 'Your browser does not support the playback of this video. Please try using a different browser.'
      },
      'pt': {
        'live': 'ao vivo',
        'back_to_live': 'voltar para o ao vivo',
        'playback_not_supported': 'Seu navegador não supporta a reprodução deste video. Por favor, tente usar um navegador diferente.'
      },
      'es': {
        'live': 'vivo',
        'back_to_live': 'volver en vivo',
        'playback_not_supported': 'Su navegador no soporta la reproducción de un video. Por favor, trate de usar un navegador diferente.'
      }
    }, this.core.options.strings || {})

    this._messages['pt-BR'] = this._messages['pt']
    this._messages['en-us'] = this._messages['en']
    this._messages['es-419'] = this._messages['es']
  }
}
