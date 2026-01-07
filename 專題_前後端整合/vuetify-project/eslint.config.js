import vuetify from 'eslint-config-vuetify'

export default vuetify(
  {},
  {
    rules: {
      'antfu/top-level-function': 'off',
      '@stylistic/arrow-parens': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/html-self-closing': 'off',
      'vue/script-indent': [
        'error',
        2,
        {
          baseIndent: 0,
          switchCase: 0,
          ignores: [],
        },
      ],
    },
  },
)
