import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// 4-SINF · 11-DARS · Ko'p xonali sonni uch xonali songa ko'paytirish

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-4-11-v1',
  slug: 'dars11-kop-xonali-sonni-uch-xonali-songa-kopaytirish',
  lessonTitle: {
    uz: "11-dars. Ko'p xonali sonni uch xonali songa ko'paytirish",
    ru: 'Урок 11. Умножение многозначного числа на трёхзначное',
  },
  skillTags: ['place_value', 'partial_products', 'row_shift', 'internal_zero', 'estimation'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'OptionalPrediction', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'OptionalPrediction', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's4', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's5', type: 'exploration', template: 'OptionalPrediction', scored: false, scope: null },
  { id: 's6', type: 'exploration', template: 'OptionalPrediction', scored: false, scope: null },
  { id: 's7', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's8', type: 'practice', template: 'Matching', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'practice', template: 'Construction', scored: true, scope: 'module-mikro' },
  { id: 's10', type: 'practice', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'practice', template: 'Strategy', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'practice', template: 'ErrorRepair', scored: true, scope: 'module-mikro' },
  { id: 's13', type: 'case', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'summary', template: 'SummaryScreen', scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Shahar panellari', ru: 'Городские панели' },
    title: { uz: 'Natija qanchalik katta?', ru: 'Насколько велик результат?' },
    question: { uz: "Natija qaysi oraliqda bo'ladi?", ru: 'В каком диапазоне будет результат?' },
    options: [
      { uz: '7 000–8 000', ru: '7 000–8 000' },
      { uz: '70 000–80 000', ru: '70 000–80 000' },
      { uz: '700 000–800 000', ru: '700 000–800 000' },
    ],
    closedSet: true,
    wrong: [
      { uz: "Bu oraliq 314 ta guruh uchun juda kichik.", ru: 'Этот диапазон слишком мал для 314 групп.' },
      { uz: "To'g'ri taxmin.", ru: 'Верная оценка.' },
      { uz: "Bu oraliq 314 ta guruh uchun juda katta.", ru: 'Этот диапазон слишком велик для 314 групп.' },
    ],
    audio: {
      uz: ["Bitta panelga ikki yuz o'ttiz oltita kontakt kerak.", "Shahar uch yuz o'n to'rtta bir xil panel o'rnatmoqda.", 'Aniq hisoblamasdan javobning kattaligini taxmin qiling.'],
      ru: ['Для одной панели нужны двести тридцать шесть контактов.', 'Город устанавливает триста четырнадцать одинаковых панелей.', 'Не вычисляя точно, оцени величину ответа.'],
    },
  },
  s1: {
    eyebrow: { uz: 'Xona tarkibi', ru: 'Разрядный состав' },
    title: { uz: '314 sonini ajratamiz', ru: 'Раскладываем число 314' },
    question: { uz: "314 sonining to'g'ri yoyiq yozuvini tanlang.", ru: 'Выбери верное разложение числа 314.' },
    options: [
      { uz: '300 + 10 + 4', ru: '300 + 10 + 4' }, { uz: '30 + 10 + 4', ru: '30 + 10 + 4' },
      { uz: '300 + 100 + 4', ru: '300 + 100 + 4' }, { uz: '3 000 + 10 + 4', ru: '3 000 + 10 + 4' },
    ],
    wrong: [
      { uz: "To'g'ri yoyiq yozuv.", ru: 'Верное разложение.' },
      { uz: "3 yuzlar xonasida, o'nlar xonasida emas.", ru: 'Цифра 3 стоит в сотнях, а не в десятках.' },
      { uz: '1 bu yerda 10 ni bildiradi, 100 ni emas.', ru: 'Цифра 1 здесь означает 10, а не 100.' },
      { uz: '3 yuzlar xonasida, minglar xonasida emas.', ru: 'Цифра 3 стоит в сотнях, а не в тысячах.' },
    ],
    audio: {
      uz: ["Uch yuz o'n to'rt sonidagi uch raqami yuzlar xonasida turadi.", "Bir raqami o'nlar xonasida turadi.", "To'rt raqami birlar xonasida turadi.", "Sonning to'g'ri yoyiq yozuvini tanlang."],
      ru: ['Цифра три в числе триста четырнадцать стоит в разряде сотен.', 'Цифра один стоит в разряде десятков.', 'Цифра четыре стоит в разряде единиц.', 'Выбери верное разложение числа.'],
    },
  },
  s2: {
    eyebrow: { uz: "To'liqsiz ko'paytmalar", ru: 'Неполные произведения' },
    title: { uz: 'Nechta qator kerak?', ru: 'Сколько строк нужно?' },
    question: { uz: "Nechta to'liqsiz ko'paytma kerak?", ru: 'Сколько неполных произведений нужно?' },
    options: [{ uz: '2 ta', ru: '2' }, { uz: '3 ta', ru: '3' }, { uz: '314 ta', ru: '314' }],
    closedSet: true,
    wrong: [
      { uz: 'Ikki qator yuzlik qismini qoldirib ketadi.', ru: 'Две строки теряют часть сотен.' },
      { uz: "To'g'ri. Har bir xona qismiga bitta qator.", ru: 'Верно. По одной строке для каждой разрядной части.' },
      { uz: 'Har bir guruhga emas, har bir xona qismiga bitta qator kerak.', ru: 'Нужна одна строка для каждой разрядной части, а не для каждой группы.' },
    ],
    audio: {
      uz: ["Ikki xonali ko'paytiruvchida ikkita qator ishlatgan edik.", "Uch yuz o'n to'rt sonida uchta xona qismi bor.", "Nechta to'liqsiz ko'paytma kerakligini tanlang."],
      ru: ['Для двузначного множителя мы использовали две строки.', 'В числе триста четырнадцать есть три разрядные части.', 'Выбери количество неполных произведений.'],
    },
  },
  s3: {
    eyebrow: { uz: 'Taqsimot modeli', ru: 'Распределительная модель' },
    title: { uz: 'Bitta misol uchta sodda misolga ajraladi', ru: 'Один пример распадается на три простых' },
    audio: {
      uz: ["Uch yuz o'n to'rtni uch yuz, o'n va to'rtga ajratamiz.", "Ikki yuz o'ttiz oltini har bir xona qismiga alohida ko'paytiramiz.", "Oxirida uchta natijani qo'shamiz."],
      ru: ['Триста четырнадцать раскладываем на триста, десять и четыре.', 'Двести тридцать шесть отдельно умножаем на каждую разрядную часть.', 'В конце складываем три результата.'],
    },
  },
  s4: {
    eyebrow: { uz: 'Birliklar qatori', ru: 'Строка единиц' },
    title: { uz: "Siljish yo'q", ru: 'Без сдвига' },
    audio: {
      uz: ["Olti birlikni to'rtga ko'paytirib, yigirma to'rt birlik olamiz.", "To'rt birlikni yozib, ikki o'nlikni ko'chiramiz.", "Uch o'nlikni to'rtga ko'paytirib, ko'chgan ikki bilan o'n to'rt o'nlik olamiz.", "Ikki yuzlikni to'rtga ko'paytirib, ko'chgan bir bilan to'qqiz yuzlik olamiz.", "Birinchi to'liqsiz ko'paytma to'qqiz yuz qirq to'rt."],
      ru: ['Шесть единиц умножаем на четыре и получаем двадцать четыре.', 'Записываем четыре и переносим два десятка.', 'Три десятка умножаем на четыре и с переносом получаем четырнадцать десятков.', 'Две сотни умножаем на четыре и с переносом получаем девять сотен.', 'Первое неполное произведение равно девятистам сорока четырём.'],
    },
  },
  s5: {
    eyebrow: { uz: "O'nliklar qatori", ru: 'Строка десятков' },
    title: { uz: 'Bir xona siljishi', ru: 'Сдвиг на один разряд' },
    question: { uz: '236 × 10 nechaga teng?', ru: 'Чему равно 236 × 10?' },
    options: [{ uz: '236', ru: '236' }, { uz: '2 360', ru: '2 360' }, { uz: '23 600', ru: '23 600' }],
    closedSet: true,
    wrong: [
      { uz: "Bu bir birlikka ko'paytma; bizga bir o'nlik kerak.", ru: 'Это произведение на одну единицу; нужен один десяток.' },
      { uz: "To'g'ri. Xom 236 bir xona siljib 2 360 bo'ladi.", ru: 'Верно. Исходное 236 сдвигается на один разряд и становится 2 360.' },
      { uz: "O'nliklar qatori ikki emas, bir xona siljiydi.", ru: 'Строка десятков сдвигается на один разряд, а не на два.' },
    ],
    audio: {
      uz: ["Uch yuz o'n to'rt sonidagi bir raqami bir o'nlikni bildiradi.", "Ikki yuz o'ttiz oltini bir o'nlikka ko'paytirish natijasini tanlang."],
      ru: ['Цифра один в числе триста четырнадцать означает один десяток.', 'Выбери результат умножения двухсот тридцати шести на один десяток.'],
    },
  },
  s6: {
    eyebrow: { uz: 'Yuzliklar qatori', ru: 'Строка сотен' },
    title: { uz: 'Ikki xona siljishi', ru: 'Сдвиг на два разряда' },
    question: { uz: '236 × 300 nechaga teng?', ru: 'Чему равно 236 × 300?' },
    options: [{ uz: '708', ru: '708' }, { uz: '7 080', ru: '7 080' }, { uz: '70 800', ru: '70 800' }],
    closedSet: true,
    wrong: [
      { uz: "Bu uch birlikka ko'paytma; 3 bu yerda 300 ni bildiradi.", ru: 'Это произведение на три единицы; здесь 3 означает 300.' },
      { uz: 'Yuzliklar qatori bir emas, ikki xona chapdan boshlanadi.', ru: 'Строка сотен начинается на два разряда левее, а не на один.' },
      { uz: "To'g'ri. Xom 708 ikki xona siljib 70 800 bo'ladi.", ru: 'Верно. Исходное 708 сдвигается на два разряда и становится 70 800.' },
    ],
    audio: {
      uz: ['Uch raqami yuzlar xonasida turib, uch yuzni bildiradi.', "Ikki yuz o'ttiz oltini uch yuzga ko'paytirish natijasini tanlang."],
      ru: ['Цифра три стоит в разряде сотен и означает триста.', 'Выбери результат умножения двухсот тридцати шести на триста.'],
    },
  },
  s7: {
    eyebrow: { uz: 'Uch qator', ru: 'Три строки' },
    title: { uz: 'Uch qator bitta natijani beradi', ru: 'Три строки дают один результат' },
    audio: {
      uz: ["Birliklar qatori to'qqiz yuz qirq to'rt.", "O'nliklar qatori ikki ming uch yuz oltmish.", 'Yuzliklar qatori yetmish ming sakkiz yuz.', "Uch qatorning yig'indisi yetmish to'rt ming bir yuz to'rt.", 'Natija dars boshidagi yetmish mingdan sakson minggacha oraliqqa mos.'],
      ru: ['Строка единиц равна девятистам сорока четырём.', 'Строка десятков равна двум тысячам трёмстам шестидесяти.', 'Строка сотен равна семидесяти тысячам восьмистам.', 'Сумма трёх строк равна семидесяти четырём тысячам ста четырём.', 'Результат входит в диапазон от семидесяти до восьмидесяти тысяч.'],
    },
  },
  s8: {
    eyebrow: { uz: 'Moslashtirish', ru: 'Соответствие' },
    title: { uz: '0, 1 va 2 xona siljishi', ru: 'Сдвиг на 0, 1 и 2 разряда' },
    question: { uz: "Har bir qismni qator siljishi bilan bog'lang.", ru: 'Соедини каждую часть со сдвигом строки.' },
    audio: {
      uz: ["Birliklar qatori siljimaydi.", "O'nliklar qatori bir xona chapdan boshlanadi.", 'Yuzliklar qatori ikki xona chapdan boshlanadi.', 'Mos juftliklarni tuzing.'],
      ru: ['Строка единиц не сдвигается.', 'Строка десятков начинается на один разряд левее.', 'Строка сотен начинается на два разряда левее.', 'Составь подходящие пары.'],
    },
  },
  s9: {
    eyebrow: { uz: "O'rtadagi nol", ru: 'Ноль в середине' },
    title: { uz: 'Uch qatorni joylashtiring', ru: 'Размести три строки' },
    question: { uz: "132 × 204 uchun uch qatorni joylashtiring.", ru: 'Размести три строки для 132 × 204.' },
    audio: {
      uz: ["Ikki yuz to'rt sonida to'rt birlik, nol o'nlik va ikki yuzlik bor.", "Nol o'nlik qatori natijani oshirmaydi, lekin o'z xona o'rnini saqlaydi.", "Uchta to'g'ri qatorni joylashtiring."],
      ru: ['В числе двести четыре есть четыре единицы, ноль десятков и две сотни.', 'Нулевая строка десятков не увеличивает результат, но сохраняет разрядное место.', 'Размести три правильные строки.'],
    },
  },
  s10: {
    eyebrow: { uz: 'Mustaqil hisob', ru: 'Самостоятельное вычисление' },
    title: { uz: 'Sonli javobni kiriting', ru: 'Введи числовой ответ' },
    question: { uz: '145 × 326 = ?', ru: '145 × 326 = ?' },
    audio: {
      uz: ["Bir yuz qirq beshni uch yuz yigirma oltiga ko'paytiring.", "Birliklar, o'nliklar va yuzliklar qatorlarini to'g'ri joylashtiring.", 'Natijani taxminan qirq besh ming bilan solishtiring.'],
      ru: ['Умножь сто сорок пять на триста двадцать шесть.', 'Правильно размести строки единиц, десятков и сотен.', 'Сравни результат с оценкой примерно сорок пять тысяч.'],
    },
  },
  s11: {
    eyebrow: { uz: 'Strategiya', ru: 'Стратегия' },
    title: { uz: 'Eng qisqa ishonchli usul', ru: 'Самый короткий надёжный способ' },
    question: { uz: '398 × 201 uchun eng qisqa ishonchli usul qaysi?', ru: 'Какой способ самый короткий и надёжный для 398 × 201?' },
    options: [{ uz: '398 × 200 + 398', ru: '398 × 200 + 398' }, { uz: '400 × 201', ru: '400 × 201' }, { uz: '398 + 201', ru: '398 + 201' }],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri aniq usul.", ru: 'Верный точный способ.' },
      { uz: 'Aniq javob uchun 80 400 dan 402 ni ayirish kerak.', ru: 'Для точного ответа нужно вычесть 402 из 80 400.' },
      { uz: "Qo'shish 201 ta teng guruhni ifodalamaydi.", ru: 'Сложение не показывает 201 равную группу.' },
    ],
    audio: {
      uz: ['Ikki yuz bir soni ikki yuz va birdan tuzilgan.', "Uch yuz to'qson sakkizni ikki yuzga va birga alohida ko'paytirish qulay.", 'Eng qisqa aniq usulni tanlang.'],
      ru: ['Число двести один состоит из двухсот и одного.', 'Удобно отдельно умножить триста девяносто восемь на двести и на один.', 'Выбери самый короткий точный способ.'],
    },
  },
  s12: {
    eyebrow: { uz: 'Bit xatosi', ru: 'Ошибка Бита' },
    title: { uz: 'Yuzlik qatorini tuzating', ru: 'Исправь строку сотен' },
    question: { uz: 'Qaysi qatorni tuzatish kerak?', ru: 'Какую строку нужно исправить?' },
    options: [{ uz: '21 300', ru: '21 300' }, { uz: '213', ru: '213' }, { uz: '213 000', ru: '213 000' }],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri. Yuzlik qatori 21 300.", ru: 'Верно. Строка сотен равна 21 300.' },
      { uz: "Bu bir birlikka ko'paytma; 1 bu yerda yuzni bildiradi.", ru: 'Это произведение на одну единицу; здесь 1 означает сто.' },
      { uz: 'Yuzliklar qatori uch emas, ikki xona siljiydi.', ru: 'Строка сотен сдвигается на два разряда, а не на три.' },
    ],
    audio: {
      uz: ["Bit ikki yuz o'n uchni bir yuz uchga ko'paytirdi.", "U yuzlik raqamini o'nlik deb joylashtirdi.", "Noto'g'ri qator o'rniga mos qiymatni tanlang."],
      ru: ['Бит умножал двести тринадцать на сто три.', 'Он разместил цифру сотен как цифру десятков.', 'Выбери правильное значение вместо неверной строки.'],
    },
  },
  s13: {
    eyebrow: { uz: 'Shahar bloklari', ru: 'Городские блоки' },
    title: { uz: "To'g'ri hisob rejasini tanlang", ru: 'Выбери верный план вычисления' },
    question: { uz: "203 ta blokning har birida 124 ta ulanish bor. Qaysi hisob rejasi to'g'ri?", ru: 'В каждом из 203 блоков по 124 соединения. Какой план вычисления верен?' },
    options: [
      { uz: '124 × 200 = 24 800 va 124 × 3 = 372', ru: '124 × 200 = 24 800 и 124 × 3 = 372' },
      { uz: '124 × 20 = 2 480 va 124 × 3 = 372', ru: '124 × 20 = 2 480 и 124 × 3 = 372' },
      { uz: '124 × 200 = 24 800 va 124 × 30 = 3 720', ru: '124 × 200 = 24 800 и 124 × 30 = 3 720' },
    ],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri hisob rejasi.", ru: 'Верный план вычисления.' },
      { uz: '2 yuzlar xonasida va 200 ni bildiradi.', ru: 'Цифра 2 стоит в сотнях и означает 200.' },
      { uz: "O'nlar raqami nol; 30 ga ko'paytma kerak emas.", ru: 'Цифра десятков равна нулю; произведение на 30 не нужно.' },
    ],
    audio: {
      uz: ["Ikki yuz uchta blokning har birida bir yuz yigirma to'rtta ulanish bor.", "Ikki yuz uch sonidagi nol o'nliklar xonasini saqlaydi.", "To'g'ri hisob rejasini tanlang."],
      ru: ['В каждом из двухсот трёх блоков находится сто двадцать четыре соединения.', 'Ноль в числе двести три сохраняет разряд десятков.', 'Выбери верный план вычисления.'],
    },
  },
  s14: {
    eyebrow: { uz: 'Yakun', ru: 'Итог' },
    title: { uz: "Uch xonali songa ko'paytirish", ru: 'Умножение на трёхзначное число' },
    audio: {
      uz: ["Uch xonali ko'paytiruvchi yuzliklar, o'nliklar va birliklarga ajraladi.", 'Birliklar qatori siljimaydi.', "O'nliklar qatori bir xona, yuzliklar qatori ikki xona chapdan boshlanadi.", "Nol tegishli xona o'rnini saqlaydi.", "Qatorlar qo'shiladi va natija taxmin bilan tekshiriladi."],
      ru: ['Трёхзначный множитель раскладывается на сотни, десятки и единицы.', 'Строка единиц не сдвигается.', 'Строка десятков начинается на один, а строка сотен на два разряда левее.', 'Ноль сохраняет место соответствующего разряда.', 'Строки складываются, а результат проверяется оценкой.'],
    },
  },
};

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const LangContext = createContext('uz');
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? value.ru ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return mobile;
}

const buildTtsUrl = (base, text, gender) => `${base}/api/tts?text=${encodeURIComponent(String(text).slice(0, 1000))}&g=${gender === 'm' ? 'm' : 'f'}`;

class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* preview speech is optional */ }
    }
  }
  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null }); }
  start() { this.play(); }
  timed(item, duration = null) {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true });
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration ?? Math.max(1100, Math.min(2200, item.text.length * 30)));
  }
  play() {
    const item = this.queue[this.index];
    if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; }
    if (this.muted || !runtimeConfig.ttsApiBase) {
      if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(String(item.text));
          utterance.lang = this.lang === 'uz' ? 'uz-UZ' : 'ru-RU';
          utterance.rate = 0.94;
          utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false });
          utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); };
          utterance.onerror = () => this.timed(item, 1200);
          this.previewUtterance = utterance;
          this.timer = window.setTimeout(() => {
            this.timer = null;
            try { window.speechSynthesis.speak(utterance); } catch { this.timed(item, 1200); }
          }, 50);
          return;
        } catch { /* fall through to the deterministic visual timer */ }
      }
      this.timed(item);
      return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item, 1200);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => {
      this.emit({ currentSegment: item.id, visualOnly: true });
      this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, 1200);
    });
  }
  toggleMute() { this.muted = !this.muted; this.stop(); this.index = 0; this.emit({ muted: this.muted }); this.start(); }
  one(text) { this.load([{ id: `feedback-${Date.now()}`, text }]); this.start(); }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ muted: audioEngineInstance?.muted ?? false, completed: false, currentSegment: null, visualOnly: !runtimeConfig.ttsApiBase });
  /* eslint-disable react-hooks/refs -- audio queue stabilizer */
  const segmentsRef = useRef(segments);
  const key = JSON.stringify(segments || []);
  const oldKey = useRef(key);
  if (oldKey.current !== key) { oldKey.current = key; segmentsRef.current = segments; }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */
  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.listener = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 220);
    return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; };
  }, [lang, stableSegments]);
  return {
    ...state,
    replay: () => { const engine = getAudioEngine(); engine?.load(stableSegments); engine?.start(); },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.one(text),
  };
}

function useNarration(value, screen) {
  const lang = useLang();
  const segments = useMemo(() => {
    const texts = value?.[lang] ?? value?.ru ?? [];
    return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: `s${screen}-beat-${index}`, text }));
  }, [lang, screen, value]);
  const audio = useAudio(segments);
  const active = segments.findIndex((segment) => segment.id === audio.currentSegment);
  return { ...audio, beat: active >= 0 ? active : (audio.completed ? Math.max(0, segments.length - 1) : 0), caption: active >= 0 ? segments[active].text : '' };
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try { new Audio(url).play().catch(() => {}); } catch { /* optional */ }
};

const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};

const AudioControls = ({ audio }) => {
  const lang = useLang();
  return <div className="audio-controls"><button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={audio.muted ? (lang === 'uz' ? 'Ovozni yoqish' : 'Включить звук') : (lang === 'uz' ? "Ovozni o'chirish" : 'Выключить звук')}>{audio.muted ? '🔇' : '🔊'}</button><button type="button" className="icon-btn" onClick={audio.replay} aria-label={lang === 'uz' ? 'Qayta eshitish' : 'Повторить'}>↻</button></div>;
};

const Feedback = ({ show, correct, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!show) { const frame = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frame); }
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    const timer = window.setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 180);
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); window.clearTimeout(timer); };
  }, [show]);
  if (!show) return null;
  return <div ref={ref} role="status" className={`feedback ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><b>{correct ? '✓' : '↻'}</b><p>{children}</p></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, finish = false, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const ref = useRef(null); const c = CONTENT[`s${screen}`];
  useEffect(() => { ref.current?.scrollTo({ top: 0, behavior: 'auto' }); }, [screen]);
  return <main className="stage"><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track"><i style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }} /></div><div className="chrome"><span><i />{t(c.eyebrow)}</span><div>{audio && <AudioControls audio={audio} />}<b>{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</b></div></div></header><section className="stage-content" ref={ref} style={{ paddingLeft: pad, paddingRight: pad }}>{children}{audio?.caption && (audio.muted || audio.visualOnly) && <div className="caption">{audio.caption}</div>}</section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span /> : <button type="button" className="btn ghost" onClick={onPrev}>← {t({ uz: 'Orqaga', ru: 'Назад' })}</button>}<button type="button" className="btn next" onClick={onNext}>{finish ? t({ uz: 'Darsni yakunlash', ru: 'Завершить урок' }) : t({ uz: 'Davom etish', ru: 'Продолжить' })} →</button></footer></main>;
};

const Heading = ({ c, bit = null }) => {
  const t = useT();
  return <div className="heading"><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div>{bit && <BitSVG state={bit} />}</div>;
};

const Options = ({ values, picked, onPick, correctIndex = null, solved = false, wrong = false, disabled = false }) => {
  const t = useT();
  return <div className="options">{values.map((value, index) => <button type="button" key={`${index}-${t(value)}`} className={`option ${picked === index ? 'picked' : ''} ${solved && index === correctIndex ? 'right' : ''} ${wrong && picked === index ? 'bad' : ''}`} onClick={() => onPick(index)} disabled={disabled}><b>{String.fromCharCode(65 + index)}</b>{t(value)}</button>)}</div>;
};

const Optional = ({ c, correctIndex, picked, setPicked }) => {
  const t = useT();
  return <div className="optional"><span>{t({ uz: 'IXTIYORIY TAXMIN', ru: 'НЕОБЯЗАТЕЛЬНАЯ ГИПОТЕЗА' })}</span><Options values={c.options} picked={picked} onPick={setPicked} /><Feedback show={picked !== null} correct={picked === correctIndex}>{picked !== null ? t(c.wrong[picked]) : ''}</Feedback></div>;
};

const RowShift = ({ raw, full, shift, active, label }) => (
  <div className={`row-shift shift-${shift} ${active ? 'active' : ''}`}>
    <small>{label}</small>
    <div className="row-rail"><span className="raw-row">{raw}</span><i>→</i><strong>{full}</strong></div>
    <em>{shift}</em>
  </div>
);

const ParallelRailsIllustration = ({ live }) => {
  const lanes = [
    { digit: '4', shift: '0', y: 42 },
    { digit: '1', shift: '1', y: 92 },
    { digit: '3', shift: '2', y: 142 },
  ];
  return (
    <svg className={`flat-math-svg parallel-rails-svg ${live ? 'is-live' : ''}`} viewBox="0 0 680 184" aria-hidden="true" focusable="false">
      <rect className="rail-panel" x="2" y="2" width="676" height="180" rx="22" />
      {[158, 236, 314, 392, 470, 548].map((x) => <path className="rail-gridline" d={`M${x} 24V162`} key={x} />)}
      {lanes.map((lane) => (
        <g className={`rail-lane rail-lane-${lane.shift}`} key={lane.shift}>
          <rect className="rail-digit" x="24" y={lane.y - 18} width="58" height="36" rx="12" />
          <text className="rail-digit-text" x="53" y={lane.y + 6} textAnchor="middle">{lane.digit}</text>
          <path className="rail-track" d={`M104 ${lane.y}H626`} />
          {[158, 236, 314, 392, 470, 548, 626].map((x) => <circle className="rail-tie" cx={x} cy={lane.y} r="3.5" key={x} />)}
          <g className={`rail-cart rail-cart-${lane.shift}`}>
            <rect x="536" y={lane.y - 15} width="68" height="30" rx="10" />
            <text x="570" y={lane.y + 5} textAnchor="middle">{lane.shift}</text>
          </g>
          <g className="rail-signal">
            <circle cx="646" cy={lane.y} r="10" />
            <path d={`M641 ${lane.y}h10`} />
          </g>
        </g>
      ))}
    </svg>
  );
};

const ShiftControlPanel = ({ beat }) => {
  const lanes = [
    { shift: 0, raw: '944', full: '944', y: 62, active: beat >= 0 },
    { shift: 1, raw: '236', full: '2 360', y: 116, active: beat >= 1 },
    { shift: 2, raw: '708', full: '70 800', y: 170, active: beat >= 2 },
  ];
  return (
    <svg className="flat-math-svg shift-console-svg" viewBox="0 0 720 220" aria-hidden="true" focusable="false">
      <rect className="console-shell" x="2" y="2" width="716" height="216" rx="24" />
      <path className="console-topline" d="M24 36H696" />
      <circle className="console-led led-one" cx="30" cy="20" r="5" />
      <circle className="console-led led-two" cx="48" cy="20" r="5" />
      <circle className="console-led led-three" cx="66" cy="20" r="5" />
      {[302, 354, 406, 458, 510].map((x) => <path className="console-place" d={`M${x} 44V196`} key={x} />)}
      {lanes.map((lane) => (
        <g className={`console-lane console-lane-${lane.shift} ${lane.active ? 'is-active' : ''}`} key={lane.shift}>
          <rect className="console-index" x="22" y={lane.y - 18} width="42" height="36" rx="11" />
          <text className="console-index-text" x="43" y={lane.y + 6} textAnchor="middle">{lane.shift}</text>
          <rect className="console-raw" x="82" y={lane.y - 18} width="104" height="36" rx="11" />
          <text className="console-raw-text" x="134" y={lane.y + 6} textAnchor="middle">{lane.raw}</text>
          <path className="console-track" d={`M206 ${lane.y}H530`} />
          <g className={`console-cart console-cart-${lane.shift}`}>
            <rect x="452" y={lane.y - 14} width="58" height="28" rx="9" />
            <circle cx="466" cy={lane.y} r="4" />
            <circle cx="496" cy={lane.y} r="4" />
          </g>
          <path className="console-arrow" d={`M536 ${lane.y}h25m-8-8 8 8-8 8`} />
          <rect className="console-terminal" x="576" y={lane.y - 20} width="120" height="40" rx="12" />
          <text className="console-terminal-text" x="636" y={lane.y + 6} textAnchor="middle">{lane.full}</text>
        </g>
      ))}
    </svg>
  );
};

const ZeroPlaceholderIllustration = ({ solved }) => (
  <svg className={`flat-math-svg zero-placeholder-svg ${solved ? 'is-solved' : ''}`} viewBox="0 0 680 168" aria-hidden="true" focusable="false">
    <rect className="zero-scene-shell" x="2" y="2" width="676" height="164" rx="22" />
    <g className="zero-multiplier">
      <rect x="22" y="30" width="132" height="108" rx="18" />
      <rect className="digit-chip hundreds-chip" x="34" y="48" width="34" height="34" rx="10" />
      <rect className="digit-chip zero-chip" x="71" y="48" width="34" height="34" rx="10" />
      <rect className="digit-chip units-chip" x="108" y="48" width="34" height="34" rx="10" />
      <text x="51" y="71" textAnchor="middle">2</text>
      <text className="zero-digit" x="88" y="71" textAnchor="middle">0</text>
      <text x="125" y="71" textAnchor="middle">4</text>
      <text className="base-number" x="88" y="116" textAnchor="middle">132</text>
    </g>
    <path className="zero-branch branch-top" d="M160 62C206 62 210 37 260 37" />
    <path className="zero-branch branch-mid" d="M160 72C206 72 210 84 260 84" />
    <path className="zero-branch branch-bottom" d="M160 82C206 82 210 131 260 131" />
    <g className="placeholder-row row-units">
      <rect x="260" y="17" width="384" height="40" rx="12" />
      <circle cx="285" cy="37" r="8" />
      <text x="310" y="43">4</text>
      <text className="placeholder-value" x="618" y="43" textAnchor="end">{solved ? '528' : '···'}</text>
    </g>
    <g className="placeholder-row row-zero">
      <rect x="260" y="64" width="384" height="40" rx="12" />
      <circle cx="285" cy="84" r="8" />
      <text x="310" y="90">0</text>
      <path className="placeholder-dash" d="M350 84H574" />
      <text className="placeholder-value zero-value" x="618" y="90" textAnchor="end">0</text>
    </g>
    <g className="placeholder-row row-hundreds">
      <rect x="260" y="111" width="384" height="40" rx="12" />
      <circle cx="285" cy="131" r="8" />
      <text x="310" y="137">2</text>
      <text className="placeholder-value" x="618" y="137" textAnchor="end">{solved ? '26 400' : '···'}</text>
    </g>
  </svg>
);

const cleanNumber = (value) => String(value ?? '').replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '').slice(0, 8);

function Screen0({ screen, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null);
  const pick = (index) => { setPicked(index); onAnswer({ screenIdx: screen, stage: 'hook', question: t(c.question), options: c.options.map(t), correctIndex: 1, correctAnswer: t(c.options[1]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: index === 1, firstTry: index === 1, attempts: 1, solved: true }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="hook-scene"><div><span>1 {t({ uz: 'panel', ru: 'панель' })}</span><strong>236</strong><small>{t({ uz: 'kontakt', ru: 'контактов' })}</small></div><i>×</i><div><span>{t({ uz: 'panellar', ru: 'панелей' })}</span><strong>314</strong></div><BitSVG state="think" /><div className={`range-hint beat-${audio.beat}`}><span>7 000</span><b>70 000–80 000</b><span>800 000</span></div></section><section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} /><Feedback show={picked !== null} correct>{t({ uz: 'Taxmin saqlandi. Endi 314 sonining tuzilishini tekshiramiz.', ru: 'Оценка сохранена. Теперь разберём строение числа 314.' })}</Feedback></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const reveal = audio.beat >= 2 || audio.completed;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="decompose"><strong>314</strong><div className={reveal ? 'links reveal' : 'links'}><span>3 → <b>300</b></span><span>1 → <b>10</b></span><span>4 → <b>4</b></span></div><em className={reveal ? 'reveal' : ''}>314 = 300 + 10 + 4</em></section><section className="question"><h2>{t(c.question)}</h2><Optional c={c} correctIndex={0} picked={picked} setPicked={setPicked} /></section></div></Stage>;
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s2; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const reveal = audio.beat >= 1 || audio.completed;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="rails-model"><div className="formula-top">314 = 300 + 10 + 4</div><div className="rails-illustration-wrap"><ParallelRailsIllustration live={reveal} /><div className="math-coach rails-coach"><BitSVG state="point" /></div></div><div className={reveal ? 'three-rails reveal' : 'three-rails'}><div><b>4 {t({ uz: 'birlik', ru: 'единицы' })}</b><span>0 {t({ uz: 'xona', ru: 'разрядов' })}</span></div><div><b>1 {t({ uz: "o'nlik", ru: 'десяток' })}</b><span>1 {t({ uz: 'xona', ru: 'разряд' })}</span></div><div><b>3 {t({ uz: 'yuzlik', ru: 'сотни' })}</b><span>2 {t({ uz: 'xona', ru: 'разряда' })}</span></div></div></section><section className="question"><h2>{t(c.question)}</h2><Optional c={c} correctIndex={1} picked={picked} setPicked={setPicked} /></section></div></Stage>;
}

function Screen3({ screen, onNext, onPrev }) {
  const c = CONTENT.s3; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="branch-model"><strong>236 × 314</strong><span>314 = 300 + 10 + 4</span><div>{['236 × 300', '236 × 10', '236 × 4'].map((item, index) => <b key={item} className={audio.beat >= Math.min(index, 2) ? 'reveal' : ''}>{item}</b>)}</div><em className={audio.beat >= 2 ? 'reveal' : ''}>70 800 + 2 360 + 944</em></section></div></Stage>;
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s4; const audio = useNarration(c.audio, screen); const formulas = ['6 × 4 = 24', { uz: "24 birlik → 2 o'nlik + 4 birlik", ru: '24 единицы → 2 десятка + 4 единицы' }, '3 × 4 + 2 = 14', '2 × 4 + 1 = 9', '236 × 4 = 944'];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="units-row"><div className="mini-calc"><span>236</span><span>× 4</span><i /><strong className={audio.beat >= 4 ? 'reveal' : ''}>944</strong></div><div className="carry-arc" aria-hidden="true">↶</div><b key={audio.beat}>{t(formulas[Math.min(audio.beat, 4)])}</b><RowShift raw="944" full="944" shift={0} active={audio.beat >= 4} label={t({ uz: 'Birliklar qatori', ru: 'Строка единиц' })} /></section></div></Stage>;
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const shifted = audio.beat >= 1 || audio.completed;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="shift-scene"><div className="place-value-note">1 {t({ uz: "o'nlik", ru: 'десяток' })} = 10</div><RowShift raw="236" full="2 360" shift={1} active={shifted} label={t({ uz: "O'nliklar qatori", ru: 'Строка десятков' })} /><p>{t({ uz: 'Xom 236 faqat bir marta chapga siljiydi.', ru: 'Исходное 236 сдвигается влево только один раз.' })}</p></section><section className="question"><h2>{t(c.question)}</h2><Optional c={c} correctIndex={1} picked={picked} setPicked={setPicked} /></section></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const shifted = audio.beat >= 1 || audio.completed;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="shift-scene"><div className="place-value-note">3 {t({ uz: 'yuzlik', ru: 'сотни' })} = 300</div><RowShift raw="708" full="70 800" shift={2} active={shifted} label={t({ uz: 'Yuzliklar qatori', ru: 'Строка сотен' })} /><p>{t({ uz: 'Xom 708 ikki xona masofaga bir marta siljiydi.', ru: 'Исходное 708 один раз сдвигается сразу на два разряда.' })}</p></section><section className="question"><h2>{t(c.question)}</h2><Optional c={c} correctIndex={2} picked={picked} setPicked={setPicked} /></section></div></Stage>;
}

const AlignedRows = ({ reveal = 4, raw = false }) => (
  <div className="aligned-rows">
    <span className={reveal >= 0 ? 'show' : ''}>{raw ? '944' : '944'}</span>
    <span className={reveal >= 1 ? 'show' : ''}>{raw && reveal < 1 ? '236' : '2 360'}</span>
    <span className={reveal >= 2 ? 'show' : ''}>{raw && reveal < 2 ? '708' : '70 800'}</span>
    <i />
    <strong className={reveal >= 3 ? 'show' : ''}>74 104</strong>
  </div>
);

function Screen7({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s7; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="synthesis synthesis-console"><div className="control-panel-wrap"><ShiftControlPanel beat={audio.beat} /><div className="math-coach console-coach"><BitSVG state="focus" /></div></div><AlignedRows reveal={audio.beat} /><div className="console-key"><span>0</span><span>1</span><span>2</span></div><div className={audio.beat >= 4 ? 'range-result reveal' : 'range-result'}>70 000 &lt; <b>74 104</b> &lt; 80 000</div><p>{t({ uz: "Tayyor qiymatlar faqat birliklar bo'yicha tekislandi, qayta siljitilmadi.", ru: 'Готовые значения только выровнены по единицам и больше не сдвигаются.' })}</p></section></div></Stage>;
}

function ChoicePractice({ screen, c, correctIndex, storedAnswer, onAnswer, onNext, onPrev, visual, correctProof, audioFeedback }) {
  const t = useT(); const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const firstTry = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => { if (solved) return; attempts.current += 1; const ok = index === correctIndex; if (!ok) firstTry.current = false; setPicked(index); setSolved(ok); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(audioFeedback[index])); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex, correctAnswer: t(c.options[correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && firstTry.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit={screen === 12 ? 'awkward' : null} />{visual}<section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} correctIndex={correctIndex} solved={solved} wrong={picked !== null && !solved} disabled={solved} /><Feedback show={picked !== null} correct={solved}>{picked !== null ? t(c.wrong[picked]) : ''}</Feedback>{solved && correctProof}</section></div></Stage>;
}

function Screen8({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s8; const audio = useNarration(c.audio, screen); const left = [{ uz: '4 birlik', ru: '4 единицы' }, { uz: "1 o'nlik", ru: '1 десяток' }, { uz: '3 yuzlik', ru: '3 сотни' }]; const right = [{ uz: '0 xona', ru: '0 разрядов' }, { uz: '1 xona', ru: '1 разряд' }, { uz: '2 xona', ru: '2 разряда' }]; const [active, setActive] = useState(null); const [pairs, setPairs] = useState(storedAnswer?.correct ? [0, 1, 2] : [null, null, null]); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true); const solved = pairs.every((value, index) => value === index);
  const chooseRight = (index) => { if (active === null || solved) return; attempts.current += 1; if (index !== active) { clean.current = false; const hint = { uz: "Raqamning o'ziga emas, ko'paytiruvchidagi xonasiga qarang.", ru: 'Смотри не только на цифру, а на её разряд в множителе.' }; setMessage(hint); playSfx('wrong'); audio.pushOneOff(t(hint)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correct: false, firstTry: false, attempts: attempts.current, solved: false, studentAnswer: `${active}:${index}` }); return; } const next = [...pairs]; next[active] = index; setPairs(next); setActive(null); const done = next.every((value, place) => value === place); if (done) { const ok = { uz: "To'g'ri. Birlik, o'nlik va yuzlik qatorlari nol, bir va ikki xona siljiydi.", ru: 'Верно. Строки единиц, десятков и сотен сдвигаются на ноль, один и два разряда.' }; setMessage(ok); playSfx('correct'); audio.pushOneOff(t(ok)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correct: true, firstTry: clean.current, attempts: attempts.current, solved: true, studentAnswer: next.join(','), correctAnswer: '0,1,2' }); } };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="matching"><div>{left.map((item, index) => <button type="button" key={t(item)} className={`${active === index ? 'picked' : ''} ${pairs[index] !== null ? 'matched' : ''}`} onClick={() => pairs[index] === null && setActive(index)} disabled={pairs[index] !== null}>{t(item)}{pairs[index] !== null && <b>{t(right[pairs[index]])}</b>}</button>)}</div><i>↔</i><div>{right.map((item, index) => <button type="button" key={t(item)} className={pairs.includes(index) ? 'matched' : ''} onClick={() => chooseRight(index)} disabled={pairs.includes(index)}>{t(item)}</button>)}</div></section><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback></div></Stage>;
}

function Screen9({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s9; const audio = useNarration(c.audio, screen); const cards = ['528', '0', '2 640', '26 400', '5 280']; const correct = ['528', '0', '26 400']; const labels = [{ uz: 'birliklar qatori', ru: 'строка единиц' }, { uz: "o'nliklar qatori", ru: 'строка десятков' }, { uz: 'yuzliklar qatori', ru: 'строка сотен' }]; const [slots, setSlots] = useState(storedAnswer?.correct ? correct : [null, null, null]); const [selected, setSelected] = useState(null); const [bad, setBad] = useState([]); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true); const solved = slots.every((value, index) => value === correct[index]); const available = cards.filter((card) => !slots.includes(card));
  const evaluate = (next) => { if (next.some((value) => value === null)) return; attempts.current += 1; const wrong = next.map((value, index) => value !== correct[index] ? index : -1).filter((index) => index >= 0); const ok = wrong.length === 0; if (!ok) clean.current = false; setBad(wrong); const text = ok ? { uz: "To'g'ri. 528, 0 va 26 400 qatorlari 26 928 ni beradi.", ru: 'Верно. Строки 528, 0 и 26 400 дают 26 928.' } : next[2] === '2 640' ? { uz: '2 yuzlar xonasida, shuning uchun yuzliklar qatori ikki xona siljiydi.', ru: 'Цифра 2 стоит в сотнях, поэтому строка сотен сдвигается на два разряда.' } : next[0] === '5 280' ? { uz: "132 ni 4 ga ko'paytirish 528 bo'ladi; birliklar qatorini siljitmang.", ru: 'Произведение 132 на 4 равно 528; не сдвигай строку единиц.' } : { uz: "528 birliklar, 0 o'nliklar, 26 400 yuzliklar qatoridir.", ru: '528 является строкой единиц, 0 строкой десятков, а 26 400 строкой сотен.' }; setMessage(text); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(ok ? t({ uz: "To'g'ri. Qatorlarning yig'indisi yigirma olti ming to'qqiz yuz yigirma sakkiz.", ru: 'Верно. Сумма строк равна двадцати шести тысячам девятистам двадцати восьми.' }) : t({ uz: 'Har bir kartaning xona qiymatini yana tekshiring.', ru: 'Ещё раз проверь разрядное значение каждой карточки.' })); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: cards, correctAnswer: correct.join('|'), studentAnswer: next.join('|'), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  const place = (index) => { if (solved) return; if (slots[index] !== null) { const next = [...slots]; next[index] = null; setSlots(next); setBad([]); setMessage(null); return; } if (selected === null) return; const next = [...slots]; next[index] = selected; setSlots(next); setSelected(null); setBad([]); setMessage(null); evaluate(next); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="construction"><ZeroPlaceholderIllustration solved={solved} /><div className="slots">{labels.map((label, index) => <button type="button" key={t(label)} className={`${slots[index] ? 'filled' : ''} ${bad.includes(index) ? 'bad' : ''}`} onClick={() => place(index)} disabled={solved}><small>{t(label)}</small><strong>{slots[index] ?? '···'}</strong></button>)}</div><div className="bank">{available.map((card) => <button type="button" key={card} className={selected === card ? 'picked' : ''} onClick={() => setSelected(card)} disabled={solved}>{card}</button>)}</div><div className={`aligned-zero ${solved ? 'reveal' : ''}`}><span>528</span><span className="zero-row">0</span><span>26 400</span><i /><b>26 928</b></div><p>{t({ uz: "26 400 tayyor yuzliklar qiymati, u qayta siljitilmaydi.", ru: '26 400 уже является значением строки сотен и больше не сдвигается.' })}</p></section><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback></div></Stage>;
}

function Screen10({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s10; const audio = useNarration(c.audio, screen); const [value, setValue] = useState(storedAnswer?.studentAnswer ?? ''); const [solved, setSolved] = useState(storedAnswer?.correct === true); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const submit = () => { const answer = cleanNumber(value); if (!answer || solved) return; attempts.current += 1; const ok = answer === '47270'; if (!ok) clean.current = false; setSolved(ok); const numeric = Number(answer); const text = ok ? { uz: "To'g'ri. Natija 47 270.", ru: 'Верно. Результат равен 47 270.' } : Math.abs(numeric - 45000) > 6000 ? { uz: "Javob qirq besh mingga yaqin bo'lishi kerak.", ru: 'Ответ должен быть близок к сорока пяти тысячам.' } : { uz: '43 500 yuzliklar qatori ikki xona siljishi bilan yoziladi.', ru: 'Строка сотен 43 500 записывается со сдвигом на два разряда.' }; setMessage(text); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(ok ? t({ uz: "To'g'ri. Natija qirq yetti ming ikki yuz yetmish.", ru: 'Верно. Результат равен сорока семи тысячам двумстам семидесяти.' }) : t({ uz: 'Javobni qirq besh minglik taxmin va yuzliklar qatori bilan tekshiring.', ru: 'Проверь ответ оценкой около сорока пяти тысяч и строкой сотен.' })); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correctAnswer: '47270', studentAnswer: answer, correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="question"><h2>{t(c.question)}</h2><div className="input-row"><input className={solved ? 'answer correct-input' : message ? 'answer wrong-input' : 'answer'} inputMode="numeric" placeholder="0" value={value} disabled={solved} onChange={(event) => { setValue(cleanNumber(event.target.value)); setMessage(null); }} onKeyDown={(event) => event.key === 'Enter' && submit()} /><button type="button" className="btn next" onClick={submit} disabled={!value || solved}>{t({ uz: 'Tekshirish', ru: 'Проверить' })}</button></div><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback>{solved && <div className="proof-grid"><span>145 × 6 = 870</span><span>145 × 20 = 2 900</span><span>145 × 300 = 43 500</span><b>47 270</b></div>}</section></div></Stage>;
}

function Screen11(props) {
  const t = useT(); const c = CONTENT.s11; const audioFeedback = [
    { uz: "To'g'ri. Uch yuz to'qson sakkiz ikki yuzga va birga alohida ko'paytiriladi.", ru: 'Верно. Триста девяносто восемь отдельно умножается на двести и на один.' },
    { uz: "Aniq javob uchun sakson ming to'rt yuzdan to'rt yuz ikkini ayirish kerak.", ru: 'Для точного ответа нужно вычесть четыреста два из восьмидесяти тысяч четырёхсот.' },
    { uz: "Qo'shish ikki yuz bir teng guruhni ifodalamaydi.", ru: 'Сложение не показывает двести одну равную группу.' },
  ];
  return <ChoicePractice {...props} c={c} correctIndex={0} audioFeedback={audioFeedback} visual={<div className="strategy-visual"><span>201 = 200 + 1</span><i>→</i><b>398 × 200 + 398</b></div>} correctProof={<div className="proof-grid"><span>398 × 200 = 79 600</span><span>398 × 1 = 398</span><b>79 600 + 398 = 79 998</b><small>{t({ uz: '80 000 taxminidan 2 kichik', ru: 'На 2 меньше оценки 80 000' })}</small></div>} />;
}

function Screen12(props) {
  const c = CONTENT.s12; const audioFeedback = [
    { uz: "To'g'ri. Yuzlik qatori yigirma bir ming uch yuz.", ru: 'Верно. Строка сотен равна двадцати одной тысяче трёмстам.' },
    { uz: "Bu bir birlikka ko'paytma. Bu yerda bir raqami yuzni bildiradi.", ru: 'Это произведение на одну единицу. Здесь цифра один означает сто.' },
    { uz: 'Yuzliklar qatori uch emas, ikki xona siljiydi.', ru: 'Строка сотен сдвигается на два разряда, а не на три.' },
  ];
  return <ChoicePractice {...props} c={c} correctIndex={0} audioFeedback={audioFeedback} visual={<div className="error-visual"><span>213 × 103</span><div><i>639</i><i>0</i><b>2 130</b><strong>2 769</strong></div></div>} correctProof={<div className="proof-grid"><span>2 130 → 21 300</span><b>21 300 + 639 = 21 939</b></div>} />;
}

function Screen13(props) {
  const t = useT(); const c = CONTENT.s13; const audioFeedback = [
    { uz: "To'g'ri. Ikki yuz va uch birlik qismlari alohida hisoblanadi.", ru: 'Верно. Части двухсот и трёх единиц вычисляются отдельно.' },
    { uz: 'Ikki raqami yuzlar xonasida turib, ikki yuzni bildiradi.', ru: 'Цифра два стоит в сотнях и означает двести.' },
    { uz: "O'nlar raqami nol. O'ttizga ko'paytma kerak emas.", ru: 'Цифра десятков равна нулю. Произведение на тридцать не нужно.' },
  ];
  return <ChoicePractice {...props} c={c} correctIndex={0} audioFeedback={audioFeedback} visual={<div className="blocks-visual"><span>203 {t({ uz: 'blok', ru: 'блока' })}</span><b>124</b></div>} correctProof={<div className="proof-grid"><span>24 800</span><span>372</span><b>24 800 + 372 = 25 172</b></div>} />;
}

function Screen14({ screen, onPrev, finishLesson }) {
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const rules = [{ uz: 'Birliklar qatori — 0 xona', ru: 'Строка единиц — 0 разрядов' }, { uz: "O'nliklar qatori — 1 xona", ru: 'Строка десятков — 1 разряд' }, { uz: 'Yuzliklar qatori — 2 xona', ru: 'Строка сотен — 2 разряда' }, { uz: "Nol xona o'rnini saqlaydi", ru: 'Ноль сохраняет место разряда' }, { uz: "Qatorlarni qo'shing va taxmin bilan tekshiring", ru: 'Сложи строки и проверь результат оценкой' }];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><Heading c={c} bit="happy" /><section className="summary"><div className="raw-shifts"><RowShift raw="944" full="944" shift={0} active={audio.beat >= 1} label="0" /><RowShift raw="236" full="2 360" shift={1} active={audio.beat >= 2} label="1" /><RowShift raw="708" full="70 800" shift={2} active={audio.beat >= 2} label="2" /></div><AlignedRows reveal={audio.beat >= 4 ? 4 : audio.beat} /><div className={audio.beat >= 4 ? 'range-result reveal' : 'range-result'}>70 000 &lt; <b>74 104</b> &lt; 80 000</div></section><div className="rules">{rules.map((rule, index) => <div className={audio.beat === index ? 'active' : ''} key={t(rule)}><b>{index + 1}</b>{t(rule)}</div>)}</div><div className="bridge"><span>{t({ uz: 'KEYINGI MAVZU', ru: 'СЛЕДУЮЩАЯ ТЕМА' })}</span><strong>{t({ uz: "Ko'paytirishga teskari amal bo'lgan bo'lish", ru: 'Деление, обратное действие для умножения' })}</strong></div></div></Stage>;
}

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars11({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const preview = previewMode ?? (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState(langProp || 'ru');
  const lang = preview ? previewLang : (langProp || 'uz');
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
  const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started = useRef(Date.now()); const finished = useRef(false);
  const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry }; return next; }), []);
  const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - started.current) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars11 preview]', payload); }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={`lesson-root ${preview ? 'lesson-root-preview' : ''}`}>{preview && <div className="preview-language" aria-label="Preview language">{['ru', 'uz'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson} /></div></LangContext.Provider>;
}

const STYLES = `
html:has(.lesson-root),
body:has(.lesson-root),
#root:has(.lesson-root),
.lesson-page:has(.lesson-root),
.lesson-frame:has(.lesson-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  margin: 0;
  overflow: hidden !important;
  overscroll-behavior: none;
}
.lesson-root,
.lesson-root * { box-sizing: border-box; }
.lesson-root h1,
.lesson-root h2,
.lesson-root p { margin: 0; }
.lesson-root button,
.lesson-root input { font: inherit; }
.lesson-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  min-height: 100dvh;
  overflow: hidden;
  color: ${T.ink};
  background:
    radial-gradient(circle at 7% 9%, rgba(22,143,163,.11), transparent 29%),
    radial-gradient(circle at 94% 89%, rgba(255,91,53,.09), transparent 31%),
    ${T.bg};
  font-family: Manrope, Arial, sans-serif;
}
.stage {
  width: min(936px, 100%);
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: transparent;
}
.stage-header {
  flex: none;
  padding-top: 12px;
  padding-bottom: 9px;
  z-index: 5;
  border-bottom: 1px solid rgba(23,59,82,.07);
  background: rgba(245,245,240,.92);
  backdrop-filter: blur(12px);
}
.lesson-root-preview .stage-header { padding-top: 54px; }
.progress-track {
  height: 6px;
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: 99px;
  background: rgba(135,148,157,.20);
}
.progress-track > i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
  box-shadow: 0 0 12px rgba(255,91,53,.34);
  transition: width .5s cubic-bezier(.16,1,.3,1);
}
.chrome,
.chrome > span,
.chrome > div,
.audio-controls {
  display: flex;
  align-items: center;
}
.chrome { min-height: 42px; justify-content: space-between; gap: 14px; }
.chrome > span {
  min-width: 0;
  gap: 9px;
  overflow: hidden;
  color: ${T.ink2};
  font-size: 12px;
  font-weight: 850;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chrome > span > i {
  width: 9px;
  height: 9px;
  flex: none;
  border-radius: 50%;
  background: ${T.lime};
  box-shadow: 0 0 11px rgba(149,201,61,.72);
}
.chrome > div { flex: none; gap: 10px; }
.chrome > div > b { color: ${T.ink3}; font: 850 11px/1 'JetBrains Mono', monospace; }
.audio-controls { gap: 5px; }
.icon-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: ${T.navy};
  background: ${T.paper};
  cursor: pointer;
  box-shadow: 0 8px 20px -15px rgba(${T.shadowBase},.52);
}
.stage-content {
  min-height: 0;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 18px;
  padding-bottom: 24px;
  scroll-padding-block: 12px;
  scrollbar-color: rgba(22,143,163,.25) transparent;
}
.stage-nav {
  min-height: 72px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 12px;
  z-index: 5;
  border-top: 1px solid rgba(23,59,82,.08);
  background: rgba(245,245,240,.94);
  backdrop-filter: blur(12px);
}
.btn {
  min-width: 124px;
  min-height: 50px;
  padding: 0 18px;
  border: 0;
  border-radius: 15px;
  color: ${T.ink2};
  background: transparent;
  font: 850 13px/1 Manrope, sans-serif;
  cursor: pointer;
  transition: transform .2s ease, background .2s ease, color .2s ease, opacity .2s ease;
}
.btn.next {
  color: ${T.accent};
  background: ${T.paper};
  box-shadow: 0 13px 28px -18px rgba(255,91,53,.60);
}
.btn:hover:not(:disabled),
.icon-btn:hover:not(:disabled) { transform: translateY(-2px); }
.btn.next:hover:not(:disabled) { color: white; background: ${T.accent}; }
.btn.ghost:hover:not(:disabled) { background: ${T.paper}; }
.btn:disabled,
button:disabled { cursor: default; opacity: .55; }
.lesson-root button:focus-visible,
.lesson-root input:focus-visible { outline: 3px solid rgba(22,143,163,.38); outline-offset: 3px; }
.option.right:disabled,
.matching button.matched:disabled,
.slots button.filled:disabled { opacity: 1; }
.stack { display: grid; gap: 14px; animation: pageEnter .5s cubic-bezier(.16,1,.3,1) both; }
.heading {
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.heading > div { min-width: 0; }
.heading span,
.bridge > span {
  display: block;
  margin-bottom: 7px;
  color: ${T.cyan};
  font-size: 10px;
  font-weight: 950;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.heading h1 {
  max-width: 770px;
  font: 750 clamp(27px,4vw,41px)/1.05 'Source Serif 4', Georgia, serif;
  letter-spacing: -.025em;
}
.heading .g1-char { width: 90px; height: 112px; flex: none; }
.question,
.decompose,
.rails-model,
.branch-model,
.units-row,
.shift-scene,
.synthesis,
.matching,
.construction,
.strategy-visual,
.error-visual,
.blocks-visual,
.summary,
.rules {
  padding: 17px 19px;
  border-radius: 22px;
  background: ${T.paper};
  box-shadow: 0 18px 42px -31px rgba(${T.shadowBase},.56);
}
.question h2 { font: 750 clamp(18px,2.6vw,25px)/1.28 'Source Serif 4', Georgia, serif; }
.options {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 10px;
  margin-top: 14px;
}
.option {
  min-height: 56px;
  padding: 10px 13px;
  border: 0;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${T.ink};
  background: #F8F8F4;
  text-align: left;
  font: 750 13px/1.35 Manrope, sans-serif;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.17), 0 8px 17px -14px rgba(${T.shadowBase},.35);
  transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
}
.option:hover:not(:disabled),
.option.picked { transform: translateY(-2px); background: ${T.accentSoft}; }
.option > b {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.paper};
  font: 900 12px/1 'JetBrains Mono', monospace;
}
.option.right { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.28); }
.option.right > b { color: white; background: ${T.success}; }
.option.bad { background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.25); }
.optional { margin-top: 12px; }
.optional > span {
  color: ${T.ink3};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .1em;
}
.feedback {
  max-height: 0;
  margin-top: 0;
  padding: 0 14px;
  overflow: hidden;
  opacity: 0;
  border-radius: 15px;
  display: grid;
  grid-template-columns: 38px 1fr;
  align-items: center;
  gap: 9px;
  transform: translateY(8px);
  transition: max-height .38s ease, padding .34s ease, margin .34s ease, opacity .28s ease, transform .34s ease;
}
.feedback.open { max-height: 190px; margin-top: 12px; padding: 11px 14px; opacity: 1; transform: none; }
.feedback > b {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.72);
  font-weight: 950;
}
.feedback p { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.feedback.correct { background: ${T.successSoft}; box-shadow: inset 4px 0 ${T.success}; }
.feedback.correct > b { color: ${T.success}; }
.feedback.wrong { background: ${T.warnSoft}; box-shadow: inset 4px 0 ${T.warn}; }
.feedback.wrong > b { color: ${T.warn}; }
.caption {
  position: sticky;
  bottom: 4px;
  z-index: 4;
  width: fit-content;
  max-width: min(680px,100%);
  margin: 13px auto 0;
  padding: 9px 13px;
  border-radius: 12px;
  color: white;
  background: rgba(23,59,82,.94);
  text-align: center;
  font-size: 12px;
  line-height: 1.4;
  box-shadow: 0 12px 28px -18px rgba(23,59,82,.8);
}
.hook-scene {
  min-height: 250px;
  padding: 25px 134px 54px 26px;
  border-radius: 26px;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(150px,1fr) 36px minmax(150px,1fr);
  align-items: center;
  gap: 14px;
  color: white;
  background:
    linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px),
    ${T.navy};
  background-size: 25px 25px;
  box-shadow: 0 24px 58px -35px rgba(23,59,82,.8);
}
.hook-scene > div:not(.range-hint) {
  min-width: 0;
  padding: 16px;
  border-radius: 18px;
  display: grid;
  gap: 4px;
  background: rgba(255,255,255,.08);
  box-shadow: inset 0 0 0 1px rgba(125,225,238,.18);
}
.hook-scene > div > span,
.hook-scene > div > small { color: #BDEEF3; font-size: 11px; font-weight: 800; }
.hook-scene > div > strong { font: 950 clamp(30px,5vw,49px)/1 'JetBrains Mono', monospace; }
.hook-scene > i { color: #7DE1EE; font: 900 30px/1 'JetBrains Mono', monospace; text-align: center; }
.hook-scene > .g1-char { position: absolute; right: 22px; top: 44px; width: 90px; height: 113px; }
.range-hint {
  position: absolute;
  left: 26px;
  right: 24px;
  bottom: 17px;
  display: grid !important;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}
.range-hint b { padding: 7px 10px; border-radius: 999px; color: ${T.navy}; background: ${T.lime}; text-align: center; font: 900 12px/1 'JetBrains Mono', monospace; animation: rangePulse 1.1s ease-in-out infinite alternate; }
.range-hint span { color: rgba(255,255,255,.58) !important; font: 750 10px/1 'JetBrains Mono', monospace; }
.decompose { display: grid; justify-items: center; gap: 14px; }
.decompose > strong { color: ${T.navy}; font: 950 clamp(48px,8vw,76px)/1 'JetBrains Mono', monospace; }
.links { width: min(540px,100%); display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; opacity: 0; transform: translateY(9px); }
.links.reveal { opacity: 1; transform: none; transition: .62s cubic-bezier(.16,1,.3,1); }
.links span { min-height: 58px; padding: 12px; border-radius: 15px; display: grid; place-items: center; color: ${T.ink2}; background: ${T.cyanSoft}; font: 800 16px/1.2 'JetBrains Mono', monospace; }
.links b { color: ${T.cyan}; }
.decompose > em { opacity: 0; color: ${T.accent}; font: normal 900 clamp(18px,3vw,28px)/1.2 'JetBrains Mono', monospace; transform: translateY(8px); }
.decompose > em.reveal { opacity: 1; transform: none; transition: .62s .12s cubic-bezier(.16,1,.3,1); }
.rails-model { display: grid; gap: 14px; }
.formula-top { color: ${T.navy}; text-align: center; font: 900 clamp(20px,3vw,28px)/1.2 'JetBrains Mono', monospace; }
.flat-math-svg { width: 100%; height: auto; display: block; overflow: visible; }
.rails-illustration-wrap {
  display: grid;
  grid-template-columns: minmax(0,1fr) 76px;
  align-items: center;
  gap: 9px;
}
.math-coach { width: 72px; align-self: center; justify-self: center; }
.math-coach .g1-char { width: 100%; height: auto; display: block; }
.parallel-rails-svg { min-width: 0; }
.rail-panel { fill: #F8FBF9; stroke: rgba(22,143,163,.20); stroke-width: 2; }
.rail-gridline { fill: none; stroke: rgba(135,148,157,.13); stroke-width: 1; stroke-dasharray: 3 7; }
.rail-digit { fill: ${T.navy}; }
.rail-digit-text { fill: white; font: 900 17px/1 'JetBrains Mono', monospace; }
.rail-track { fill: none; stroke: rgba(22,143,163,.38); stroke-width: 5; stroke-linecap: round; }
.rail-tie { fill: ${T.cyan}; opacity: .55; }
.rail-cart { opacity: .32; transform-origin: center; transform-box: fill-box; }
.rail-cart rect { fill: ${T.accentSoft}; stroke: ${T.accent}; stroke-width: 2; }
.rail-cart text { fill: ${T.accent}; font: 900 14px/1 'JetBrains Mono', monospace; }
.rail-signal circle { fill: ${T.cyanSoft}; stroke: ${T.cyan}; stroke-width: 2; }
.rail-signal path { fill: none; stroke: ${T.cyan}; stroke-width: 2; stroke-linecap: round; }
.parallel-rails-svg.is-live .rail-cart { opacity: 1; }
.parallel-rails-svg.is-live .rail-cart-0 { animation: railCartZero .48s cubic-bezier(.16,1,.3,1) both; }
.parallel-rails-svg.is-live .rail-cart-1 { animation: railCartOne .72s .09s cubic-bezier(.16,1,.3,1) both; }
.parallel-rails-svg.is-live .rail-cart-2 { animation: railCartTwo .72s .18s cubic-bezier(.16,1,.3,1) both; }
.parallel-rails-svg.is-live .rail-signal { animation: railSignal .62s .42s ease both; }
.three-rails { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; opacity: 0; transform: translateY(8px); }
.three-rails.reveal { opacity: 1; transform: none; transition: .62s cubic-bezier(.16,1,.3,1); }
.three-rails > div { min-height: 94px; padding: 14px; border-radius: 17px; display: grid; align-content: center; gap: 8px; background: #F8F8F4; box-shadow: inset 0 0 0 1px rgba(135,148,157,.16); }
.three-rails b { color: ${T.navy}; font: 850 15px/1.2 'JetBrains Mono', monospace; }
.three-rails span { color: ${T.cyan}; font-size: 12px; font-weight: 850; }
.branch-model { display: grid; justify-items: center; gap: 12px; }
.branch-model > strong { color: ${T.navy}; font: 950 clamp(26px,4vw,38px)/1 'JetBrains Mono', monospace; }
.branch-model > span { color: ${T.ink2}; font: 800 16px/1.2 'JetBrains Mono', monospace; }
.branch-model > div { width: 100%; display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.branch-model > div > b { min-height: 62px; padding: 12px; border-radius: 16px; display: grid; place-items: center; opacity: .16; color: ${T.cyan}; background: ${T.cyanSoft}; font: 850 15px/1.2 'JetBrains Mono', monospace; transform: translateY(9px); }
.branch-model > div > b.reveal,
.branch-model > em.reveal { opacity: 1; transform: none; transition: .55s cubic-bezier(.16,1,.3,1); }
.branch-model > em { opacity: .16; color: ${T.accent}; font: normal 900 19px/1.2 'JetBrains Mono', monospace; transform: translateY(8px); }
.units-row { display: grid; grid-template-columns: 150px 50px 1fr; align-items: center; gap: 18px; }
.mini-calc { padding: 12px 19px; display: grid; justify-items: end; color: ${T.navy}; font: 900 22px/1.35 'JetBrains Mono', monospace; }
.mini-calc > i { width: 100%; height: 2px; background: ${T.ink}; }
.mini-calc > strong { opacity: .16; }
.mini-calc > strong.reveal { opacity: 1; animation: digitDrop .42s ease both; }
.carry-arc { color: ${T.accent}; font-size: 42px; text-align: center; animation: carryArc .72s ease-in-out infinite alternate; }
.units-row > b { padding: 12px; border-radius: 14px; color: ${T.cyan}; background: ${T.cyanSoft}; text-align: center; font: 850 15px/1.25 'JetBrains Mono', monospace; animation: digitDrop .42s ease both; }
.units-row .row-shift { grid-column: 1 / -1; }
.shift-scene { display: grid; justify-items: center; gap: 16px; }
.place-value-note { padding: 9px 16px; border-radius: 999px; color: ${T.navy}; background: ${T.warnSoft}; font: 900 15px/1 'JetBrains Mono', monospace; }
.shift-scene > p,
.synthesis > p,
.construction > p { color: ${T.ink2}; text-align: center; font-size: 13px; line-height: 1.45; }
.row-shift { width: min(560px,100%); display: grid; grid-template-columns: 110px 1fr 34px; align-items: center; gap: 10px; }
.row-shift > small { color: ${T.ink2}; font-size: 11px; font-weight: 850; }
.row-shift > em { width: 30px; height: 30px; border-radius: 10px; display: grid; place-items: center; color: white; background: ${T.navy}; font: normal 900 12px/1 'JetBrains Mono', monospace; }
.row-rail { min-height: 62px; padding: 10px 16px; border-radius: 16px; position: relative; overflow: hidden; display: grid; grid-template-columns: 1fr 28px 1fr; align-items: center; color: ${T.navy}; background: linear-gradient(90deg,${T.cyanSoft},#F8F8F4); font: 900 clamp(17px,2.8vw,25px)/1 'JetBrains Mono', monospace; }
.row-rail span { text-align: center; }
.row-rail i { color: ${T.accent}; text-align: center; font-style: normal; }
.row-rail strong { opacity: .12; text-align: center; }
.row-shift.active .row-rail strong { opacity: 1; animation: fullAppear .62s .18s cubic-bezier(.16,1,.3,1) both; }
.row-shift.active .raw-row { animation: rawFade .46s ease both; }
.row-shift.shift-1.active .raw-row { animation: rawShiftOne .72s cubic-bezier(.16,1,.3,1) both; }
.row-shift.shift-2.active .raw-row { animation: rawShiftTwo .72s cubic-bezier(.16,1,.3,1) both; }
.synthesis,
.summary { display: grid; grid-template-columns: minmax(270px,1fr) minmax(180px,.72fr); align-items: center; gap: 16px; }
.synthesis-console { grid-template-columns: minmax(190px,.72fr) minmax(170px,.48fr); }
.control-panel-wrap {
  grid-column: 1 / -1;
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0,1fr) 78px;
  align-items: center;
  gap: 8px;
}
.console-coach { width: 74px; }
.shift-console-svg { min-width: 0; filter: drop-shadow(0 18px 24px rgba(23,59,82,.16)); }
.console-shell { fill: ${T.navy}; }
.console-topline { fill: none; stroke: rgba(255,255,255,.13); stroke-width: 1.5; }
.console-led { opacity: .9; }
.led-one { fill: ${T.accent}; }
.led-two { fill: #FFC23C; }
.led-three { fill: ${T.lime}; }
.console-place { fill: none; stroke: rgba(125,225,238,.10); stroke-width: 1; stroke-dasharray: 3 6; }
.console-index { fill: rgba(125,225,238,.15); stroke: #7DE1EE; stroke-width: 1.5; }
.console-index-text { fill: #BDEEF3; font: 900 14px/1 'JetBrains Mono', monospace; }
.console-raw { fill: rgba(255,255,255,.08); stroke: rgba(255,255,255,.14); stroke-width: 1; }
.console-raw-text { fill: white; font: 850 14px/1 'JetBrains Mono', monospace; }
.console-track { fill: none; stroke: rgba(125,225,238,.34); stroke-width: 4; stroke-linecap: round; }
.console-cart { opacity: .28; transform-box: fill-box; transform-origin: center; }
.console-cart rect { fill: ${T.accent}; }
.console-cart circle { fill: #FFD5C9; }
.console-arrow { fill: none; stroke: #7DE1EE; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; opacity: .55; }
.console-terminal { fill: rgba(255,255,255,.07); stroke: rgba(149,201,61,.35); stroke-width: 1.5; }
.console-terminal-text { fill: ${T.lime}; opacity: .18; font: 900 15px/1 'JetBrains Mono', monospace; }
.console-lane.is-active .console-cart { opacity: 1; }
.console-lane-0.is-active .console-cart { animation: consoleShiftZero .46s cubic-bezier(.16,1,.3,1) both; }
.console-lane-1.is-active .console-cart { animation: consoleShiftOne .72s cubic-bezier(.16,1,.3,1) both; }
.console-lane-2.is-active .console-cart { animation: consoleShiftTwo .72s cubic-bezier(.16,1,.3,1) both; }
.console-lane.is-active .console-terminal { stroke: ${T.lime}; }
.console-lane.is-active .console-terminal-text { animation: consoleTerminal .5s .22s ease both; }
.console-key { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; }
.console-key > span { min-height: 42px; border-radius: 13px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font: 900 13px/1 'JetBrains Mono', monospace; box-shadow: inset 0 0 0 1px rgba(22,143,163,.13); }
.raw-shifts { display: grid; gap: 8px; }
.raw-shifts .row-shift { grid-template-columns: 28px 1fr 30px; }
.raw-shifts .row-shift > small { width: 27px; height: 27px; border-radius: 9px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font: 900 11px/1 'JetBrains Mono', monospace; }
.aligned-rows,
.aligned-zero {
  width: min(220px,100%);
  justify-self: center;
  padding: 14px 18px;
  display: grid;
  justify-items: end;
  color: ${T.navy};
  font: 900 20px/1.4 'JetBrains Mono', monospace;
}
.aligned-rows span,
.aligned-rows strong { opacity: .14; transform: translateY(6px); }
.aligned-rows .show { opacity: 1; transform: none; transition: .42s ease; }
.aligned-rows i,
.aligned-zero i { width: 100%; height: 2px; margin: 2px 0; background: ${T.ink}; }
.synthesis > .range-result,
.summary > .range-result { grid-column: 1 / -1; }
.synthesis > p { grid-column: 1 / -1; }
.range-result { padding: 10px 16px; border-radius: 14px; opacity: .14; color: ${T.ink3}; background: #F8F8F4; text-align: center; font: 800 13px/1.2 'JetBrains Mono', monospace; }
.range-result b { margin: 0 15px; color: ${T.success}; font-size: 18px; }
.range-result.reveal { opacity: 1; animation: fullAppear .62s ease both; }
.matching { min-height: 260px; display: grid; grid-template-columns: 1fr 40px 1fr; align-items: stretch; gap: 12px; }
.matching > div { display: grid; gap: 10px; }
.matching > i { align-self: center; color: ${T.accent}; text-align: center; font: normal 900 24px/1 'JetBrains Mono', monospace; }
.matching button,
.slots button,
.bank button {
  min-height: 52px;
  padding: 10px 13px;
  border: 0;
  border-radius: 15px;
  color: ${T.ink};
  background: #F8F8F4;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.18);
  transition: .2s ease;
}
.matching button { display: grid; align-content: center; gap: 4px; text-align: left; font-size: 13px; font-weight: 800; }
.matching button b { color: ${T.cyan}; font: 850 11px/1.2 'JetBrains Mono', monospace; }
.matching button.picked,
.bank button.picked { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px rgba(255,91,53,.35); transform: translateY(-2px); }
.matching button.matched { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.25); }
.construction { display: grid; gap: 15px; }
.zero-placeholder-svg { filter: drop-shadow(0 14px 22px rgba(23,59,82,.10)); }
.zero-scene-shell { fill: #F8FBF9; stroke: rgba(22,143,163,.18); stroke-width: 2; }
.zero-multiplier > rect:first-child { fill: ${T.navy}; }
.digit-chip { stroke-width: 1.5; }
.hundreds-chip { fill: rgba(125,225,238,.18); stroke: #7DE1EE; }
.zero-chip { fill: ${T.warnSoft}; stroke: ${T.warn}; stroke-dasharray: 3 3; }
.units-chip { fill: ${T.accentSoft}; stroke: ${T.accent}; }
.zero-multiplier text { fill: white; font: 900 14px/1 'JetBrains Mono', monospace; }
.zero-multiplier .zero-digit { fill: ${T.warn}; }
.zero-multiplier .base-number { fill: #BDEEF3; font-size: 18px; }
.zero-branch { fill: none; stroke: rgba(22,143,163,.42); stroke-width: 2.5; stroke-linecap: round; }
.branch-mid { stroke: ${T.warn}; stroke-dasharray: 5 5; }
.placeholder-row rect { fill: white; stroke: rgba(135,148,157,.18); stroke-width: 1.5; }
.placeholder-row circle { fill: ${T.cyanSoft}; stroke: ${T.cyan}; stroke-width: 1.5; }
.placeholder-row text { fill: ${T.ink2}; font: 850 14px/1 'JetBrains Mono', monospace; }
.placeholder-row .placeholder-value { fill: ${T.navy}; font-size: 17px; }
.row-zero rect { fill: ${T.warnSoft}; stroke: ${T.warn}; stroke-dasharray: 5 5; }
.row-zero circle { fill: white; stroke: ${T.warn}; }
.row-zero text,
.placeholder-row .zero-value { fill: ${T.warn}; }
.placeholder-dash { fill: none; stroke: rgba(169,111,19,.45); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 5 7; }
.zero-placeholder-svg.is-solved .row-units,
.zero-placeholder-svg.is-solved .row-hundreds { animation: zeroRowConfirm .62s cubic-bezier(.16,1,.3,1) both; }
.slots { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.slots button { min-height: 88px; display: grid; align-content: center; gap: 8px; }
.slots button small { color: ${T.ink3}; font-size: 10px; font-weight: 850; }
.slots button strong { color: ${T.navy}; font: 900 18px/1 'JetBrains Mono', monospace; }
.slots button.filled { background: ${T.cyanSoft}; }
.slots button.bad { background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.28); }
.bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 9px; }
.bank button { min-width: 88px; color: ${T.navy}; font: 900 15px/1 'JetBrains Mono', monospace; }
.aligned-zero { opacity: .13; transition: opacity .5s ease; }
.aligned-zero.reveal { opacity: 1; }
.aligned-zero .zero-row { color: ${T.ink3}; }
.input-row { margin-top: 15px; display: flex; align-items: stretch; gap: 10px; }
.answer {
  min-width: 0;
  min-height: 54px;
  flex: 1;
  padding: 10px 16px;
  border: 2px solid rgba(135,148,157,.25);
  border-radius: 15px;
  outline: 0;
  color: ${T.navy};
  background: #F8F8F4;
  font: 900 20px/1 'JetBrains Mono', monospace;
}
.answer:focus { border-color: ${T.cyan}; box-shadow: 0 0 0 4px rgba(22,143,163,.12); }
.answer.correct-input { border-color: ${T.success}; background: ${T.successSoft}; }
.answer.wrong-input { border-color: ${T.warn}; background: ${T.warnSoft}; }
.proof-grid {
  margin-top: 13px;
  padding: 13px;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  font: 850 13px/1.3 'JetBrains Mono', monospace;
  animation: proofOpen .72s cubic-bezier(.16,1,.3,1) both;
}
.proof-grid span,
.proof-grid b,
.proof-grid small { padding: 8px 10px; border-radius: 10px; background: rgba(255,255,255,.66); }
.proof-grid b { color: ${T.success}; }
.proof-grid small { width: 100%; color: ${T.ink2}; text-align: center; font-family: Manrope, sans-serif; }
.strategy-visual,
.blocks-visual { min-height: 124px; display: flex; align-items: center; justify-content: center; gap: 20px; }
.strategy-visual span,
.strategy-visual b,
.blocks-visual span,
.blocks-visual b { padding: 14px 18px; border-radius: 15px; font: 900 clamp(17px,3vw,25px)/1 'JetBrains Mono', monospace; }
.strategy-visual span,
.blocks-visual span { color: ${T.ink2}; background: #F8F8F4; }
.strategy-visual b,
.blocks-visual b { color: ${T.cyan}; background: ${T.cyanSoft}; }
.strategy-visual i { color: ${T.accent}; font: normal 900 26px/1 Manrope, sans-serif; }
.error-visual { min-height: 160px; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 18px; }
.error-visual > span { color: ${T.navy}; text-align: center; font: 900 25px/1 'JetBrains Mono', monospace; }
.error-visual > div { padding: 12px 28px; display: grid; justify-items: end; color: ${T.navy}; font: 900 18px/1.35 'JetBrains Mono', monospace; }
.error-visual i,
.error-visual b,
.error-visual strong { font-style: normal; }
.error-visual b { padding: 2px 6px; border-radius: 7px; color: ${T.warn}; background: ${T.warnSoft}; text-decoration: line-through; }
.error-visual strong { width: 100%; margin-top: 4px; padding-top: 5px; border-top: 2px solid ${T.ink}; color: ${T.warn}; }
.summary { align-items: start; }
.rules { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; }
.rules > div { min-height: 92px; padding: 10px; border-radius: 14px; display: grid; align-content: center; justify-items: center; gap: 8px; color: ${T.ink2}; background: #F8F8F4; text-align: center; font-size: 11px; line-height: 1.35; transition: .22s ease; }
.rules > div > b { width: 27px; height: 27px; border-radius: 9px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font: 900 11px/1 'JetBrains Mono', monospace; }
.rules > div.active { color: ${T.navy}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px rgba(255,91,53,.24); transform: translateY(-3px); }
.bridge { padding: 13px 16px; border-radius: 16px; color: white; background: ${T.navy}; }
.bridge > span { color: #7DE1EE; }
.bridge > strong { font: 750 16px/1.3 'Source Serif 4', Georgia, serif; }
.preview-language {
  position: fixed;
  top: 9px;
  right: 9px;
  z-index: 30;
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255,255,255,.95);
  box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},.6);
}
.preview-language button { min-width: 44px; min-height: 44px; padding: 4px 9px; border: 0; border-radius: 999px; color: ${T.ink2}; background: transparent; cursor: pointer; font-size: 10px; font-weight: 900; }
.preview-language .preview-active { color: white; background: ${T.accent}; }
.g1-char { overflow: visible; filter: drop-shadow(0 9px 11px rgba(23,59,82,.20)); }
.g1-bit-ant { transform-origin: 60px 28px; animation: antennaBounce 2.1s ease-in-out infinite; }
.g1-bit-wave,
.bit-wave-right { transform-origin: 84px 76px; animation: bitWave 1.15s ease-in-out infinite alternate; }
.bit-wave-left { transform-origin: 36px 76px; animation: bitWaveLeft 1.15s ease-in-out infinite alternate; }
.bit-think-hand { transform-origin: 84px 76px; animation: thinkTap 1.7s ease-in-out infinite; }
.bit-point-arm { transform-origin: 84px 76px; animation: pointPulse 1.2s ease-in-out infinite alternate; }
.bit-idea-bulb,
.bit-nod-check { animation: bulbPulse 1.15s ease-in-out infinite alternate; }
.g1-eyes { animation: blink 4.6s ease-in-out infinite; transform-origin: center; }
@keyframes pageEnter { from { opacity: 0; transform: translateY(10px); } }
@keyframes rangePulse { to { box-shadow: 0 0 18px rgba(149,201,61,.55); transform: scale(1.025); } }
@keyframes digitDrop { from { opacity: 0; transform: translateY(-10px); } }
@keyframes carryArc { to { transform: translateY(-4px) rotate(-7deg); } }
@keyframes rawFade { to { opacity: 0; } }
@keyframes rawShiftOne { to { opacity: 0; transform: translateX(-42px); } }
@keyframes rawShiftTwo { to { opacity: 0; transform: translateX(-76px); } }
@keyframes railCartZero { from { transform: scale(.88); } to { transform: scale(1); } }
@keyframes railCartOne { from { transform: translateX(0); } to { transform: translateX(-78px); } }
@keyframes railCartTwo { from { transform: translateX(0); } to { transform: translateX(-156px); } }
@keyframes railSignal { from { opacity: .25; transform: scale(.76); } to { opacity: 1; transform: scale(1); } }
@keyframes consoleShiftZero { from { transform: scale(.84); } to { transform: scale(1); } }
@keyframes consoleShiftOne { from { transform: translateX(0); } to { transform: translateX(-52px); } }
@keyframes consoleShiftTwo { from { transform: translateX(0); } to { transform: translateX(-104px); } }
@keyframes consoleTerminal { from { opacity: .15; } to { opacity: 1; } }
@keyframes zeroRowConfirm { from { opacity: .45; transform: translateX(-7px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fullAppear { from { opacity: 0; transform: translateY(7px); } }
@keyframes proofOpen { from { opacity: 0; transform: translateY(10px); } }
@keyframes antennaBounce { 50% { transform: rotate(5deg); } }
@keyframes bitWave { to { transform: rotate(-11deg); } }
@keyframes bitWaveLeft { to { transform: rotate(11deg); } }
@keyframes thinkTap { 50% { transform: rotate(-5deg) translateY(-2px); } }
@keyframes pointPulse { to { transform: translateX(3px); } }
@keyframes bulbPulse { to { filter: drop-shadow(0 0 5px rgba(255,194,60,.75)); transform: scale(1.06); } }
@keyframes blink { 0%,45%,49%,100% { transform: scaleY(1); } 47% { transform: scaleY(.12); } }
@media (max-width: 639.98px) {
  .stage { width: min(390px,100%); }
  .stage-content { overscroll-behavior: contain; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .stage-content::-webkit-scrollbar { display: none; }
  .heading { min-height: 70px; gap: 10px; }
  .heading h1 { font-size: 27px; }
  .heading .g1-char { width: 67px; height: 83px; }
  .question,
  .decompose,
  .rails-model,
  .branch-model,
  .units-row,
  .shift-scene,
  .synthesis,
  .matching,
  .construction,
  .strategy-visual,
  .error-visual,
  .blocks-visual,
  .summary,
  .rules { padding: 14px; border-radius: 18px; }
  .options { grid-template-columns: 1fr; }
  .option { min-height: 52px; }
  .hook-scene { min-height: 275px; padding: 18px 16px 65px; grid-template-columns: 1fr 30px 1fr; gap: 7px; }
  .hook-scene > div:not(.range-hint) { padding: 12px 9px; }
  .hook-scene > div > strong { font-size: 30px; }
  .hook-scene > .g1-char { width: 69px; height: 88px; right: 12px; top: 10px; }
  .range-hint { left: 13px; right: 13px; bottom: 14px; gap: 6px !important; }
  .range-hint b { font-size: 10px; }
  .rails-illustration-wrap,
  .control-panel-wrap { position: relative; grid-template-columns: 1fr; padding-top: 22px; }
  .rails-coach,
  .console-coach { position: absolute; top: -23px; right: 1px; width: 58px; z-index: 2; }
  .parallel-rails-svg,
  .shift-console-svg,
  .zero-placeholder-svg { width: 100%; }
  .console-key { gap: 5px; }
  .console-key > span { min-height: 36px; }
  .links,
  .three-rails,
  .branch-model > div { gap: 6px; }
  .links span,
  .three-rails > div,
  .branch-model > div > b { padding: 8px 5px; font-size: 11px; }
  .units-row { grid-template-columns: 115px 34px 1fr; gap: 7px; }
  .mini-calc { padding: 8px 10px; font-size: 18px; }
  .carry-arc { font-size: 30px; }
  .units-row > b { padding: 9px 6px; font-size: 11px; }
  .row-shift { grid-template-columns: 78px 1fr 30px; gap: 6px; }
  .row-rail { min-height: 55px; padding: 8px; grid-template-columns: 1fr 20px 1fr; font-size: 15px; }
  .synthesis,
  .summary { grid-template-columns: 1fr; }
  .raw-shifts .row-shift { grid-template-columns: 27px 1fr 27px; }
  .aligned-rows { width: 184px; font-size: 17px; }
  .matching { min-height: 240px; grid-template-columns: 1fr 24px 1fr; gap: 6px; }
  .matching button { min-height: 58px; padding: 8px; font-size: 11px; }
  .slots { grid-template-columns: 1fr; }
  .slots button { min-height: 65px; }
  .input-row { flex-direction: column; }
  .strategy-visual,
  .blocks-visual { min-height: 105px; flex-wrap: wrap; gap: 8px; }
  .strategy-visual span,
  .strategy-visual b,
  .blocks-visual span,
  .blocks-visual b { padding: 10px; font-size: 15px; }
  .error-visual { min-height: 130px; grid-template-columns: 1fr; gap: 4px; }
  .rules { grid-template-columns: 1fr; }
  .rules > div { min-height: 54px; grid-template-columns: 30px 1fr; justify-items: start; text-align: left; }
  .stage-nav { min-height: 68px; }
  .btn { min-width: 110px; min-height: 48px; padding: 0 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root *,
  .lesson-root *::before,
  .lesson-root *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
  .row-shift.active .raw-row { opacity: 0 !important; transform: none !important; }
  .row-shift.active .row-rail strong,
  .links.reveal,
  .three-rails.reveal,
  .branch-model .reveal,
  .range-result.reveal,
  .aligned-rows .show { opacity: 1 !important; transform: none !important; }
  .parallel-rails-svg.is-live .rail-cart-0,
  .console-lane-0.is-active .console-cart { opacity: 1 !important; transform: none !important; }
  .parallel-rails-svg.is-live .rail-cart-1 { opacity: 1 !important; transform: translateX(-78px) !important; }
  .parallel-rails-svg.is-live .rail-cart-2 { opacity: 1 !important; transform: translateX(-156px) !important; }
  .console-lane-1.is-active .console-cart { opacity: 1 !important; transform: translateX(-52px) !important; }
  .console-lane-2.is-active .console-cart { opacity: 1 !important; transform: translateX(-104px) !important; }
  .console-lane.is-active .console-terminal-text,
  .parallel-rails-svg.is-live .rail-signal,
  .zero-placeholder-svg.is-solved .placeholder-row { opacity: 1 !important; transform: none !important; }
}
`;
