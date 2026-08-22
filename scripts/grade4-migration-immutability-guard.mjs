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
  'Dars01Practice.jsx': '8f4d9dcc3be3ffdd5fdd115e972f675660e6613bef206b799db33bab2adb6875',
  'Dars02Practice.jsx': '6d08bc093c2f3c2df11f788fc1f9a06487da53051f62291c20e4eb8555640f61',
  'Dars03Practice.jsx': '01905db6b52030bdf7233b60c2a8408749b56cbf39195a2b816a65888003efc9',
  'Dars04Practice.jsx': '92d3c32c03bd3392a7407e9925dbc2a216da361d7a573329db3f172e14fa2db0',
  'Dars05Practice.jsx': '9090fffeaa10c38033a3f8bf44040d85b82d57d2d815f97e6dd93392ea7105c3',
  'Dars06Practice.jsx': 'bc655a0aa40e127ea081366b73e80bc8246e452ab58da633a27ae335cba11709',
  'Dars07Practice.jsx': '9d14747fb6b0f8b29411bc33fa9d2c9fb983652518fc1481d4be1d5317c6f35e',
  'Dars08Practice.jsx': '215ffdfc0cefeb42cdcbea1fc24022cc6bc6f946f98307bf3a33260481cc4e3a',
  'Dars09Practice.jsx': '0fc9a2751b43e16141ceb108bc3e730ab888f3e9bbef0ff6c2b391f62a56a852',
  'Dars10Practice.jsx': 'b89bbaf7ca502e7388d06ad6f67cb6981f09c0f1e7c15c84023c5938174115c7',
  'Dars11Practice.jsx': '8f14e4a2bc7705d1fdedf7eb56812f8ae1e7a549d598e20c05c58c0b2ccf6ba2',
  'Dars12Practice.jsx': '3d4fc01dc3fadea69964b23529cfec45dc42a7ba93342589b326e9e90ddaa4c8',
  'Dars13Practice.jsx': 'e6e5ab0e9a79d9c0e1872faccbc79dd3f8c0e0dc916c481ae09f7a3d357772a8',
  'Dars14Practice.jsx': 'fcb7518400cdca0d78ddcefc8f3a2da3914bd4e390b3e7252d8c91fa94705d83',
  'Dars15Practice.jsx': '99286b64a33b237c84b7ed18321013099a37b586c22d9e7f4aaf355fa7eb5398',
  'Dars16Practice.jsx': '58e5038c53745ee205f31ab583d3cfa6ee9dd8cf512c2f22a01996aeb4b19d43',
  'Dars17Practice.jsx': 'ddad87efd58f079329e446809eb3428cbab446ad3a14dc2cf02c6e55bb238637',
  'Dars18Practice.jsx': '68455e808bbeb2c2accb6f953b127f27bfc9e66ba402089ea5abcac67122344d',
  'Dars19Practice.jsx': '7396a7be864283fd62df43cb834d37674896e4264c957f6c2f6c641fdd564566',
  'Dars20Practice.jsx': 'feab5560bae240b0f73876e8eaed7003a5608cc669876e23a89d7d5ffa3e5681',
  'Dars21Practice.jsx': 'cca9925dc310841f29d66afaf101fa45dab7ffc2635922651a8ef5246b14793b',
  'Dars22Practice.jsx': '2359cf00516762e9c2eecbe43212d03bf12ee732cf89394cbafcd52557773266',
  'Dars23Practice.jsx': '740f262c0e5f6095da45e3ad83c5df7f1deac1dab09d46ddf8251576ecfb777d',
  'Dars24Practice.jsx': 'dc396ab193bdd663782f3c19b96876895f54314475b4213cb3829919c895f22a',
  'Dars25Practice.jsx': 'f329c2dcc6dd823e93d426e01b5cef160622b7765b814f8602a25c96d437d518',
  'Dars26Practice.jsx': '18858d9684d9ddbea26e00453b328b01f92d49d18862db251d0647dde24d51c9',
  'Dars27Practice.jsx': '9e0bb5ea05bfda568da8078c636f41b9b34e2f8bedcddbe611e1f0cc9d8e87d2',
  'Dars28Practice.jsx': 'e38bdd4c9edcc10254e81afee287e9cddca2f8b907e5a6c81f1eb448a9d0530e',
  'Dars29Practice.jsx': '29662634aadcfed5e666eea759ec16decd96dd041d807c951582f33f29d8eecb',
  'Dars30Practice.jsx': 'cdfb76c64956ab3952b2cc2abace0f0c2597919c43e2a756985d3a97541e0818',
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
