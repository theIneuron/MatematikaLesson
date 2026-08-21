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
  'Dars01Practice.jsx': '8a9bc2c3984b32c0516d66bccb45f49a0353abbccf484dbc8e282b872f92d0e5',
  'Dars02Practice.jsx': '8eeb0c0bfd3430b940b0c2c540362a943cb893cfb89f24e7441b6fc8baeb5aab',
  'Dars03Practice.jsx': 'af4d5344deeb307b8d99ccefd00b59093e277af2b3d018379bcb901e0fae5181',
  'Dars04Practice.jsx': '0262a4a85c870d0207ff92b7f02e10210074f85246b521666be8119c88e9986e',
  'Dars05Practice.jsx': '33c5df29ecb926628a414dd2bbf0d8abb7842f75f8b2c7c01a8c47c0cb73c13f',
  'Dars06Practice.jsx': 'dc08e3df414ad86cb30874f0f96acb844ead76ba622f167399a1c5255fbbe116',
  'Dars07Practice.jsx': '8c8340bdccfefe97e8f2f8f3240762ae55d7e9d901deed2f6d310a11b2dfdb0f',
  'Dars08Practice.jsx': '4d60dd2cf01cbf49b73ff7c60643af9dc768fce1b6de80f033b168d1ff82f968',
  'Dars09Practice.jsx': '1ad2c217b4872226a96fdb9cdeaa80ba92ee29ef3ae59fe9e5b3d0324fd15f67',
  'Dars10Practice.jsx': '10888cf13fb195447dc9207f39318725bbae085572dcaf948b46c852cb356d7c',
  'Dars11Practice.jsx': 'c24484da56bcb31a8d8ad20f78517ea6615d7195eb756f445020568780295345',
  'Dars12Practice.jsx': '2abe8e30ae6d4e60fca161775e27662867671b721becc22af3808f488fdf1533',
  'Dars13Practice.jsx': '2a65eab4c7140edbc24a83188f06b95de56f7d0690e6321433be02ea3644cfb9',
  'Dars14Practice.jsx': '60c972b8ccc2d367c36d1d57b34a4e312032ebcc78f88745f0aa82978766d9ba',
  'Dars15Practice.jsx': 'fbecce11f4874287cebf18805f33d17179506be050a71193529571123025eb5a',
  'Dars16Practice.jsx': 'b0a5cc585b943ccdb214e26aa2027d3b8ba9c62496aeb143535f7a7a32bb050d',
  'Dars17Practice.jsx': 'e67f73b6ec28cb5320f2faae88427e44839ede613ec5f809c903a1205e604b5d',
  'Dars18Practice.jsx': 'a30b7ce737b1a10c13cf7db77e4b5dcd9172462ce003d662cc020757a153db99',
  'Dars19Practice.jsx': '64efbb6d0870381af87aad520f0ccdf76035217f3b422c9cc82ededb282b54c4',
  'Dars20Practice.jsx': '4c2aa0d0351424425165cea7557fa82c1b6bcb5949725c613274269172273c60',
  'Dars21Practice.jsx': 'f1c8d7e5dfef227da8f1646dc65283297ccf5db7a413e3d13675dfbebd31e45f',
  'Dars22Practice.jsx': '9544c56e1b7e39484fac5e6854753bc72522e4b95bd1898217bbefb63897367c',
  'Dars23Practice.jsx': '457da8b9080140e933bfc7dcd13bd0a7470585afcbc5165e224caca1ecdea5be',
  'Dars24Practice.jsx': '530bd76592c057ca4cb062a474143943ec3f69d3085032aca30d57e18c8bc864',
  'Dars25Practice.jsx': 'bdf72c4ce763441e9967617ebdb611428879cd1ee407aee18b97a39660372c4a',
  'Dars26Practice.jsx': 'cdcb0931659e77a1485bd51e3e80644d410edaf07b46609db3d2b672c8b3c413',
  'Dars27Practice.jsx': '1c271167bac0e8d437e84c9ab2973a1a6fa6f90384dadd464bedc11293efdc79',
  'Dars28Practice.jsx': '7049fe4875fa0cf001675f38e420a98a4e2d7d24ea589dda79cba573c7b9157f',
  'Dars29Practice.jsx': '71e3c649c0a4cfb6c9876843e91c755f1333beeaa039647bf0756fc3726c9fa6',
  'Dars30Practice.jsx': '9d3f6249643c470fb8ac9cadad7f068024f79ac7bef65f31b454923dc3f9dcdf',
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
