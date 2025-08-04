const js = require('@eslint/js')

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        // Framework globals
        _gaq: false,
        process: false,
        ActiveXObject: false,
        VERSION: false,
        CLAPPR_VERSION: false,
        CLAPPR_CORE_VERSION: false,
        PLAIN_HTML5_ONLY: false,
        // Build globals
        __dirname: false,
        module: false,
        require: false,
        // Test globals
        after: false,
        afterEach: false,
        assert: false,
        before: false,
        beforeEach: false,
        describe: false,
        expect: false,
        it: false,
        sinon: false,
        xit: false,
        jest: false,
        test: false,
        // Browser globals
        window: false,
        document: false,
        console: false,
        setTimeout: false,
        clearTimeout: false,
        setInterval: false,
        clearInterval: false,
        navigator: false,
        localStorage: false,
        Event: false,
        Path2D: false,
        performance: false
      }
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'no-var': 'error',
      'block-spacing': 'error',
      curly: ['error', 'multi-or-nest', 'consistent'],
      'object-curly-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'keyword-spacing': 'error',
      'space-before-blocks': 'error',
      'arrow-spacing': 'error',
      // part of Node Style-guide but ignored
      'max-len': 0,
      'max-statements': 0
    }
  }
]