import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  // Ignorar arquivos compilados e dependências
  {
    ignores: ['dist/**', 'node_modules/**', '*.min.js'],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      // Vue — desabilita regras que conflitam com o estilo do projeto
      'vue/multi-word-component-names': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/html-indent': 'off',
      'vue/no-v-html': 'warn',

      // Vue — avisos não-bloqueantes
      'vue/require-prop-types': 'warn',
      'vue/no-required-prop-with-default': 'warn',
      'vue/require-default-prop': 'warn',

      // JS — avisos não-bloqueantes
      'no-unused-vars': 'warn',
      'no-useless-catch': 'warn',
    }
  },
  // Scripts Node.js (CJS) precisam de globals do Node
  {
    files: ['scripts/**/*.cjs', 'scripts/**/*.js'],
    languageOptions: {
      globals: globals.node
    }
  },
  // SvgIcon usa v-html de forma controlada (conteúdo vem de src/assets/icons/index.js).
  // Nunca exponha input de usuário neste componente.
  {
    files: ['src/components/atoms/SvgIcon.vue'],
    rules: {
      'vue/no-v-html': 'off'
    }
  }
]


