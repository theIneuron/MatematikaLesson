// ============================================================================
// 8-sinf Dars01v2 -- AVTONOM HTML previu.
//
// Nima uchun: metodist darsni sayt va server ko'tarmasdan, faylni ikki marta
// bosib ochishi kerak (JSON talabi: "если требуется автономное превью").
// Natija -- ikkita fayl, ichida React ham, dars ham bor, tarmoq kerak emas
// (faqat shriftlar internet bo'lsa yuklanadi, bo'lmasa tizim shrifti).
//
// Manba AYNAN LMS ga ketadigan fayl: src/components/grade8/lms-grade8-standalone/Dars01v2.jsx.
// Shu sababli previu va LMS bir xil kodni ishlatadi, ikkiga ayrilmaydi.
//
// Ishga tushirish: node scripts/grade8-dars01v2-standalone.mjs
// Natija: artifacts/grade8-dars01-lesson/index.html + lesson.js
//
// DIQQAT: maket papkasi (artifacts/grade8-dars01-design) TEGILMAYDI.
// ============================================================================
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const OUT = 'artifacts/grade8-dars01-lesson'
const TMP = '.tmp/g8-standalone-entry.jsx'

await mkdir(OUT, { recursive: true })
await mkdir('.tmp', { recursive: true })

// Avval bitta faylli LMS yig'iladi (previu shuni ko'rsatadi).
const lms = spawnSync('node scripts/build-grade8-dars01-lms.mjs --no-smoke', { stdio: 'inherit', shell: true })
if (lms.status !== 0) {
  console.error("LMS fayli yig'ilmadi, previu to'xtatildi")
  process.exit(1)
}

// Previu qobig'i: til tanlagichi va dars. Saytdagi `LessonPage` ning eng
// kichik nusxasi, faqat shu dars uchun.
const entry = `
import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Lesson from '../src/components/grade8/lms-grade8-standalone/Dars01v2.jsx'

function Preview() {
  const [lang, setLang] = useState('ru')
  return (
    <div>
      <div className="pv-lang">
        {['uz', 'ru', 'en'].map((code) => (
          <button
            type="button"
            key={code}
            className={lang === code ? 'is-active' : ''}
            onClick={() => setLang(code)}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
      <Lesson
        key={lang}
        lang={lang}
        studentName="Aziza"
        onFinished={(p) => console.log('[standalone] onFinished', p)}
      />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<Preview />)
`
await writeFile(TMP, entry, 'utf8')

// Windows da `npx` .cmd bo'lgani uchun shell orqali chaqiriladi.
const cmd = [
  'npx esbuild', TMP,
  '--bundle',
  '--format=iife',
  '--loader:.jsx=jsx',
  '--jsx=automatic',
  '--define:process.env.NODE_ENV=\\"production\\"',
  '--minify',
  '--outfile=' + OUT + '/lesson.js',
].join(' ')
const res = spawnSync(cmd, { stdio: 'inherit', shell: true })
if (res.status !== 0) {
  console.error('esbuild yiqildi')
  process.exit(1)
}

const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>8 класс · Урок 1 · Рациональные выражения и рациональные дроби</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..600&family=JetBrains+Mono:wght@400..800&family=Manrope:wght@400..800&display=swap" rel="stylesheet">
  <style>
    html, body { margin: 0; padding: 0; height: 100%; background: #F4EFE6; }
    .pv-lang {
      position: fixed;
      top: 12px;
      right: 14px;
      z-index: 40;
      display: flex;
      gap: 6px;
      font-family: 'Manrope', system-ui, sans-serif;
    }
    .pv-lang button {
      border: 1px solid #D9D1C5;
      background: #FFFCF7;
      color: #667174;
      border-radius: 10px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
    }
    .pv-lang button.is-active { background: #147D79; border-color: #147D79; color: #fff; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="./lesson.js"></script>
</body>
</html>
`
await writeFile(OUT + '/index.html', html, 'utf8')
await rm(TMP, { force: true })
console.log('OK:', OUT + '/index.html', '+', OUT + '/lesson.js')
