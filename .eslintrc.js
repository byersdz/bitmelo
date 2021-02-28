
module.exports = {
  "extends": "airbnb-base",
  "env": {
    "browser": true,
    "node": true,
    "jest": true
  },
  "rules": {
    "no-underscore-dangle": "off",
    "no-continue": "off",
    "class-methods-use-this": "off",
    "space-in-parens": ["error", "always"],
    "template-curly-spacing": ["error", "never"],
    "no-bitwise": "off",
    "template-curly-spacing": ["error", "always"],
    "arrow-body-style": "off",
    "brace-style": ["error", "stroustrup"],
    "max-len": ["error", { "code": 120, "ignoreComments": true, "ignoreTrailingComments": true }],
    "operator-assignment": "off",
    "no-lonely-if": "off",
    "no-console": 'off',
    "prefer-destructuring": ["error", {
      "array": false,
      "object": true
    }, {
      "enforceForRenamedProperties": false
    }]
  },
  "globals": {
    "bitmelo": "readonly"
  }
}
