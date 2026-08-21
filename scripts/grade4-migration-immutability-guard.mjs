#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src', 'components', 'grade4');
const DARS01_PATH = path.join(GRADE4_DIR, 'Dars01.jsx');
// Rebaselined after the approved Grade 4 theory answer-lock correction. The
// migration guard continues to protect this reviewed Dars01.jsx version.
const DARS01_BASELINE_SHA256 = '758c2075df9568ca63081b0dc99417e9745c7632dc02dcb346ae37344b5c5550';
// Rebaselined 2026-08-21: metodist barcha 4-sinf AMALIY darslarini
// o'zgartirishni so'radi — tekshirish tugmasi o'ngda (2-dars etaloni),
// moslashtirishda ikki tomon ramkalari teng, variantli savollarda xato
// javobdan keyin variantlar qayta aralashadi va to'g'ri javob bir o'rinda
// qotib qolmaydi. Guard keyingi tasodifiy o'zgarishlardan himoya qiladi.
const PRACTICE_BASELINE_SHA256 = {
  'Dars01Practice.jsx': '03e9d7231ef1749e81d800378464180a3d0921c55836c9461fbb13eeb66b3ca8',
  'Dars02Practice.jsx': 'e2f937a79088c8c784fc0e7f71bea5ce6de3bfa3129a1e9eaa0eac83b379afd5',
  'Dars03Practice.jsx': '6b33c4739f9da22b166a812cdbaf0a5382630e76cc4d869f24af4af4aaf4192f',
  'Dars04Practice.jsx': 'bdab718e3777c79bf106e647726188ac26a5b99dd0eaf69290231aa7783bf42c',
  'Dars05Practice.jsx': 'b08b6dbbffbbb73eb4e0ba4235584bd7899a771422a56a760f220f825ba21d3f',
  'Dars06Practice.jsx': 'fbf190998b2cfbd3acecd10600852cc728399c481f715bee1e65ac7e62016f15',
  'Dars07Practice.jsx': '205d1dffd6d19724e6761829725a55213f8aef8164a7247db41541b13f57cdfd',
  'Dars08Practice.jsx': '8f96123d2a8945b789a25f7e77790d20aac1411403217d0f5327ceeb1675e4da',
  'Dars09Practice.jsx': 'e518e306dd526aa21071abd9a5013cf1bef5b0b49a7e4a02235b9f2fa2aabdfa',
  'Dars10Practice.jsx': 'b1f899f64c4cbf9ee43767d2f6f651750819b4030b755106cadc19ddb98b15de',
  'Dars11Practice.jsx': 'b95b78bbd553ca6a12b266352fdeef12bec7340181196577a81b07e0800a7713',
  'Dars12Practice.jsx': '375b1e7974ddaf01b27464f87a991c8cbbd322ff0e6493cf54247b70aa51adea',
  'Dars13Practice.jsx': '21e3cbc024635bf169631f00ef96bd06b3259beb3197d82e18348f3947d2cf4e',
  'Dars14Practice.jsx': 'ae75613fce74f892d9fa5cfed95819b748f2b522bd1eab0c9bf54baa552fa190',
  'Dars15Practice.jsx': 'a42b20cf7cbf57d34527dca8f60d7a4d134ef73b533ec95cd9bc30600ac25035',
  'Dars16Practice.jsx': '1d6fea4e91c2d881ed21924c8b0e26e83b3503a6e985d1928ee0b63a4cd46f7d',
  'Dars17Practice.jsx': 'b692c86a5fe9538acbc28c4a4edfbf1d9be2c87a8ebaa295e0b7b28779c6dfc4',
  'Dars18Practice.jsx': '1c21ac4ee325578317d68dc6b8ff908e0327e4641e046ff1cb05391572201b62',
  'Dars19Practice.jsx': 'bd4d3510a9fdb8382cfcddd08cf14ec6a47f62aa607a81b914cdb7b6ce5e7756',
  'Dars20Practice.jsx': 'aa11c5a0cab78bded2fb771e42e76381f22d39f33f16cb9bac664a724a009732',
  'Dars21Practice.jsx': 'cfcc4964b8425d009a754be1e85524b80d710d6922430f8817e8d44dc807db47',
  'Dars22Practice.jsx': '34e8522936dd8cd0a813ce4603c125b81ce830dba284bfe27a7e2438fd9caf6f',
  'Dars23Practice.jsx': 'cea4084692ef3afe149681f71553d402f22a7d93b1d073482edfce4977a1eb94',
  'Dars24Practice.jsx': 'de93bef147dfb629eab50535e87cea8b194ff36049d858641e93ea57bae7818e',
  'Dars25Practice.jsx': '685ff5bc3dd4f02cd0c6e600e122fb0b8762060aa00aa87a32dc4d8226aa4a1b',
  'Dars26Practice.jsx': 'd8b64a16f4e99f9b0aa0329ec5d4b4561692b4b6e07e2e5b8812cfdcf5f90745',
  'Dars27Practice.jsx': 'b10b28613cdbc333df378bd991e7cbf105fc1653d7ec6c06de69c49f93c3029b',
  'Dars28Practice.jsx': '8f9476fee497769078bafcd46cf6111f4a41f68f7883df2e931056f89a235a57',
  'Dars29Practice.jsx': '7640c7546a2d3cd295ecbdfd2345573ac073ba224e04cd8537e9d8d7f965e33e',
  'Dars30Practice.jsx': '4e51489594575e8d35ff01d8615a2ed071f5de0316c3cd90f2d7fa4169099b3b',
};

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const failures = [];

const dars01Hash = sha256(await readFile(DARS01_PATH));
if (dars01Hash !== DARS01_BASELINE_SHA256) {
  failures.push(
    `Dars01.jsx o'zgargan: ${dars01Hash}; kutilgan baseline ${DARS01_BASELINE_SHA256}`,
  );
}

const practiceFiles = (await readdir(GRADE4_DIR))
  .filter((file) => /^Dars\d{2}Practice\.jsx$/.test(file))
  .sort();

// Guard vazifasi — ko'rikdan o'tgan migratsiya fayllarini jimgina o'zgarishdan
// SAQLASH. Yangi amaliyot faylining paydo bo'lishi buzilish emas: aks holda
// 31-40 va 41 bloklarini yozish umuman mumkin bo'lmaydi. Shuning uchun:
//   - baselinedagi fayl yo'qolsa yoki o'zgarsa — buzilish;
//   - baseline tashqarisidagi yangi fayl — faqat xabar, tekshiruvni yiqitmaydi.
const expectedPracticeFiles = Object.keys(PRACTICE_BASELINE_SHA256).sort();
const missingBaselineFiles = expectedPracticeFiles.filter((file) => !practiceFiles.includes(file));
if (missingBaselineFiles.length) {
  failures.push(`Baselinedagi Practice fayllari yo'qolgan: ${missingBaselineFiles.join(', ')}`);
}
const newPracticeFiles = practiceFiles.filter((file) => !(file in PRACTICE_BASELINE_SHA256));

for (const file of practiceFiles) {
  if (!(file in PRACTICE_BASELINE_SHA256)) continue;
  const hash = sha256(await readFile(path.join(GRADE4_DIR, file)));
  if (hash !== PRACTICE_BASELINE_SHA256[file]) {
    failures.push(`${file}: ${hash}; kutilgan ${PRACTICE_BASELINE_SHA256[file]}`);
  }
}

if (failures.length) {
  console.error(`Grade 4 migration immutability guard: ${failures.length} ta buzilish.`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Grade 4 migration immutability guard o'tdi: Dars01 SHA-256 ${dars01Hash}; `
  + `${expectedPracticeFiles.length} ta baseline Practice fayli o'zgarmagan.`,
);
if (newPracticeFiles.length) {
  console.log(`  Baseline tashqarisidagi yangi Practice fayllari: ${newPracticeFiles.join(', ')}.`);
}
