import Clappr from './main'

describe('External Plugin', function() {
  test('should expose extend method for the plugins exposed on Clappr scope', function() {
    let MyPluginClass
    let myPluginInstance
    let nativePluginInstance
    const testMethod = function() {
      return 'test'
    }

    const core = { options: {} }
    const container = { options: {} }

    MyPluginClass = Clappr.Playback.extend({ testMethod: testMethod })
    myPluginInstance = new MyPluginClass()
    nativePluginInstance = new Clappr.Playback()
    expect(myPluginInstance.play).toEqual(nativePluginInstance.play)
    expect(myPluginInstance.stop).toEqual(nativePluginInstance.stop)
    expect(myPluginInstance.testMethod).toEqual(testMethod)
    expect(MyPluginClass.type).toEqual('playback')

    MyPluginClass = Clappr.ContainerPlugin.extend({ testMethod: testMethod })
    myPluginInstance = new MyPluginClass(container)
    nativePluginInstance = new Clappr.ContainerPlugin(container)
    expect(myPluginInstance.enable).toEqual(nativePluginInstance.enable)
    expect(myPluginInstance.disable).toEqual(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).toEqual(testMethod)
    expect(MyPluginClass.type).toEqual('container')

    MyPluginClass = Clappr.UIContainerPlugin.extend({ testMethod: testMethod })
    myPluginInstance = new MyPluginClass(container)
    nativePluginInstance = new Clappr.UIContainerPlugin(container)
    expect(myPluginInstance.enable).toEqual(nativePluginInstance.enable)
    expect(myPluginInstance.disable).toEqual(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).toEqual(testMethod)
    expect(MyPluginClass.type).toEqual('container')


    MyPluginClass = Clappr.UICorePlugin.extend({ testMethod: testMethod, render: function() {} })
    myPluginInstance = new MyPluginClass(core)
    nativePluginInstance = new Clappr.UICorePlugin(core)
    expect(myPluginInstance.enable).toEqual(nativePluginInstance.enable)
    expect(myPluginInstance.disable).toEqual(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).toEqual(testMethod)
    expect(MyPluginClass.type).toEqual('core')

    MyPluginClass = Clappr.CorePlugin.extend({ testMethod: testMethod, render: function() {} })
    myPluginInstance = new MyPluginClass(core)
    nativePluginInstance = new Clappr.CorePlugin(core)
    expect(myPluginInstance.enable).toEqual(nativePluginInstance.enable)
    expect(myPluginInstance.disable).toEqual(nativePluginInstance.disable)
    expect(myPluginInstance.testMethod).toEqual(testMethod)
    expect(MyPluginClass.type).toEqual('core')
  })
})
