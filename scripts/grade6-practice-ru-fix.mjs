// 6-sinf amaliyoti: RUSCHA qatlamdagi til aralashuvini tuzatadi.
//
// Nima tuzatiladi (hammasi ruscha tomonda, uzbekcha va inglizcha tegilmaydi):
//   1. lotin o'lchov birligi ruscha matnda: «получается 44 cm» -> «44 см»;
//   2. ruscha izohda uzbekcha javob: «получается doira» -> «получается круг»;
//   3. variant yozuvining ruscha tarjimasi uzbekcha qolgan yoki yo'q;
//   4. algebraik ifodada kirill harfi: «2(м−1)» -> «2(m−1)» (o'zgaruvchi lotin);
//   5. ruscha son bilan kelishmagan so'z: «5 часа» -> «5 часов», «шт..» -> predmet nomi.
//
// Skript qayta ishga tushirilsa hech narsani buzmaydi: mos matn topilmasa, o'tib ketadi.
//
//   node scripts/grade6-practice-ru-fix.mjs [--dry]
import { readItem, taskPath, writeItem } from './grade6-practice-en-lib.mjs';

const dry = process.argv.includes('--dry');

// --- 1. lotin o'lchov birligi ruscha matnda --------------------------------
const UNIT_MAP = {
  'cm³': 'см³', 'cm²': 'см²', 'dm³': 'дм³', 'm³': 'м³', 'm²': 'м²',
  cm: 'см', km: 'км', mm: 'мм', dm: 'дм', kg: 'кг', ml: 'мл', l: 'л', m: 'м', g: 'г',
};
const UNIT_RE = /(\d)(\s*)(cm³|cm²|dm³|m³|m²|cm|km|mm|dm|kg|ml|l|m|g)(?![a-z²³])/g;
const fixUnits = (text) => text.replace(UNIT_RE, (whole, digit, space, unit) => `${digit}${space}${UNIT_MAP[unit]}`);

// --- 2 va 5. ruscha izoh matni --------------------------------------------
// Kalit — topshiriq, qiymat — [qidiriladigan bo'lak, o'rniga yoziladigan bo'lak].
const RU_TEXT = {
  D12_10: ['6 шт..', '6 стаканов.'],
  D13_10: ['72 шт..', '72 книги.'],
  D17_10: ['18 шт..', '18 книг.'],
  D36_07: ['получается 40 ming.', 'получается 40 тысяч.'],
  D37_01: ['получается radius.', 'получается радиус.'],
  D37_04: ['получается doira.', 'получается круг.'],
  D37_07: ['получается diametr.', 'получается диаметр.'],
  D38_10: ['получается 3 marta oshadi.', 'получается: длина увеличится в 3 раза.'],
  D42_04: ['получается to‘g‘ri burchakli.', 'получается: прямоугольный треугольник.'],
};

// --- 3 va 4. variant yozuvlarining ruscha tarjimasi -----------------------
const RU_LABELS = {
  // algebraik ifodada o'zgaruvchi lotin harfi bo'lib qoladi
  D31_06: { '2(m−1)': '2(m−1)' },
  D32_03: { '−3(m+2)': '−3(m+2)' },
  D33_03: { '3m+m': '3m+m' },
  // uzbekcha yozuv ruscha ekranda qolgan yoki umuman yo'q
  D37_03: { 'ikki nuqtani tutashtiradi': 'соединяет две точки' },
  D37_09: { 'chegara va ichki qism': 'граница и внутренняя часть' },
  D38_06: { 'yarim yoy': 'половина окружности' },
  D40_03: { 'to‘g‘ri to‘rtburchak': 'прямоугольник', 'turli tomonli uchburchak': 'разносторонний треугольник' },
  D41_06: { parallelogramm: 'параллелограмм' },
  // ruscha tarjimada ma'no buzilgan: markaz haqida gap ketadi, o'q haqida emas
  D41_09: { 'O ga nisbatan aks': 'отражение относительно точки O' },
  // so'zlar tushib qolgan tarjima
  D11_06: {
    '24 ning 5/8 qismi': '5/8 от 24',
    '36 ning 7/9 qismi': '7/9 от 36',
    '40 ning 3/5 qismi': '3/5 от 40',
  },
  // sanoq: predmet nomi «шт.» dan aniqroq
  D12_10: { '4 ta': '4 стакана', '5 ta': '5 стаканов', '6 ta': '6 стаканов', '8 ta': '8 стаканов' },
  D13_10: { '64 ta': '64 книги', '68 ta': '68 книг', '72 ta': '72 книги', '81 ta': '81 книга' },
  D17_10: { '15 ta': '15 книг', '18 ta': '18 книг', '20 ta': '20 книг', '30 ta': '30 книг' },
  // son bilan kelishuv
  D19_04: { '5 soat': '5 часов', '6 soat': '6 часов' },
  D19_07: { '8 soat': '8 часов', '9 soat': '9 часов' },
  D23_03: { '10 soat': '10 часов' },
  D24_04: { '4 birlik': '4 единицы' },
  D25_04: { '1 birlik': '1 единица' },
};

const changes = [];
const missing = [];

for (let lesson = 1; lesson <= 46; lesson += 1) {
  for (let task = 1; task <= 10; task += 1) {
    const file = taskPath(lesson, task);
    const id = `D${String(lesson).padStart(2, '0')}_${String(task).padStart(2, '0')}`;
    const { src, item, block } = readItem(file);
    let touched = false;

    for (const key of ['topic', 'prompt', 'explanation']) {
      const before = item[key].ru;
      if (typeof before !== 'string') continue;
      let after = fixUnits(before);
      const patch = RU_TEXT[id];
      if (patch && after.includes(patch[0])) after = after.replace(patch[0], patch[1]);
      if (after !== before) {
        item[key] = { ...item[key], ru: after };
        changes.push(`${id}.${key}.ru: ${before.slice(-46)}  ->  ${after.slice(-46)}`);
        touched = true;
      }
    }

    const labels = RU_LABELS[id];
    if (labels) {
      const table = { ...(item.translationsRu || {}) };
      for (const [label, ru] of Object.entries(labels)) {
        if (table[label] === ru) continue;
        if (table[label] === undefined && !(item.options || item.left || item.right || []).includes(label)) {
          // yozuv topilmasa jim o'tib ketmaymiz: topshiriq o'zgargan bo'lishi mumkin
          const known = [...(item.options || []), ...(item.left || []), ...(item.right || [])];
          if (!known.includes(label)) { missing.push(`${id}: "${label}" yozuvi topilmadi`); continue; }
        }
        changes.push(`${id}.translationsRu["${label}"]: ${table[label] ?? '(yo\'q)'}  ->  ${ru}`);
        table[label] = ru;
        touched = true;
      }
      if (touched) item.translationsRu = table;
    }

    if (touched && !dry) writeItem(file, src, block, item);
  }
}

console.log(`${dry ? 'ko\'rib chiqildi' : 'yozildi'}: ${changes.length} o'zgarish`);
changes.forEach((line) => console.log('  ' + line));
if (missing.length) {
  console.error(`\nDIQQAT (${missing.length}):`);
  missing.forEach((line) => console.error('  ' + line));
  process.exit(1);
}
