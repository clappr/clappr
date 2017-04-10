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
  get name() {return 'strings'}

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
    const lang = this._language()
    const i18n = lang && this._messages[lang] || this._messages['en']
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
      },
      'ru': {
        'live': 'прямой эфир',
        'back_to_live': 'к прямому эфиру',
        'playback_not_supported': 'Ваш браузер не поддерживает воспроизведение этого видео. Пожалуйста, попробуйте другой браузер.'
      },
      'fr': {
        'live': 'en direct',
        'back_to_live': 'retour au direct',
        'playback_not_supported': 'Votre navigateur ne supporte pas la lecture de cette vidéo. Merci de tenter sur un autre navigateur.'
      },
      'tr': {
        'live': 'canlı',
        'back_to_live': 'canlı yayına dön',
        'playback_not_supported': 'Tarayıcınız bu videoyu oynatma desteğine sahip değil. Lütfen farklı bir tarayıcı ile deneyin.',
      }
    }, this.core.options.strings || {})

    this._messages['pt-BR'] = this._messages['pt']
    this._messages['en-US'] = this._messages['en']
    this._messages['es-419'] = this._messages['es']
    this._messages['fr-FR'] = this._messages['fr']
    this._messages['tr-TR'] = this._messages['tr']
  }
}
