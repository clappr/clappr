import Clappr from '../../src/main'

describe('External Plugin', function() {
  it('should expose extend method for the plugins exposed on Clappr scope', function(){
    var MyPluginClass
    var myPluginInstance
    var nativePluginInstance
    var testMethod = function() {
      return "test"
    }

  	MyPluginClass = Clappr.CorePlugin.extend({testMethod: testMethod})
  	myPluginInstance = new MyPluginClass()
  	nativePluginInstance = new Clappr.CorePlugin()
    expect(myPluginInstance.enable).to.be.equal(nativePluginInstance.enable)
    expect(myPluginInstance.disable).to.be.equal(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).to.be.equal(testMethod)

    MyPluginClass = Clappr.Playback.extend({testMethod: testMethod})
    myPluginInstance = new MyPluginClass()
    nativePluginInstance = new Clappr.Playback()
    expect(myPluginInstance.play).to.be.equal(nativePluginInstance.play)
    expect(myPluginInstance.stop).to.be.equal(nativePluginInstance.stop)
    expect(myPluginInstance.testMethod).to.be.equal(testMethod)

    MyPluginClass = Clappr.ContainerPlugin.extend({testMethod: testMethod})
    myPluginInstance = new MyPluginClass({container:{}})
    nativePluginInstance = new Clappr.ContainerPlugin({container:{}})
    expect(myPluginInstance.enable).to.be.equal(nativePluginInstance.enable)
    expect(myPluginInstance.disable).to.be.equal(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).to.be.equal(testMethod)

    MyPluginClass = Clappr.UIContainerPlugin.extend({testMethod: testMethod})
    myPluginInstance = new MyPluginClass({container:{}})
    nativePluginInstance = new Clappr.UIContainerPlugin({container:{}})
    expect(myPluginInstance.enable).to.be.equal(nativePluginInstance.enable)
    expect(myPluginInstance.disable).to.be.equal(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).to.be.equal(testMethod)

    MyPluginClass = Clappr.UICorePlugin.extend({testMethod: testMethod})
    MyPluginClass.prototype.render = function() {}
    Clappr.UICorePlugin.prototype.render = function() {}
    myPluginInstance = new MyPluginClass()
    nativePluginInstance = new Clappr.UICorePlugin()
    expect(myPluginInstance.enable).to.be.equal(nativePluginInstance.enable)
    expect(myPluginInstance.disable).to.be.equal(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).to.be.equal(testMethod)
  })
})