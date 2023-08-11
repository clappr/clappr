import { getBrowserLanguage } from '../../utils'
import $ from 'clappr-zepto'
import CorePlugin from '../../base/core_plugin'

/**
 * The internationalization (i18n) plugin
 * @class Strings
 * @constructor
 * @extends CorePlugin
 * @module plugins
 */
export default class Strings extends CorePlugin {
  get name() { return 'strings' }
  get supportedVersion() { return { min: VERSION } }

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
    const fallbackLang = this._messages['en']
    const i18n = lang && this._messages[lang] || fallbackLang
    return i18n[key] || fallbackLang[key] || key
  }

  _language() { return this.core.options.language || getBrowserLanguage() }

  _initializeMessages() {
    const defaultMessages = {
      'en': {
        'live': 'live',
        'back_to_live': 'back to live',
        'disabled': 'Disabled',
        'playback_not_supported': 'Your browser does not support the playback of this video. Please try using a different browser.',
        'default_error_title': 'Could not play video.',
        'default_error_message': 'There was a problem trying to load the video.',
      },
      'de': {
        'live': 'Live',
        'back_to_live': 'Zurück zum Live-Video',
        'disabled': 'Deaktiviert',
        'playback_not_supported': 'Ihr Browser unterstützt das Playback Verfahren nicht. Bitte vesuchen Sie es mit einem anderen Browser.',
        'default_error_title': 'Video kann nicht abgespielt werden',
        'default_error_message': 'Es gab ein Problem beim Laden des Videos',
      },
      'pt': {
        'live': 'ao vivo',
        'back_to_live': 'voltar para o ao vivo',
        'disabled': 'Desativado',
        'playback_not_supported': 'Seu navegador não suporta a reprodução deste video. Por favor, tente usar um navegador diferente.',
        'default_error_title': 'Não foi possível reproduzir o vídeo.',
        'default_error_message': 'Ocorreu um problema ao tentar carregar o vídeo.',
      },
      'es_am': {
        'live': 'vivo',
        'back_to_live': 'volver en vivo',
        'disabled': 'No disponible',
        'playback_not_supported': 'Su navegador no soporta la reproducción de este video. Por favor, utilice un navegador diferente.',
        'default_error_title': 'No se puede reproducir el video.',
        'default_error_message': 'Se ha producido un error al cargar el video.'
      },
      'es': {
        'live': 'en directo',
        'back_to_live': 'volver al directo',
        'disabled': 'No disponible',
        'playback_not_supported': 'Este navegador no es compatible para reproducir este vídeo. Utilice un navegador diferente.',
        'default_error_title': 'No se puede reproducir el vídeo.',
        'default_error_message': 'Se ha producido un problema al cargar el vídeo.'
      },
      'ru': {
        'live': 'прямой эфир',
        'back_to_live': 'к прямому эфиру',
        'disabled': 'Отключено',
        'playback_not_supported': 'Ваш браузер не поддерживает воспроизведение этого видео. Пожалуйста, попробуйте другой браузер.',
      },
      'bg': {
        'live': 'на живо',
        'back_to_live': 'Върни на живо',
        'disabled': 'Изключено',
        'playback_not_supported': 'Вашият браузър не поддържа възпроизвеждането на това видео. Моля, пробвайте с друг браузър.',
        'default_error_title': 'Видеото не може да се възпроизведе.',
        'default_error_message': 'Възникна проблем при зареждането на видеото.',
      },
      'fr': {
        'live': 'en direct',
        'back_to_live': 'retour au direct',
        'disabled': 'Désactivé',
        'playback_not_supported': 'Votre navigateur ne supporte pas la lecture de cette vidéo. Merci de tenter sur un autre navigateur.',
        'default_error_title': 'Impossible de lire la vidéo.',
        'default_error_message': 'Un problème est survenu lors du chargement de la vidéo.',
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
        'playback_not_supported': 'Teie brauser ei toeta selle video taasesitust. Proovige kasutada muud brauserit.',
      },
      'ar': {
        'live': 'مباشر',
        'back_to_live': 'الرجوع إلى المباشر',
        'disabled': 'معطّل',
        'playback_not_supported': 'المتصفح الذي تستخدمه لا يدعم تشغيل هذا الفيديو. الرجاء إستخدام متصفح آخر.',
        'default_error_title': 'غير قادر الى التشغيل.',
        'default_error_message': 'حدثت مشكلة أثناء تحميل الفيديو.',
      },
      'zh': {
        'live': '直播',
        'back_to_live': '返回直播',
        'disabled': '已禁用',
        'playback_not_supported': '您的浏览器不支持该视频的播放。请尝试使用另一个浏览器。',
        'default_error_title': '无法播放视频。',
        'default_error_message': '在尝试加载视频时出现了问题。',
      },
    }

    this._messages = $.extend(true, defaultMessages, this.core.options.strings || {})
    this._messages['de-DE'] = this._messages['de']
    this._messages['pt-BR'] = this._messages['pt']
    this._messages['en-US'] = this._messages['en']
    this._messages['bg-BG'] = this._messages['bg']
    this._messages['es-419'] = this._messages['es_am']
    this._messages['es-ES'] = this._messages['es']
    this._messages['fr-FR'] = this._messages['fr']
    this._messages['tr-TR'] = this._messages['tr']
    this._messages['et-EE'] = this._messages['et']
    this._messages['ar-IQ'] = this._messages['ar']
    this._messages['zh-CN'] = this._messages['zh']
  }
}
