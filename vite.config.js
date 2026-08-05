import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// Dev-сервер Vite не знает про функции Vercel, поэтому /api/tts локально был бы
// 404 и уроки читались бы браузерным Web Speech. Плагин поднимает ТОТ ЖЕ
// обработчик api/tts.js, что и на Vercel: боевой голос слышно локально, без
// `vercel dev`. Ключи берутся из .env.local (в git не идёт).
function fishTtsDev(env) {
  return {
    name: 'fish-tts-dev',
    apply: 'serve',
    configureServer(server) {
      for (const [key, value] of Object.entries(env)) {
        if (/^(FISH_|TTS_)/.test(key) && !process.env[key]) process.env[key] = value
      }
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/tts.js')
          req.url = req.originalUrl || req.url // mount-путь срезает /api/tts из url
          await mod.default(req, res)
        } catch (err) {
          server.config.logger.error(`[fish-tts-dev] ${err && err.stack}`)
          res.statusCode = 500
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(String((err && err.message) || err))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), fishTtsDev(loadEnv(mode, process.cwd(), ''))],
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
}))
