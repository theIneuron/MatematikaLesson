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
// Rebaselined 2026-08-21 (ikkinchi marta): metodist juftlashtirishdagi ikki
// nosozlikni tuzatishni so'radi — juftlikning ikki tomoni bir xil rang oladi
// va hammasini juftlagandan keyin ham qayta juftlash mumkin (tupik yo'q).
// Shu bilan birga o'ng ustun to'g'ri javob qarshisida turmaydi va past
// ekranda topshiriq skrollga ketmaydi. Guard keyingi tasodifiy
// o'zgarishlardan himoya qiladi.
const PRACTICE_BASELINE_SHA256 = {
  'Dars01Practice.jsx': 'afde26e02e4c74bac0a2e7872abe27d146dc23e3edc634aec83895d4d5f5fb64',
  'Dars02Practice.jsx': '7b5779df801380d6e305a836ee60bf89f46212e1eb6000958c3c0c0c9f413f6e',
  'Dars03Practice.jsx': 'b84bcfe998198463a8eeb4d002448c176de0125d13a3835a313301608ac5a08e',
  'Dars04Practice.jsx': 'a7c3ddfa8af39be98d10b27ae0db638e77154032fe2b6cf3842fa4637b693ff2',
  'Dars05Practice.jsx': '51b18e072f25097ca52d55047509dd160dd69d948bd55c3bf31e0fd13dc83961',
  'Dars06Practice.jsx': 'da7bd90502da2cfe7ca61c1f2aba81d2f733a233f473a76b45f663c7962d03f6',
  'Dars07Practice.jsx': '4be313e0feab72cb72c1dbf6933fec3a5328783ed36130a45e5fec0e0bf08a53',
  'Dars08Practice.jsx': '9ea466e54cd5ab007ba95e2dd048245506a6c24904ab2e866631425ccf97e09e',
  'Dars09Practice.jsx': 'c5a34d4bbaddd5cf521eaf9c1d2a6226ee07f71caba3307e0227cbc59a6a56b3',
  'Dars10Practice.jsx': '108e1b03586ead70673d6b5ae1ec1bf77c302ff0c803304c683d81a59c84dde7',
  'Dars11Practice.jsx': 'bf1c7000f50a2d191ed1e1cbfc30fd52f6255403a0edb558188cd697a1206c6e',
  'Dars12Practice.jsx': '3d4fc01dc3fadea69964b23529cfec45dc42a7ba93342589b326e9e90ddaa4c8',
  'Dars13Practice.jsx': 'c7c35842c2aa4128836838a2f2cc530fcbd0e56a57d44449ef6ef1812b6b3d03',
  'Dars14Practice.jsx': '60714bd878c8fd98c1615d876b74fb81e2f709da8aefe694d66bcd6c827d63f8',
  'Dars15Practice.jsx': '89d66a9d9f03826a8835f86766c45512d9fe11d6d4653920d688189dd9218c88',
  'Dars16Practice.jsx': '96ce3d726f0d639ddf973fd7c20c3eb13aafa5692acaa93f8d2ed84350cd644b',
  'Dars17Practice.jsx': '1551e61a5146f9206f7150f37456d3dd08481712f70e90ac34a72bb8dd8c4bd7',
  'Dars18Practice.jsx': 'e978d548296227e2787c61cc412815da348303435287c992abc16dd66601dd66',
  'Dars19Practice.jsx': '9f8aeb6bc266ded06932e185acc4792b93980c525ef7ab4c79530f7b9d493ef6',
  'Dars20Practice.jsx': 'fdfc28e763c580b3003b8c3b93f2322cb58d0efdbb95d79840cce74839d22f74',
  'Dars21Practice.jsx': 'ae3f31286b430b3fa55e536438be630d2c2801228dda67301a336a9327603c28',
  'Dars22Practice.jsx': '69176c62c1e9ff8942ed598d6438d9ffba413827490bfd5b458f5ee16f14f9d9',
  'Dars23Practice.jsx': '6e00aa5d7a177b77891da491621e5a0a3558b50d8054840539894280ffc2f096',
  'Dars24Practice.jsx': '3e5dcb825ca23811b29baacc889857f18ccedbf209a84bc815dd1d4d7da6b026',
  'Dars25Practice.jsx': 'bb1f91caef7353144ca7dfe589033b7cfd2eb0ed5cb5c047e55dbf60f20b39a0',
  'Dars26Practice.jsx': '25831dcfb0847a00a665982d270a122beab3ce9033f00a65a3bf6bfc777fc37a',
  'Dars27Practice.jsx': 'c5116b02418b99edb365a1f837f95097f82b95c2c31b87d638fdc28139c77f4e',
  'Dars28Practice.jsx': '118bb7830c00465b60f2bbaa50b19e45bd1584749dc2a4aea5bfc235e27db8df',
  'Dars29Practice.jsx': '3a1d88302d48e0aae02a863d1ba3b0312c0e084f12c17ca0268d2a172de1f21c',
  'Dars30Practice.jsx': '321f34b29df285daa818a48b104b61ca1a66e9cf2d762e8a55b5882412b4b525',
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
