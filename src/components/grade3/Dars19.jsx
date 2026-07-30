import { useEffect, useMemo, useRef, useState } from 'react';
import { Grade3CityEtalonScene } from './Dars01.jsx';
import { Grade3TowerEtalonScene } from './Dars02.jsx';
import { Grade3GardenEtalonScene } from './Dars09.jsx';
import { Grade3WorkshopEtalonScene } from './Dars18.jsx';
import {
  createGrade3RunSeed,
  restoreGrade3LessonIndex,
  restoreGrade3LessonLanguage,
  seededIndexOrder,
} from './grade3MethodUtils.js';
import { GRADE3_REVIEW_MODE } from './grade3ReviewMode.js';
import { speakGrade3Text, toGrade3SpeechText } from './grade3Speech.js';
import { grade3StorageKey, readGrade3State, writeGrade3State } from './grade3Storage.js';

const T = (uz, ru) => ({ uz, ru });

const SCREENS = [
  {
    type: 'hook',
    title: T("Ustaxonadagi ortiqcha detallar", "Лишние детали в мастерской"),
    text: T("Bit 17 ta detalni 5 ta qutiga teng joylamoqchi. Har qutiga bir xil miqdor tushadi, lekin ayrim detallar ortib qoladi.", "Бит хочет поровну разложить 17 деталей в 5 коробок. В каждой коробке будет поровну, но несколько деталей останутся."),
    visual: '17 → 5 + 5 + 5 + 2',
    ask: T("Avvalgi darsga ko'ra, 15 : 5 nechaga teng?", "Вспомни прошлый урок: чему равно 15 : 5?"),
    options: ['2', '3', '5'], correct: 1,
    hint: T("5 × 3 = 15 tengligini eslang.", "Вспомни равенство 5 × 3 = 15."),
  },
  {
    type: 'exploration',
    title: T("Teng guruhlar quramiz", "Строим равные группы"),
    text: T("17 ta detalning 15 tasini 5 ta teng guruhga joylaymiz. Har guruhda 3 tadan detal bo'ladi.", "Из 17 деталей 15 раскладываем в 5 равных групп. В каждой группе по 3 детали."),
    visual: '●●● | ●●● | ●●● | ●●● | ●●●   + ●●',
    ask: T("Nechta detal guruhlarga kirmay qoldi?", "Сколько деталей не вошло в группы?"),
    options: ['1', '2', '3'], correct: 1,
    hint: T("17 dan guruhlarga joylangan 15 ni ayiring.", "Вычти из 17 те 15 деталей, которые вошли в группы."),
  },
  {
    type: 'exploration',
    title: T("Yangi yozuv", "Новая запись"),
    text: T("17 ni 5 ga bo'lganda 3 tadan to'liq guruh va 2 ta ortiqcha detal hosil bo'ldi.", "При делении 17 на 5 получили по 3 в каждой полной группе и 2 лишние детали."),
    visual: '17 : 5 = 3 (qoldiq 2)',
    ask: T("Bu yozuvda bo'linma qaysi son?", "Какое число является частным?"),
    options: ['2', '3', '5'], correct: 1,
    hint: T("Bo'linma har bir guruhdagi miqdorni ko'rsatadi.", "Частное показывает количество в каждой группе."),
  },
  {
    type: 'exploration',
    title: T("Qoldiqni taniymiz", "Находим остаток"),
    text: T("Qoldiq — teng guruhlarga joylashmagan qism. U bo'luvchidan doim kichik bo'ladi.", "Остаток — часть, которая не вошла в равные группы. Он всегда меньше делителя."),
    visual: '17 = 5 × 3 + 2',
    ask: T("Qoldiq qaysi son?", "Какое число является остатком?"),
    options: ['2', '3', '17'], correct: 0,
    hint: T("Ko'paytmadan keyin qo'shilgan ortiqcha qismga qarang.", "Посмотри на лишнюю часть после произведения."),
  },
  {
    type: 'rule',
    title: T("Qoldiqli bo'lish qoidasi", "Правило деления с остатком"),
    text: T("Bo'linuvchi = bo'luvchi × bo'linma + qoldiq. Qoldiq noldan katta yoki teng va bo'luvchidan kichik bo'ladi.", "Делимое = делитель × частное + остаток. Остаток неотрицателен и меньше делителя."),
    visual: 'a = b × q + r,   0 ≤ r < b',
    ask: T("5 ga bo'lgandagi qoldiq qaysi son bo'la olmaydi?", "Какого остатка не может быть при делении на 5?"),
    options: ['0', '4', '5'], correct: 2,
    hint: T("Qoldiq bo'luvchidan kichik bo'lishi shart.", "Остаток обязан быть меньше делителя."),
  },
  {
    type: 'test',
    title: T("Birga yechamiz", "Решаем вместе"),
    text: T("14 ta modulni 4 tadan guruhlaymiz: 12 tasi uchta to'liq guruh beradi.", "Группируем 14 модулей по 4: 12 модулей дают три полные группы."),
    visual: '14 = 4 × 3 + ?',
    ask: T("Qoldiqni toping.", "Найди остаток."),
    options: ['1', '2', '3'], correct: 1,
    hint: T("14 − 12 ni hisoblang.", "Вычисли 14 − 12."),
  },
  {
    type: 'test',
    title: T("Bo'linma va qoldiq", "Частное и остаток"),
    text: T("22 ni 6 ga bo'lamiz. 22 dan oshmaydigan eng yaqin 6 karralisi 18.", "Делим 22 на 6. Ближайшее кратное 6, не превышающее 22, — 18."),
    visual: '22 = 6 × 3 + 4',
    ask: T("To'g'ri javobni tanlang.", "Выбери верный ответ."),
    options: ['22 : 6 = 3 (qoldiq 4)', '22 : 6 = 4 (qoldiq 2)', '22 : 6 = 3 (qoldiq 3)'], correct: 0,
    hint: T("6 × 3 va undan qolgan farqni tekshiring.", "Проверь 6 × 3 и оставшуюся разность."),
  },
  {
    type: 'test',
    title: T("Chegara holati", "Граничный случай"),
    text: T("24 soni 6 ga qoldiqsiz bo'linadi. Qoldiqsiz bo'lish ham shu umumiy yozuvga mos.", "24 делится на 6 без остатка. Деление без остатка тоже подходит к общей записи."),
    visual: '24 = 6 × 4 + 0',
    ask: T("24 : 6 da qoldiq nechaga teng?", "Каков остаток при 24 : 6?"),
    options: ['0', '4', '6'], correct: 0,
    hint: T("Barcha 24 birlik to'liq guruhlarga kirdi.", "Все 24 единицы вошли в полные группы."),
  },
  {
    type: 'test',
    title: T("Teskari topshiriq", "Обратное задание"),
    text: T("Bo'luvchi 7, bo'linma 4, qoldiq 3. Bo'linuvchini tiklaymiz.", "Делитель 7, частное 4, остаток 3. Восстановим делимое."),
    visual: '□ = 7 × 4 + 3',
    ask: T("Bo'linuvchi qaysi son?", "Каково делимое?"),
    options: ['28', '31', '35'], correct: 1,
    hint: T("Avval 7 × 4, keyin 3 ni qo'shing.", "Сначала вычисли 7 × 4, затем прибавь 3."),
  },
  {
    type: 'test',
    title: T("Qoldiqni tekshiramiz", "Проверяем остаток"),
    text: T("Har bir yozuvda qoldiq bo'luvchidan kichik bo'lishi kerak.", "В каждой записи остаток должен быть меньше делителя."),
    visual: '19 : 4 = 4 (qoldiq 3)',
    ask: T("Yozuv to'g'rimi?", "Верна ли запись?"),
    options: [T("Ha, chunki 4 × 4 + 3 = 19", "Да, потому что 4 × 4 + 3 = 19"), T("Yo'q, qoldiq katta", "Нет, остаток слишком большой"), T("Yo'q, bo'linma 3", "Нет, частное равно 3")], correct: 0,
    hint: T("Ko'paytirib qo'shing va 3 < 4 ni tekshiring.", "Умножь, прибавь и проверь 3 < 4."),
  },
  {
    type: 'test',
    title: T("Xatoni toping", "Найди ошибку"),
    text: T("Jasur: «20 : 6 = 3, qoldiq 2», dedi. Anvar esa qoldiq 6 bo'lishi mumkinligini aytdi.", "Жасур сказал: «20 : 6 = 3, остаток 2». Анвар сказал, что остаток может равняться 6."),
    visual: '20 = 6 × 3 + 2',
    ask: T("Kimning fikri to'g'ri?", "Кто рассуждает верно?"),
    options: [T("Jasurniki", "Жасур"), T("Anvarniki", "Анвар"), T("Ikkalasi ham", "Оба")], correct: 0,
    hint: T("Qoldiq 6 bo'luvchidan kichikmi?", "Меньше ли остаток 6 делителя 6?"),
  },
  {
    type: 'case',
    title: T("Ustaxona masalasi", "Задача мастерской"),
    text: T("Bitda 29 ta murvat bor. Har bir ramkaga 4 tadan murvat kerak.", "У Бита 29 болтов. Для каждой рамы нужно по 4 болта."),
    visual: '29 : 4 = ?',
    ask: T("Nechta to'liq ramka yig'iladi va nechta murvat qoladi?", "Сколько полных рам получится и сколько болтов останется?"),
    options: [T("7 ta ramka, 1 ta qoldiq", "7 рам, остаток 1"), T("6 ta ramka, 5 ta qoldiq", "6 рам, остаток 5"), T("8 ta ramka, qoldiq yo'q", "8 рам, без остатка")], correct: 0,
    hint: T("29 dan oshmaydigan eng katta 4 karralisini toping.", "Найди наибольшее кратное 4, не превышающее 29."),
  },
  {
    type: 'test',
    title: T("Mustaqil mashq", "Самостоятельная работа"),
    text: T("37 ni 5 ga qoldiqli bo'ling.", "Раздели 37 на 5 с остатком."),
    visual: '37 : 5 = ?',
    ask: T("To'g'ri yozuvni tanlang.", "Выбери верную запись."),
    options: ['37 : 5 = 7 (qoldiq 2)', '37 : 5 = 6 (qoldiq 7)', '37 : 5 = 8 (qoldiq 3)'], correct: 0,
    hint: T("5 × 7 = 35 dan foydalaning.", "Используй 5 × 7 = 35."),
  },
  {
    type: 'test',
    title: T("Yakuniy diagnostika", "Итоговая диагностика"),
    text: T("Yangi vaziyat: 43 ta signal 8 tadan paketlanadi.", "Новая ситуация: 43 сигнала упаковывают по 8."),
    visual: '43 = 8 × □ + △',
    ask: T("□ va △ ni toping.", "Найди □ и △."),
    options: ['□ = 5, △ = 3', '□ = 4, △ = 11', '□ = 6, △ = 5'], correct: 0,
    hint: T("43 dan oshmaydigan eng katta 8 karralisini toping.", "Найди наибольшее кратное 8, не превышающее 43."),
  },
  {
    type: 'summary',
    title: T("Taqsimot yakunlandi", "Распределение завершено"),
    text: T("Siz qoldiqli bo'lishni model, yozuv va tekshiruv orqali tushuntirdingiz. Bit ortib qolgan detallarni alohida qutiga joyladi.", "Ты объяснил деление с остатком с помощью модели, записи и проверки. Бит сложил оставшиеся детали в отдельную коробку."),
    visual: 'bo‘linuvchi = bo‘luvchi × bo‘linma + qoldiq',
    ask: T("Eng muhim shart qaysi?", "Какое условие самое важное?"),
    options: [T("Qoldiq bo'luvchidan kichik", "Остаток меньше делителя"), T("Qoldiq doim 1", "Остаток всегда 1"), T("Bo'linma qoldiqdan kichik", "Частное меньше остатка")], correct: 0,
    hint: T("Qoldiqdan yana bitta to'liq guruh tuzib bo'lmasligi kerak.", "Из остатка нельзя составить ещё одну полную группу."),
  },
];

function local(value, lang) {
  if (typeof value === 'string') return value;
  return value?.[lang] ?? value?.uz ?? '';
}

const BOOKEND_TOPICS = {
  19: ['remainder', "Qoldiqli bo'lish", 'Деление с остатком'],
  20: ['verify', 'Amallarni tekshirish', 'Проверка действий'],
  21: ['column', 'Yozma usullar', 'Письменные приёмы'],
  22: ['modules', "Ikki xonali sonlarni ko'paytirish", 'Умножение двузначных чисел'],
  23: ['build', 'Qurilish masalasi', 'Задача о строительстве'],
  24: ['share', 'Kattalik ulushi', 'Доля величины'],
  25: ['fractions', "Kasrlarning hosil bo'lishi", 'Образование дробей'],
  26: ['compareFractions', 'Ulushlarni taqqoslash', 'Сравнение долей'],
  27: ['partOf', 'Sonning ulushini topish', 'Нахождение доли числа'],
  28: ['mixed', "To'g'ri va noto'g'ri kasrlar", 'Правильные и неправильные дроби'],
  29: ['fractionScale', 'Kasrlarni taqqoslash', 'Сравнение дробей'],
  30: ['fractionMath', "Kasrlarni qo'shish va ayirish", 'Сложение и вычитание дробей'],
  31: ['decimal', "O'nli kasrlar", 'Десятичные дроби'],
  32: ['feast', 'Ulush va kasrlarga oid masala', 'Задача на доли и дроби'],
  33: ['perimeter', 'Perimetr', 'Периметр'],
  34: ['areaUnits', 'Yuza birliklari', 'Единицы площади'],
  35: ['rectArea', "To'g'ri to'rtburchak yuzasi", 'Площадь прямоугольника'],
  36: ['squareArea', 'Kvadrat yuzasi', 'Площадь квадрата'],
  37: ['measureCompare', 'Perimetr va yuzani taqqoslash', 'Сравнение периметра и площади'],
  38: ['blueprint', 'Perimetr va yuzaga oid masala', 'Задача на периметр и площадь'],
  39: ['lines', 'Uchburchaklar va chiziqlar', 'Треугольники и линии'],
  40: ['symmetry', "Simmetriya va burchak", 'Симметрия и угол'],
  41: ['solids', 'Piramida va konus', 'Пирамида и конус'],
  42: ['mass', 'Massa', 'Масса'],
  43: ['time', 'Vaqt', 'Время'],
  44: ['length', 'Uzunlik birliklari', 'Единицы длины'],
  45: ['calendar', 'Kalendar', 'Календарь'],
  46: ['equation', 'Tenglamalar', 'Уравнения'],
  47: ['equationCheck', 'Tenglamani yechish va tekshirish', 'Решение и проверка уравнений'],
  48: ['route', 'Murakkab masalalar', 'Составные задачи'],
  49: ['logic', 'Tengsizlik va fikrlar', 'Неравенства и высказывания'],
  50: ['data', "Doiraviy diagramma", 'Круговая диаграмма'],
  51: ['finale', 'Yakuniy takrorlash', 'Итоговое повторение'],
};

function CrewMember({ x, y, suit, hair, scale = 1, pose = 'watch' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="72" rx="25" ry="7" fill="#071923" opacity=".28"/>
      <path d="M-17 33q17-12 34 0v35q-17 12-34 0Z" fill={suit} stroke="#e9fbff" strokeWidth="2"/>
      <circle cx="0" cy="16" r="19" fill="#dca77c" stroke="#edfaff" strokeWidth="2"/>
      <path d="M-18 12q4-23 19-19 16 0 18 19-8-8-18-8-11 0-19 8Z" fill={hair}/>
      <circle cx="-6" cy="17" r="1.8" fill="#223746"/><circle cx="6" cy="17" r="1.8" fill="#223746"/>
      <path d="M-5 24q5 4 10 0" fill="none" stroke="#8d5143" strokeWidth="1.7" strokeLinecap="round"/>
      <path d={pose === 'point' ? 'M16 39l25-14' : 'M-15 41l-14 17'} stroke={suit} strokeWidth="8" strokeLinecap="round"/>
      <path d="M-9 68l-4 12M9 68l4 12" stroke="#e9fbff" strokeWidth="7" strokeLinecap="round"/>
      <rect x="-7" y="42" width="14" height="10" rx="3" fill="#173649" opacity=".7"/>
    </g>
  );
}

function BitGuide({ done }) {
  return (
    <g className="bit-guide" transform="translate(275 110)">
      <ellipse cx="0" cy="70" rx="29" ry="8" fill="#071923" opacity=".3"/>
      <rect x="-20" y="27" width="40" height="50" rx="18" fill="#f5f8fa" stroke="#6dd6e8" strokeWidth="3"/>
      <circle cx="0" cy="12" r="25" fill="#f5f8fa" stroke="#6dd6e8" strokeWidth="3"/>
      <rect x="-17" y="3" width="34" height="19" rx="9" fill="#263e59"/>
      <circle cx="-7" cy="12" r="3.5" fill="#71e6ff"/><circle cx="7" cy="12" r="3.5" fill="#71e6ff"/>
      <path d={done ? 'M-7 20q7 7 14 0' : 'M-6 20q6-3 12 0'} fill="none" stroke="#71e6ff" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M-19 39l-18 15M19 39l22-13" stroke="#f5f8fa" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="0" cy="47" r="6" fill={done ? '#6ee0a1' : '#ffd36b'} filter="url(#g3-glow)"/>
    </g>
  );
}

function SetPiece({ kind, done }) {
  const ok = done ? '#72e0a5' : '#ffbf69';
  const alert = done ? '#72e0a5' : '#ff7766';
  const panel = '#152f45';
  const line = '#b9f1fa';
  const grid = (cols, rows, size = 19) => Array.from({ length: cols * rows }, (_, i) => (
    <rect key={i} x={(i % cols) * size} y={Math.floor(i / cols) * size} width={size - 3} height={size - 3} rx="3" fill={i < Math.ceil(cols * rows * .62) ? ok : '#52728a'}/>
  ));

  if (kind === 'remainder') return <g transform="translate(426 92)"><path d="M0 88h238" stroke="#7fb2bd" strokeWidth="5"/>{[0,1,2,3,4].map(i=><g key={i} transform={`translate(${i*43} 28)`}><rect width="35" height="55" rx="6" fill={panel} stroke={line} strokeWidth="2"/>{[0,1,2].map(j=><circle key={j} cx={9+j*9} cy="48" r="4" fill={ok}/>)}</g>)}<circle cx="222" cy="68" r="6" fill={alert}/><circle cx="237" cy="68" r="6" fill={alert}/></g>;
  if (kind === 'verify' || kind === 'equationCheck') return <g transform="translate(435 78)"><rect width="218" height="112" rx="16" fill={panel} stroke="#72d7e9" strokeWidth="4"/><path d="M38 58h52m38 0h52" stroke={line} strokeWidth="8" strokeLinecap="round"/><path d="M90 58l18-16m-18 16l18 16m20-32l-18 16 18 16" fill="none" stroke={ok} strokeWidth="5" strokeLinecap="round"/><circle cx="190" cy="22" r="7" fill={alert}/><rect x="27" y="88" width="164" height="8" rx="4" fill="#456477"/></g>;
  if (kind === 'column' || kind === 'modules' || kind === 'build') return <g transform="translate(433 68)"><path d="M20 112V35h178v77" fill="#25495b" stroke="#75d8e8" strokeWidth="4"/><path d="M3 38h212L188 8H31Z" fill="#3c6675"/>{[0,1,2].map(r=>[0,1,2,3].map(c=><rect key={`${r}-${c}`} x={34+c*39} y={51+r*25} width="28" height="18" rx="4" fill={(r*4+c)<(done?12:8)?ok:'#587484'}/>))}<path d="M212 104l35 8-35 8Z" fill={alert}/></g>;
  if (['share','fractions','partOf','mixed','fractionMath','feast'].includes(kind)) return <g transform="translate(472 126)"><ellipse cx="73" cy="53" rx="103" ry="22" fill="#395a55"/><circle cx="58" cy="5" r="60" fill="#ffd477" stroke="#fff0b2" strokeWidth="4"/><path d="M58 5V-55A60 60 0 0 1 118 5Z" fill={ok}/><path d="M58 5h60A60 60 0 0 1 58 65Z" fill="#7ebee9"/><path d="M58 5v60A60 60 0 0 1-2 5Z" fill="#c399e5"/><path d="M58 5H-2A60 60 0 0 1 58-55Z" fill="#f19b69"/>{done&&<path d="M58-55v120M-2 5h120" stroke="#fff8d7" strokeWidth="3"/>}</g>;
  if (kind === 'compareFractions' || kind === 'fractionScale') return <g transform="translate(452 97)"><path d="M107 5v87M28 90h158" stroke={line} strokeWidth="6" strokeLinecap="round"/><path d="M42 34h130" stroke="#a8e8f2" strokeWidth="5"/><path d="M42 34L20 69m22-35l22 35m108-35l-22 35m22-35l22 35" stroke="#a8e8f2" strokeWidth="3"/><circle cx="42" cy="75" r="27" fill="#f3b963"/><path d="M42 75V48A27 27 0 0 1 69 75Z" fill={ok}/><circle cx="172" cy="75" r="27" fill="#83c8ed"/><path d="M172 75V48A27 27 0 0 1 199 75Z" fill={alert}/></g>;
  if (kind === 'decimal') return <g transform="translate(438 81)"><rect width="218" height="108" rx="16" fill={panel} stroke="#74d9e8" strokeWidth="4"/><g transform="translate(26 23)">{grid(10,4,16)}</g><text x="174" y="66" fill="#ffe293" fontSize="28" fontWeight="900">0,6</text></g>;
  if (kind === 'perimeter') return <g transform="translate(444 78)"><rect width="208" height="112" rx="14" fill="#243953" stroke="#c2adff" strokeWidth="4"/><path d="M28 22h128v68H28Z" fill="#314c63" stroke={ok} strokeWidth="8"/><path d="M28 101h128" stroke="#f4d978" strokeWidth="3"/><path d="M28 96v10m128-10v10" stroke="#f4d978" strokeWidth="3"/><text x="181" y="67" textAnchor="middle" fill="#ffe28d" fontSize="24" fontWeight="900">P</text></g>;
  if (kind === 'areaUnits') return <g transform="translate(444 78)"><rect width="208" height="112" rx="14" fill="#243953" stroke="#c2adff" strokeWidth="4"/><g transform="translate(23 16)">{grid(7,5,17)}</g><rect x="150" y="22" width="40" height="40" rx="5" fill={ok} stroke="#efffc9" strokeWidth="3"/><text x="170" y="87" textAnchor="middle" fill="#ffe28d" fontSize="18" fontWeight="900">1 cm²</text></g>;
  if (kind === 'rectArea') return <g transform="translate(444 78)"><rect width="208" height="112" rx="14" fill="#243953" stroke="#c2adff" strokeWidth="4"/><g transform="translate(20 19)">{grid(7,4,19)}</g><path d="M18 14h132v80H18Z" fill="none" stroke="#f4d978" strokeWidth="4"/><text x="177" y="63" textAnchor="middle" fill={ok} fontSize="18" fontWeight="900">a×b</text></g>;
  if (kind === 'squareArea') return <g transform="translate(444 78)"><rect width="208" height="112" rx="14" fill="#243953" stroke="#c2adff" strokeWidth="4"/><g transform="translate(28 13)">{grid(5,5,18)}</g><path d="M24 9h90v90H24Z" fill="none" stroke="#f4d978" strokeWidth="4"/><text x="163" y="63" textAnchor="middle" fill={ok} fontSize="18" fontWeight="900">a²</text></g>;
  if (kind === 'measureCompare') return <g transform="translate(444 78)"><rect width="208" height="112" rx="14" fill="#243953" stroke="#c2adff" strokeWidth="4"/><rect x="17" y="23" width="72" height="62" fill="#314c63" stroke={ok} strokeWidth="6"/><g transform="translate(111 20)">{grid(4,4,18)}</g><path d="M102 12v88" stroke="#c9b6f7" strokeWidth="3" strokeDasharray="6 5"/><text x="53" y="106" textAnchor="middle" fill="#ffe28d" fontSize="14" fontWeight="900">P</text><text x="146" y="106" textAnchor="middle" fill="#ffe28d" fontSize="14" fontWeight="900">S</text></g>;
  if (kind === 'blueprint') return <g transform="translate(444 78)"><rect width="208" height="112" rx="14" fill="#243953" stroke="#c2adff" strokeWidth="4"/><path d="M25 88V19h72v28h69v41Z" fill="#41617a" stroke={ok} strokeWidth="5"/><path d="M20 100h151M13 21v68" stroke="#f4d978" strokeWidth="3"/><path d="M20 95v10m151-10v10M8 21h10M8 89h10" stroke="#f4d978" strokeWidth="3"/><circle cx="179" cy="28" r="8" fill={alert}/></g>;
  if (kind === 'lines' || kind === 'symmetry') return <g transform="translate(448 73)"><path d="M18 111L91 8l75 103Z" fill="#5b7eac" stroke="#d8c9ff" strokeWidth="4"/><path d="M91 8v103" stroke={ok} strokeWidth="4" strokeDasharray="8 6"/><path d="M177 109V35h58M177 109h58" fill="none" stroke="#f8d778" strokeWidth="5"/><path d="M177 91h18V109" fill="none" stroke={alert} strokeWidth="3"/></g>;
  if (kind === 'solids') return <g transform="translate(450 79)"><path d="M22 106L80 3l61 103Z" fill="#936fd0" stroke="#e0d1ff" strokeWidth="4"/><path d="M80 3v103M22 106l58-31 61 31" fill="none" stroke="#e0d1ff" strokeWidth="3"/><ellipse cx="190" cy="105" rx="43" ry="14" fill="#477ea3" stroke="#bceaf4" strokeWidth="4"/><path d="M147 105L190 8l43 97" fill="#5ba2c4" stroke="#bceaf4" strokeWidth="4"/></g>;
  if (kind === 'mass') return <g transform="translate(445 82)"><path d="M107 5v103M35 34h145M35 34L10 79m25-45l25 45m120-45l-25 45m25-45l25 45" stroke={line} strokeWidth="5"/><path d="M3 79h64q-7 25-32 25T3 79m145 0h64q-7 25-32 25t-32-25" fill={ok}/><rect x="158" y="56" width="44" height="25" rx="5" fill={alert}/></g>;
  if (kind === 'time') return <g transform="translate(492 77)"><circle cx="74" cy="59" r="57" fill="#edf7f8" stroke="#76d5e5" strokeWidth="5"/><circle cx="74" cy="59" r="5" fill="#17394d"/><path d="M74 59V22M74 59l31 19" stroke="#17394d" strokeWidth="6" strokeLinecap="round"/>{done&&<circle cx="74" cy="59" r="46" fill="none" stroke={ok} strokeWidth="3"/>}</g>;
  if (kind === 'length') return <g transform="translate(430 100)"><rect width="238" height="72" rx="12" fill="#f2cd67" stroke="#fff1b4" strokeWidth="4"/>{Array.from({length:13},(_,i)=><path key={i} d={`M${13+i*17} 0v${i%5===0?35:22}`} stroke="#243b4b" strokeWidth="3"/>)}<path d="M24 53h185" stroke={ok} strokeWidth="7" strokeLinecap="round"/><path d="M24 45v16m185-16v16" stroke={ok} strokeWidth="4"/></g>;
  if (kind === 'calendar') return <g transform="translate(454 70)"><rect width="190" height="123" rx="15" fill="#f4f6f0" stroke="#78d6e5" strokeWidth="4"/><path d="M0 34h190" stroke="#ef776c" strokeWidth="10"/>{Array.from({length:21},(_,i)=><rect key={i} x={18+(i%7)*23} y={50+Math.floor(i/7)*23} width="16" height="16" rx="3" fill={i===(done?13:8)?ok:'#b9cad1'}/>)}</g>;
  if (kind === 'equation') return <g transform="translate(442 80)"><path d="M108 12v91M25 38h166M25 38L7 82m18-44l18 44m148-44l-18 44m18-44l18 44" stroke={line} strokeWidth="5"/><rect x="2" y="78" width="48" height="28" rx="8" fill={alert}/><text x="26" y="99" textAnchor="middle" fill="#17394d" fontSize="24" fontWeight="900">x</text><rect x="166" y="78" width="48" height="28" rx="8" fill={ok}/><text x="190" y="99" textAnchor="middle" fill="#17394d" fontSize="20" fontWeight="900">12</text></g>;
  if (kind === 'route' || kind === 'finale') return <g transform="translate(423 76)"><path d="M14 105C55 20 103 118 145 35s82 22 95-15" fill="none" stroke="#f5dc80" strokeWidth="7" strokeDasharray="11 8"/>{[[14,105],[81,75],[145,35],[221,41]].map((p,i)=><g key={i}><circle cx={p[0]} cy={p[1]} r="15" fill={i<=(done?3:1)?ok:'#5a7487'}/><text x={p[0]} y={p[1]+5} textAnchor="middle" fill="#163342" fontSize="13" fontWeight="900">{i+1}</text></g>)}</g>;
  if (kind === 'logic') return <g transform="translate(438 83)"><rect width="220" height="104" rx="16" fill={panel} stroke="#75d7e7" strokeWidth="4"/><text x="53" y="62" fill={ok} fontSize="38" fontWeight="900">≤</text><text x="112" y="62" fill="#f5dd83" fontSize="31" fontWeight="900">?</text><text x="166" y="62" fill={alert} fontSize="38" fontWeight="900">≥</text><circle cx="55" cy="82" r="7" fill={ok}/><circle cx="165" cy="82" r="7" fill={alert}/></g>;
  return <g transform="translate(466 75)"><circle cx="82" cy="61" r="59" fill="#f5d875" stroke="#fff1b7" strokeWidth="4"/><path d="M82 61V2A59 59 0 0 1 138 79Z" fill={ok}/><path d="M82 61l56 18a59 59 0 0 1-94 29Z" fill="#7ebee9"/><path d="M82 61l-38 47A59 59 0 0 1 82 2Z" fill="#c99ce9"/></g>;
}

function GeneratedBookendScene({ lessonNumber, phase, lang }) {
  const zone = lessonNumber >= 42
    ? 'observatory'
    : lessonNumber >= 33
      ? 'crystal'
      : lessonNumber >= 24
        ? 'fraction'
        : 'workshop';
  const done = phase === 'finish';
  const labels = {
    workshop: T('Lumo ustaxonasi', 'Мастерская Лумо'),
    fraction: T('Ulush hududi', 'Долина долей'),
    crystal: T('Kristall arxitektura', 'Кристальная архитектура'),
    observatory: T('Lumo observatoriyasi', 'Обсерватория Лумо'),
  };
  const state = done
    ? T('Vazifa bajarildi', 'Задача решена')
    : T('Yangi vazifa', 'Новая задача');

  const topic = BOOKEND_TOPICS[lessonNumber] || ['data', `Dars ${lessonNumber}`, `Урок ${lessonNumber}`];

  return (
    <figure
      className={`bookend-scene ${zone} ${done ? 'is-finished' : 'is-start'}`}
      aria-label={`${local(labels[zone], lang)}. ${local(state, lang)}.`}
    >
      <svg viewBox="0 0 760 240" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`g3-sky-${zone}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={zone === 'observatory' ? '#17295b' : zone === 'crystal' ? '#402d70' : '#173b51'} />
            <stop offset="1" stopColor={zone === 'fraction' ? '#4c2859' : '#102637'} />
          </linearGradient>
          <linearGradient id={`g3-ground-${zone}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={zone === 'fraction' ? '#7f9e5b' : '#31566a'} />
            <stop offset="1" stopColor={zone === 'crystal' ? '#624b8b' : '#203f50'} />
          </linearGradient>
          <filter id="g3-glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="760" height="240" rx="22" fill={`url(#g3-sky-${zone})`} />
        <circle cx="650" cy="48" r="27" fill={zone === 'observatory' ? '#ffd98a' : '#ef7b72'} opacity=".92" />
        <g fill="#fff" opacity=".75">
          <circle cx="75" cy="38" r="2"/><circle cx="148" cy="62" r="1.5"/><circle cx="312" cy="35" r="2"/>
          <circle cx="435" cy="60" r="1.5"/><circle cx="580" cy="28" r="2"/><circle cx="710" cy="88" r="1.5"/>
        </g>
        <path d="M0 181 Q120 145 236 180 T470 174 T760 166 V240 H0Z" fill={`url(#g3-ground-${zone})`} />

        {zone === 'workshop' && <g opacity=".8"><path d="M340 172V62h350v110" fill="#1e4051" stroke="#538195" strokeWidth="3"/><path d="M326 65h380l-38-31H362Z" fill="#315d6d"/><path d="M365 88h286" stroke="#79d7e5" strokeWidth="3" strokeDasharray="10 8"/></g>}
        {zone === 'fraction' && <g opacity=".8"><path d="M325 176q100-117 205 0m-150 0q115-86 245 0" fill="#496852" stroke="#82bc75" strokeWidth="4"/><g fill="#a4e590" filter="url(#g3-glow)"><circle cx="366" cy="139" r="7"/><circle cx="637" cy="133" r="8"/></g></g>}
        {zone === 'crystal' && <g opacity=".65" stroke="#d8c7ff" strokeWidth="3"><path d="M335 177l34-85 35 85Z" fill="#72559c"/><path d="M665 177l27-69 31 69Z" fill="#4d88a9"/></g>}
        {zone === 'observatory' && <g opacity=".72"><path d="M340 176v-56a61 61 0 0 1 122 0v56" fill="#667e9c" stroke="#9bdcea" strokeWidth="3"/><path d="M352 119a49 49 0 0 1 98 0Z" fill="#b9ccd8"/></g>}

        <SetPiece kind={topic[0]} done={done}/>
        <CrewMember x={84} y={119} suit="#e88955" hair="#3d2925" scale=".72" pose="point"/>
        <CrewMember x={135} y={126} suit="#5b8fc9" hair="#272b38" scale=".66"/>
        <CrewMember x={181} y={128} suit="#9b6bc2" hair="#3f2922" scale=".63"/>
        <CrewMember x={224} y={132} suit="#58a879" hair="#25252d" scale=".59"/>
        <BitGuide done={done}/>
        <g className="scene-status">
          <rect x="24" y="18" width="190" height="52" rx="16" fill="#0b2130" opacity=".82"/>
          <text x="42" y="40" fill="#a9dfea" fontSize="13" fontWeight="800">{local(labels[zone], lang)}</text>
          <text x="42" y="59" fill={done ? '#78e3a7' : '#ffd074'} fontSize="16" fontWeight="900">{local(state, lang)}</text>
        </g>
        <g className="topic-plate">
          <rect x="462" y="18" width="270" height="34" rx="12" fill="#081e2c" opacity=".84"/>
          <text x="597" y="40" textAnchor="middle" fill="#f3f8f9" fontSize="14" fontWeight="850">
            {lang === 'uz' ? topic[1] : topic[2]}
          </text>
        </g>
        {done && <g className="scene-sparks" fill="#ffe279"><circle cx="330" cy="55" r="5"/><circle cx="570" cy="62" r="4"/><circle cx="690" cy="128" r="5"/></g>}
      </svg>
    </figure>
  );
}

function LumoBookendScene({ lessonNumber, phase, lang }) {
  if (lessonNumber >= 33 && lessonNumber <= 41) {
    return <GeneratedBookendScene lessonNumber={lessonNumber} phase={phase} lang={lang} />;
  }

  const complete = phase === 'finish';
  const topic = BOOKEND_TOPICS[lessonNumber] || ['data', `Dars ${lessonNumber}`, `Урок ${lessonNumber}`];
  const Scene = lessonNumber >= 42
    ? Grade3CityEtalonScene
    : lessonNumber >= 33
      ? Grade3TowerEtalonScene
      : lessonNumber >= 24
        ? Grade3GardenEtalonScene
        : Grade3WorkshopEtalonScene;
  const zone = lessonNumber >= 42
    ? T('Lumo observatoriyasi', 'Обсерватория Лумо')
    : lessonNumber >= 33
      ? T('Kristall arxitektura', 'Кристальная архитектура')
      : lessonNumber >= 24
        ? T('Ulush hududi', 'Долина долей')
        : T('Lumo ustaxonasi', 'Мастерская Лумо');
  const state = complete
    ? T('Vazifa bajarildi', 'Задача решена')
    : T('Yangi vazifa', 'Новая задача');

  return (
    <figure
      className={`bookend-scene etalon-reuse ${complete ? 'is-finished' : 'is-start'}`}
      aria-label={`${local(zone, lang)}. ${local(state, lang)}.`}
    >
      <Scene complete={complete}/>
      <figcaption className="etalon-scene-caption">
        <span>
          <small>{local(zone, lang)}</small>
          <b>{local(state, lang)}</b>
        </span>
        <strong>{lang === 'uz' ? topic[1] : topic[2]}</strong>
      </figcaption>
    </figure>
  );
}

export function Grade3LessonShell({
  screens = SCREENS,
  titleUz = "19-dars. Qoldiqli bo'lish",
  titleRu = 'Урок 19. Деление с остатком',
  lessonId,
  fact,
  ttsApiBase,
  voiceGender,
}) {
  const lessonNumber = Number(titleUz.match(/\d+/)?.[0] || 19);
  const resolvedLessonId = lessonId || `num-3-${String(lessonNumber).padStart(2, '0')}`;
  const storageKey = grade3StorageKey('theory', resolvedLessonId);
  const [initialSavedState] = useState(() => readGrade3State(storageKey, {}));
  const [runSeed] = useState(createGrade3RunSeed);
  const [lang, setLang] = useState(
    () => restoreGrade3LessonLanguage(initialSavedState?.lang),
  );
  const [muted, setMuted] = useState(false);
  const [index, setIndex] = useState(
    () => restoreGrade3LessonIndex(initialSavedState?.currentIndex, screens.length),
  );
  const [audioReady, setAudioReady] = useState(false);
  const [speechTick, setSpeechTick] = useState(0);
  const [results, setResults] = useState(
    () => initialSavedState?.screens && typeof initialSavedState.screens === 'object'
      ? initialSavedState.screens
      : {},
  );
  const cardRef = useRef(null);
  const screen = screens[index];
  const optionOrder = useMemo(
    () => seededIndexOrder(
      screen.options.length,
      `${runSeed}:${resolvedLessonId}:${index}:${screen.options.length}`,
    ),
    [runSeed, resolvedLessonId, index, screen.options.length],
  );
  const displayOptions = useMemo(
    () => optionOrder.map((originalIndex) => screen.options[originalIndex]),
    [optionOrder, screen.options],
  );
  const displayCorrect = optionOrder.indexOf(screen.correct);
  const storedResult = results[index];
  const pickedOriginal = Number.isInteger(storedResult?.pickedOriginal)
    ? storedResult.pickedOriginal
    : Number.isInteger(storedResult?.picked)
      ? optionOrder[storedResult.picked]
      : storedResult?.correct
        ? screen.correct
        : null;
  const restoredPicked = pickedOriginal === null ? -1 : optionOrder.indexOf(pickedOriginal);
  const picked = restoredPicked >= 0 ? restoredPicked : null;
  const correct = storedResult?.correct === true && picked === displayCorrect;
  const done = picked !== null;
  const interactionReady = GRADE3_REVIEW_MODE || audioReady;
  const lessonFact = fact || (lessonNumber >= 33
    ? T(
      "Kristallar tartibli tuzilishda o'sadi. Qor uchqunlaridagi simmetriya ham shu tabiiy tartibning ko'rinishidir.",
      'Кристаллы растут упорядоченно. Симметрия снежинок — одно из проявлений этого природного порядка.',
    )
    : lessonNumber >= 24
      ? T(
        "Asalari uyasidagi teng olti burchakli kataklar bo'sh joy qoldirmay yonma-yon joylashadi va joyni tejaydi.",
        'Одинаковые шестиугольные ячейки сот прилегают без промежутков и экономят пространство.',
      )
      : T(
        "Muhandislar hisob natijasini teskari amal bilan tekshiradi: bu qurilishga ketadigan materialdagi xatoni erta topishga yordam beradi.",
        'Инженеры проверяют вычисления обратным действием: это помогает заранее находить ошибки в расчёте материалов.',
      ));
  const solvedCount = Object.values(results).filter((result) => result.correct).length;
  const firstTryCount = Object.values(results).filter((result) => result.correct && result.attempts === 1).length;
  const missedTopics = Object.entries(results)
    .filter(([, result]) => result.attempts > 1)
    .map(([screenIndex]) => local(screens[Number(screenIndex)]?.title, lang))
    .filter(Boolean);

  const speechSource = useMemo(
    () => `${local(screen.title, lang)}. ${local(screen.text, lang)} ${local(screen.visual, lang)}. ${local(screen.ask, lang)}`,
    [screen, lang],
  );
  const spoken = useMemo(() => toGrade3SpeechText(speechSource, lang), [speechSource, lang]);

  useEffect(() => {
    const values = Object.values(results);
    const completed = screens.every((_, screenIndex) => results[screenIndex]?.correct === true);
    const previous = readGrade3State(storageKey, {});
    writeGrade3State(storageKey, {
      version: 2,
      lessonId: resolvedLessonId,
      lang,
      currentIndex: index,
      updatedAt: new Date().toISOString(),
      completed,
      completedAt: completed ? (previous?.completedAt || new Date().toISOString()) : null,
      solved: values.filter((result) => result.correct).length,
      firstTry: values.filter((result) => result.correct && result.attempts === 1).length,
      total: screens.length,
      screens: results,
    });
  }, [index, lang, resolvedLessonId, results, screens, storageKey]);

  useEffect(() => {
    if (muted) {
      queueMicrotask(() => setAudioReady(true));
      return undefined;
    }
    let finished = false;
    const finishAudio = () => {
      if (finished) return;
      finished = true;
      setAudioReady(true);
    };
    // Longer text needs more time; never unlock answers before ~speech end estimate.
    const fallbackMs = Math.min(90000, Math.max(12000, spoken.length * 55));
    const fallbackTimer = window.setTimeout(finishAudio, fallbackMs);
    const stopSpeech = speakGrade3Text(speechSource, {
      language: lang,
      ttsApiBase,
      voiceGender,
      onEnd: finishAudio,
      onError: finishAudio,
    });
    return () => {
      window.clearTimeout(fallbackTimer);
      stopSpeech();
    };
  }, [index, lang, muted, speechSource, speechTick, spoken, ttsApiBase, voiceGender]);

  useEffect(() => {
    cardRef.current?.focus();
  }, [index]);

  const selectAnswer = (optionIndex) => {
    if (!interactionReady || correct) return;
    const isCorrect = optionIndex === displayCorrect;
    setResults((current) => {
      const previousResult = current[index] || { attempts: 0, correct: false };
      // Do not inflate attempts when revisiting an already-solved screen.
      if (previousResult.correct) {
        return current;
      }
      const updated = {
        ...current,
        [index]: {
          attempts: previousResult.attempts + 1,
          correct: isCorrect,
          picked: optionIndex,
          pickedOriginal: optionOrder[optionIndex],
        },
      };
      return updated;
    });
  };

  const goToScreen = (nextIndex) => {
    setAudioReady(false);
    setIndex(nextIndex);
  };

  const next = () => {
    if (!GRADE3_REVIEW_MODE && !correct) return;
    if (index < screens.length - 1) {
      goToScreen(index + 1);
    }
  };

  const previous = () => {
    if (index === 0) return;
    goToScreen(index - 1);
  };

  const changeLanguage = () => {
    setAudioReady(false);
    setLang((value) => value === 'uz' ? 'ru' : 'uz');
  };

  const toggleSound = () => {
    setMuted((value) => {
      const nextMuted = !value;
      setAudioReady(nextMuted);
      return nextMuted;
    });
  };

  const replay = () => {
    setAudioReady(false);
    setSpeechTick((value) => value + 1);
  };

  return (
    <div className="g3d19">
      <style>{CSS}</style>
      <header>
          <div className="lesson-heading">
            <div className="title-row">
            <b>
              <span className="full-lesson-title">{lang === 'uz' ? titleUz : titleRu}</span>
              <span className="short-lesson-title">
                {lang === 'uz' ? `Dars ${lessonNumber}` : `Урок ${lessonNumber}`}
              </span>
            </b>
            {GRADE3_REVIEW_MODE && (
              <span className="review-badge">{lang === 'uz' ? 'TEKSHIRUV' : 'ПРОВЕРКА'}</span>
            )}
          </div>
          <small>{index + 1} / {screens.length}</small>
        </div>
        <div className="tools">
          <button type="button" onClick={replay} disabled={muted} aria-label={lang === 'uz' ? 'Qayta eshitish' : 'Повторить'}>↻</button>
          <button type="button" onClick={toggleSound} aria-label={lang === 'uz' ? 'Ovoz' : 'Звук'}>{muted ? '🔇' : '🔊'}</button>
          <button type="button" onClick={changeLanguage}>{lang === 'uz' ? 'RU' : 'UZ'}</button>
        </div>
      </header>
      <div className="progress"><i style={{ width: `${((index + 1) / screens.length) * 100}%` }} /></div>
      <main>
        <section
          ref={cardRef}
          className={`card ${screen.type}`}
          tabIndex="-1"
          aria-labelledby={`g3-lesson-title-${index}`}
        >
          {(index === 0 || index === screens.length - 1) && (
            <LumoBookendScene
              lessonNumber={lessonNumber}
              phase={index === 0 ? 'start' : 'finish'}
              lang={lang}
            />
          )}
          <span className="kind">{screen.type}</span>
          <h1 id={`g3-lesson-title-${index}`}>{local(screen.title, lang)}</h1>
          <details className="explanation">
            <summary>{lang === 'uz' ? 'Qisqa izoh' : 'Краткое объяснение'}</summary>
            <p>{local(screen.text, lang)}</p>
          </details>
          <div className="visual">{local(screen.visual, lang)}</div>
          <h2>{local(screen.ask, lang)}</h2>
          {!audioReady && !muted && !GRADE3_REVIEW_MODE && (
            <div className="audio-wait" role="status">
              {lang === 'uz' ? 'Avval tushuntirishni tinglang…' : 'Сначала прослушайте объяснение…'}
            </div>
          )}
          <div className="options">
            {displayOptions.map((option, optionIndex) => (
              <button
                type="button"
                key={optionIndex}
                className={optionIndex === picked ? (correct ? 'right' : 'wrong') : ''}
                onClick={() => selectAnswer(optionIndex)}
                disabled={correct || !interactionReady}
              >
                <span>{String.fromCharCode(65 + optionIndex)}</span>{local(option, lang)}
              </button>
            ))}
          </div>
          {done && (
            <div className={`feedback ${correct ? 'ok' : 'retry'}`} role="status" aria-live="polite">
              {correct
                ? (lang === 'uz' ? "To'g'ri!" : 'Верно!')
                : (lang === 'uz' ? "Yana urinib ko'ring." : 'Попробуйте ещё раз.')}
            </div>
          )}
          {screen.type === 'summary' && (
            <div className="summary-extras">
              <details className="fact-card">
                <summary>{lang === 'uz' ? 'Ilmiy fakt' : 'Научный факт'}</summary>
                <span>{local(lessonFact, lang)}</span>
              </details>
              <aside className="diagnostic">
                <b>{lang === 'uz' ? 'Dars diagnostikasi' : 'Диагностика урока'}</b>
                <div className="diagnostic-metrics">
                  <span>{lang === 'uz' ? 'Bajarilgan' : 'Выполнено'}: {solvedCount}/{screens.length}</span>
                  <span>{lang === 'uz' ? '1-urinish' : 'С 1-й попытки'}: {firstTryCount}</span>
                </div>
                {missedTopics.length > 0 && (
                  <details className="missed-topics">
                    <summary>{lang === 'uz' ? 'Takrorlash' : 'Повторить'} ({missedTopics.length})</summary>
                    <small>{missedTopics.join(', ')}</small>
                  </details>
                )}
              </aside>
            </div>
          )}
        </section>
      </main>
      <nav>
        <button type="button" className="back" disabled={index === 0} onClick={previous}>
          {lang === 'uz' ? 'Orqaga' : 'Назад'}
        </button>
        <button
          type="button"
          className="next"
          disabled={index === screens.length - 1 || (!GRADE3_REVIEW_MODE && !correct)}
          onClick={next}
        >
          {lang === 'uz' ? 'Davom' : 'Далее'}
        </button>
      </nav>
    </div>
  );
}

export default function Dars19(runtimeProps) {
  return <Grade3LessonShell {...runtimeProps} />;
}

const CSS = `
.g3d19,.g3d19 *{box-sizing:border-box}.g3d19{position:fixed;inset:0;display:grid;grid-template-rows:auto 7px 1fr auto;background:radial-gradient(circle at 15% 10%,#e8f7fb,transparent 30%),linear-gradient(145deg,#f8f7f3,#f1ede4);color:#172b3a;font-family:Manrope,system-ui,sans-serif}.g3d19 header{display:flex;align-items:center;justify-content:space-between;padding:14px clamp(16px,4vw,42px);background:#ffffffdb;border-bottom:1px solid #dfe7e8}.g3d19 header div:first-child{display:grid;gap:3px}.g3d19 header b{font-size:clamp(14px,2vw,18px)}.g3d19 header small{color:#60717b}.g3d19 .tools{display:flex;gap:8px}.g3d19 .tools button,.g3d19 nav button{border:0;border-radius:12px;padding:10px 14px;background:#fff;box-shadow:0 4px 16px #18344218;font-weight:850;cursor:pointer}.g3d19 .progress{background:#dfe4e3}.g3d19 .progress i{display:block;height:100%;background:linear-gradient(90deg,#ff774f,#ff4f28);transition:width .35s}.g3d19 main{min-height:0;display:grid;place-items:center;overflow:auto;padding:clamp(14px,3vw,32px)}.g3d19 .card{width:min(860px,100%);padding:clamp(20px,4vw,38px);border:1px solid #d9e4e6;border-radius:25px;background:#fffffff5;box-shadow:0 24px 60px -38px #173647;outline:none}.g3d19 .card:focus-visible,.g3d19 button:focus-visible{outline:3px solid rgba(1,154,203,.48);outline-offset:3px}.g3d19 .bookend-scene{margin:0 0 18px}.g3d19 .bookend-scene svg{display:block;width:100%;height:auto;max-height:240px;border-radius:22px;box-shadow:0 18px 36px -26px #102b3c}.g3d19 .bookend-scene.is-start .bit-guide{animation:g3BitFloat 3s ease-in-out infinite}.g3d19 .bookend-scene.is-finished .scene-sparks{animation:g3Spark 1.6s ease-in-out infinite alternate}.g3d19 .kind{display:inline-block;padding:5px 9px;border-radius:99px;background:#e8f5f8;color:#087d9f;font-size:11px;font-weight:900;text-transform:uppercase}.g3d19 h1{margin:13px 0 8px;font-size:clamp(25px,4vw,38px)}.g3d19 p{margin:0;color:#4b5d67;font-size:clamp(15px,2vw,18px);line-height:1.55}.g3d19 .visual{margin:22px 0;padding:20px;border-radius:18px;background:linear-gradient(145deg,#22384a,#132636);color:#ffe29b;text-align:center;font:900 clamp(19px,4vw,31px) "JetBrains Mono",monospace;letter-spacing:.02em;white-space:pre-line}.g3d19 h2{font-size:clamp(17px,2.5vw,21px)}.g3d19 .audio-wait{margin:-4px 0 10px;color:#087d9f;font-size:13px;font-weight:750}.g3d19 .options{display:grid;gap:9px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}.g3d19 .options button{min-height:58px;padding:11px;border:2px solid #e3e2db;border-radius:14px;background:#fff;color:#263944;font:800 15px Manrope,system-ui;cursor:pointer}.g3d19 .options button span{display:inline-grid;place-items:center;width:27px;height:27px;margin-right:8px;border-radius:8px;background:#eef3f4;color:#59717c}.g3d19 .options button.right{border-color:#27835a;background:#e5f4eb}.g3d19 .options button.wrong{border-color:#c44c40;background:#fbe9e7}.g3d19 .feedback{margin-top:14px;padding:12px 14px;border-radius:13px;font-weight:750}.g3d19 .ok{background:#e5f4eb;color:#17663f}.g3d19 .retry{background:#fff3d8;color:#865d00}.g3d19 .fact-card{display:grid;gap:6px;margin-top:14px;padding:14px;border:1px solid #d9c57a;border-radius:15px;background:#fff9df;color:#6f5611}.g3d19 .fact-card span{font-size:13px;line-height:1.5}.g3d19 .diagnostic{display:grid;gap:6px;margin-top:10px;padding:14px;border:1px solid #bcd8ca;border-radius:15px;background:#f0f8f3;color:#245b3f}.g3d19 .diagnostic span{font-size:13px;font-weight:750}.g3d19 .diagnostic small{line-height:1.45}.g3d19 nav{display:flex;justify-content:space-between;padding:12px clamp(16px,4vw,42px);background:#ffffffdf;border-top:1px solid #dfe7e8}.g3d19 nav .next{background:#ff4f28;color:#fff}.g3d19 button:disabled{opacity:.42;cursor:not-allowed}@keyframes g3BitFloat{50%{transform:translateY(-5px)}}@keyframes g3Spark{to{opacity:.35;transform:translateY(-4px)}}@media(max-width:520px){.g3d19 header{padding:10px 12px}.g3d19 main{padding:10px}.g3d19 .card{padding:17px;border-radius:19px}.g3d19 .bookend-scene{margin-bottom:13px}.g3d19 .bookend-scene svg{border-radius:16px}.g3d19 .visual{margin:14px 0;padding:15px}.g3d19 nav{padding:9px 12px}}@media(prefers-reduced-motion:reduce){.g3d19 *{transition:none!important;animation:none!important}}
.g3d19 .etalon-reuse{position:relative;max-width:680px;margin-inline:auto}
.g3d19 .etalon-reuse .grade3-reused-scene{position:relative;width:100%;font-family:Manrope,system-ui,sans-serif}
.g3d19 .etalon-reuse .lm-scene,.g3d19 .etalon-reuse .lm-scene-establishing{width:100%;max-height:none;border-radius:20px;box-shadow:0 20px 38px -27px #102b3c}
.g3d19 .etalon-reuse svg{max-height:none}
.g3d19 .etalon-scene-caption{position:absolute;inset:14px 14px auto 14px;z-index:8;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;pointer-events:none}
.g3d19 .etalon-scene-caption span,.g3d19 .etalon-scene-caption strong{display:grid;padding:8px 13px;border-radius:13px;background:#092131df;color:#f7fbfc;box-shadow:0 8px 20px #07192338}
.g3d19 .etalon-scene-caption small{color:#9bdce7;font-size:10px;font-weight:850}
.g3d19 .etalon-scene-caption b{color:#ffd36b;font-size:14px}
.g3d19 .is-finished .etalon-scene-caption b{color:#70e0a1}
.g3d19 .etalon-scene-caption strong{max-width:45%;text-align:right;font-size:12px}

/* Compact, single-viewport lesson shell. Explanations stay available without
   competing with the question and answer controls for vertical space. */
.g3d19{grid-template-rows:auto 4px minmax(0,1fr) auto;overflow:hidden;overscroll-behavior:none}
.g3d19 header{min-height:52px;padding:8px clamp(12px,3vw,30px) 8px max(176px,3vw)}
.g3d19 .lesson-heading{min-width:0}
.g3d19 .title-row{display:flex;align-items:center;gap:8px;min-width:0}
.g3d19 .title-row b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.g3d19 .short-lesson-title{display:none}
.g3d19 .review-badge{flex:0 0 auto;padding:3px 6px;border:1px solid #dc7c16;border-radius:999px;background:#fff3d8;color:#8a5200;font-size:9px;font-weight:950;letter-spacing:.06em}
.g3d19 .tools button,.g3d19 nav button{min-height:36px;padding:7px 11px}
.g3d19 main{place-items:start center;overflow:hidden;padding:clamp(8px,2vh,18px)}
.g3d19 .card{max-height:100%;overflow:hidden;padding:clamp(14px,2.5vh,24px);border-radius:20px}
.g3d19 .bookend-scene{height:min(180px,22vh);margin:0 0 10px;overflow:hidden}
.g3d19 .bookend-scene>svg{width:100%;height:100%;max-height:100%;object-fit:cover}
.g3d19 .etalon-reuse .grade3-reused-scene{height:100%;overflow:hidden}
.g3d19 .etalon-reuse .lm-scene,.g3d19 .etalon-reuse .lm-scene-establishing{height:100%;max-height:100%;object-fit:cover}
.g3d19 .kind{padding:3px 7px}
.g3d19 h1{margin:7px 0 5px;font-size:clamp(21px,3vw,31px);line-height:1.15}
.g3d19 .explanation{margin:0 0 7px;color:#4b5d67}
.g3d19 .explanation summary,.g3d19 .fact-card summary,.g3d19 .missed-topics summary{width:max-content;max-width:100%;color:#087d9f;font-size:12px;font-weight:850;cursor:pointer}
.g3d19 .explanation p{margin-top:6px;font-size:14px;line-height:1.35}
.g3d19 .visual{margin:8px 0;padding:11px 14px;font-size:clamp(18px,3vw,26px);line-height:1.2}
.g3d19 h2{margin:8px 0;font-size:clamp(16px,2.2vw,19px);line-height:1.25}
.g3d19 .options{gap:7px}
.g3d19 .options button{min-height:46px;padding:8px;font-size:14px;line-height:1.2}
.g3d19 .options button span{width:23px;height:23px;margin-right:6px}
.g3d19 .feedback{margin-top:7px;padding:8px 10px;font-size:13px}
.g3d19 .summary-extras{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:7px;margin-top:7px}
.g3d19 .fact-card,.g3d19 .diagnostic{margin:0;padding:8px 10px;border-radius:11px}
.g3d19 .fact-card span{display:block;margin-top:5px;font-size:12px;line-height:1.3}
.g3d19 .diagnostic{gap:3px}
.g3d19 .diagnostic b{font-size:12px}
.g3d19 .diagnostic-metrics{display:flex;flex-wrap:wrap;gap:3px 10px}
.g3d19 .diagnostic span{font-size:11px}
.g3d19 .missed-topics small{display:block;margin-top:3px;font-size:10px;line-height:1.25}
.g3d19 nav{min-height:48px;padding:6px clamp(12px,3vw,30px)}

@media(max-width:520px){
  .g3d19 header{min-height:48px;padding:6px 6px 6px 134px}
  .g3d19 header small{font-size:10px}
  .g3d19 .title-row{gap:5px}
  .g3d19 .title-row b{font-size:13px}
  .g3d19 .full-lesson-title{display:none}
  .g3d19 .short-lesson-title{display:inline}
  .g3d19 .review-badge{padding:2px 4px;font-size:0}
  .g3d19 .review-badge::after{content:'QA';font-size:8px}
  .g3d19 .tools{gap:3px}
  .g3d19 .tools button{width:30px;min-height:32px;padding:3px}
  .g3d19 main{place-items:start center;padding:6px}
  .g3d19 .card{padding:10px;border-radius:14px}
  .g3d19 .bookend-scene{height:min(104px,15vh);margin-bottom:6px}
  .g3d19 .etalon-scene-caption{inset:7px 7px auto;gap:5px}
  .g3d19 .etalon-scene-caption span,.g3d19 .etalon-scene-caption strong{padding:4px 6px;border-radius:8px}
  .g3d19 .etalon-scene-caption small{font-size:8px}
  .g3d19 .etalon-scene-caption b,.g3d19 .etalon-scene-caption strong{font-size:9px}
  .g3d19 .kind{display:none}
  .g3d19 h1{margin:2px 0 4px;font-size:19px}
  .g3d19 .explanation{margin-bottom:4px}
  .g3d19 .explanation summary{font-size:11px}
  .g3d19 .explanation p{display:-webkit-box;margin-top:3px;overflow:hidden;font-size:12px;line-height:1.25;-webkit-box-orient:vertical;-webkit-line-clamp:3}
  .g3d19 .visual{margin:5px 0;padding:8px 9px;border-radius:11px;font-size:18px}
  .g3d19 h2{margin:5px 0;font-size:15px}
  .g3d19 .options{grid-template-columns:1fr;gap:5px}
  .g3d19 .options button{min-height:40px;padding:5px 7px;border-radius:10px;font-size:12px}
  .g3d19 .options button span{width:21px;height:21px;font-size:11px}
  .g3d19 .feedback{margin-top:5px;padding:6px 8px;font-size:12px}
  .g3d19 .summary-extras{grid-template-columns:1fr;margin-top:5px}
  .g3d19 .fact-card,.g3d19 .diagnostic{padding:6px 8px}
  .g3d19 .fact-card summary,.g3d19 .missed-topics summary{font-size:10px}
  .g3d19 nav{min-height:44px;padding:5px 8px}
  .g3d19 nav button{min-height:34px;padding:5px 10px}
}

@media(max-height:700px){
  .g3d19 .bookend-scene{display:none}
  .g3d19 .fact-card{display:none}
  .g3d19 .summary-extras{grid-template-columns:1fr}
}
`;
