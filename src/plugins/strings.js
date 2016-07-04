import {getBrowserLanguage} from 'base/utils'

import CorePlugin from 'base/core_plugin'

export default class Strings extends CorePlugin {
  constructor(core) {
    super(core)
    this._initializeMessages()
  }

  t(key) {
    var i18n = this._messages[this._language()] || this._messages['en']
    return i18n[key] || 'nontranslated'
  }

  _language() {return getBrowserLanguage()}

  _initializeMessages() {
    this._messages = this.core.options.strings || {
      'en': {
        'live': 'live',
        'back_to_live': 'back to live'
        'doesnt_support_playback': 'Your browser does not support the playback of this video. Please try using a different browser.'
      },
      'pt': {
        'live': 'ao vivo',
        'back_to_live': 'voltar para o ao vivo'
        'doesnt_support_playback': 'Seu navegador não supporta a reprodução deste video. Por favor, tente usar um navegador diferente.'
      },
      'es': {
        'live': 'vivo',
        'back_to_live': 'volver a vivo'
        'doesnt_support_playback': 'Su navegador no soporta la reproducción de un video. Por favor, trate de usar un navegador diferente.'
      }
    }
    this._messages['pt-BR'] = this._messages['pt']
    this._messages['en-us'] = this._messages['en']
    this._messages['es-419'] = this._messages['es']
  }
}
