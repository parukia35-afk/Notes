import vuetify from 'eslint-config-vuetify'
import prettierConfig from 'eslint-config-prettier'

export default [
  ...vuetify({
    rules: {
      'antfu/top-level-function': 'off',
      'vue/html-self-closing': 'off',
    },
  }),
  prettierConfig,
]
