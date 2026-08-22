#!/usr/bin/env node
// ============================================================================
// 4-SINF AMALIYOTI — JUFTLASHTIRISH KONTRAKTI (metodist qarori 2026-08-21)
//
// Nima uchun skript. Amaliyot fayllari LMS talabi bo'yicha avtonom: umumiy
// modul yo'q, shuning uchun juftlashtirish mexanikasi 49 faylda ALTI xil
// avlodda takrorlangan. Bitta faylda qo'lda tuzatish qilinsa, qolgan 48 tasi
// jimgina eski holatda qoladi. Bu skript uchta shartni HAR faylda tekshiradi:
//
//   1) RANG — juftlikning ikki tomoni bir xil rang oladi: chap tugma
//      `matchToneLeft`, o'ng tugma `matchToneRight` chaqiradi va uslublarda
//      `p4-tone1..6` bloki bor. Bolaning ko'zi qaysi javob qaysi qatorga
//      ketganini rangdan o'qiydi.
//   2) TUPIK YO'Q — band kartochka `disabled` bo'lmaydi va bog'lash
//      `matchTie` orqali ketadi (eski egasi bo'shaydi). Aks holda bola
//      hammasini juftlagach xatoni tuzata olmaydi.
//   3) ARALASHTIRISH — o'ng ustun `matchSpread` bilan joylanadi, ya'ni hech
//      bir karta o'z juftining qarshisida turmaydi. `shuffle` bilan uchta
//      juftlikda oltidan bir hollarda javoblar to'g'rima to'g'ri chiqib
//      qolardi.
//
// Xulqning O'ZI brauzerda tekshiriladi (juftlashtirish sinovi, README ga
// qarang); bu skript esa tez va CI uchun: kod darajasidagi qoidalar.
//
//   node scripts/grade4-practice-match-audit.mjs
// ============================================================================
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DIR = path.join(process.cwd(), 'src', 'components', 'grade4');
const files = readdirSync(DIR).filter((name) => /^Dars\d{2}Practice\.jsx$/.test(name)).sort();

const failures = [];
let checked = 0;

for (const file of files) {
  const src = readFileSync(path.join(DIR, file), 'utf8');
  if (!/kind: 'match'/.test(src)) continue;
  checked += 1;
  const say = (message) => failures.push(`${file}: ${message}`);

  // 1) rang
  if (!src.includes('const matchToneLeft')) say("matchToneLeft yordamchisi yo'q");
  if (!src.includes('matchToneLeft(task, pairs,')) say('chap tugma rang olmaydi');
  if (!src.includes('matchToneRight(task, pairs,')) say('o\'ng tugma rang olmaydi');
  if (!/\.p4-tone1\b/.test(src)) say("uslublarda p4-tone1 bloki yo'q");
  if (!/\.p4-tone6\b/.test(src)) say("uslublarda p4-tone6 bloki yo'q");

  // 2) tupik yo'q
  if (!src.includes('const matchTie')) say("matchTie yordamchisi yo'q");
  if (!/setPairs\(\(\w+\) => matchTie\(/.test(src)) say('bog\'lash matchTie orqali ketmaydi');
  for (const match of src.matchAll(/disabled=\{([^{}]*activeLeft[^{}]*)\}/g)) {
    if (/\bused\b|usedByOther|Object\.values\(pairs\)/.test(match[1])) {
      say(`band kartochka taqiqlangan: disabled={${match[1]}}`);
    }
  }
  for (const match of src.matchAll(/if \(([^)]*activeLeft[^)]*)\) return;/g)) {
    if (/\bused\b|usedByOther|Object\.values\(pairs\)\.includes/.test(match[1])) {
      say(`bosish qo'riqchisi band kartochkani rad etadi: if (${match[1]})`);
    }
  }

  // 3) aralashtirish
  if (!src.includes('const matchSpread')) say("matchSpread yordamchisi yo'q");
  if (!/matchSpread\(/.test(src.replace('const matchSpread', ''))) say('matchSpread ishlatilmaydi');
  if (/shuffle\(task\.(?:right|pairs)\b/.test(src)) say("o'ng ustun hali shuffle bilan joylanadi");
}

if (!checked) {
  console.error("Juftlashtirish topshirig'i bo'lgan fayl topilmadi — skript joyini tekshiring.");
  process.exit(2);
}

if (failures.length) {
  console.error(`4-sinf juftlashtirish auditi: ${failures.length} ta buzilish (${checked} fayl tekshirildi).`);
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}
console.log(`4-sinf juftlashtirish auditi o'tdi: ${checked} ta amaliyot fayli uchala shartni bajaradi.`);
