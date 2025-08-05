import Strings from './strings'

describe('Strings', function () {
  it('translates', function () {
    const fakeCore = { options: { } }
    const strings = new Strings(fakeCore)
    strings._language = function () { return 'en' }

    expect(strings.t('live')).toEqual('live')
  })

  it('fallbacks to English language', function () {
    const fakeCore = { options: { language: '404' } }
    const strings = new Strings(fakeCore)

    expect(strings.t('live')).toEqual('live')
  })

  it('shows key when it does not find the translation', function () {
    const fakeCore = { options: {} }
    const strings = new Strings(fakeCore)

    expect(strings.t('Example')).toEqual('Example')
  })

  it('translates based on user language', function () {
    const fakeCore = { options: { language: 'es' } }
    const strings = new Strings(fakeCore)

    expect(strings.t('live')).toEqual('en directo')
  })

  it('translates based on user options', function () {
    const fakeCore = {
      options: {
        language: 'en',
        strings: {
          'en': {
            'live': 'Company Live'
          }
        }
      }
    }
    const strings = new Strings(fakeCore)

    expect(strings.t('live')).toEqual('Company Live')
  })

  it('merges user translations with default translations', function () {
    const fakeCore = {
      options: {
        language: 'en',
        strings: {
          'en': {
            'live': 'Company Live'
          }
        }
      }
    }
    const strings = new Strings(fakeCore)

    expect(strings.t('back_to_live')).toEqual('back to live')
    expect(strings.t('live')).toEqual('Company Live')
  })

  it('merges user translations with a language not existing in default translations', function () {
    const fakeCore = {
      options: {
        language: 'hu',
        strings: {
          'hu': {
            'live': 'Élő',
            'back_to_live': 'Ugrás élő képre'
          }
        }
      }
    }
    const strings = new Strings(fakeCore)

    expect(strings.t('back_to_live')).toEqual('Ugrás élő képre')
    expect(strings.t('live')).toEqual('Élő')
  })
})
