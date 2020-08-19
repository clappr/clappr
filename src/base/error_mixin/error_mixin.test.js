import ErrorMixin from './error_mixin'
import PlayerError from '@/components/error'
import CorePlugin from '@/base/core_plugin'
import UICorePlugin from '@/base/ui_core_plugin'
import ContainerPlugin from '@/base/container_plugin'
import UIContainerPlugin from '@/base/ui_container_plugin'
import Core from '@/components/core'
import Playback from '@/base/playback'
import Events from '@/base/events'

describe('ErrorMixin', function() {
  beforeEach(() => {
    this.errorExample = { code: 'TEST_ERROR', description: 'A error example.', level: PlayerError.Levels.FATAL }
  })

  test('is used on all plugins base classes', () => {
    const plugin1 = new CorePlugin({})
    const plugin2 = new UICorePlugin({})
    const plugin3 = new ContainerPlugin({})
    const plugin4 = new UIContainerPlugin({})
    const plugin5 = new Playback({})

    expect(plugin1.createError).toEqual(ErrorMixin.createError)
    expect(plugin2.createError).toEqual(ErrorMixin.createError)
    expect(plugin3.createError).toEqual(ErrorMixin.createError)
    expect(plugin4.createError).toEqual(ErrorMixin.createError)
    expect(plugin5.createError).toEqual(ErrorMixin.createError)
  })

  describe('creates a error', () => {

    test('with default values', () => {
      expect(ErrorMixin.createError(this.errorExample)).toEqual({
        code: ':TEST_ERROR',
        description: 'A error example.',
        level: 'FATAL',
        origin: '',
        raw: {},
        scope: '',
      })

      const err = { description: 'A error example.', level: PlayerError.Levels.FATAL }

      expect(ErrorMixin.createError(err)).toEqual({
        description: 'A error example.',
        level: 'FATAL',
        origin: '',
        scope: '',
        raw: {},
        code: ':unknown',
      })
    })

    test('owns option to not manipulate error code', () => {
      expect(ErrorMixin.createError(this.errorExample, { useCodePrefix: false })).toEqual({
        description: 'A error example.',
        level: 'FATAL',
        origin: '',
        scope: '',
        raw: {},
        code: 'TEST_ERROR'
      })
    })

    test('needs a scope to generate a more descriptive error', () => {
      const playback = new Playback({})
      const plugin1 = new CorePlugin({})
      const plugin2 = new ContainerPlugin({})

      expect(playback.createError(this.errorExample)).toEqual({
        description: 'A error example.',
        level: 'FATAL',
        origin: 'playback',
        scope: 'playback',
        raw: {},
        code: 'playback:TEST_ERROR'
      })

      expect(plugin1.createError(this.errorExample)).toEqual({
        description: 'A error example.',
        level: 'FATAL',
        origin: 'core',
        scope: 'core',
        raw: {},
        code: 'core:TEST_ERROR'
      })

      expect(plugin2.createError(this.errorExample)).toEqual({
        description: 'A error example.',
        level: 'FATAL',
        origin: 'container',
        scope: 'container',
        raw: {},
        code: 'container:TEST_ERROR'
      })
    })

    test('with default UI for FATAL errors on scopes with i18n configured', () => {
      const plugin = new UIContainerPlugin({
        get i18n() {
          return { t: (key) => key }
        }
      })

      expect(plugin.createError(this.errorExample)).toEqual({
        description: 'A error example.',
        level: 'FATAL',
        origin: 'container',
        scope: 'container',
        raw: {},
        code: 'container:TEST_ERROR',
        UI: { title: 'default_error_title', message: 'default_error_message' },
      })
    })
  })

  test('sends the error for one existing PlayerError instance', () => {
    const callback = jest.fn()
    const plugin = new UICorePlugin(new Core({}))

    plugin.listenTo(plugin.core, Events.ERROR, callback)
    plugin.createError(this.errorExample)

    expect(callback).toHaveBeenCalledWith({
      description: 'A error example.',
      level: 'FATAL',
      origin: 'core',
      scope: 'core',
      raw: {},
      code: 'core:TEST_ERROR',
      UI: { title: 'default_error_title', message: 'default_error_message' },
    })
  })
})
