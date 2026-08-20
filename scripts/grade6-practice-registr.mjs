// 6-sinf amaliyoti: MUROJAAT REGISTRI va TILLARNING ARALASHUVI.
//
// Bir topshiriqda uchta til yonma-yon turadi, shuning uchun xato ham ikki xil:
//   1) uzbekcha matn «sen» ga o'tib ketadi (buyruq shakli -ng / -ing / -ingiz
//      bo'lishi kerak: «toping», «yozing», emas «top», «yoz»);
//   2) bir tilning so'zi boshqa tilda qoladi — ruschada uzbekcha so'z
//      («получается doira»), uzbekchada kirill, inglizchada uzbekcha so'z.
//
// Ishlatish:
//   node scripts/grade6-practice-registr.mjs           // 46 dars
//   node scripts/grade6-practice-registr.mjs 20        // bitta dars
import {
  TASKS_PER_LESSON, labelsOf, needsTranslation, parseLessons, readItem, taskId, taskPath,
} from './grade6-practice-en-lib.mjs';

const lessons = parseLessons(process.argv.slice(2));
const problems = [];
const bad = (where, msg, text) => problems.push(`${where}  ${msg}\n      ${String(text).slice(0, 120)}`);

// --- 1. «sen» belgilari -----------------------------------------------------
const PRON = /\b(sen|sening|senga|seni|sendan|senda)\b/i;
const FIN = /\b[a-z'‘’]+(san|ding|gansan|yapsan|arsan|ibsan|masan)\b/i;
const FIN_OK = /^(insan|doston)$/i;
const GIN = /\b[a-z'‘’]+gin\b/i;

// Buyruq fe'lining yalang'och o'zagi — bu «sen» ga murojaat. Ro'yxat amaliyotda
// uchraydigan fe'llardan: yangi fe'l chiqsa shu yerga qo'shiladi.
const STEMS = [
  'top', 'yoz', 'hisobla', 'tanla', "bog'la", 'moslashtir', 'kirit', "qo'sh", 'ayir',
  "ko'paytir", "bo'l", 'qisqartir', 'kengaytir', 'keltir', 'tekshir', 'soddalashtir',
  'ixchamla', 'yech', 'aylantir', 'siljit', 'yaxlitla', 'tuz', 'och', 'ajrat', 'solishtir',
  'aniqla', 'yasa', 'akslantir', 'toping'.slice(0, 0) || 'juftla', 'belgila', 'chizib',
].filter(Boolean);
const STEM_RE = new RegExp(`(?<![a-z'‘’])(${STEMS.map((s) => s.replace(/'/g, "['‘’]")).join('|')})(?![a-z'‘’])`, 'i');

// --- 2. tillarning aralashuvi ----------------------------------------------
const CYRILLIC = /[Ѐ-ӿ]/;
// Ruscha matnda lotin yozuvi faqat o'lchov birligi, o'zgaruvchi yoki formula
// bo'lishi mumkin. Qolgani — boshqa tildan qolib ketgan so'z.
const RU_LATIN_OK = new Set([
  'cm', 'km', 'mm', 'dm', 'm', 'kg', 'g', 'l', 'ml', 't', 'min', 's', 'h',
  'x', 'y', 'a', 'b', 'c', 'n', 'k', 'p', 'q', 'r', 'd', 'v', 'f', 'ab', 'abc',
  'ah', 'bh', 'pr', 'xy', 'ii', 'iii', 'iv', 'vi', 'vii', 'viii', 'ix',
]);
// Inglizcha matnda uzbekcha so'zning izlari.
const UZ_MARKS = /(?<![a-z])(ta|ming|so['‘’]m|qism|qismi|soni|toping|yozing|hisoblang|bo['‘’]l\w*|nechta|marta|soat|kun|birlik|chorak|doira|aylana|radius\w+|vatar|yoy|uch\w*|tomon\w*|burchak\w*|moda|mediana)(?![a-z])/i;

const latinWords = (text) => String(text)
  .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '')
  .split(/[^A-Za-z'‘’]+/)
  .filter(Boolean);

let count = 0;

for (const lesson of lessons) {
  for (let task = 1; task <= TASKS_PER_LESSON; task += 1) {
    const id = taskId(lesson, task);
    const { item } = readItem(taskPath(lesson, task));
    count += 1;

    const fields = [
      ...['topic', 'prompt', 'explanation'].map((key) => [key, item[key]]),
    ];

    for (const [key, node] of fields) {
      const uz = node.uz || '';
      const ru = node.ru || '';
      const en = node.en || '';
      const at = `${id}.${key}`;

      // 1. registr
      if (PRON.test(uz)) bad(at, 'uzbekchada «sen» olmoshi', uz);
      const fin = uz.match(FIN);
      if (fin && !FIN_OK.test(fin[0])) bad(at, `uzbekchada «sen» shakli (${fin[0]})`, uz);
      if (GIN.test(uz)) bad(at, `uzbekchada -gin buyrug'i (${uz.match(GIN)[0]})`, uz);
      const stem = uz.match(STEM_RE);
      if (stem) bad(at, `uzbekchada yalang'och buyruq (${stem[0]})`, uz);

      // 2. aralashuv
      if (CYRILLIC.test(uz)) bad(at, 'uzbekchada kirill harflari', uz);
      if (CYRILLIC.test(en)) bad(at, 'inglizchada kirill harflari', en);
      for (const word of latinWords(ru)) {
        if (word.length < 2) continue;
        // Nuqta va kesma nomlari bosh harf bilan yoziladi: OA, AB, AA — bu geometriya belgisi.
        if (/^[A-Z']+$/.test(word)) continue;
        if (!RU_LATIN_OK.has(word.toLowerCase())) bad(at, `ruschada uzbekcha/lotin so'z «${word}»`, ru);
      }
      const uzInEn = en.match(UZ_MARKS);
      if (uzInEn) bad(at, `inglizchada uzbekcha so'z «${uzInEn[0]}»`, en);
      if (/\.\./.test(ru)) bad(at, 'ruschada ikkita nuqta', ru);
    }

    // Uzbekcha variant yozuvi ruscha ekranda qolib ketmasin.
    for (const label of labelsOf(item)) {
      if (!needsTranslation(label)) continue;
      if (!item.translationsRu?.[label]) bad(`${id}.translationsRu`, `«${label}» ruschaga o'tmagan`, label);
    }

    // Variant yozuvlari: ruscha va inglizcha xaritalar.
    for (const [table, lang] of [[item.translationsRu, 'ruscha'], [item.translationsEn, 'inglizcha']]) {
      for (const [key, value] of Object.entries(table || {})) {
        const at = `${id}.translations${lang === 'ruscha' ? 'Ru' : 'En'}["${key}"]`;
        if (lang === 'ruscha') {
          for (const word of latinWords(value)) {
            if (word.length < 2) continue;
            if (!RU_LATIN_OK.has(word.toLowerCase())) bad(at, `ruscha yozuvda lotin so'z «${word}»`, value);
          }
        } else if (CYRILLIC.test(value)) {
          bad(at, 'inglizcha yozuvda kirill', value);
        }
      }
    }
  }
}

console.log(`tekshirildi: ${count} topshiriq`);
if (!problems.length) {
  console.log('registr va tillar toza');
} else {
  problems.forEach((p) => console.log('  ' + p));
}
console.log(`jami: ${problems.length}`);
process.exit(problems.length ? 1 : 0);
