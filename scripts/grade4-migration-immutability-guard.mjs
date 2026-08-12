#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src', 'components', 'grade4');
const DARS01_PATH = path.join(GRADE4_DIR, 'Dars01.jsx');
const DARS01_BASELINE_SHA256 = '982f8fd8a76a884da75866f772174ac6e11fcf5db69152d1c555d6b26b29a282';
const PRACTICE_BASELINE_SHA256 = {
  'Dars01Practice.jsx': '8a25d45799e0212217385c33832b1d849c2dd4ae1e751fd5ca9e9bc8760f1afd',
  'Dars02Practice.jsx': 'a76c3faf495255e857f80786df0f2a88a307cfe0291716417c71c97bee6bbb9f',
  'Dars03Practice.jsx': 'c0a8b35470fd684823001cadcf565d56fc5d2d7e385dd34d3a9041103ce74c92',
  'Dars04Practice.jsx': 'f425a2db9a9d1f00dcd02913154783ea2da2453b85c1fce00940d94ba437707b',
  'Dars05Practice.jsx': '938ebd96575709d0be8ab73c1b9b6c06e24650b18b92ed5d303cdc4b96eb5376',
  'Dars06Practice.jsx': 'e1032934658bf6635eead8aac820f60a28e3b8b896df29350d5d8fd1866c2f76',
  'Dars07Practice.jsx': '77eeef6cabe2549dbba3d59a19d989e5903e379da53f8f1f256c89ae616cedb1',
  'Dars08Practice.jsx': '16d843de17dedcf1cc3c535935b4f1cd3d27f505e5e48df40058af3cfbac6600',
  'Dars09Practice.jsx': '5a72bbdfd0fdf44e3a1a84d86f23356761dc627f1ec25a33de5677249b5c7788',
  'Dars10Practice.jsx': '6f0c0ae024936f56345de9087a544cc5a065fd685f35a76a5ad309761acfeeb9',
  'Dars11Practice.jsx': 'e38dbf9ecb915435ebebd32a00604e67d2e61c766cf11fbf0e2770307a3012fb',
  'Dars12Practice.jsx': 'e01c2cc96665a5048f8dcc78307fd83452320cef1899ddde9a1bb37b1ed91c7d',
  'Dars13Practice.jsx': '708cd10a29369217af50b4f172fd52b73a58ecc9114992987467c1b21ebf67d8',
  'Dars14Practice.jsx': '513dc270cd4e20274631704b2dbbf26410cea20718479d60b1ed90b3d0bce727',
  'Dars15Practice.jsx': 'e73c1be95d19026fc868ba3daf30b28b9c429fd85c4bea6085e1dcc5cfb681fe',
  'Dars16Practice.jsx': '5da1b638ea4a90f78fdd618f21078af83ded63f3ef1689e860b514edf9d908f0',
  'Dars17Practice.jsx': '708161f37e5cc181cd1c9f87289946a28b048952b16e6ba4d5d8441bc9340d90',
  'Dars18Practice.jsx': 'f9d5ccdf968428142019100bac68746957d015140d8ad9abaa791cd854c55fc5',
  'Dars19Practice.jsx': 'aaca7b7a8a99feecdd5ddeb1ab718088de813e799eefed4df197e28d4a641862',
  'Dars20Practice.jsx': 'ad28aa6764355f31d2a63f1ca3d47c69ba7973d2989990629e3d65f81ebd8652',
  'Dars21Practice.jsx': '8d28a71c75677c23ad5c95ab55ab2438a73db68e815f722c13d8cb6c40a7bcf8',
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

const expectedPracticeFiles = Object.keys(PRACTICE_BASELINE_SHA256).sort();
if (practiceFiles.join('\n') !== expectedPracticeFiles.join('\n')) {
  failures.push(
    `Practice fayllari ro'yxati o'zgargan: ${practiceFiles.length} ta; `
    + `baseline bo'yicha ${expectedPracticeFiles.length} ta`,
  );
}

for (const file of practiceFiles) {
  const hash = sha256(await readFile(path.join(GRADE4_DIR, file)));
  if (hash !== PRACTICE_BASELINE_SHA256[file]) {
    failures.push(`${file}: ${hash}; kutilgan ${PRACTICE_BASELINE_SHA256[file] ?? 'fayl baseline ro\'yxatida yo\'q'}`);
  }
}

if (failures.length) {
  console.error(`Grade 4 migration immutability guard: ${failures.length} ta buzilish.`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Grade 4 migration immutability guard o'tdi: Dars01 SHA-256 ${dars01Hash}; `
  + `${practiceFiles.length} ta Practice fayli turn-start baseline bilan bir xil.`,
);
