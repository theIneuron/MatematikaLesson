// Разовая правка: подписи, которые лежали в уроке ОДНОЙ строкой и потому показывались
// по-русски и на узбекском экране, становятся парой { ru, uz }.
// Ключи те, что нашла проверка grade3-lang-slot-check.
import fs from 'node:fs';
import path from 'node:path';

const KEYS = ['label', 'res', 'swap_line', 'check', 'step1', 'step2', 'rule_ex', 'fig_line', 'tbl_cells', 'stmts', 'lines', 'plate'];

// Термины взяты из уже написанных узбекских текстов этих же уроков: maxraj, surat, ulush,
// qoldiq, perimetr, yuza, butun — так они звучат в учебнике 3 класса.
const UZ = {
  '(ост. 5)': '(qold. 5)',
  '1 неделя = 7 суток': '1 hafta = 7 sutka',
  '1 сутки = 24 часа': '1 sutka = 24 soat',
  '1 ч 20 мин': '1 soat 20 daq',
  '1 час': '1 soat',
  '1/2 — одна вторая': '1/2 — bir ikkidan',
  '1/3 больше, чем 1/6': '1/3 1/6 dan katta',
  '1/3 — крупный кусок': "1/3 — yirik bo'lak",
  '1/6 — мелкий кусок': "1/6 — mayda bo'lak",
  '100 мин, на 40 больше': "100 daq, 40 taga ko'p",
  '11/4 = 2 целых 3/4': '11/4 = 2 butun 3/4',
  '12 клеток': '12 katak',
  '12 равных частей, закрашено 7': "12 teng qism, 7 tasi bo'yalgan",
  '15 = 1 десяток и 5': "15 = 1 o'nlik va 5",
  '18 увезли, 22 осталось': '18 tasi olib ketildi, 22 tasi qoldi',
  '2 ч = 120 мин': '2 soat = 120 daq',
  '2 части → 1/2': '2 qism → 1/2',
  '2/3 от 12 это 8': "12 ning 2/3 qismi 8",
  '2/3 от 9 см это 6 см': '9 sm ning 2/3 qismi 6 sm',
  '20 плиток': '20 plitka',
  '25 суток, 96 часов': '25 sutka, 96 soat',
  '27 нужно, 3 останется': '27 kerak, 3 ortadi',
  '3/4 меньше целого': "3/4 butundan kichik",
  '37 : 2 = 18 (ост. 1) · 18 · 2 = 36': '37 : 2 = 18 (qold. 1) · 18 · 2 = 36',
  '4 < 9, значит 4 ≤ 9 истинно': '4 < 9, demak 4 ≤ 9 rost',
  '4 боковых, 5 граней, 5 вершин': '4 yon, 5 yoq, 5 uch',
  '4 оси, 2 оси, 90°': "4 o'q, 2 o'q, 90°",
  '4 угла': '4 burchak',
  '4 угла, 2 пары, 3 стороны': '4 burchak, 2 juft, 3 tomon',
  '40 нужно, 10 останется': '40 kerak, 10 ortadi',
  '42 : 2 = 21, полных полок 3': "42 : 2 = 21, to'liq javon 3",
  '45 + 54 = 99, 99 : 8 = 12, ответ 12 кг': '45 + 54 = 99, 99 : 8 = 12, javob 12 kg',
  '46 : 5 = 8 (ост. 6) · 8 · 5 + 6 = 46': '46 : 5 = 8 (qold. 6) · 8 · 5 + 6 = 46',
  '48 : 3 = 16, 16 : 5 = 3 (ост. 1)': '48 : 3 = 16, 16 : 5 = 3 (qold. 1)',
  '5 : 2 = 2 (ост. 1)': '5 : 2 = 2 (qold. 1)',
  '5 < 5 — нет': "5 < 5 — yo'q",
  '5 ≤ 5 истинно, 7 ≥ 9 ложно': "5 ≤ 5 rost, 7 ≥ 9 yolg'on",
  '5/4 = 1 целая 1/4': '5/4 = 1 butun 1/4',
  '5/4 = 1 целая и 1/4': '5/4 = 1 butun va 1/4',
  '5/4 больше целого': '5/4 butundan katta',
  '53 : 4 = 12 (ост. 5)': '53 : 4 = 12 (qold. 5)',
  '60 мин = 1 ч': '60 daq = 1 soat',
  '60 минут': '60 daqiqa',
  '7 клеток в строке': 'qatorda 7 katak',
  '7/10 и 3/10, потом 4/5 и 4/9': '7/10 va 3/10, keyin 4/5 va 4/9',
  '7/3 = 2 целых 1/3': '7/3 = 2 butun 1/3',
  '8 · 3 = 24, потом 8 + 24 = 32': '8 · 3 = 24, keyin 8 + 24 = 32',
  '8 равных частей, закрашено 3': "8 teng qism, 3 tasi bo'yalgan",
  '8 рёбер, 16 м': '8 qirra, 16 m',
  '8 частей → 1/8': '8 qism → 1/8',
  '9 дней = 1 неделя и 2 дня': '9 kun = 1 hafta va 2 kun',
  '95 : 12 = 7 (ост. 11)': '95 : 12 = 7 (qold. 11)',
  '99 : 8 = 12 (ост. 3)': '99 : 8 = 12 (qold. 3)',
  'P разный': 'P har xil',
  'S одинаковая': 'S bir xil',
  'x + 3 = 10, корень x = 7': 'x + 3 = 10, ildiz x = 7',
  'x = 18, проверка 18 + 12 = 30': 'x = 18, tekshiruv 18 + 12 = 30',
  'x = 48, проверка 48 : 6 = 8': 'x = 48, tekshiruv 48 : 6 = 8',
  'x — слагаемое': "x — qo'shiluvchi",
  'было 40': '40 edi',
  'в году 12 месяцев': 'yilda 12 oy',
  'везде по 60': 'hamma yerda 60 tadan',
  'весы 2 кг': 'tarozi 2 kg',
  'взяли': 'olindi',
  'внутри': 'ichida',
  'вопрос решает': 'savol hal qiladi',
  'все углы острые': "hamma burchak o'tkir",
  'всего 16': 'jami 16',
  'всего частей': 'jami qism',
  'гвозди 500 г, вата 300 г': 'mix 500 g, paxta 300 g',
  'год = 12 …': 'yil = 12 …',
  'градусов': 'daraja',
  'граммов': 'gramm',
  'грани сходятся в вершине': 'yoqlar uchda tutashadi',
  'два действия смотрят в разные стороны': 'ikki amal qarama-qarshi tomonga qaraydi',
  'два признака: углы и стороны': 'ikki belgi: burchak va tomon',
  'диски разрезаны на 4 и на 10': "disklar 4 ga va 10 ga bo'lingan",
  'доля одна, числа разные': 'ulush bitta, sonlar har xil',
  'доска 2 м 30 см': 'taxta 2 m 30 sm',
  'закрашено': "bo'yalgan",
  'зал 8 на 5': 'zal 8 ga 5',
  'запись истинна': 'yozuv rost',
  'запятая отделяет целые от долей': 'vergul butunni ulushdan ajratadi',
  'знаменатель': 'maxraj',
  'знаменатель большей': 'kattaning maxraji',
  'знаменатель не меняется': "maxraj o'zgarmaydi",
  'истинно или ложно': "rost yoki yolg'on",
  'квадрат': 'kvadrat',
  'квадрат 6': 'kvadrat 6',
  'квадрат и прямоугольник': "kvadrat va to'rtburchak",
  'клеток': 'katak',
  'корень только один': 'ildiz faqat bitta',
  'круг и одна вершина': 'doira va bitta uch',
  'мелкое в г, крупное в кг': 'maydasi g da, yirigi kg da',
  'месяц: 30, 31 или 28 дней': 'oy: 30, 31 yoki 28 kun',
  'метр это сто сантиметров': 'metr bu yuz santimetr',
  'минут': 'daqiqa',
  'не закрашено': "bo'yalmagan",
  'не меняется': "o'zgarmaydi",
  'один угол решает': 'bitta burchak hal qiladi',
  'основание + вершина': 'asos + uch',
  'основание — многоугольник': "asos — ko'pburchak",
  'осталось 3 кг': '3 kg qoldi',
  'остаток': 'qoldiq',
  'ответ 20 плиток': 'javob 20 plitka',
  'ответ 32 кристалла': 'javob 32 kristall',
  'панели 3 на 6 и 2 на 9': 'panellar 3 ga 6 va 2 ga 9',
  'панель 5 и 7': 'panel 5 va 7',
  'панель 6 и 4': 'panel 6 va 4',
  'панель 6 на 5': 'panel 6 ga 5',
  'панель 7 и 3': 'panel 7 va 3',
  'периметр': 'perimetr',
  'периметр это сумма всех сторон': "perimetr bu hamma tomonlar yig'indisi",
  'пирамида с квадратным основанием': 'asosi kvadrat piramida',
  'площадь мерят квадратными единицами': "yuza kvadrat birliklarda o'lchanadi",
  'пол → S, ограда → P': 'pol → S, panjara → P',
  'половина': 'yarmi',
  'половина от 10': '10 ning yarmi',
  'половина — 6': 'yarmi — 6',
  'половинки не совпали': 'yarimlar mos kelmadi',
  'половинки разошлись': 'yarimlar ajralib ketdi',
  'половинки совпали': 'yarimlar mos keldi',
  'половину': 'yarmini',
  'поход 9 дней': 'sayohat 9 kun',
  'проверка складыванием': 'buklab tekshirish',
  'проверка: 20 − 6 = 14': 'tekshiruv: 20 − 6 = 14',
  'прямой 90°, острый < 90°, тупой > 90°': "to'g'ri 90°, o'tkir < 90°, o'tmas > 90°",
  'прямой угол': "to'g'ri burchak",
  'прямоугольник': "to'rtburchak",
  'разные величины': 'har xil kattaliklar',
  'рама 16, всего 22': 'ramka 16, jami 22',
  'рама 2, вставка 4': "ramka 2, qo'shimcha 4",
  'рама прямоугольная': "ramka to'rtburchak",
  'с основанием': 'asosi bilan',
  'сколько': 'nechta',
  'слагаемое': "qo'shiluvchi",
  'слева': 'chapda',
  'сначала смотрим, что совпало': 'avval nima mos kelganiga qaraymiz',
  'справа': "o'ngda",
  'сторон': 'tomon',
  'считаем все линии сгиба': "hamma buklanish chizig'ini sanaymiz",
  'считаем до вопроса': 'savolgacha sanaymiz',
  'считаем равные стороны': 'teng tomonlarni sanaymiz',
  'считали только видимые': "faqat ko'rinadiganini sanashdi",
  'треть': 'uchdan biri',
  'треугольная, четырёхугольная пирамида': "uchburchakli, to'rtburchakli piramida",
  'урок 45 минут': 'dars 45 daqiqa',
  'фигуру просто повернули': 'shakl shunchaki burildi',
  'целое 24, доля 1/3': 'butun 24, ulush 1/3',
  'частей': 'qism',
  'частей больше — доля меньше': "qism ko'p — ulush kichik",
  'частей в целом': 'butundagi qism',
  'чаша с гвоздями ниже': 'mixli tovoq pastroq',
  'четверть — 3': 'chorak — 3',
  'числитель большей': 'kattaning surati',
  'число': 'son',
  'штук': 'dona',
  // сокращения единиц: на узбекском экране кириллицы быть не должно даже в «см»
  '1 дм = 10 см': '1 dm = 10 sm',
  '1 м + 20 см': '1 m + 20 sm',
  '10 см = 1 дм': '10 sm = 1 dm',
  '12 см²': '12 sm²',
  '16 см² ? 16 см': '16 sm² ? 16 sm',
  '2 кг': '2 kg',
  '2 кг + 500 г': '2 kg + 500 g',
  '2 кг = 2000 г': '2 kg = 2000 g',
  '2 м': '2 m',
  '2 м + 30 см = 230 см': '2 m + 30 sm = 230 sm',
  '2 м 30 см = 230 см': '2 m 30 sm = 230 sm',
  '2 по 3': '2 tadan 3',
  '2/3 от 24': '24 ning 2/3 qismi',
  '20 см = 2 дм': '20 sm = 2 dm',
  '2000 г = 800 г + 1200 г': '2000 g = 800 g + 1200 g',
  '3 кг': '3 kg',
  '3 м': '3 m',
  '3 м = 300 см': '3 m = 300 sm',
  '340 см = 34 дм': '340 sm = 34 dm',
  '40 см': '40 sm',
  '5 = 5 — да': '5 = 5 — ha',
  '5 и 3': '5 va 3',
  '500 г > 300 г': '500 g > 300 g',
  '700 г': '700 g',
  '= 16 м': '= 16 m',
  'P = 15 м': 'P = 15 m',
  'P = 16 м': 'P = 16 m',
  'P = 20 м': 'P = 20 m',
  'S = 12 см²': 'S = 12 sm²',
  'S = 16 см²': 'S = 16 sm²',
  'S = 18 см²': 'S = 18 sm²',
  'S = 21 см²': 'S = 21 sm²',
  'S = 24 см²': 'S = 24 sm²',
  'S = 24 см², P = 20 см': 'S = 24 sm², P = 20 sm',
  'S = 25 см²': 'S = 25 sm²',
  'S = 30 см², P = 22 см': 'S = 30 sm², P = 22 sm',
  'S = 35 см²': 'S = 35 sm²',
  'S = 36 см², P = 24 см': 'S = 36 sm², P = 24 sm',
  'S = 6 · 4 = 24 см²': 'S = 6 · 4 = 24 sm²',
  'S = 6 · 6 = 36 см²': 'S = 6 · 6 = 36 sm²',
  'см': 'sm',
  'ч': 'soat',
  // здесь в общей строке стоял УЗБЕКСКИЙ текст, русский экран показывал его же
  'Jami 21': { ru: 'Всего 21', uz: 'Jami 21' }
};

const q = (s) => (s.includes("'") ? `"${s.replace(/"/g, '\\"')}"` : `'${s}'`);
const pair = (ru) => {
  const v = UZ[ru];
  if (v === undefined) return null;
  if (typeof v === 'object') return `{ ru: ${q(v.ru)}, uz: ${q(v.uz)} }`;
  return `{ ru: ${q(ru)}, uz: ${q(v)} }`;
};

const DIR = 'src/components/grade3';
const files = fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort().map((f) => path.join(DIR, f));
const missing = new Set();
let total = 0;

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  const before = src;
  let n = 0;
  for (const key of KEYS) {
    // одиночное значение: `key: 'текст'`
    src = src.replace(new RegExp(`(\\b${key}: )(['"])([^'"\\n]*)\\2`, 'g'), (m, head, _qt, val) => {
      const p = pair(val);
      if (!p) { if (/[А-Яа-яЁё]/.test(val)) missing.add(val); return m; }
      n++; return head + p;
    });
    // массив: `key: ['a', 'b']`
    src = src.replace(new RegExp(`(\\b${key}: \\[)([^\\]\\n]*)(\\])`, 'g'), (m, head, body, tail) => {
      if (/\{/.test(body)) return m;
      const parts = body.split(/,\s*/).filter((x) => x.trim() !== '');
      let touched = false;
      const out = parts.map((raw) => {
        const t = raw.trim();
        const mm = t.match(/^(['"])(.*)\1$/);
        if (!mm) return t;
        const p = pair(mm[2]);
        if (!p) { if (/[А-Яа-яЁё]/.test(mm[2])) missing.add(mm[2]); return t; }
        touched = true; n++; return p;
      });
      return touched ? head + out.join(', ') + tail : m;
    });
  }
  if (src !== before) { fs.writeFileSync(file, src, 'utf8'); total += n; console.log(`${path.basename(file)}: ${n}`); }
}
console.log(`\nпереведено значений: ${total}`);
if (missing.size) { console.log('\nБЕЗ ПЕРЕВОДА (нет в таблице):'); [...missing].forEach((m) => console.log('  ' + m)); }
