#!/usr/bin/env node
// 4-sinf nazariy darslarining freym masofalari auditi.
//
// Metodist talabi (2026-08-21): freymlar bir-biriga TEGIB qolmasligi kerak va
// orasida JUDA KATTA bo'sh joy ham bo'lmasligi kerak. Ko'z bilan 41 darsni
// tekshirish imkonsiz, shuning uchun o'lchov brauzerda avtomat olinadi.
//
// "Freym" — ko'rinadigan idish: o'z foni, chegarasi yoki soyasi bor element
// (kartochka, variant, izoh bloki, jadval). Bir ota ichidagi ketma-ket ikki
// freym vertikal ustma-ust joylashgan bo'lsa, ular orasidagi masofa
// o'lchanadi.
//
// Ishlatish:
//   npx vite preview --port 4173 --strictPort
//   node scripts/grade4-frame-gap-audit.mjs [11 12 ...]
import process from 'node:process';
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4173';
const MIN_GAP = Number(process.env.MIN_GAP || 3); // shundan kichigi — tegib turgan
const MAX_GAP = Number(process.env.MAX_GAP || 56); // shundan kattasi — uzoqlashgan
const JOBS = Number(process.env.JOBS || 4);
const OUT = process.env.OUT || '.tmp-frame-gap.json';

const SLUGS = {
  11: 'dars11-kop-xonali-sonni-uch-xonali-songa-kopaytirish',
  12: 'dars12-kop-xonali-sonni-bir-xonali-songa-bolish',
  13: 'dars13-kop-xonali-sonni-ikki-xonali-songa-bolish',
  14: 'dars14-harakat-masalalari',
  15: 'dars15-ortacha-arifmetik',
  16: 'dars16-formulalar',
  17: 'dars17-shkalalar',
  18: 'dars18-kasr-tushunchasi',
  19: 'dars19-kasrlarni-taqqoslash',
  20: 'dars20-kasrlarni-qoshish',
  21: 'dars21-kasrlarni-ayirish',
  22: 'dars22-sonning-kasr-qismini-topish',
  23: 'dars23-kasrli-masalalar',
  24: 'dars24-onli-kasrlar',
  25: 'dars25-toplamlar-eyler-venn-diagrammasi',
  26: 'dars26-uzunlik-birliklari',
  27: 'dars27-massa-birliklari',
  28: 'dars28-vaqt-birliklari',
  29: 'dars29-yuza-birliklari',
  30: 'dars30-kattalik-birliklarini-aylantirish',
  31: 'dars31-kattaliklarga-doir-masalalar',
  32: 'dars32-hajm-birliklari',
  33: 'dars33-burchak-turlari',
  34: 'dars34-burchaklarni-yasash',
  35: 'dars35-uchburchak-turlari',
  36: 'dars36-togri-tortburchak-va-kvadrat',
  37: 'dars37-perimetr-va-yuza',
  38: 'dars38-geometrik-yasashlar',
  39: 'dars39-nuqta-koordinatalari',
  40: 'dars40-fazoviy-shakllar-va-yoyilmalar',
  41: 'dars41-simmetriya-va-burilish-simmetriyasi',
  42: 'dars42-tenglamalar',
  43: 'dars43-tenglamalarni-yechish-va-tekshirish',
  44: 'dars44-murakkab-masalalar',
  45: 'dars45-harakatga-doir-masalalar',
  46: 'dars46-qism-va-butunni-topish',
  47: 'dars47-tengsizliklarni-tanlash-usuli',
  48: 'dars48-qoshish-xossalari',
  49: 'dars49-mulohazalar-va-hukmlar',
  50: 'dars50-grafiklar-va-malumotlar',
  51: 'dars51-yakuniy-takrorlash',
};

const VIEWPORTS = [
  { name: '1366x768', width: 1366, height: 768 },
  { name: '390x760', width: 390, height: 760 },
];

const lessons = process.argv.slice(2).length
  ? process.argv.slice(2).map(Number)
  : Object.keys(SLUGS).map(Number);

// Brauzer ichida bajariladigan o'lchov.
const MEASURE = ({ minGap, maxGap }) => {
  const root = document.querySelector('.lesson-root') || document.body;
  const parse = (value) => {
    const m = /rgba?\(([^)]+)\)/.exec(value || '');
    if (!m) return null;
    const parts = m[1].split(',').map((x) => parseFloat(x));
    return { a: parts.length > 3 ? parts[3] : 1 };
  };
  const isFrame = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    if (r.width < 24 || r.height < 14) return false;
    const bg = parse(cs.backgroundColor);
    const hasBg = bg && bg.a > 0.02;
    const hasShadow = cs.boxShadow && cs.boxShadow !== 'none';
    const hasBorder = ['Top', 'Right', 'Bottom', 'Left'].some((side) => (
      parseFloat(cs['border' + side + 'Width']) > 0.4
      && getComputedStyle(el)['border' + side + 'Style'] !== 'none'
    ));
    return Boolean(hasBg || hasShadow || hasBorder);
  };
  const label = (el) => {
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
    return (el.tagName.toLowerCase() + (cls ? '.' + cls : '')).slice(0, 70);
  };

  // Ikki freym orasidagi masofa faqat u HAQIQATAN bo'sh bo'lsa hisoblanadi.
  // Orada sarlavha, matn yoki boshqa ko'rinadigan element turgan bo'lsa, bu
  // bo'sh joy emas — shuning uchun `stage-header` bilan `stage-nav` orasidagi
  // butun slayd balandligi "uzoq masofa" deb belgilanmaydi.
  // Bo'shliqni faqat KO'RINADIGAN narsa band qiladi: freym, matn, chizma.
  // Shaffof o'ram div (foni ham, matni ham yo'q) butun ustunni egallab turadi
  // va u hisobga olinsa hech qanday bo'shliq "bo'sh" bo'lib chiqmaydi.
  const hasOwnText = (el) => [...el.childNodes]
    .some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
  const visible = [];
  for (const el of root.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.02) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const drawn = isFrame(el) || hasOwnText(el)
      || ['SVG', 'IMG', 'CANVAS', 'HR', 'I', 'B', 'EM', 'STRONG'].includes(el.tagName.toUpperCase());
    if (!drawn) continue;
    visible.push({ el, r });
  }
  const bandIsEmpty = (a, b) => {
    const top = a.r.bottom;
    const bottom = b.r.top;
    const left = Math.max(a.r.left, b.r.left);
    const rightEdge = Math.min(a.r.right, b.r.right);
    for (const { el, r } of visible) {
      if (el === a.el || el === b.el) continue;
      if (a.el.contains(el) || b.el.contains(el)) continue;
      if (el.contains(a.el) || el.contains(b.el)) continue; // ota-bobolar
      if (r.bottom <= top + 0.5 || r.top >= bottom - 0.5) continue;
      if (r.right <= left + 0.5 || r.left >= rightEdge - 0.5) continue;
      return false;
    }
    return true;
  };

  const findings = [];
  const parents = new Set([root, ...root.querySelectorAll('*')]);
  for (const parent of parents) {
    const kids = [...parent.children].filter(isFrame);
    if (kids.length < 2) continue;
    const boxes = kids.map((el) => ({ el, r: el.getBoundingClientRect() }))
      .sort((a, b) => a.r.top - b.r.top);
    for (let i = 0; i + 1 < boxes.length; i += 1) {
      const a = boxes[i];
      const b = boxes[i + 1];
      // faqat vertikal ustma-ust turganlar (gorizontal qatorlar hisobga olinmaydi)
      const overlapX = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      if (overlapX < Math.min(a.r.width, b.r.width) * 0.5) continue;
      const gap = b.r.top - a.r.bottom;
      if (gap >= minGap && gap <= maxGap) continue;
      if (gap > maxGap && !bandIsEmpty(a, b)) continue;
      findings.push({
        gap: Math.round(gap * 10) / 10,
        kind: gap < minGap ? (gap < -0.5 ? 'overlap' : 'touching') : 'far',
        parent: label(parent),
        a: label(a.el),
        b: label(b.el),
      });
    }
  }
  // Ramka ICHIDAGI o'lik bo'sh joy. Freymlar orasidagi masofa to'g'ri bo'lsa
  // ham, ramkaning o'zi kontentidan ancha baland bo'lishi mumkin — 31-40
  // darslarning yakuniy ekranida savol kartasi ostida aynan shunday 92 px oq
  // joy turgan edi. Faqat pastdagi bo'shliq o'lchanadi: tepadagi bo'shliq
  // ko'pincha ataylab (markazlashtirish).
  for (const el of root.querySelectorAll('*')) {
    if (!isFrame(el)) continue;
    const kids = [...el.children].filter((k) => {
      const cs = getComputedStyle(k);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      const r = k.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    });
    if (!kids.length) continue;
    const cs = getComputedStyle(el);
    // Markazga tekislangan idishda pastdagi bo'shliq — maket, nosozlik emas.
    if (/center|end|space-/.test(`${cs.alignItems} ${cs.alignContent} ${cs.justifyContent}`)) continue;
    const r = el.getBoundingClientRect();
    const innerBottom = r.bottom - parseFloat(cs.paddingBottom || 0) - parseFloat(cs.borderBottomWidth || 0);
    const lastBottom = Math.max(...kids.map((k) => k.getBoundingClientRect().bottom));
    const dead = innerBottom - lastBottom;
    if (dead > maxGap) {
      findings.push({
        gap: Math.round(dead * 10) / 10,
        kind: 'olik-joy',
        parent: label(el),
        a: label(kids[kids.length - 1]),
        b: '(ramka pasti)',
      });
    }
  }

  const stage = document.querySelector('.stage');
  const body = document.querySelector('.stage-body');
  return {
    findings,
    scroll: Math.max(
      document.documentElement.scrollHeight - document.documentElement.clientHeight,
      stage ? stage.scrollHeight - stage.clientHeight : 0,
      body ? body.scrollHeight - body.clientHeight : 0,
    ),
    count: document.querySelector('.screen-count')?.textContent?.trim() ?? '',
  };
};

const browser = await chromium.launch();
const report = [];

const auditLesson = async (lesson) => {
  const slug = SLUGS[lesson];
  if (!slug) { console.log(`Dars ${lesson}: slug topilmadi`); return; }
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    try {
      await page.goto(`${BASE}/4-sinf/matematika/nazariy/${slug}`, { waitUntil: 'load' });
      await page.waitForSelector('.stage', { timeout: 40000 });
      await page.waitForTimeout(500);
      const mute = page.locator('.audio-controls button, .audio-indicator button').first();
      if (await mute.count()) await mute.click();
      await page.waitForTimeout(400);
      const total = Number((((await page.locator('.screen-count').first().textContent()) || '/ 16').split('/')[1] || '16').trim()) || 16;

      for (let screen = 0; screen < total; screen += 1) {
        await page.waitForTimeout(450);
        const m = await page.evaluate(MEASURE, { minGap: MIN_GAP, maxGap: MAX_GAP });
        if (m.findings.length || m.scroll > 1) {
          report.push({ lesson, vp: vp.name, screen: screen + 1, count: m.count, scroll: m.scroll, findings: m.findings });
        }
        // keyingi ekran: to'g'ri javobni bosib o'tamiz (data-g4-correct yoki tugma)
        const right = page.locator('[data-g4-correct="true"]:not([disabled])').first();
        if (await right.count()) { await right.click().catch(() => {}); await page.waitForTimeout(500); }
        const next = page.locator('.stage-nav button:last-child, .btn-next, .btn-white-accent').last();
        if (!(await next.count())) break;
        if (await next.isDisabled().catch(() => true)) {
          // gate yopiq — barcha bosiladigan javoblarni sinab ko'ramiz
          const any = page.locator('.option:not([disabled]), .slot:not([disabled]), .chip:not([disabled])');
          const n = Math.min(await any.count(), 6);
          for (let k = 0; k < n; k += 1) {
            await any.nth(k).click().catch(() => {});
            await page.waitForTimeout(350);
            if (!(await next.isDisabled().catch(() => true))) break;
          }
        }
        if (await next.isDisabled().catch(() => true)) {
          // oxirgi ekranda "Davom etish" o'rniga mukofot turadi — bu nosozlik emas
          if (screen + 1 < total) report.push({ lesson, vp: vp.name, screen: screen + 1, blocked: true });
          break;
        }
        await next.click().catch(() => {});
      }
      if (errors.length) report.push({ lesson, vp: vp.name, consoleErrors: errors.slice(0, 5) });
    } catch (error) {
      report.push({ lesson, vp: vp.name, fatal: String(error).slice(0, 200) });
    }
    await page.close();
  }
  const own = report.filter((r) => r.lesson === lesson);
  const bad = own.reduce((sum, r) => sum + (r.findings?.length ?? 0), 0);
  console.log(`Dars ${String(lesson).padStart(2, '0')}: ${bad} masofa muammosi, ${own.filter((r) => r.blocked).length} qulflangan ekran, ${own.filter((r) => r.consoleErrors).length} konsol xatosi`);
};

const queue = [...lessons];
await Promise.all(Array.from({ length: Math.min(JOBS, queue.length) }, async () => {
  while (queue.length) {
    const lesson = queue.shift();
    await auditLesson(lesson);
  }
}));

await browser.close();
writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(`\nTo'liq hisobot: ${OUT}`);
