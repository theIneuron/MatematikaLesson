import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // dist — выход сборки; _archive — материал вне проекта; .tmp и standalone-бандлы —
  // отладочные прогоны и чужие сборки. Без этих исключений `npm run lint` линтует
  // тысячи файлов, к проекту не относящихся, и сигнал тонет в шуме.
  globalIgnores([
    'dist',
    '_archive',
    '.tmp',
    'lms_dars01_3d_build',
    'lms-grade6-standalone',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
