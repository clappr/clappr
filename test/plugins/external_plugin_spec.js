import Clappr from '../../src/main'

describe('External Plugin', function() {
  it('should expose extend method for the plugins exposed on Clappr scope', function(){
    let MyPluginClass
    let myPluginInstance
    let nativePluginInstance
    const testMethod = function() {
      return 'test'
    }

    const core = {options: {}}
    const container = {options: {}}

    MyPluginClass = Clappr.Playback.extend({testMethod: testMethod})
    myPluginInstance = new MyPluginClass()
    nativePluginInstance = new Clappr.Playback()
    expect(myPluginInstance.play).to.be.equal(nativePluginInstance.play)
    expect(myPluginInstance.stop).to.be.equal(nativePluginInstance.stop)
    expect(myPluginInstance.testMethod).to.be.equal(testMethod)
    expect(MyPluginClass.type).to.be.equal('playback')

    MyPluginClass = Clappr.ContainerPlugin.extend({testMethod: testMethod})
    myPluginInstance = new MyPluginClass(container)
    nativePluginInstance = new Clappr.ContainerPlugin(container)
    expect(myPluginInstance.enable).to.be.equal(nativePluginInstance.enable)
    expect(myPluginInstance.disable).to.be.equal(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).to.be.equal(testMethod)
    expect(MyPluginClass.type).to.be.equal('container')

    MyPluginClass = Clappr.UIContainerPlugin.extend({testMethod: testMethod})
    myPluginInstance = new MyPluginClass(container)
    nativePluginInstance = new Clappr.UIContainerPlugin(container)
    expect(myPluginInstance.enable).to.be.equal(nativePluginInstance.enable)
    expect(myPluginInstance.disable).to.be.equal(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).to.be.equal(testMethod)
    expect(MyPluginClass.type).to.be.equal('container')


    MyPluginClass = Clappr.UICorePlugin.extend({testMethod: testMethod, render: function() {}})
    myPluginInstance = new MyPluginClass(core)
    nativePluginInstance = new Clappr.UICorePlugin(core)
    expect(myPluginInstance.enable).to.be.equal(nativePluginInstance.enable)
    expect(myPluginInstance.disable).to.be.equal(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).to.be.equal(testMethod)
    expect(MyPluginClass.type).to.be.equal('core')

    MyPluginClass = Clappr.CorePlugin.extend({testMethod: testMethod, render: function() {}})
    myPluginInstance = new MyPluginClass(core)
    nativePluginInstance = new Clappr.CorePlugin(core)
    expect(myPluginInstance.enable).to.be.equal(nativePluginInstance.enable)
    expect(myPluginInstance.disable).to.be.equal(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).to.be.equal(testMethod)
    expect(MyPluginClass.type).to.be.equal('core')
  })
})
