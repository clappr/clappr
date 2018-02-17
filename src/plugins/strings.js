import { getBrowserLanguage } from '../base/utils'
import $ from 'clappr-zepto'
import CorePlugin from '../base/core_plugin'

/**
 * The internationalization (i18n) plugin
 * @class Strings
 * @constructor
 * @extends CorePlugin
 * @module plugins
 */
export default class Strings extends CorePlugin {
  get name() { return 'strings' }

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

  _language() { return this.core.options.language || getBrowserLanguage() }

  _initializeMessages() {
    const defaultMessages = $.extend(true, {
      'en': {
        'live': 'live',
        'back_to_live': 'back to live',
        'disabled': 'Disabled',
        'playback_not_supported': 'Your browser does not support the playback of this video. Please try using a different browser.'
      },
      'pt': {
        'live': 'ao vivo',
        'back_to_live': 'voltar para o ao vivo',
        'disabled': 'Desativado',
        'playback_not_supported': 'Seu navegador não supporta a reprodução deste video. Por favor, tente usar um navegador diferente.'
      },
      'es': {
        'live': 'vivo',
        'back_to_live': 'volver en vivo',
        'disabled': 'Discapacitado',
        'playback_not_supported': 'Su navegador no soporta la reproducción de un video. Por favor, trate de usar un navegador diferente.'
      },
      'ru': {
        'live': 'прямой эфир',
        'back_to_live': 'к прямому эфиру',
        'disabled': 'Отключено',
        'playback_not_supported': 'Ваш браузер не поддерживает воспроизведение этого видео. Пожалуйста, попробуйте другой браузер.'
      },
      'fr': {
        'live': 'en direct',
        'disabled': 'Désactivé',
        'back_to_live': 'retour au direct',
        'playback_not_supported': 'Votre navigateur ne supporte pas la lecture de cette vidéo. Merci de tenter sur un autre navigateur.'
      },
      'tr': {
        'live': 'canlı',
        'back_to_live': 'canlı yayına dön',
        'disabled': 'Engelli',
        'playback_not_supported': 'Tarayıcınız bu videoyu oynatma desteğine sahip değil. Lütfen farklı bir tarayıcı ile deneyin.',
      },
      'et': {
        'live': 'Otseülekanne',
        'back_to_live': 'Tagasi otseülekande juurde',
        'disabled': 'Keelatud',
        'playback_not_supported': 'Teie brauser ei toeta selle video taasesitust. Proovige kasutada muud brauserit.'
      }
    }, this.core.options.strings || {})

    this._messages = Object.keys(defaultMessages).reduce((messages, lang) => {
      messages[lang] = $.extend({}, defaultMessages[lang])
      return messages
    }, {})

    this._messages['pt-BR'] = this._messages['pt']
    this._messages['en-US'] = this._messages['en']
    this._messages['es-419'] = this._messages['es']
    this._messages['fr-FR'] = this._messages['fr']
    this._messages['tr-TR'] = this._messages['tr']
    this._messages['et-EE'] = this._messages['et']

  }
}
