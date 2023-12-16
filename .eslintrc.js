module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
    },
    "globals": {
        "_gaq": false,
        "process": false,
        "ActiveXObject": false,
        "VERSION": false,
        "PLAIN_HTML5_ONLY": false,
        // Build globals
        "__dirname": false,
        // Test globals
        "after": false,
        "afterEach": false,
        "assert": false,
        "before": false,
        "beforeEach": false,
        "describe": false,
        "expect": false,
        "it": false,
        "sinon": false,
        "xit": false
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2018,
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-var": "error",
        "block-spacing": "error",
        "curly": ["error", "multi-or-nest", "consistent"],
        "object-curly-spacing": ["error", "always"],
        "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        "keyword-spacing": "error",
        "space-before-blocks": "error",
        "arrow-spacing": "error",
        // part of Node Style-guide but ignored
        "max-len": 0,
        "max-statements": 0,
    }
};
