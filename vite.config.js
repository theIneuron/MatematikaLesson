import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @lesson/runtime — lokal preview shim (Web Speech TTS / bip SFX / mock grader).
      // Production'da bu modulni platforma lesson-runner beradi.
      '@lesson/runtime': fileURLToPath(new URL('./src/runtime/lessonRuntime.js', import.meta.url)),
    },
  },
  server: {
    watch: {
      // src ichidagi .rar/.zip arxivlarni kuzatma — qulflanganda EBUSY bilan dev server o'ladi
      ignored: ['**/*.rar', '**/*.zip'],
    },
  },
})
