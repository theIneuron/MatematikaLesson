// 9-sinf amaliyoti: TEKSHIRUV (TIPLAR_AMALIYOT_9SINF.md §5).
//   1) har bosishdan keyin kontent kadrga sig'adimi — 5 o'lcham x 3 til;
//   2) amaliyot to'g'ri javoblar bilan birinchi urinishda 10/10 beradimi.
//
// G9_WRONG=1 — o'sha o'nta topshiriq ATAYLAB noto'g'ri o'tiladi: ball
// berilmasin, razbor chiqsin, u bo'sh bo'lmasin va ekranda yashil qolmasin.
//
// Yuruvchi 8-sinf bilan umumiy: `practice-check-lib.mjs`. Bu fayl faqat
// 9-sinfning rejasini beradi.
//
// Ishlatish:
//   npx vite --port 5199                            (alohida terminalda)
//   node scripts/grade9-practice-check.mjs
//   G9_WRONG=1 node scripts/grade9-practice-check.mjs
//   G9_VP=telefon G9_LANG=en node scripts/grade9-practice-check.mjs
import { LESSONS, VIEWPORTS, LANGS } from './grade9-practice-plan.mjs';
import { runPracticeCheck } from './practice-check-lib.mjs';

const ok = await runPracticeCheck({
  LESSONS, VIEWPORTS, LANGS,
  base: process.env.G9_BASE || 'http://localhost:5199',
  wrong: process.env.G9_WRONG === '1',
  vp: process.env.G9_VP,
  lang: process.env.G9_LANG,
  lesson: process.env.G9_LESSON,
});
if (!ok) process.exit(1);
