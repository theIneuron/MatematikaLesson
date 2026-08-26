// 8-sinf amaliyoti: TEKSHIRUV. Bir vaqtda ikki ish qiladi (TIPLAR §8):
//   1) har bosishdan keyin kontent kadrga sig'adimi — 5 o'lcham x 3 til;
//   2) amaliyot to'g'ri javoblar bilan birinchi urinishda 10/10 beradimi.
//
// G8_WRONG=1 — o'sha o'nta topshiriq ATAYLAB noto'g'ri o'tiladi va uchta
// narsa talab qilinadi: ball berilmasin, razbor chiqsin va u BO'SH bo'lmasin.
// Bo'sh razbor eng sezilmas nuqson: qolgan tekshiruvlar yashil, ekranda esa
// hech narsa yo'q.
//
// YURUVCHINING O'ZI `practice-check-lib.mjs` da (2026-08-26): 9-sinfga ham
// aynan shu tekshiruv kerak bo'ldi, ikkinchi nusxa esa CLAUDE.md §5 ga zid.
// Bu fayl faqat 8-sinfning rejasini va env prefiksini beradi.
//
// Ishlatish:
//   npx vite --port 5199                            (alohida terminalda)
//   node scripts/grade8-practice-check.mjs
//   G8_WRONG=1 node scripts/grade8-practice-check.mjs
//   G8_VP=telefon G8_LANG=en node scripts/grade8-practice-check.mjs
import { LESSONS, VIEWPORTS, LANGS } from './grade8-practice-plan.mjs';
import { runPracticeCheck } from './practice-check-lib.mjs';

const ok = await runPracticeCheck({
  LESSONS, VIEWPORTS, LANGS,
  base: process.env.G8_BASE || 'http://localhost:5199',
  wrong: process.env.G8_WRONG === '1',
  vp: process.env.G8_VP,
  lang: process.env.G8_LANG,
  lesson: process.env.G8_LESSON,
});
if (!ok) process.exit(1);
