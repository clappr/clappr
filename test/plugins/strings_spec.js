import Strings from 'plugins/strings'

describe('Strings', function() {
  it('translates', function() {
    var fakeCore = { options: { } }
    var strings = new Strings(fakeCore)
    strings._language = function(){return 'en'}

    expect(strings.t('live')).to.equal('live')
  })

  it('fallbacks to English language', function() {
    var fakeCore = { options: { language: '404' } }
    var strings = new Strings(fakeCore)

    expect(strings.t('live')).to.equal('live')
  })

  it('shows key when it does not find the translation', function() {
    var fakeCore = { options: {} }
    var strings = new Strings(fakeCore)

    expect(strings.t('Example')).to.equal('Example')
  })

  it('translates based on user language', function() {
    var fakeCore = { options: { language: 'es' } }
    var strings = new Strings(fakeCore)

    expect(strings.t('live')).to.equal('vivo')
  })

  it('translates based on user options', function() {
    var fakeCore = {
      options: {
        strings: {
          'en': {
            'live': 'Company Live'
          }
        }
      }
    }
    var strings = new Strings(fakeCore)
    strings._language = function(){return 'en'}

    expect(strings.t('live')).to.equal('Company Live')
  })

  it('merges user translations with default translations', function() {
    var fakeCore = {
      options: {
        language: 'es',
        strings: {
          'en': {
            'live': 'Company Live'
          }
        }
      }
    }
    var strings = new Strings(fakeCore)

    expect(strings.t('live')).to.equal('vivo')
  })
})
