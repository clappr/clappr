import Strings from 'plugins/strings'

describe('Strings', function() {
  it('translates', function() {
    var fakeCore = { options: { } }
    var strings = new Strings(fakeCore)
    strings._language = function(){return 'en'}

    expect(strings.t('live')).to.equal('live')
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
})
