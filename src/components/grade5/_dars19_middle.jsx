// ============================================================
// --- UROK: frac_5_06 — Har xil maxrajli kasrlarni qo'shish / Сложение дробей с разными знаменателями
// Keep-visible qayta yig'ish (etalon: Dars28/Dars37/Dars09). Infra Dars28 dan bayt-aniq.
// Model: tishli g'ildirak (umumiy maxraj = g'ildiraklar uchrashgan joy) + olti/o'n ikki katakli to'r.
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-06-v3',
  lessonTitle: { ru: 'Сложение дробей с разными знаменателями', uz: "Har xil maxrajli kasrlarni qo'shish" }
};
const TOTAL_SCREENS = 13;
const SCREEN_META = [
  { id: 's0',     type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',     type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's2',     type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',     type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',     type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 'sfill',  type: 'test',        template: 'DragToSlots',    scored: true,  scope: 'practice' },  // drag: sonlarni kataklarga
  { id: 'sbins',  type: 'test',        template: 'DragToBins',     scored: true,  scope: 'practice' },  // drag: juftlarni maxraj-savatlariga
  { id: 's6',     type: 'test',        template: 'SeqMC',          scored: true,  scope: 'practice' },
  { id: 's7',     type: 'test',        template: 'SeqMix',         scored: true,  scope: 'practice' },
  { id: 'sorder', type: 'test',        template: 'DragToSlots',    scored: true,  scope: 'practice' },  // drag: kichikdan kattaga
  { id: 's8',     type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's9',     type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'final' },
  { id: 's10',    type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {
  // s0 — HOOK: Doniyor o'yinni ikki bosqichda yukladi (1/2 + 1/3), "jami 2/5" deb yozdi — kichrayib qoldi.
  s0: {
    eyebrow: { ru: 'Вопрос', uz: "Savol" },
    lead: { ru: 'Дониёр качал игру в два захода: сначала 1/2, потом 1/3. Он записал: всего 2/5.', uz: "Doniyor o'yinni ikki bosqichda yukladi: avval 1/2, keyin 1/3. U shunday yozdi: jami 2/5." },
    question: { ru: 'Но 2/5 меньше, чем одна только 1/2. После сложения меньше стать не может. В чём ошибка?', uz: "Lekin 2/5 bitta 1/2 ning o'zidan ham kichik. Qo'shgandan keyin kichrayib qola olmaydi. Xato nimada?" },
    opt0: { ru: 'Доли разного размера — так складывать нельзя', uz: "Bo'laklar har xil o'lchamda — bunday qo'shib bo'lmaydi" },
    opt1: { ru: 'Всё верно, 2/5 — правильный ответ', uz: "Hammasi to'g'ri, 2/5 — to'g'ri javob" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Дониёр качал игру в два захода. Сначала загрузилась одна вторая игры, потом ещё одна третья. Он записал: всего две пятых. Но две пятых меньше, чем одна только половина. После сложения число меньше стать не может. Значит где-то ошибка. Подумай и выбери ответ.', uz: "Doniyor o'yinni ikki bosqichda yukladi. Avval o'yinning yarmi, keyin yana uchdan biri yuklandi. U shunday yozdi: jami beshdan ikki. Lekin beshdan ikki bitta yarimning o'zidan ham kichik. Qo'shgandan keyin son kichrayib qola olmaydi. Demak qayerdadir xato bor. O'ylab, javobni tanlang." }
  },

  // s1 — EXPLORATION step: yarim va uchdan bir — har xil o'lchamda
  s1: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Половина и треть — доли разного размера', uz: "Yarim va uchdan bir — har xil o'lchamdagi ulushlar" },
    conclusion: { ru: 'Доли разного размера. Чтобы сложить, сначала сделаем их одинаковыми — найдём общий знаменатель.', uz: "Ulushlar har xil o'lchamda. Qo'shish uchun avval ularni bir xil qilamiz — umumiy maxraj topamiz." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Как сделать доли одинаковыми?', uz: "Ulushlarni qanday bir xil qilamiz?" },
    audio: {
      ru: [
        'Сравним половину и треть. Нажимай кнопку дальше.',
        'Половина это одна доля из двух. Она большая.',
        'Треть это одна доля из трёх. Она меньше половины.',
        'Доли разного размера, поэтому просто сложить их количество нельзя. Сначала сделаем доли одинаковыми.'
      ],
      uz: [
        "Yarim bilan uchdan birni solishtiramiz. Davom etish tugmasini bosing.",
        "Yarim bu ikkidan bir ulush. U katta.",
        "Uchdan bir bu uchdan bir ulush. U yarimdan kichik.",
        "Ulushlar har xil o'lchamda, shuning uchun shunchaki sonini qo'shib bo'lmaydi. Avval ulushlarni bir xil qilamiz."
      ]
    }
  },

  // s2 — EXPLORATION g'ildiraklar: umumiy karra = 6
  s2: {
    eyebrow: { ru: 'Поиграй', uz: "O'ynab ko'ring" },
    title: { ru: 'Где встретятся шестерёнки? Это и есть общий знаменатель.', uz: "Tishli g'ildiraklar qayerda uchrashadi? Bu — umumiy maxraj." },
    note_hit: { ru: 'Совпало! Обе вернулись в начало через 6 — общий знаменатель 6.', uz: "Mos keldi! Ikkalasi 6 dan keyin boshiga qaytdi — umumiy maxraj 6." },
    note_miss: { ru: 'Ещё не совпало. Крути дальше.', uz: "Hali mos kelmadi. Aylantiring." },
    conclusion: { ru: 'Шестерёнки на 2 и на 3 встречаются на 6. 6 делится и на 2, и на 3 — это наименьший общий знаменатель.', uz: "2 tishli va 3 tishli g'ildirak 6 da uchrashadi. 6 ham 2 ga, ham 3 ga bo'linadi — bu eng kichik umumiy maxraj." },
    btn: { ru: 'Понятно, дальше', uz: "Tushunarli, davom" },
    audio: { ru: 'Крути шестерёнки. Одна делится на два, другая на три. Считай, через сколько шагов обе разом вернутся в начало. Это число делится и на два, и на три, это шесть. Шесть и будет общим знаменателем.', uz: "G'ildiraklarni aylantiring. Biri ikkiga, ikkinchisi uchga bo'lingan. Necha qadamdan keyin ikkalasi birga boshiga qaytishini sanang. Bu son ham ikkiga, ham uchga bo'linadi, olti bo'ladi. Olti umumiy maxraj bo'ladi." }
  },

  // s3 — EXPLORATION step: oltilarga keltirish (1/2=3/6, 1/3=2/6)
  s3: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Приводим обе дроби к шестым', uz: "Ikkala kasrni oltilarga keltiramiz" },
    conclusion: { ru: '1/2 = 3/6, 1/3 = 2/6. Теперь доли одинаковые — шестые.', uz: "1/2 = 3/6, 1/3 = 2/6. Endi ulushlar bir xil — oltidan." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        'Делим каждую полосу на шесть равных долей. Нажимай дальше.',
        'Половина это три доли из шести. Значит одна вторая равна три шестых.',
        'Треть это две доли из шести. Значит одна третья равна две шестых. Теперь обе дроби в шестых.'
      ],
      uz: [
        "Har bir chiziqni olti teng ulushga bo'lamiz. Davom etishni bosing.",
        "Yarim bu oltidan uch ulush. Demak ikkidan bir teng oltidan uch.",
        "Uchdan bir bu oltidan ikki ulush. Demak uchdan bir teng oltidan ikki. Endi ikkala kasr oltidan."
      ]
    }
  },

  // s4 — RULE: suratlarni qo'shamiz, maxraj qoladi + 3 qadam
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Как сложить — 3 шага', uz: "Qanday qo'shamiz — 3 qadam" },
    title: { ru: 'Привели к общему знаменателю — складываем числители.', uz: "Umumiy maxrajga keltirdik — suratlarni qo'shamiz." },
    step1: { ru: 'Найди общий знаменатель (наименьший).', uz: "Umumiy maxrajni toping (eng kichik)." },
    step2: { ru: 'Приведи обе дроби к нему: 1/2 = 3/6, 1/3 = 2/6.', uz: "Ikkala kasrni unga keltiring: 1/2 = 3/6, 1/3 = 2/6." },
    step3: { ru: 'Сложи числители, знаменатель оставь: 3/6 + 2/6 = 5/6.', uz: "Suratlarni qo'shing, maxrajni qoldiring: 3/6 + 2/6 = 5/6." },
    card_line: { ru: '1/2 + 1/3 = 5/6. Не 2/5 и не 5/12!', uz: "1/2 + 1/3 = 5/6. 2/5 ham, 5/12 ham emas!" },
    audio: { ru: 'Запомни три шага. Первый: найди общий знаменатель, для двух и трёх это шесть. Второй: приведи обе дроби к шестым, одна вторая это три шестых, одна третья это две шестых. Третий: сложи числители, а знаменатель оставь. Три шестых плюс две шестых равно пять шестых.', uz: "Uch qadamni eslab qoling. Birinchi: umumiy maxrajni toping, ikki va uch uchun bu olti. Ikkinchi: ikkala kasrni oltilarga keltiring, ikkidan bir bu oltidan uch, uchdan bir bu oltidan ikki. Uchinchi: suratlarni qo'shing, maxrajni qoldiring. Oltidan uch plyus oltidan ikki teng oltidan besh." }
  },

  // sfill — DRAG (sonlarni kataklarga sudrash): 1/2 + 1/3 = ?/6 + ?/6 = ?/6
  sfill: {
    eyebrow: { ru: 'Перетащи', uz: "Sudrang" },
    title: { ru: 'Собери решение перетаскиванием', uz: "Yechimni sudrab yig'ing" },
    lead: { ru: 'Перетащи (или нажми) числа в пустые клетки. Знаменатель уже общий — шесть.', uz: "Sonlarni bo'sh kataklarga sudrang yoki bosing. Maxraj allaqachon umumiy — olti." },
    tray_label: { ru: 'Числа', uz: "Sonlar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Половина это три шестых, треть это две шестых. Потом сложи числители.', uz: "Yarim bu oltidan uch, uchdan bir bu oltidan ikki. Keyin suratlarni qo'shing." },
    correct_text: { ru: 'Верно! 1/2 = 3/6, 1/3 = 2/6, а вместе 5/6.', uz: "To'g'ri! 1/2 = 3/6, 1/3 = 2/6, birga esa 5/6." },
    fact: { ru: 'Калькуляторы складывают дроби так же: сначала общий знаменатель, потом числители.', uz: "Kalkulyatorlar ham kasrlarni shunday qo'shadi: avval umumiy maxraj, keyin suratlar." },
    audio: {
      intro: { ru: 'Собери решение. Перетащи или нажми числа в пустые клетки: сначала одна вторая в шестых, потом одна третья в шестых, потом их сумма. Затем нажми проверить.', uz: "Yechimni yig'ing. Sonlarni bo'sh kataklarga sudrang yoki bosing: avval ikkidan bir oltilarda, keyin uchdan bir oltilarda, keyin ularning yig'indisi. So'ng tekshirishni bosing." },
      on_correct: { ru: 'Верно. Три шестых плюс две шестых это пять шестых.', uz: "To'g'ri. Oltidan uch plyus oltidan ikki bu oltidan besh." },
      on_wrong: { ru: 'Пока не так. Половина это три шестых, треть это две шестых.', uz: "Hozircha emas. Yarim bu oltidan uch, uchdan bir bu oltidan ikki." }
    }
  },

  // sbins — DRAG (juftlarni umumiy-maxraj savatlariga): 6 yoki 12
  sbins: {
    eyebrow: { ru: 'Перетащи', uz: "Sudrang" },
    title: { ru: 'Разложи пары по общему знаменателю', uz: "Juftlarni umumiy maxraj bo'yicha ajrating" },
    lead: { ru: 'Перетащи каждую пару в корзину с её наименьшим общим знаменателем.', uz: "Har bir juftni eng kichik umumiy maxrajli savatga sudrang." },
    bin6: { ru: 'Общий 6', uz: "Umumiy 6" },
    bin12: { ru: 'Общий 12', uz: "Umumiy 12" },
    it0: { ru: '1/2 и 1/3', uz: "1/2 va 1/3" },
    it1: { ru: '1/3 и 1/6', uz: "1/3 va 1/6" },
    it2: { ru: '1/4 и 1/6', uz: "1/4 va 1/6" },
    it3: { ru: '1/3 и 1/4', uz: "1/3 va 1/4" },
    tray_label: { ru: 'Пары', uz: "Juftlar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Ищи наименьшее число, делящееся на оба знаменателя.', uz: "Ikkala maxrajga bo'linadigan eng kichik sonni toping." },
    correct_text: { ru: 'Верно! Для 2 и 3, как и для 3 и 6 — это 6. Для 4 и 6, как и для 3 и 4 — это 12.', uz: "To'g'ri! 2 va 3, hamda 3 va 6 uchun — bu 6. 4 va 6, hamda 3 va 4 uchun — bu 12." },
    fact: { ru: 'В музыке ноты тоже сводят к общей доле такта, прежде чем сложить длительности.', uz: "Musiqada notalar ham davomiylikni qo'shishdan oldin umumiy ulushga keltiriladi." },
    audio: {
      intro: { ru: 'Перетащи или нажми каждую пару в корзину с её наименьшим общим знаменателем: шесть или двенадцать. Потом нажми проверить.', uz: "Har bir juftni eng kichik umumiy maxrajli savatga sudrang yoki bosing: olti yoki o'n ikki. Keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно. Ты находишь наименьший общий знаменатель для каждой пары.', uz: "To'g'ri. Har juft uchun eng kichik umumiy maxrajni topyapsiz." },
      on_wrong: { ru: 'Пока не так. Ищи наименьшее число, делящееся на оба знаменателя.', uz: "Hozircha emas. Ikkala maxrajga bo'linadigan eng kichik sonni qidiring." }
    }
  },

  // s6 — 5 TA OSON SAVOL (SeqMC, scored). Yig'indiga qisqa qadamlar + bir xil maxraj eslatmasi (spaced retrieval).
  s6: {
    eyebrow: { ru: 'Разминка', uz: "Mashq" },
    title: { ru: '5 быстрых вопросов', uz: "5 ta tez savol" },
    lead: { ru: 'Короткие шаги к сумме. Жми ответ.', uz: "Yig'indiga qisqa qadamlar. Javobni bosing." },
    audio: {
      intro: { ru: 'Пять быстрых вопросов. Сначала найди общий знаменатель, потом приведи дроби, потом сложи. Нажимай ответ.', uz: "Besh ta tez savol. Avval umumiy maxrajni toping, keyin kasrlarni keltiring, keyin qo'shing. Javobni bosing." },
      on_wrong: { ru: 'Не совсем. Подумай ещё.', uz: "Unchalik emas. Yana o'ylang." },
      on_done: { ru: 'Готово. Пять верных шагов к сумме.', uz: "Tayyor. Yig'indiga besh to'g'ri qadam." }
    },
    questions: [
      { q: { ru: 'Общий знаменатель для 2 и 3?', uz: "2 va 3 uchun umumiy maxraj?" }, opts: ['6', '5', '2'], correct: 0,
        say: { ru: 'Общий знаменатель для двух и трёх?', uz: "Ikki va uch uchun umumiy maxraj?" },
        ok: { ru: 'Верно, шесть.', uz: "To'g'ri, olti." }, no: { ru: 'Нужно число, делящееся и на 2, и на 3.', uz: "Ham 2 ga, ham 3 ga bo'linadigan son kerak." } },
      { q: { ru: '1/2 = ?/6', uz: "1/2 = ?/6" }, opts: ['3', '2', '1'], correct: 0,
        say: { ru: 'Сколько шестых в одной второй?', uz: "Yarimda nechta oltidan bor?" },
        ok: { ru: 'Верно, три шестых.', uz: "To'g'ri, oltidan uch." }, no: { ru: 'Умножь числитель и знаменатель на 3.', uz: "Surat va maxrajni 3 ga ko'paytiring." } },
      { q: { ru: '1/3 = ?/6', uz: "1/3 = ?/6" }, opts: ['2', '3', '1'], correct: 0,
        say: { ru: 'Сколько шестых в одной третьей?', uz: "Uchdan birda nechta oltidan bor?" },
        ok: { ru: 'Верно, две шестых.', uz: "To'g'ri, oltidan ikki." }, no: { ru: 'Умножь числитель и знаменатель на 2.', uz: "Surat va maxrajni 2 ga ko'paytiring." } },
      { q: { ru: '3/6 + 2/6 = ?/6', uz: "3/6 + 2/6 = ?/6" }, opts: ['5', '6', '1'], correct: 0,
        say: { ru: 'Три шестых плюс две шестых. Сколько шестых?', uz: "Oltidan uch plyus oltidan ikki. Nechta oltidan?" },
        ok: { ru: 'Верно, пять шестых.', uz: "To'g'ri, oltidan besh." }, no: { ru: 'Сложи только числители, знаменатель оставь.', uz: "Faqat suratlarni qo'shing, maxrajni qoldiring." } },
      { q: { ru: '1/4 + 1/4 = ?/4', uz: "1/4 + 1/4 = ?/4" }, opts: ['2', '8', '1'], correct: 0,
        say: { ru: 'Знаменатели уже одинаковые. Сколько четвёртых?', uz: "Maxrajlar allaqachon bir xil. Nechta to'rtdan?" },
        ok: { ru: 'Верно, две четвёртых.', uz: "To'g'ri, to'rtdan ikki." }, no: { ru: 'Знаменатель не меняется, складываем только числители.', uz: "Maxraj o'zgarmaydi, faqat suratlarni qo'shamiz." } }
    ]
  },

  // s7 — 6-8 MISOL OSON->QIYIN (SeqMix: mc / input / multi). LCM kerak bo'lgan misollar ham (5/12, 17/12).
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Примеры: от простого к сложному', uz: "Misollar: oddiydan murakkabga" },
    lead: { ru: 'Складывай дроби. Каждый пример чуть сложнее.', uz: "Kasrlarni qo'shing. Har misol biroz qiyinroq." },
    audio: {
      intro: { ru: 'Семь примеров, от простого к сложному. Для каждого найди общий знаменатель и сложи. Поехали.', uz: "Yetti misol, oddiydan murakkabga. Har biriga umumiy maxraj topib qo'shing. Boshladik." },
      on_wrong: { ru: 'Не совсем. Сначала общий знаменатель, потом сложи числители.', uz: "Unchalik emas. Avval umumiy maxraj, keyin suratlarni qo'shing." },
      on_done: { ru: 'Отлично. Ты прошёл от простого примера до самого трудного.', uz: "Zo'r. Oson misoldan eng qiyiniga qadar yetib bordingiz." }
    },
    items: [
      { type: 'mc', q: { ru: '1/2 + 1/4', uz: "1/2 + 1/4" }, opts: ['3/4', '2/6', '1/4'], correct: 0,
        say: { ru: 'Одна вторая плюс одна четвёртая.', uz: "Ikkidan bir plyus to'rtdan bir." },
        ok: { ru: 'Верно. 1/2 = 2/4, и 2/4 + 1/4 = 3/4.', uz: "To'g'ri. 1/2 = 2/4, va 2/4 + 1/4 = 3/4." },
        no: { ru: 'Приведи обе дроби к одному знаменателю, потом сложи числители.', uz: "Ikkala kasrni bir maxrajga keltiring, keyin suratlarni qo'shing." } },
      { type: 'input', q: { ru: '1/3 + 1/6 = ?/6', uz: "1/3 + 1/6 = ?/6" }, answer: 3,
        say: { ru: 'Одна третья плюс одна шестая. Сколько шестых в числителе?', uz: "Uchdan bir plyus oltidan bir. Suratda nechta oltidan?" },
        ok: { ru: 'Верно. 1/3 = 2/6, и 2/6 + 1/6 = 3/6.', uz: "To'g'ri. 1/3 = 2/6, va 2/6 + 1/6 = 3/6." },
        no: { ru: 'Сначала приведи одну третью к шестым, потом сложи числители.', uz: "Avval uchdan birni oltilarga keltiring, keyin suratlarni qo'shing." } },
      { type: 'mc', q: { ru: '1/2 + 1/3', uz: "1/2 + 1/3" }, opts: ['5/6', '2/5', '2/6'], correct: 0,
        say: { ru: 'Одна вторая плюс одна третья.', uz: "Ikkidan bir plyus uchdan bir." },
        ok: { ru: 'Верно. 3/6 + 2/6 = 5/6.', uz: "To'g'ri. 3/6 + 2/6 = 5/6." },
        no: { ru: 'Так складывать нельзя. Приведи обе дроби к общему знаменателю.', uz: "Bunday qo'shib bo'lmaydi. Ikkala kasrni umumiy maxrajga keltiring." } },
      { type: 'multi', q: { ru: 'У каких пар общий знаменатель 12?', uz: "Qaysi juftlarning umumiy maxraji 12?" }, opts: ['1/4, 1/6', '1/3, 1/4', '1/2, 1/3'], correctSet: [0, 1],
        say: { ru: 'Отметь все пары, где наименьший общий знаменатель двенадцать.', uz: "Eng kichik umumiy maxraji o'n ikki bo'lgan barcha juftlarni belgilang." },
        ok: { ru: 'Верно. Для 4 и 6 это 12, для 3 и 4 тоже 12. А для 2 и 3 — шесть.', uz: "To'g'ri. 4 va 6 uchun bu 12, 3 va 4 uchun ham 12. 2 va 3 uchun esa — olti." },
        no: { ru: 'Ищи пары, где наименьшее общее число равно 12.', uz: "Eng kichik umumiy soni 12 ga teng juftlarni qidiring." } },
      { type: 'mc', q: { ru: '1/4 + 1/3', uz: "1/4 + 1/3" }, opts: ['7/12', '2/7', '5/12'], correct: 0,
        say: { ru: 'Одна четвёртая плюс одна третья. Общий знаменатель двенадцать.', uz: "To'rtdan bir plyus uchdan bir. Umumiy maxraj o'n ikki." },
        ok: { ru: 'Верно. 1/4 = 3/12, 1/3 = 4/12, сумма 7/12.', uz: "To'g'ri. 1/4 = 3/12, 1/3 = 4/12, yig'indi 7/12." },
        no: { ru: 'Приведи обе дроби к двенадцатым, потом сложи числители.', uz: "Ikkala kasrni o'n ikkilarga keltiring, keyin suratlarni qo'shing." } },
      { type: 'mc', q: { ru: '1/4 + 1/6', uz: "1/4 + 1/6" }, opts: ['5/12', '2/10', '5/24'], correct: 0,
        say: { ru: 'Одна четвёртая плюс одна шестая. Наименьший общий знаменатель двенадцать.', uz: "To'rtdan bir plyus oltidan bir. Eng kichik umumiy maxraj o'n ikki." },
        ok: { ru: 'Верно. 1/4 = 3/12, 1/6 = 2/12, сумма 5/12.', uz: "To'g'ri. 1/4 = 3/12, 1/6 = 2/12, yig'indi 5/12." },
        no: { ru: 'Возьми наименьший общий знаменатель, а не произведение. Потом сложи.', uz: "Ko'paytmani emas, eng kichik umumiy maxrajni oling. Keyin qo'shing." } },
      { type: 'mc', q: { ru: '2/3 + 3/4', uz: "2/3 + 3/4" }, opts: ['17/12', '5/7', '6/12'], correct: 0,
        say: { ru: 'Две третьих плюс три четвёртых. Общий знаменатель двенадцать.', uz: "Uchdan ikki plyus to'rtdan uch. Umumiy maxraj o'n ikki." },
        ok: { ru: 'Верно. 2/3 = 8/12, 3/4 = 9/12, сумма 17/12.', uz: "To'g'ri. 2/3 = 8/12, 3/4 = 9/12, yig'indi 17/12." },
        no: { ru: 'Приведи обе дроби к двенадцатым, потом сложи числители.', uz: "Ikkala kasrni o'n ikkilarga keltiring, keyin suratlarni qo'shing." } }
    ]
  },

  // sorder — DRAG (kichikdan kattaga sudrash): 1/4 < 1/3 < 1/2 (oltidan/o'n ikkidan solishtirib)
  sorder: {
    eyebrow: { ru: 'Перетащи', uz: "Sudrang" },
    title: { ru: 'Расставь от меньшей к большей', uz: "Kichikdan kattaga joylashtiring" },
    lead: { ru: 'Перетащи дроби по местам: слева самая маленькая, справа самая большая.', uz: "Kasrlarni o'rinlarga sudrang: chapda eng kichigi, o'ngda eng kattasi." },
    slot0: { ru: 'Меньшая', uz: "Eng kichik" },
    slot1: { ru: 'Средняя', uz: "O'rtacha" },
    slot2: { ru: 'Большая', uz: "Eng katta" },
    tray_label: { ru: 'Дроби', uz: "Kasrlar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Приведи к двенадцатым: 1/4 = 3/12, 1/3 = 4/12, 1/2 = 6/12. Чем больше долей, тем больше дробь.', uz: "O'n ikkilarga keltiring: 1/4 = 3/12, 1/3 = 4/12, 1/2 = 6/12. Ulush qancha ko'p bo'lsa, kasr shuncha katta." },
    correct_text: { ru: 'Верно! 1/4 = 3/12, 1/3 = 4/12, 1/2 = 6/12 — по возрастанию.', uz: "To'g'ri! 1/4 = 3/12, 1/3 = 4/12, 1/2 = 6/12 — o'sish tartibida." },
    fact: { ru: 'Чтобы сравнить дроби, их тоже приводят к общему знаменателю — как при сложении.', uz: "Kasrlarni solishtirish uchun ham ularni umumiy maxrajga keltirishadi — xuddi qo'shishdagidek." },
    audio: {
      intro: { ru: 'Расставь дроби от меньшей к большей. Перетащи или нажми. Чтобы сравнить, приведи их к двенадцатым. Потом нажми проверить.', uz: "Kasrlarni kichikdan kattaga joylashtiring. Sudrang yoki bosing. Solishtirish uchun ularni o'n ikkilarga keltiring. Keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно. Одна четвёртая меньше одной третьей, а одна третья меньше половины.', uz: "To'g'ri. To'rtdan bir uchdan birdan kichik, uchdan bir esa yarimdan kichik." },
      on_wrong: { ru: 'Пока не так. Приведи к двенадцатым и сравни число долей.', uz: "Hozircha emas. O'n ikkilarga keltiring va ulushlar sonini solishtiring." }
    }
  },

  // s8 — CASE setup: Mohira BITTA kitobni ikki kun o'qidi (1/3 + 1/4). Kunlar belgilangan + aniq "1/3 + 1/4 = ?".
  s8: {
    eyebrow: { ru: 'Задача · чтение', uz: "Masala · o'qish" },
    title: { ru: 'Мохира читала одну книгу два дня.', uz: "Mohira bitta kitobni ikki kun o'qidi." },
    body_p1: { ru: 'Книга одна и та же. Сколько всего она прочитала за два дня?', uz: "Kitob bitta. Ikki kunda jami qancha qismini o'qidi?" },
    day1: { ru: 'Вчера', uz: "Kecha" },
    day2: { ru: 'Сегодня', uz: "Bugun" },
    sum_label: { ru: 'Всего за два дня', uz: "Ikki kunda jami" },
    outro: { ru: 'Доли разного размера: трети и четвёртые. Чтобы сложить, нужен общий знаменатель.', uz: "Ulushlar har xil: uchdan va to'rtdan. Qo'shish uchun umumiy maxraj kerak." },
    btn_help: { ru: 'Помочь Мохире', uz: "Mohiraga yordam berish" },
    audio: { ru: 'Мохира читала одну книгу два дня. Вчера прочитала одну третью, сегодня одну четвёртую. Сколько всего она прочитала за два дня? Это одна третья плюс одна четвёртая. Доли разного размера, трети и четвёртые, поэтому нужен общий знаменатель. Помоги на следующем шаге.', uz: "Mohira bitta kitobni ikki kun o'qidi. Kecha uchdan birini, bugun to'rtdan birini o'qidi. Ikki kunda jami qancha o'qidi? Bu uchdan bir plyus to'rtdan bir. Ulushlar har xil, uchdan va to'rtdan, shuning uchun umumiy maxraj kerak. Keyingi bosqichda yordam bering." }
  },

  // s9 — CASE final MC: 1/3 + 1/4 = 7/12 (keep-visible, scored final)
  s9: {
    eyebrow: { ru: 'Задача · итог', uz: "Masala · natija" },
    label: { ru: 'Сколько книги прочитала всего?', uz: "Jami qancha o'qidi?" },
    question: { ru: '1/3 + 1/4 = ?', uz: "1/3 + 1/4 = ?" },
    correct_text: { ru: 'Правильно. 1/3 = 4/12, 1/4 = 3/12. 4/12 + 3/12 = 7/12.', uz: "To'g'ri. 1/3 = 4/12, 1/4 = 3/12. 4/12 + 3/12 = 7/12." },
    wrong_1: { ru: 'Сложили числители и знаменатели: (1+1)/(3+4). Сначала общий знаменатель 12: 4/12 + 3/12 = 7/12.', uz: "Surat va maxraj qo'shilgan: (1+1)/(3+4). Avval umumiy maxraj 12: 4/12 + 3/12 = 7/12." },
    wrong_2: { ru: 'Потеряли числители при приведении. 1/3 = 4/12, 1/4 = 3/12. Сумма 7/12.', uz: "Keltirishda suratlar yo'qolgan. 1/3 = 4/12, 1/4 = 3/12. Yig'indi 7/12." },
    wrong_3: { ru: 'Это целая книга. А прочитано меньше: 4/12 + 3/12 = 7/12.', uz: "Bu butun kitob. O'qilgani esa kamroq: 4/12 + 3/12 = 7/12." },
    wrong_default: { ru: 'Приведи к 12: 1/3 = 4/12, 1/4 = 3/12. Тогда 7/12.', uz: "12 ga keltiring: 1/3 = 4/12, 1/4 = 3/12. U holda 7/12." },
    // audio_hint_N — faqat ovoz uchun, metod, javobni ochmaydi
    audio_hint_1: { ru: 'Знаменатели складывать нельзя. Сначала приведи к общему знаменателю.', uz: "Maxrajlarni qo'shib bo'lmaydi. Avval umumiy maxrajga keltiring." },
    audio_hint_2: { ru: 'При приведении не теряй числители. Потом сложи их.', uz: "Keltirishda suratlarni yo'qotmang. Keyin ularni qo'shing." },
    audio_hint_3: { ru: 'Прочитано меньше целой книги. Приведи к общему знаменателю и сложи.', uz: "Butun kitobdan kamroq o'qilgan. Umumiy maxrajga keltirib qo'shing." },
    fact: { ru: 'Электронные книги тоже считают прогресс чтения, приводя разные главы к общей доле страниц.', uz: "Elektron kitoblar ham o'qish jarayonini har xil boblarni umumiy sahifa ulushiga keltirib hisoblaydi." },
    audio: {
      intro: { ru: 'Сложи одну третью и одну четвёртую. Какую часть книги Мохира прочитала всего? Выбери ответ.', uz: "Uchdan bir va to'rtdan birni qo'shing. Mohira kitobning jami qancha qismini o'qidi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Четыре двенадцатых плюс три двенадцатых это семь двенадцатых. Электронные книги считают прогресс так же.', uz: "To'g'ri. O'n ikkidan to'rt plyus o'n ikkidan uch bu o'n ikkidan yetti. Elektron kitoblar ham jarayonni shunday hisoblaydi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: "Unchalik emas. Tushuntirishga qarang." }
    }
  },

  // s10 — SUMMARY (Dars09-13 kanonik layout: ball qatori + asosiy + hookga qaytish + ConnectionsBlock)
  s10: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты складываешь дроби с разными знаменателями.', uz: "Endi siz har xil maxrajli kasrlarni qo'shasiz." },
    score_caption: { ru: 'верных ответов с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob" },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Дроби с разными знаменателями нельзя складывать сразу — доли разного размера.', uz: "Har xil maxrajli kasrlarni darrov qo'shib bo'lmaydi — ulushlar har xil o'lchamda." },
    main_2: { ru: 'Сначала находим общий знаменатель — наименьшее число, делящееся на оба.', uz: "Avval umumiy maxraj topamiz — ikkalasiga bo'linadigan eng kichik son." },
    main_3: { ru: 'Приводим обе дроби к нему (1/2 = 3/6, 1/3 = 2/6).', uz: "Ikkala kasrni unga keltiramiz (1/2 = 3/6, 1/3 = 2/6)." },
    main_4: { ru: 'Складываем числители, знаменатель оставляем (3/6 + 2/6 = 5/6).', uz: "Suratlarni qo'shamiz, maxrajni qoldiramiz (3/6 + 2/6 = 5/6)." },
    back_to_hook: { ru: '1/2 + 1/3 это не 2/5. Привели к шестым: 3/6 + 2/6 = 5/6.', uz: "1/2 + 1/3 bu 2/5 emas. Oltilarga keltirdik: 3/6 + 2/6 = 5/6." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Эквивалентные дроби» (приведение) и «Сложение дробей с равным знаменателем».', uz: "«Ekvivalent kasrlar» (keltirish) va «Teng maxrajli kasrlarni qo'shish»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'вычитание дробей с разными знаменателями.', uz: "har xil maxrajli kasrlarni ayirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты складываешь дроби с разными знаменателями. Сначала находим общий знаменатель, приводим к нему обе дроби, потом складываем числители, а знаменатель оставляем. Одна вторая плюс одна третья это не две пятых, а пять шестых. Дальше научимся вычитать дроби с разными знаменателями.', uz: "Zo'r. Endi siz har xil maxrajli kasrlarni qo'shasiz. Avval umumiy maxraj topamiz, ikkala kasrni unga keltiramiz, keyin suratlarni qo'shamiz, maxrajni qoldiramiz. Ikkidan bir plyus uchdan bir bu beshdan ikki emas, oltidan besh. Keyin har xil maxrajli kasrlarni ayirishni o'rganamiz." }
  }
};

// ============================================================
// YORDAMCHILAR (Title/shuffleMC/ConnectionsBlock/Floaters infra'da YO'Q — shu yerda)
// ============================================================
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };

const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; content[`audio_hint_${newI}`] = c[`audio_hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

// Ikonkalar ✓/✗ — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);

const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

// ============================================================
// FAKT-BLOK (ko'k karta, to'g'ri javobdan keyin)
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
const AnimProgress = () => (<div className="fa-prog"><div className="fa-prog-fill"/></div>);
const FactCard = ({ text, anim, badge = FACT_BADGE }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(badge)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
    </div>
  );
};

// ============================================================
// VIZUALIZATOR — g'ildiraklar (umumiy karra) + katakli to'r-chiziq + yuklash animatsiyasi
// ============================================================
const gridFills = (parts, total) => {
  const a = Array.from({ length: total }, () => null); let i = 0;
  parts.forEach(p => { for (let k = 0; k < p.count && i < total; k++) { a[i] = p.color; i++; } });
  return a;
};
const CellRow = ({ total, fills, h = 44, max = 420 }) => (
  <div className="cr-wrap" style={{ display: 'flex', width: '100%', maxWidth: max, height: h, margin: '0 auto', borderRadius: 10, overflow: 'hidden', background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="cr-cell" style={{ flex: 1, position: 'relative', borderRight: i < total - 1 ? `2px solid ${T.bg}` : 'none', background: (fills && fills[i]) || 'transparent' }}>{(fills && fills[i]) && <span className="cr-shine"/>}</div>
    ))}
  </div>
);
const FracPlus = ({ parts, sumN, sumD, showSum = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
    {parts.map((p, j) => (<React.Fragment key={j}>{j > 0 && <Op>+</Op>}<Frac n={String(p.n)} d={String(p.d)} size="mid" color={p.c}/></React.Fragment>))}
    {showSum && <><Op>=</Op><Frac n={String(sumN)} d={String(sumD)} size="mid" color={T.success}/></>}
  </div>
);
// Gear — boshqariladigan g'ildirak: teeth tishli, steps qadamga buriladi (1 qadam = 1/teeth aylanish).
const Gear = ({ teeth, steps, size, color }) => {
  const c = size / 2, rr = c - 11;
  const angle = (steps / teeth) * 360;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <span className="mono" style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', color: T.ink2, fontSize: 14, zIndex: 2 }}>▾</span>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', transform: `rotate(${angle}deg)`, transition: 'transform 0.45s cubic-bezier(0.34, 1.1, 0.64, 1)' }}>
        {Array.from({ length: teeth }).map((_, i) => { const a = ((i / teeth) * 360 - 90) * Math.PI / 180; const x = c + Math.cos(a) * (rr + 5); const y = c + Math.sin(a) * (rr + 5); return <rect key={i} x={x - 5} y={y - 5} width={10} height={10} rx={2} fill={i === 0 ? T.success : color} transform={`rotate(${(i / teeth) * 360} ${x} ${y})`}/>; })}
        <circle cx={c} cy={c} r={rr} fill={color}/>
        <circle cx={c} cy={c} r={rr * 0.4} fill={T.paper}/>
      </svg>
      <span className="mono" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 700, fontSize: 'clamp(14px, 2vw, 18px)', color }}>{teeth}</span>
    </div>
  );
};
// DownloadBars — s0 hook'dagi harakatli yuklash chiziqlari (mount'da to'ladi).
const DownloadBars = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360, position: 'relative' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="1" d="2" size="sm" color={T.accent}/><div className="dl-bar" style={{ flex: 1 }}><div className="dl-fill dl-fill-a" style={{ width: '50%' }}/></div></div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="1" d="3" size="sm" color={T.blue}/><div className="dl-bar" style={{ flex: 1 }}><div className="dl-fill dl-fill-b" style={{ width: '33.333%' }}/></div></div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginTop: 2 }}><Frac n="1" d="2" size="mid" color={T.accent}/><Op>+</Op><Frac n="1" d="3" size="mid" color={T.blue}/><Op>=</Op><Frac n="2" d="5" size="mid" color={T.ink3}/><span className="mop hk-q" style={{ color: T.ink3 }}>?</span></div>
  </div>
);

// ============================================================
// SeqMC — ketma-ket bir nechta tez MC (mobil tap). веди-до-верного; oxirida bitta ball.
// ============================================================
const SeqMC = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const qs = c.questions; const n = qs.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: `seq${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [picked, setPicked] = useState(null);
  const [wrong, setWrong] = useState(() => new Set());
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const q = qs[idx];
  const solvedItem = picked === q.correct;
  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && qs[i].say) e.pushOneOff(qs[i].say[lang]); } };
  const finish = (firstTries) => {
    setDone(true);
    if (scored) {
      const itemsCorrect = firstTries.filter(Boolean).length; const allOk = itemsCorrect === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const pick = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    const isCorrect = i === q.correct;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = isCorrect;
    if (isCorrect) {
      setPicked(i); sfx.playCorrect();
      const cur = firstTryRef.current.slice();
      advanceRef.current = setTimeout(() => {
        if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setPicked(null); setWrong(new Set()); sayItem(ni); }
        else finish(cur);
      }, 850);
    } else {
      sfx.playWrong();
      setWrong(prev => { const s = new Set(prev); s.add(i); return s; });
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(q.no ? q.no[lang] : c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true" style={{ position: 'relative' }}>
          {qs.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma savol yechildi." : 'Все вопросы решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              {(() => { const qStr = tx(q.q); return qStr.length <= 12
                ? <div className="dm-prob">{mt(qStr)}</div>
                : <p className="title h-sub" style={{ margin: 0, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{mt(qStr)}</p>; })()}
            </div>
            <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(16px, 2.4vw, 20px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                    {mt(tx(o))}
                  </button>
                );
              })}
            </div>
            <FeedbackBlock show={picked !== null || wrong.size > 0} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? '✓' : '✗'}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(tx(solvedItem ? q.ok : q.no))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SeqMix — ketma-ket har xil turdagi savollar (mc / input / multi). веди-до-верного; oxirida bitta ball.
// ============================================================
const SeqMix = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const items = c.items; const n = items.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: `mix${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [done, setDone] = useState(wasSolved);
  const [solvedItem, setSolvedItem] = useState(wasSolved);
  const [wrong, setWrong] = useState(() => new Set());   // mc: погашенные неверные опции
  const [sel, setSel] = useState(() => new Set());        // multi: выбранные
  const [val, setVal] = useState('');                     // input: значение
  const [showHint, setShowHint] = useState(false);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const itemErrRef = useRef(false);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const it = items[idx];

  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && items[i].say) e.pushOneOff(items[i].say[lang]); } };
  const voiceWrong = (node) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff((node && node[lang]) || c.audio.on_wrong[lang]); } };

  const finishAll = (firstTries) => {
    setDone(true);
    if (scored) {
      const ok = firstTries.filter(Boolean).length; const allOk = ok === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${ok}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect: ok, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };

  const markFirstTry = (correct) => { if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = correct; };
  const advance = () => {
    setSolvedItem(true); sfx.playCorrect();
    const cur = firstTryRef.current.slice();
    advanceRef.current = setTimeout(() => {
      if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setSolvedItem(false); setWrong(new Set()); setSel(new Set()); setVal(''); setShowHint(false); itemErrRef.current = false; sayItem(ni); }
      else finishAll(cur);
    }, 850);
  };

  // MC
  const pickMc = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const isCorrect = i === it.correct;
    if (isCorrect && !itemErrRef.current) markFirstTry(true);
    if (isCorrect) { markFirstTry(firstTryRef.current[idx] ?? !itemErrRef.current); advance(); }
    else { itemErrRef.current = true; markFirstTry(false); sfx.playWrong(); setWrong(prev => { const s = new Set(prev); s.add(i); return s; }); voiceWrong(it.no); }
  };
  // INPUT
  const submitInput = () => {
    if (done || solvedItem) return;
    const v = parseInt(String(val).replace(/\s/g, ''), 10);
    if (isNaN(v)) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const isCorrect = v === it.answer;
    if (isCorrect) { markFirstTry(!itemErrRef.current); advance(); }
    else { itemErrRef.current = true; markFirstTry(false); sfx.playWrong(); setShowHint(true); voiceWrong(it.no); }
  };
  // MULTI
  const toggleMulti = (i) => { if (done || solvedItem) return; setShowHint(false); setSel(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; }); };
  const submitMulti = () => {
    if (done || solvedItem) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const want = new Set(it.correctSet);
    const ok = sel.size === want.size && [...sel].every(i => want.has(i));
    if (ok) { markFirstTry(!itemErrRef.current); advance(); }
    else { itemErrRef.current = true; markFirstTry(false); sfx.playWrong(); setShowHint(true); voiceWrong(it.no); }
  };

  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true" style={{ position: 'relative' }}>
          {items.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma misol yechildi." : 'Все примеры решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 'clamp(14px, 2.6vw, 20px)' }}>
              {(() => { const qStr = tx(it.q); return qStr.length <= 12
                ? <div className="dm-prob">{mt(qStr)}</div>
                : <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(qStr)}</p>; })()}
              {it.type === 'input' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <input type="text" inputMode="numeric" className={`answer-input ${solvedItem ? 'correct' : ''}`} value={solvedItem ? String(it.answer) : val} placeholder="0" disabled={solvedItem}
                    onChange={e => { setVal(e.target.value); setShowHint(false); }} onKeyDown={e => e.key === 'Enter' && submitInput()} style={{ width: 'clamp(90px, 20vw, 120px)' }}/>
                  {!solvedItem && <button className="btn-white-accent" onClick={submitInput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>}
                </div>
              )}
            </div>
            {it.type === 'mc' && (
              <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                {it.opts.map((o, i) => {
                  let cls = 'option';
                  const isWrong = wrong.has(i); const isCorr = i === it.correct;
                  if (solvedItem && isCorr) cls += ' option-correct';
                  else if (isWrong) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pickMc(i)}
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(15px, 2.2vw, 19px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700 }}>
                      {mt(tx(o))}
                    </button>
                  );
                })}
              </div>
            )}
            {it.type === 'multi' && (
              <>
                <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                  {it.opts.map((o, i) => {
                    const on = sel.has(i);
                    return (
                      <button key={i} className={`option${on ? ' option-correct' : ''}`} disabled={solvedItem} onClick={() => toggleMulti(i)}
                        style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2vw, 17px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 600 }}>
                        {mt(tx(o))}
                      </button>
                    );
                  })}
                </div>
                {!solvedItem && <div className="fade-up" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={submitMulti} disabled={sel.size === 0} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button></div>}
              </>
            )}
            <FeedbackBlock show={solvedItem || showHint || wrong.size > 0} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? '✓' : '✗'}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(tx(solvedItem ? it.ok : it.no))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================
// s0 — HOOK: yuklash + 1/2 + 1/3 = 2/5 xatosi (harakatli)
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.question[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1 hook-alive" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <DownloadBars/>
        </div>
        <h2 className="title h-sub fade-up delay-2" style={{ position: 'relative' }}>{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)} style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6vw, 54px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span><span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION step: ulushlar har xil o'lchamda
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          {step >= 1 && <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 380 }}><Frac n="1" d="2" size="sm" color={T.accent}/><div style={{ flex: 1 }}><CellRow total={2} fills={gridFills([{ count: 1, color: T.accent }], 2)} h={34} max={9999}/></div></div>}
          {step >= 2 && <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 380 }}><Frac n="1" d="3" size="sm" color={T.blue}/><div style={{ flex: 1 }}><CellRow total={3} fills={gridFills([{ count: 1, color: T.blue }], 3)} h={34} max={9999}/></div></div>}
          {step >= 3 && <p className="body" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION g'ildiraklar: umumiy 6
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [steps, setSteps] = useState(0);
  const fit = steps > 0 && steps % 2 === 0 && steps % 3 === 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', minHeight: 180, justifyContent: 'center', boxShadow: fit ? '0 0 0 2px #1F7A4D, 0 8px 22px -6px rgba(31, 122, 77, 0.35)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 4vw, 28px)' }}>
            <Gear teeth={2} steps={steps} size={88} color={T.accent}/>
            <Gear teeth={3} steps={steps} size={110} color={T.blue}/>
          </div>
          <p className="mono small" style={{ margin: 0, color: T.ink2 }}>{lang === 'uz' ? 'Qadam' : 'Шаг'}: {steps}</p>
          <p className="body" style={{ margin: 0, textAlign: 'center', fontWeight: fit ? 600 : 400, color: fit ? T.success : T.ink2 }}>{mt(t(fit ? c.note_hit : c.note_miss))}</p>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn-white-accent" onClick={() => setSteps(s => s + 1)} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.5vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Aylantirish' : 'Крутить'}</button>
          <button className="btn-ghost" onClick={() => setSteps(0)} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Boshidan' : 'Сначала'}</button>
        </div>
        {fit && <p className="small fade-up" style={{ position: 'relative', textAlign: 'center', color: T.ink2 }}>{mt(t(c.conclusion))}</p>}
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION step: oltilarga keltirish
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s3_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          {step >= 1 && <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 400 }}><Frac n="3" d="6" size="sm" color={T.accent}/><div style={{ flex: 1 }}><CellRow total={6} fills={gridFills([{ count: 3, color: T.accent }], 6)} h={34} max={9999}/></div></div>}
          {step >= 2 && <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 400 }}><Frac n="2" d="6" size="sm" color={T.blue}/><div style={{ flex: 1 }}><CellRow total={6} fills={gridFills([{ count: 2, color: T.blue }], 6)} h={34} max={9999}/></div></div>}
          {step >= 2 && <p className="body" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s4 — RULE: 3 qadam
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <CellRow total={6} fills={gridFills([{ count: 3, color: T.accent }, { count: 2, color: T.blue }], 6)} h={40}/>
          <FracPlus parts={[{ n: 3, d: 6, c: T.accent }, { n: 2, d: 6, c: T.blue }]} sumN={5} sumD={6}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
            <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{t(c.label)}</p>
            {[c.step1, c.step2, c.step3].map((stp, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 1 }}>{i + 1}</span><p className="body" style={{ margin: 0 }}>{mt(t(stp))}</p></div>))}
            <p className="small" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{mt(t(c.card_line))}</p>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// ============================================================
// DRAG-AND-DROP — tap (mobil) + sichqoncha-drag gibridi. веди-до-верного, keep-visible, storedAnswer tiklash.
// ============================================================
// DragToSlots: chiplarni N katakka joylash (har katakka bitta). Layout — renderBoard(slotEl) orqali (fill / order).
const DragToSlots = ({ screen, idx, c, chips, correct, renderBoard, slotSize = 'sm', factOnCorrect, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const N = correct.length;
  const audio = useAudio([{ id: `d${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [place, setPlace] = useState(() => (wasSolved ? correct.slice() : Array(N).fill(null))); // place[slot] = chipId
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvRef = useRef(wasSolved);
  const chipById = (id) => chips.find(ch => ch.id === id);
  const dropTo = (slot) => { if (solved || sel === null) return; setChecked(false); setPlace(p => { const n = [...p]; n[slot] = sel; return n; }); setSel(null); };
  const returnChip = (slot) => { if (solved) return; setChecked(false); setPlace(p => { const n = [...p]; n[slot] = null; return n; }); };
  const allPlaced = place.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = correct.every((v, i) => v === place[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: t(c.title), correctAnswer: correct.join(','), studentAnswer: place.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setPlace(p => p.map((v, i) => (v === correct[i] ? v : null)));   // веди-до-верного: noto'g'ri chiplar qaytadi
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const slotEl = (i) => (
    <span key={`sl${i}`} className={`dnd-slot dnd-slot-${slotSize}${sel !== null && place[i] === null ? ' dnd-slot-armed' : ''}${solved ? ' dnd-ok' : ''}`}
      onClick={() => { if (place[i] === null) dropTo(i); else returnChip(i); }}
      onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); dropTo(i); }}>
      {place[i] !== null ? chipById(place[i]).node : <span className="dnd-slot-q">?</span>}
    </span>
  );
  const trayChips = chips.filter(ch => !place.includes(ch.id));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>{renderBoard(slotEl)}</div>
        {!solved && (
          <div className="dnd-tray fade-up delay-2" style={{ position: 'relative' }}>
            <span className="dnd-tray-lbl">{t(c.tray_label)}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(ch => (
              <span key={ch.id} className={`dnd-chip${sel === ch.id ? ' dnd-chip-sel' : ''}`} draggable onDragStart={() => setSel(ch.id)} onClick={() => setSel(s => (s === ch.id ? null : ch.id))}>{ch.node}</span>
            ))}
          </div>
        )}
        {!solved && <div className="fade-up" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};

// DragToBins: chiplarni savatlarga (klassifikatsiya). place[itemIdx] = binId.
const DragToBins = ({ screen, idx, c, items, bins, correct, factOnCorrect, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const audio = useAudio([{ id: `d${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [place, setPlace] = useState(() => (wasSolved ? correct.slice() : items.map(() => null)));
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvRef = useRef(wasSolved);
  const dropTo = (bin) => { if (solved || sel === null) return; setChecked(false); setPlace(p => { const n = [...p]; n[sel] = bin; return n; }); setSel(null); };
  const onChipClick = (i) => { if (solved) return; setChecked(false); setSel(s => (s === i ? null : i)); };
  const returnChip = (i) => { if (solved) return; setChecked(false); setPlace(p => { const n = [...p]; n[i] = null; return n; }); };
  const allPlaced = place.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = correct.every((v, i) => v === place[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: t(c.title), correctAnswer: correct.join(','), studentAnswer: place.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setPlace(p => p.map((v, i) => (v === correct[i] ? v : null)));
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const trayChips = items.map((it, i) => (place[i] === null ? i : null)).filter(i => i !== null);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="dnd-bins fade-up delay-1" style={{ position: 'relative', maxHeight: solved ? 0 : 900, opacity: solved ? 0 : 1, overflow: 'hidden', transition: 'opacity 0.4s, max-height 0.6s' }}>
          {bins.map(bin => {
            const inBin = items.map((it, i) => (place[i] === bin.id ? i : null)).filter(i => i !== null);
            return (
              <div key={bin.id} className={`dnd-bin${sel !== null ? ' dnd-bin-armed' : ''}`} onClick={() => dropTo(bin.id)}
                onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); dropTo(bin.id); }}>
                <span className="dnd-bin-lbl">{t(bin.label)}</span>
                <div className="dnd-bin-slot">
                  {inBin.map(i => {
                    const right = solved && place[i] === correct[i];
                    return (
                      <span key={i} className={`dnd-chip dnd-chip-in${right ? ' dnd-ok' : ''}`} draggable={!solved} onDragStart={() => setSel(i)}
                        onClick={e => { e.stopPropagation(); returnChip(i); }}>{items[i].node}</span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {!solved && (
          <div className="dnd-tray fade-up delay-2" style={{ position: 'relative' }}>
            <span className="dnd-tray-lbl">{t(c.tray_label)}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(i => (
              <span key={i} className={`dnd-chip${sel === i ? ' dnd-chip-sel' : ''}`} draggable onDragStart={() => setSel(i)} onClick={() => onChipClick(i)}>{items[i].node}</span>
            ))}
          </div>
        )}
        {!solved && <div className="fade-up" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};

// sfill — DRAG-FILL: 1/2 + 1/3 = [3]/6 + [2]/6 = [5]/6
const ScreenDragFill = (props) => {
  const c = CONTENT.sfill;
  const chips = [2, 3, 4, 5, 6].map(v => ({ id: String(v), node: <span className="mono" style={{ fontWeight: 700, fontSize: 'clamp(15px, 2.4vw, 19px)' }}>{v}</span> }));
  const correct = ['3', '2', '5'];
  const dndFrac = (slot) => (
    <span className="dnd-frac">{slot}<span className="dnd-frac-bar"/><span className="dnd-frac-d">6</span></span>
  );
  const renderBoard = (slotEl) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(4px, 1.4vw, 9px)', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Frac n="1" d="2" size="mid" color={T.accent}/><Op>+</Op><Frac n="1" d="3" size="mid" color={T.blue}/><Op>=</Op>
      {dndFrac(slotEl(0))}<Op>+</Op>{dndFrac(slotEl(1))}<Op>=</Op>{dndFrac(slotEl(2))}
    </span>
  );
  return <DragToSlots {...props} idx={5} c={c} chips={chips} correct={correct} slotSize="sm" renderBoard={renderBoard} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>}/>}/>;
};

// sbins — DRAG-CLASSIFY: juftlarni umumiy maxraj 6 / 12 savatlariga
const ScreenDragBins = (props) => {
  const t = useT(); const c = CONTENT.sbins;
  const items = [c.it0, c.it1, c.it2, c.it3].map((node, i) => ({ id: i, node: <span className="body" style={{ fontWeight: 600 }}>{mt(t(node))}</span> }));
  const bins = [{ id: 'b6', label: c.bin6 }, { id: 'b12', label: c.bin12 }];
  const correct = ['b6', 'b6', 'b12', 'b12'];
  return <DragToBins {...props} idx={6} c={c} items={items} bins={bins} correct={correct} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>}/>}/>;
};

// s6 — 5 TA OSON SAVOL (SeqMC)
const Screen6 = (props) => <SeqMC {...props} screenContent={CONTENT.s6} scored={true}/>;

// s7 — 6-8 MISOL OSON->QIYIN (SeqMix)
const Screen7 = (props) => <SeqMix {...props} screenContent={CONTENT.s7} scored={true}/>;

// sorder — DRAG-ORDER: kichikdan kattaga (1/4 < 1/3 < 1/2)
const ScreenDragOrder = (props) => {
  const t = useT(); const c = CONTENT.sorder;
  const chips = [
    { id: 'q2', node: <Frac n="1" d="2" size="mid" color={T.success}/> },
    { id: 'q3', node: <Frac n="1" d="3" size="mid" color={T.accent}/> },
    { id: 'q4', node: <Frac n="1" d="4" size="mid" color={T.blue}/> }
  ];
  const correct = ['q4', 'q3', 'q2'];
  const labels = [c.slot0, c.slot1, c.slot2];
  const renderBoard = (slotEl) => (
    <div style={{ display: 'flex', gap: 'clamp(10px, 3.5vw, 26px)', alignItems: 'flex-end', justifyContent: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {slotEl(i)}
          <span className="mono small" style={{ color: T.ink3 }}>{t(labels[i])}</span>
        </div>
      ))}
    </div>
  );
  return <DragToSlots {...props} idx={9} c={c} chips={chips} correct={correct} slotSize="lg" renderBoard={renderBoard} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>}/>}/>;
};

// s8 — CASE setup: Mohira 1/3 + 1/4
const Screen8 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2 }}>{mt(t(c.body_p1))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="mono small" style={{ minWidth: 64, color: T.ink2, fontWeight: 600 }}>{t(c.day1)}</span><Frac n="1" d="3" size="sm" color={T.accent}/><div style={{ flex: 1 }}><CellRow total={3} fills={gridFills([{ count: 1, color: T.accent }], 3)} h={28} max={9999}/></div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="mono small" style={{ minWidth: 64, color: T.ink2, fontWeight: 600 }}>{t(c.day2)}</span><Frac n="1" d="4" size="sm" color={T.blue}/><div style={{ flex: 1 }}><CellRow total={4} fills={gridFills([{ count: 1, color: T.blue }], 4)} h={28} max={9999}/></div></div>
          <div style={{ borderTop: `1px solid ${T.bg}`, paddingTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span className="small" style={{ color: T.ink3 }}>{t(c.sum_label)}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Frac n="1" d="3" size="mid" color={T.accent}/><Op>+</Op><Frac n="1" d="4" size="mid" color={T.blue}/><Op>=</Op><span className="mop hk-q" style={{ color: T.ink3 }}>?</span></span>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative' }}>{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s9 — CASE final MC: 1/3 + 1/4 = 7/12 (keep-visible, scored final)
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [<Frac n="7" d="12" size="mid"/>, <Frac n="2" d="7" size="mid"/>, <Frac n="5" d="12" size="mid"/>, <Frac n="12" d="12" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 3, 1]);
  const titleNode = c.label;
  const question = (
    <div className="frame" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Frac n="1" d="3" size="mid" color={T.accent}/><Op>+</Op><Frac n="1" d="4" size="mid" color={T.blue}/><Op>=</Op><span className="mop hk-q" style={{ color: T.ink3 }}>?</span></span>
    </div>
  );
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} titleNode={titleNode} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>} badge={FACT_BADGE}/>}/>;
};

// s10 — SUMMARY (kanonik Dars09-13 layout)
const Screen10 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, [finishLesson]);
  const scoredScreens = SCREEN_META.filter(s => s.scored);
  const total = scoredScreens.length;
  const correct = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-white-accent" onClick={onReset} style={{ marginLeft: 'auto', padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <Floaters/>
        <p className="eyebrow fade-up" style={{ position: 'relative', color: T.success, margin: 0 }}>{t(c.label)}</p>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 'clamp(26px, 5vw, 34px)', fontWeight: 700, color: T.success }}>{correct} / {total}</span>
          <span className="small" style={{ color: T.ink2 }}>{t(c.score_caption)}</span>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{t(c.main_label)}</p>
          {mains.map((mn, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 1 }}>{i + 1}</span><p className="body" style={{ margin: 0 }}>{mt(t(mn))}</p></div>))}
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.back_to_hook))}</p></div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVIY KOMPONENT
// ============================================================
export default function FractionAddLesson({
  studentName, lang: langProp, ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
    const scored = SCREEN_META.filter(s => s.scored);
    const finalScreens = scored.filter(s => s.scope === 'final');
    const correctCount = answers.filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
    const finalCorrect = answers.filter((a, i) => a && SCREEN_META[i]?.scope === 'final' && a.correct).length;
    const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scored.length,
      correctAnswers: correctCount,
      scorePercent: scored.length > 0 ? Math.round((correctCount / scored.length) * 100) : 0,
      finalScore: finalCorrect,
      finalTotal: finalScreens.length,
      passed: finalScreens.length > 0 ? finalCorrect / finalScreens.length >= 0.6 : (scored.length > 0 ? correctCount / scored.length >= 0.6 : false),
      firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
      answers: answers.filter(Boolean)
    };
    safeOnFinished(payload);
  }, [answers, safeOnFinished]);

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, ScreenDragFill, ScreenDragBins, Screen6, Screen7, ScreenDragOrder, Screen8, Screen9, Screen10];
  const CurrentScreen = screens[current];

  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(58, 53, 48, 0.25)' }}>
            {['ru', 'uz'].map(l => (
              <button key={l} onClick={() => setPreviewLang(l)}
                style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '4px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
                         background: previewLang === l ? '#FF4F28' : 'transparent', color: previewLang === l ? '#FFFFFF' : '#5A5A60' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen screen={current} studentName={safeName} storedAnswer={answers[current]} answers={answers} onAnswer={handleAnswer} onNext={next} onPrev={prev} onReset={reset} finishLesson={finishLesson}/>
      </div>
    </LangContext.Provider>
  );
}

// ============================================================
// CSS — bazaviy (Dars28) + dars19 maxsus (g'ildirak/katak/yuklash/fakt-anim)
// ============================================================
const STYLES = `/*__BASE__*/

/* === Dars19 (frac_5_06) maxsus CSS === */
/* HOOK jonli animatsiya */
.hook-alive { position: relative; overflow: hidden; }
.hook-glow { position: absolute; inset: 0; pointer-events: none; z-index: 1; border-radius: inherit; animation: hookGlow 3.4s ease-in-out infinite; }
.hook-sheen { position: absolute; top: 0; bottom: 0; left: 0; width: 45%; pointer-events: none; z-index: 2; background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%); transform: translateX(-110%); animation: hookSheen 3.4s ease-in-out infinite; }
@keyframes hookSheen { 0% { transform: translateX(-110%); } 55%, 100% { transform: translateX(240%); } }
@keyframes hookGlow { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: inset 0 0 26px 2px rgba(255, 79, 40, 0.10); } }
.hk-q { display: inline-block; animation: hkQ 1.3s ease-in-out infinite; }
@keyframes hkQ { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.25); opacity: 1; text-shadow: 0 0 12px rgba(255, 79, 40, 0.5); } }
/* Yuklash chiziqlari (s0) — mount'da to'ladi */
.dl-bar { height: 30px; border-radius: 8px; background: rgba(167, 166, 162, 0.22); overflow: hidden; box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.4); }
.dl-fill { height: 100%; border-radius: 8px; }
.dl-fill-a { background: linear-gradient(90deg, rgba(255,79,40,0.85), #FF4F28); animation: dlA 1.1s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
.dl-fill-b { background: linear-gradient(90deg, rgba(1,154,203,0.85), #019ACB); animation: dlB 1.3s cubic-bezier(0.33, 1, 0.68, 1) 0.25s backwards; }
@keyframes dlA { from { width: 0; } }
@keyframes dlB { from { width: 0; } }
/* g'ildirak fakt-anim spin */
@keyframes gearSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.fa-gear { animation: gearSpin 4s linear infinite; transform-origin: center; }
/* katakli to'r yarq-yarq */
.cr-shine { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 55%); }
/* fakt: progress (yuklash) */
.fa-prog { position: relative; width: 66px; height: 16px; border-radius: 99px; background: rgba(1, 154, 203, 0.18); overflow: hidden; }
.fa-prog-fill { height: 100%; border-radius: 99px; background: #019ACB; animation: faProg 2.2s ease-in-out infinite; }
@keyframes faProg { 0% { width: 6%; } 60% { width: 80%; } 100% { width: 6%; } }
/* fakt: piksel to'r */
.fa-px { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; width: 44px; }
.fa-px-c { width: 100%; aspect-ratio: 1 / 1; border-radius: 2px; background: #019ACB; animation: faPx 2.2s ease-in-out infinite; }
@keyframes faPx { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }

/* === DRAG-AND-DROP (Dars37 dnd uslubi + katak/kasr slotlari) === */
.dnd-bins { display: flex; gap: clamp(8px, 1.8vw, 14px); }
.dnd-bin { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; background: #FDFBF7; border: 2px dashed #A7A6A2; border-radius: 14px; padding: clamp(8px, 1.5vw, 11px) clamp(6px, 1.2vw, 10px); transition: border-color 0.2s, background 0.2s; cursor: pointer; }
.dnd-bin-armed { border-color: #019ACB; background: #EAF6FB; }
.dnd-bin-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.6vw, 14px); color: #5A5A60; text-align: center; }
.dnd-bin-slot { display: flex; flex-direction: column; gap: 6px; min-height: clamp(42px, 8vw, 54px); align-items: stretch; justify-content: center; }
.dnd-tray { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 12px; padding: clamp(9px, 1.6vw, 12px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.dnd-tray-lbl { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.4vw, 12px); font-weight: 600; color: #A7A6A2; text-transform: uppercase; letter-spacing: 0.06em; }
.dnd-chip { cursor: grab; user-select: none; -webkit-user-select: none; touch-action: none; display: inline-flex; align-items: center; justify-content: center; background: #FFFFFF; border: 1.5px solid #FF4F28; border-radius: 99px; padding: clamp(8px, 1.4vw, 10px) clamp(13px, 2.1vw, 17px); font-weight: 600; color: #0E0E10; box-shadow: 0 4px 12px -4px rgba(255, 79, 40, 0.25); transition: transform 0.15s, box-shadow 0.15s, background 0.18s; }
.dnd-chip:hover { transform: translateY(-1px); box-shadow: 0 8px 18px -5px rgba(255, 79, 40, 0.38); }
.dnd-chip-sel { background: #FF4F28; color: #FFFFFF; box-shadow: 0 8px 20px -5px rgba(255, 79, 40, 0.5); }
.dnd-chip-in { cursor: pointer; text-align: center; border-color: #019ACB; box-shadow: 0 4px 12px -4px rgba(1, 154, 203, 0.28); }
.dnd-ok { border-color: #1F7A4D !important; background: #E3F0E8 !important; color: #1F7A4D !important; box-shadow: 0 4px 12px -4px rgba(31, 122, 77, 0.3) !important; }
/* slot (fill/order uchun bo'sh katak) */
.dnd-slot { display: inline-flex; align-items: center; justify-content: center; border: 2px dashed #A7A6A2; border-radius: 10px; background: #FDFBF7; cursor: pointer; transition: border-color 0.2s, background 0.2s, transform 0.15s; vertical-align: middle; }
.dnd-slot-sm { min-width: clamp(34px, 7vw, 44px); min-height: clamp(30px, 6vw, 38px); }
.dnd-slot-lg { min-width: clamp(56px, 13vw, 76px); min-height: clamp(52px, 11vw, 66px); }
.dnd-slot-armed { border-color: #019ACB; background: #EAF6FB; }
.dnd-slot-q { color: #A7A6A2; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.4vw, 20px); }
/* fill: kasr ko'rinishi (surat = slot, maxraj = 6) */
.dnd-frac { display: inline-flex; flex-direction: column; align-items: center; gap: 3px; vertical-align: middle; }
.dnd-frac-bar { width: clamp(34px, 7vw, 46px); height: 2px; background: #0E0E10; }
.dnd-frac-d { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.4vw, 20px); color: #0E0E10; }
`;
