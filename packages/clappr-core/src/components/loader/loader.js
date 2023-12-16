// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
import Version from '@/utils/version'
import Log from '@/components/log'

const filterPluginsByType = (plugins, type) => {
  if (!plugins || !type) return {}

  return Object.entries(plugins)
    .filter(([, value]) => value.type === type)
    .reduce((obj, [key, value]) => (obj[key] = value, obj), {})
}

/**
 * It keeps a list of the default plugins (playback, container, core) and it merges external plugins with its internals.
 * @class Loader
 * @constructor
 * @extends BaseObject
 * @module components
 */
export default (() => {

  const registry = {
    plugins: {},
    playbacks: []
  }

  const currentVersion = VERSION

  return class Loader {

    static get registeredPlaybacks() {
      return [...registry.playbacks]
    }

    static get registeredPlugins() {
      const { plugins } = registry
      const core = filterPluginsByType(plugins, 'core')
      const container = filterPluginsByType(plugins, 'container')
      return {
        core,
        container,
      }
    }

    static checkVersionSupport(entry) {
      const { supportedVersion, name } = entry.prototype

      if (!supportedVersion || !supportedVersion.min) {
        Log.warn('Loader', `missing version information for ${name}`)
        return false
      }

      const maxVersion = supportedVersion.max ? Version.parse(supportedVersion.max) : Version.parse(supportedVersion.min).inc('minor')
      const minVersion = Version.parse(supportedVersion.min)

      if (!Version.parse(currentVersion).satisfies(minVersion, maxVersion)) {
        Log.warn('Loader', `unsupported plugin ${name}: Clappr version ${currentVersion} does not match required range [${minVersion},${maxVersion})`)
        return false
      }

      return true
    }

    static registerPlugin(pluginEntry) {
      if (!pluginEntry || !pluginEntry.prototype.name) {
        Log.warn('Loader', `missing information to register plugin: ${pluginEntry}`)
        return false
      }

      Loader.checkVersionSupport(pluginEntry)

      const pluginRegistry = registry.plugins

      if (!pluginRegistry) return false

      const previousEntry = pluginRegistry[pluginEntry.prototype.name]

      if (previousEntry) Log.warn('Loader', `overriding plugin entry: ${pluginEntry.prototype.name} - ${previousEntry}`)

      pluginRegistry[pluginEntry.prototype.name] = pluginEntry

      return true
    }

    static registerPlayback(playbackEntry) {
      if (!playbackEntry || !playbackEntry.prototype.name) return false

      Loader.checkVersionSupport(playbackEntry)

      let { playbacks } = registry

      const previousEntryIdx = playbacks.findIndex((entry) => entry.prototype.name === playbackEntry.prototype.name)

      if (previousEntryIdx >= 0) {
        const previousEntry = playbacks[previousEntryIdx]
        playbacks.splice(previousEntryIdx, 1)
        Log.warn('Loader', `overriding playback entry: ${previousEntry.name} - ${previousEntry}`)
      }

      registry.playbacks = [playbackEntry, ...playbacks]

      return true
    }

    static unregisterPlugin(name) {
      if (!name) return false

      const { plugins } = registry
      const plugin = plugins[name]

      if (!plugin) return false

      delete plugins[name]
      return true
    }

    static unregisterPlayback(name) {
      if (!name) return false

      let { playbacks } = registry

      const index = playbacks.findIndex((entry) => entry.prototype.name === name)

      if (index < 0) return false

      playbacks.splice(index, 1)
      registry.playbacks = playbacks

      return true
    }

    static clearPlugins() {
      registry.plugins = {}
    }

    static clearPlaybacks() {
      registry.playbacks = []
    }

    /**
     * builds the loader
     * @method constructor
     * @param {Object} externalPlugins the external plugins
     * @param {Number} playerId you can embed multiple instances of clappr, therefore this is the unique id of each one.
     */
    constructor(externalPlugins = [], playerId = 0) {
      this.playerId = playerId

      this.playbackPlugins = [...registry.playbacks]

      const { core, container } = Loader.registeredPlugins
      this.containerPlugins = Object.values(container)
      this.corePlugins = Object.values(core)

      if (!Array.isArray(externalPlugins))
        this.validateExternalPluginsType(externalPlugins)

      this.addExternalPlugins(externalPlugins)
    }

    /**
     * groups by type the external plugins that were passed through `options.plugins` it they're on a flat array
     * @method addExternalPlugins
     * @private
     * @param {Object} an config object or an array of plugins
     * @return {Object} plugins the config object with the plugins separated by type
     */
    groupPluginsByType(plugins) {
      if (Array.isArray(plugins)) {
        plugins = plugins.reduce(function (memo, plugin) {
          memo[plugin.type] || (memo[plugin.type] = [])
          memo[plugin.type].push(plugin)
          return memo
        }, {})
      }
      return plugins
    }

    removeDups(list, useReversePrecedence = false) {
      const groupUp = (plugins, plugin) => {
        if (plugins[plugin.prototype.name] && useReversePrecedence) return plugins

        plugins[plugin.prototype.name] && delete plugins[plugin.prototype.name]
        plugins[plugin.prototype.name] = plugin
        return plugins
      }
      const pluginsMap = list.reduceRight(groupUp, Object.create(null))

      const plugins = []
      for (let key in pluginsMap)
        plugins.unshift(pluginsMap[key])

      return plugins
    }

    /**
     * adds all the external plugins that were passed through `options.plugins`
     * @method addExternalPlugins
     * @private
     * @param {Object} plugins the config object with all plugins
     */
    addExternalPlugins(plugins) {
      const loadExternalPluginsFirst = typeof plugins.loadExternalPluginsFirst === 'boolean'
        ? plugins.loadExternalPluginsFirst
        : true
      const loadExternalPlaybacksFirst = typeof plugins.loadExternalPlaybacksFirst === 'boolean'
        ? plugins.loadExternalPlaybacksFirst
        : true

      plugins = this.groupPluginsByType(plugins)

      if (plugins.playback) {
        const playbacks = plugins.playback.filter((playback) => (Loader.checkVersionSupport(playback), true))
        this.playbackPlugins = loadExternalPlaybacksFirst
          ? this.removeDups(playbacks.concat(this.playbackPlugins))
          : this.removeDups(this.playbackPlugins.concat(playbacks), true)
      }

      if (plugins.container) {
        const containerPlugins = plugins.container.filter((plugin) => (Loader.checkVersionSupport(plugin), true))
        this.containerPlugins = loadExternalPluginsFirst
          ? this.removeDups(containerPlugins.concat(this.containerPlugins))
          : this.removeDups(this.containerPlugins.concat(containerPlugins), true)
      }

      if (plugins.core) {
        const corePlugins = plugins.core.filter((plugin) => (Loader.checkVersionSupport(plugin), true))
        this.corePlugins = loadExternalPluginsFirst
          ? this.removeDups(corePlugins.concat(this.corePlugins))
          : this.removeDups(this.corePlugins.concat(corePlugins), true)
      }
    }

    /**
     * validate if the external plugins that were passed through `options.plugins` are associated to the correct type
     * @method validateExternalPluginsType
     * @private
     * @param {Object} plugins the config object with all plugins
     */
    validateExternalPluginsType(plugins) {
      const pluginTypes = ['playback', 'container', 'core']
      pluginTypes.forEach((type) => {
        (plugins[type] || []).forEach((el) => {
          const errorMessage = 'external ' + el.type + ' plugin on ' + type + ' array'
          if (el.type !== type) throw new ReferenceError(errorMessage)
        })
      })
    }
  }
})()
