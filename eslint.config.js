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
    // Собранные для LMS файлы лежат рядом с уроками своего класса (перенесены из корня
    // 2026-08-12). Это выход сборщика: движок вшит в каждый файл, править надо исходник.
    'src/components/grade3/lms-grade3-standalone',
    'src/components/grade3/lms-grade3-standalone-tts',
    'src/components/grade3/lms-grade3-practice-standalone',
    'src/components/grade6/lms-grade6-standalone',
    'src/components/grade6/lms-grade6-practice-standalone',
    'src/components/grade8/lms-grade8-standalone',
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
