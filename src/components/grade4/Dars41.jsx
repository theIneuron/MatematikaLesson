// ============================================================================
// 4-SINF · Dars 41 · Simmetrik shakllar. Burish simmetriyasi
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri, 199-202-betlar.
// Skelet: src/books/grade4/Dars41_SCENARIO.md.
// Syujet: Lumo City arxitektura byurosining naqsh ustaxonasi (SYUJET_4SINF.md,
// 5-blok). Ish tuguni yangi: markaziy bekat uchun panjara-oyna.
//
// YADRO. Dastgoh naqshning faqat yarmini kesadi, ikkinchi yarmi KO'ZGU bilan
// chiqadi. Bit o'ng yarmini ko'zgu qilmay nusxa ko'chirgan, shuning uchun
// chokda barglar bir-biriga emas, bir tomonga qaraydi.
//
// Ikkinchi yo'nalish: dumaloq guldasta bitta bargdan BURISH bilan quriladi.
// Shakl bir aylanishda n marta o'ziga mos tushsa, burish burchagi 360 : n.
//
// RITM (metodist talabi): qisqa tushuntirish -> misol -> yana tushuntirish ->
// misol. Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
//
// Infratuzilma ko'chirilmaydi, `kit/` dan import qilinadi (CLAUDE.md §5).
// ============================================================================
import { useEffect, useState } from 'react';
import {
  BitSVG, BuildScreen, ChoiceScreen, FitSvg, KIT_STYLES, RevealScreen, SlotScreen,
  SummaryScreen, T, TheoryLessonRoot, assertScreenTypeLabels, usePrefersReducedMotion, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'sym-4-41-v2',
  slug: 'dars41-simmetriya-va-burilish-simmetriyasi',
  lessonTitle: {
    uz: '41-dars. Simmetriya va burilish simmetriyasi',
    ru: 'Урок 41. Симметрия и поворотная симметрия',
    en: 'Lesson 41. Line and rotational symmetry',
  },
  skillTags: ['line_symmetry', 'equal_distance', 'mirror_construction', 'rotational_symmetry', 'turn_angle'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', scored: false, scope: null },
  { id: 's2', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's3', type: 'exploration', scored: false, scope: null },
  { id: 's4', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's5', type: 'exploration', scored: false, scope: null },
  { id: 's6', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's7', type: 'exploration', scored: false, scope: null },
  { id: 's8', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'exploration', scored: false, scope: null },
  { id: 's10', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'rule', scored: false, scope: null },
  { id: 's12', type: 'strategy', scored: false, scope: null },
  { id: 's13', type: 'error-analysis', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'life-case', scored: false, scope: 'final' },
  { id: 's15', type: 'summary', scored: false, scope: null },
];

const TOTAL_SCREENS = SCREEN_META.length;
assertScreenTypeLabels(SCREEN_META, LESSON_META.lessonId);

// Har ekrandagi ovoz bo'laklari soni: chizmadagi kadr shu bo'lakka ergashadi.
const FRAME_COUNTS = [4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3];

// ---------------------------------------------------------------------------
// KONTENT: UZ (asosiy), RU, EN + har ekran uchun ovoz.
// Ovoz ekran matnidan kengroq: ekranda natija, ovozda sabab.
// Ovozda belgi yo'q, sonlar so'z bilan (audio_rules).
// ---------------------------------------------------------------------------
const CONTENT = {
  s0: {
    eyebrow: { uz: 'Naqsh ustaxonasi', ru: 'Мастерская орнамента', en: 'The pattern workshop' },
    title: {
      uz: 'Chok nega qovushmadi?',
      ru: 'Почему стык не сошёлся?',
      en: 'Why does the seam not meet?',
    },
    question: {
      uz: "O'ng yarimda nima noto'g'ri?",
      ru: 'Что не так с правой половиной?',
      en: 'What is wrong with the right half?',
    },
    options: [
      { uz: "U ko'zgudagidek emas, oddiy nusxa", ru: 'Это не отражение, а простая копия', en: 'It is a plain copy, not a reflection' },
      { uz: 'Undagi barglar soni kamroq', ru: 'В ней меньше листьев', en: 'It has fewer leaves' },
      { uz: "U o'qdan uzoqroqda turibdi", ru: 'Она стоит дальше от оси', en: 'It stands further from the axis' },
      { uz: 'U burab qo\'yilgan', ru: 'Она повёрнута', en: 'It has been turned' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Nusxada barglar bir tomonga qaraydi. Ko'zguda esa ular bir-biriga qaraydi va chokda naqsh yopiladi.",
      ru: 'Верно. В копии листья смотрят в одну сторону. В отражении они смотрят друг на друга, и узор на стыке закрывается.',
      en: 'Correct. In a copy the leaves point the same way. In a reflection they face each other and the pattern closes at the seam.',
    },
    wrong: [
      null,
      {
        uz: "Barglar soni teng: ikkala yarmida ham oltitadan. Xato ularning yo'nalishida.",
        ru: 'Листьев поровну: по шесть в каждой половине. Ошибка в их направлении.',
        en: 'The leaves are equal in number: six in each half. The error is in the way they point.',
      },
      {
        uz: "Ikkala yarim ham chokka tegib turibdi. Masofa emas, yo'nalish boshqacha.",
        ru: 'Обе половины прилегают к стыку. Различается не расстояние, а направление.',
        en: 'Both halves touch the seam. What differs is not the distance but the direction.',
      },
      {
        uz: "Burasak, barglar aylana bo'ylab tartib bilan ketardi. Bu yerda ular shunchaki ko'chirilgan.",
        ru: 'При повороте листья шли бы по кругу. Здесь они просто скопированы.',
        en: 'After a turn the leaves would run around a circle. Here they are simply copied.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Lumo City arxitektura byurosi markaziy bekatga panjara-oyna tayyorlamoqda.",
          "Dastgoh naqshning faqat chap yarmini kesadi. O'ng yarmi ko'zgu qonuni bilan chiqishi kerak.",
          "Bit chap yarmni ko'chirib, o'ngga qo'ydi. Chokda barglar bir-biriga qaramay, bir tomonga qaradi.",
          "Naqsh yopilmadi. Sizningcha, o'ng yarimda nima noto'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Архитектурное бюро Lumo City готовит решётчатое окно для центральной станции.',
          'Станок режет только левую половину узора. Правая должна получиться по закону зеркала.',
          'Bit скопировал левую половину и поставил её справа. На стыке листья смотрят в одну сторону, а не друг на друга.',
          'Узор не закрылся. Как ты думаешь, что не так с правой половиной? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The Lumo City architecture bureau is preparing a lattice window for the central station.',
          'The cutter only cuts the left half of the pattern. The right half has to come from the law of the mirror.',
          'Bit copied the left half and placed it on the right. At the seam the leaves point the same way instead of facing each other.',
          'The pattern did not close. What do you think is wrong with the right half? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Simmetriya o\'qi', ru: 'Ось симметрии', en: 'The axis of symmetry' },
    title: {
      uz: 'Buklab tekshiramiz',
      ru: 'Проверяем сгибом',
      en: 'We check by folding',
    },
    lead: {
      uz: "Panelni chiziq bo'ylab buklaymiz. Ikki yarim ustma-ust tushsa, bu chiziq simmetriya o'qi.",
      ru: 'Сгибаем панель по прямой. Если половины совпали, эта прямая — ось симметрии.',
      en: 'We fold the panel along a line. If the halves land on each other, that line is the axis of symmetry.',
    },
    note: {
      uz: "Chiziq boshqa joydan o'tsa, yarimlar mos tushmaydi: u simmetriya o'qi emas.",
      ru: 'Если прямая проходит иначе, половины не совпадают: это не ось симметрии.',
      en: 'If the line runs elsewhere, the halves do not match: it is not an axis of symmetry.',
    },
    audio: {
      intro: {
        uz: [
          "Bitta panelni olamiz. Unda to'rtta barg bor va ular chokka qaragan.",
          "O'rtasidan tik chiziq o'tkazamiz. Bu chiziq bo'ylab panelni buklaymiz.",
          "Ikki yarim aniq ustma-ust tushdi. Demak, bu chiziq simmetriya o'qi.",
          "Endi chiziqni boshqa joydan o'tkazamiz. Buklaganda yarimlar mos tushmadi. Har qanday chiziq o'q bo'lavermaydi.",
        ],
        ru: [
          'Возьмём одну панель. На ней четыре листа, и они повёрнуты к стыку.',
          'Проведём через середину прямую. По этой прямой сложим панель.',
          'Половины легли точно друг на друга. Значит, эта прямая и есть ось симметрии.',
          'Теперь проведём прямую в другом месте. При сгибе половины не совпали. Не всякая прямая является осью.',
        ],
        en: [
          'Take one panel. It carries four leaves and they face the seam.',
          'Draw a straight line through the middle. Fold the panel along that line.',
          'The halves landed exactly on each other. So this line is an axis of symmetry.',
          'Now draw a line somewhere else. After the fold the halves did not match. Not every line is an axis.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Uchta panel', ru: 'Три панели', en: 'Three panels' },
    title: {
      uz: 'Qaysi panel simmetrik?',
      ru: 'Какая панель симметрична?',
      en: 'Which panel is symmetric?',
    },
    question: {
      uz: "Qaysi panelda naqsh o'qqa nisbatan simmetrik?",
      ru: 'На какой панели узор симметричен относительно оси?',
      en: 'On which panel is the pattern symmetric about the axis?',
    },
    options: [
      { uz: '1-panel', ru: 'Панель 1', en: 'Panel 1' },
      { uz: '2-panel', ru: 'Панель 2', en: 'Panel 2' },
      { uz: '3-panel', ru: 'Панель 3', en: 'Panel 3' },
    ],
    correctIndex: 1,
    correctText: {
      uz: "To'g'ri. Ikkinchi panelda barglar o'qqa qarab bir-biriga tik turibdi va o'qdan bir xil masofada.",
      ru: 'Верно. На второй панели листья обращены друг к другу и стоят на одинаковом расстоянии от оси.',
      en: 'Correct. On the second panel the leaves face each other and stand at the same distance from the axis.',
    },
    wrong: [
      {
        uz: "Birinchi panelda barglar bir tomonga qaragan. Bu ko'chirma, ko'zgu emas.",
        ru: 'На первой панели листья смотрят в одну сторону. Это копия, а не отражение.',
        en: 'On the first panel the leaves point the same way. That is a copy, not a reflection.',
      },
      null,
      {
        uz: "Uchinchi panelda o'ng yarim pastga siljigan. Buklasak, barglar ustma-ust tushmaydi.",
        ru: 'На третьей панели правая половина сдвинута вниз. При сгибе листья не совпадут.',
        en: 'On the third panel the right half is shifted down. After a fold the leaves will not match.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ustaxonaga uchta panel keldi. Har birida tik chiziq chizilgan.",
          "Har bir panelni shu chiziq bo'ylab xayolan buklab ko'ring.",
          "Qaysi panelda naqsh o'qqa nisbatan simmetrik? Javobni tanlang.",
        ],
        ru: [
          'В мастерскую поступили три панели. На каждой проведена вертикальная прямая.',
          'Мысленно сложи каждую панель по этой прямой.',
          'На какой панели узор симметричен относительно оси? Выбери ответ.',
        ],
        en: [
          'Three panels have arrived at the workshop. A vertical line is drawn on each of them.',
          'Fold each panel along that line in your head.',
          'On which panel is the pattern symmetric about the axis? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Masofa qoidasi', ru: 'Правило расстояния', en: 'The distance rule' },
    title: {
      uz: "O'qdan bir xil masofa",
      ru: 'Одинаковое расстояние от оси',
      en: 'The same distance from the axis',
    },
    lead: {
      uz: "Nuqtadan o'qqa tik yo'l chizamiz va shuncha katakni narigi tomonda sanaymiz.",
      ru: 'Проводим от точки перпендикуляр к оси и отсчитываем столько же клеток по другую сторону.',
      en: 'We draw a perpendicular from the point to the axis and count the same number of cells on the other side.',
    },
    note: {
      uz: "Yodda tuting: o'zaro simmetrik nuqtalar simmetriya o'qidan ayni bir xil masofada yotadi.",
      ru: 'Запомни: взаимно симметричные точки лежат на одинаковом расстоянии от оси симметрии.',
      en: 'Remember: mutually symmetric points lie at the same distance from the axis of symmetry.',
    },
    audio: {
      intro: {
        uz: [
          "Panelni katakli qog'ozga qo'yamiz. O'rtada simmetriya o'qi turibdi.",
          "A nuqta o'qdan uch katak chapda. Undan o'qqa tik yo'l chizamiz.",
          "Narigi tomonda ham xuddi shu tik yo'lda uch katak sanaymiz. A shtrix nuqtasi shu yerda.",
          "Yodda tuting: o'zaro simmetrik nuqtalar simmetriya o'qidan ayni bir xil masofada yotadi.",
        ],
        ru: [
          'Положим панель на клетчатую бумагу. Посередине стоит ось симметрии.',
          'Точка А на три клетки левее оси. Проведём от неё перпендикуляр к оси.',
          'По другую сторону на том же перпендикуляре отсчитаем три клетки. Там и стоит точка А штрих.',
          'Запомни: взаимно симметричные точки лежат на одинаковом расстоянии от оси симметрии.',
        ],
        en: [
          'Put the panel on squared paper. The axis of symmetry stands in the middle.',
          'Point A is three cells to the left of the axis. Draw a perpendicular from it to the axis.',
          'On the other side, along the same perpendicular, count three cells. Point A prime stands there.',
          'Remember: mutually symmetric points lie at the same distance from the axis of symmetry.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Aksni qo\'ying', ru: 'Поставь отражение', en: 'Place the reflection' },
    title: {
      uz: 'B nuqtaning aksi qayerda?',
      ru: 'Где отражение точки B?',
      en: 'Where is the reflection of point B?',
    },
    question: {
      uz: "B nuqta o'qdan 4 katak chapda. Aksi qaysi katakda turadi?",
      ru: 'Точка B на 4 клетки левее оси. В какой клетке стоит её отражение?',
      en: 'Point B is 4 cells to the left of the axis. In which cell does its reflection stand?',
    },
    token: "B'",
    slots: [
      { label: { uz: '2 katak', ru: '2 клетки', en: '2 cells' }, caption: { uz: "o'qdan", ru: 'от оси', en: 'from the axis' } },
      { label: { uz: '4 katak', ru: '4 клетки', en: '4 cells' }, caption: { uz: "o'qdan", ru: 'от оси', en: 'from the axis' } },
      { label: { uz: '6 katak', ru: '6 клеток', en: '6 cells' }, caption: { uz: "o'qdan", ru: 'от оси', en: 'from the axis' } },
    ],
    correctSlot: 1,
    correctText: {
      uz: "To'g'ri. B o'qdan to'rt katak chapda, aksi ham o'qdan to'rt katak o'ngda.",
      ru: 'Верно. B на четыре клетки левее оси, и отражение на четыре клетки правее оси.',
      en: 'Correct. B is four cells left of the axis, and its reflection is four cells right of the axis.',
    },
    wrong: [
      {
        uz: "Ikki katak — bu o'qdan panel chetigacha bo'lgan masofa. Bizga B nuqtadan o'qqacha masofa kerak.",
        ru: 'Две клетки — это расстояние от оси до края панели. А нужно расстояние от точки B до оси.',
        en: 'Two cells is the distance from the axis to the edge of the panel. We need the distance from point B to the axis.',
      },
      null,
      {
        uz: "Olti katak — bu B dan aksigacha bo'lgan butun yo'l emas. Har bir nuqta o'qdan to'rt katak narida turadi.",
        ru: 'Шесть клеток — это не то, что нужно: каждая точка стоит на четыре клетки от оси.',
        en: 'Six cells is not what we need: each point stands four cells from the axis.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Endi o'zingiz qo'yasiz. B nuqta o'qdan to'rt katak chapda turibdi.",
          "Uning aksi qaysi katakda bo'ladi? O'qdan sanang.",
          "Javobni tanlang.",
        ],
        ru: [
          'Теперь ставишь ты. Точка B стоит на четыре клетки левее оси.',
          'В какой клетке будет её отражение? Считай от оси.',
          'Выбери ответ.',
        ],
        en: [
          'Now it is your turn. Point B stands four cells to the left of the axis.',
          'In which cell will its reflection be? Count from the axis.',
          'Choose an answer.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Shaklni qurish', ru: 'Построение фигуры', en: 'Building the figure' },
    title: {
      uz: 'Uchlari bo\'yicha quramiz',
      ru: 'Строим по вершинам',
      en: 'We build it vertex by vertex',
    },
    lead: {
      uz: "Har bir uchni o'z masofasiga qo'yamiz, keyin ularni tutashtiramiz. Shakl o'zi chiqadi.",
      ru: 'Каждую вершину ставим на своё расстояние, затем соединяем. Фигура получается сама.',
      en: 'We place each vertex at its own distance, then join them. The figure appears on its own.',
    },
    question: {
      uz: "Belgilangan uchning aksi qaysi katakda? Uni bosing.",
      ru: 'В какой клетке отражение отмеченной вершины? Нажми на неё.',
      en: 'In which cell is the reflection of the marked vertex? Tap it.',
    },
    buildSteps: 3,
    correctText: {
      uz: "Uchta uch ham o'z joyiga tushdi va kvadrat tutashdi. Siz shaklni o'zingiz qurdingiz.",
      ru: 'Все три вершины встали на свои места, и квадрат замкнулся. Ты построил фигуру сам.',
      en: 'All three vertices landed in place and the square closed. You built the figure yourself.',
    },
    wrongText: {
      uz: "Bu katak emas. Belgilangan uchdan o'qqacha nechta katak borligini sanang va o'shancha katakni narigi tomonda oling.",
      ru: 'Не эта клетка. Сосчитай, сколько клеток от отмеченной вершины до оси, и отложи столько же по другую сторону.',
      en: 'Not that cell. Count the cells from the marked vertex to the axis and take the same number on the other side.',
    },
    note: {
      uz: "Bitta uch xato qo'yilsa, butun shakl qiyshayadi.",
      ru: 'Если одна вершина поставлена неверно, вся фигура перекосится.',
      en: 'If one vertex is placed wrongly, the whole figure goes crooked.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikdagi vazifa: chiziq simmetriya o'qi bo'lsa, kvadratga simmetrik kvadrat chizing.",
          "Butun kvadratni birdan ko'chirmaymiz. Avval bitta uchni olamiz va uni o'z masofasiga qo'yamiz. Mana shu birinchi uch.",
          "Endi navbat sizga. Qolgan uchta uchni o'zingiz qo'yasiz.",
          "Chapda qaysi uch yonib tursa, o'shaning aksini o'ng tomondagi katakdan toping va bosing. Uchtasi ham joyiga tushsa, kvadrat o'zi tutashadi.",
        ],
        ru: [
          'Задание из учебника. Если прямая является осью симметрии, начерти квадрат, симметричный данному.',
          'Не переносим весь квадрат сразу. Сначала берём одну вершину и ставим её на своё расстояние. Вот эта первая вершина.',
          'Теперь очередь за тобой. Остальные три вершины ты поставишь сам.',
          'Слева горит вершина: найди её отражение в клетке справа и нажми. Когда все три встанут на место, квадрат замкнётся сам.',
        ],
        en: [
          'A task from the textbook: if the line is an axis of symmetry, draw the square symmetric to the given one.',
          'We do not move the whole square at once. First we take one vertex and place it at its own distance. Here is that first vertex.',
          'Now it is your turn. You will place the other three vertices yourself.',
          'A vertex lights up on the left: find its reflection in a cell on the right and tap it. When all three are in place, the square closes on its own.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Aksni tanlang', ru: 'Выбери отражение', en: 'Choose the reflection' },
    title: {
      uz: 'Qaysi kvadrat to\'g\'ri aks?',
      ru: 'Какой квадрат — верное отражение?',
      en: 'Which square is the true reflection?',
    },
    question: {
      uz: "Chiziq simmetriya o'qi. Qaysi kvadrat unga nisbatan simmetrik?",
      ru: 'Прямая — ось симметрии. Какой квадрат симметричен относительно неё?',
      en: 'The line is the axis of symmetry. Which square is symmetric about it?',
    },
    options: [
      { uz: '1-kvadrat', ru: 'Квадрат 1', en: 'Square 1' },
      { uz: '2-kvadrat', ru: 'Квадрат 2', en: 'Square 2' },
      { uz: '3-kvadrat', ru: 'Квадрат 3', en: 'Square 3' },
      { uz: '4-kvadrat', ru: 'Квадрат 4', en: 'Square 4' },
    ],
    correctIndex: 2,
    correctText: {
      uz: "To'g'ri. Uchinchi kvadratning har bir uchi o'qdan xuddi shuncha katak narida turibdi.",
      ru: 'Верно. Каждая вершина третьего квадрата стоит на таком же расстоянии от оси.',
      en: 'Correct. Every vertex of the third square stands at the same distance from the axis.',
    },
    wrong: [
      {
        uz: "Birinchi kvadrat shunchaki o'ngga surilgan: o'qdan masofasi kattaroq bo'lib qolgan.",
        ru: 'Первый квадрат просто сдвинут вправо: расстояние до оси стало больше.',
        en: 'The first square is just slid to the right: its distance from the axis has grown.',
      },
      {
        uz: "Ikkinchi kvadrat o'qqa juda yaqin turibdi. Buklaganda u chapdagisidan kichik chiqadi.",
        ru: 'Второй квадрат стоит слишком близко к оси. При сгибе он не ляжет на левый.',
        en: 'The second square stands too close to the axis. After a fold it will not land on the left one.',
      },
      null,
      {
        uz: "To'rtinchi kvadrat burab qo'yilgan. Ko'zguda shakl burilmaydi, faqat tomoni almashadi.",
        ru: 'Четвёртый квадрат повёрнут. В зеркале фигура не поворачивается, меняется только сторона.',
        en: 'The fourth square is turned. In a mirror a figure is not turned, only its side changes.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Chapda kvadrat, o'rtada simmetriya o'qi. O'ngda to'rtta nomzod turibdi.",
          "Har bir nomzodning uchlarini o'qdan sanab ko'ring.",
          "Qaysi biri to'g'ri aks? Javobni tanlang.",
        ],
        ru: [
          'Слева квадрат, посередине ось симметрии. Справа стоят четыре кандидата.',
          'Отсчитай вершины каждого кандидата от оси.',
          'Какой из них верное отражение? Выбери ответ.',
        ],
        en: [
          'On the left there is a square, in the middle the axis of symmetry. Four candidates stand on the right.',
          'Count the vertices of each candidate from the axis.',
          'Which one is the true reflection? Choose an answer.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Burish simmetriyasi', ru: 'Поворотная симметрия', en: 'Rotational symmetry' },
    title: {
      uz: 'Burab tekshiramiz',
      ru: 'Проверяем поворотом',
      en: 'We check by turning',
    },
    lead: {
      uz: "Shaklni markazidan ushlab burasak, u bir aylanishda bir necha marta o'ziga mos tushishi mumkin.",
      ru: 'Если держать фигуру за центр и вращать, за один оборот она может несколько раз совпасть с собой.',
      en: 'If you hold a figure by its centre and turn it, in one full turn it can land on itself several times.',
    },
    note: {
      uz: 'Bir aylanish 360 daraja. Uchburchak uchun 360 : 3 = 120.',
      ru: 'Полный оборот — 360 градусов. Для треугольника 360 : 3 = 120.',
      en: 'A full turn is 360 degrees. For the triangle 360 : 3 = 120.',
    },
    audio: {
      intro: {
        uz: [
          "Ustaxonada dumaloq guldasta ham kesiladi. U bitta bargdan burish bilan quriladi.",
          "Avval oddiyroq shaklni sinaymiz. Teng tomonli uchburchakni markazidan ushlab buramiz.",
          "Bir marta to'liq aylantirguncha u uch marta dastlabki holatiga mos tushdi.",
          "Bir aylanish uch yuz oltmish daraja. Uni uchga bo'lsak, bir yuz yigirma chiqadi. Har bir yuz yigirma darajada shakl o'ziga tushadi.",
        ],
        ru: [
          'В мастерской режут и круглую розетку. Её строят из одного лепестка поворотом.',
          'Сначала проверим фигуру попроще. Возьмём равносторонний треугольник за центр и повернём.',
          'За один полный оборот он три раза совпал со своим начальным положением.',
          'Полный оборот равен трёмстам шестидесяти градусам. Разделим на три, получится сто двадцать. Каждые сто двадцать градусов фигура ложится на себя.',
        ],
        en: [
          'The workshop also cuts a round rosette. It is built from a single petal by turning.',
          'First let us test a simpler figure. Hold an equilateral triangle by its centre and turn it.',
          'In one full turn it matched its starting position three times.',
          'A full turn is three hundred and sixty degrees. Divide it by three and you get one hundred and twenty. Every one hundred and twenty degrees the figure lands on itself.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Guldasta', ru: 'Розетка', en: 'The rosette' },
    title: {
      uz: 'Necha marta mos tushadi?',
      ru: 'Сколько раз совпадёт?',
      en: 'How many times will it match?',
    },
    question: {
      uz: "To'rt bargli guldasta bir aylanishda necha marta o'ziga mos tushadi?",
      ru: 'Сколько раз розетка из четырёх лепестков совпадёт с собой за один оборот?',
      en: 'How many times does a four-petal rosette match itself in one full turn?',
    },
    options: [
      { uz: '2 marta', ru: '2 раза', en: '2 times' },
      { uz: '3 marta', ru: '3 раза', en: '3 times' },
      { uz: '4 marta', ru: '4 раза', en: '4 times' },
      { uz: '8 marta', ru: '8 раз', en: '8 times' },
    ],
    correctIndex: 2,
    correctText: {
      uz: "To'g'ri. To'rtta barg teng joylashgan, shuning uchun to'rt marta. Burish burchagi 360 : 4 = 90 daraja.",
      ru: 'Верно. Четыре лепестка расположены поровну, поэтому четыре раза. Угол поворота 360 : 4 = 90 градусов.',
      en: 'Correct. Four petals are placed evenly, so four times. The turn angle is 360 : 4 = 90 degrees.',
    },
    wrong: [
      {
        uz: "Ikki marta — bu yarim aylanish bilan sanalgan. Butun aylanishni oxirigacha kuzating.",
        ru: 'Два раза — это счёт по половине оборота. Досмотри оборот до конца.',
        en: 'Two times counts only half a turn. Follow the whole turn to the end.',
      },
      {
        uz: "Uch marta uchburchakda edi, unda uchta tomon bor. Bu yerda barglar to'rtta.",
        ru: 'Три раза было у треугольника, у него три стороны. Здесь лепестков четыре.',
        en: 'Three times belonged to the triangle with its three sides. Here there are four petals.',
      },
      null,
      {
        uz: "Sakkiz — barglar bilan ular orasidagi bo'shliqlar birga sanalgan. Faqat barglarni sanang.",
        ru: 'Восемь — это лепестки вместе с промежутками. Считай только лепестки.',
        en: 'Eight counts the petals together with the gaps. Count only the petals.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Oyna markaziga to'rt bargli guldasta qo'yiladi. Barglar teng joylashgan.",
          "Uni markazidan ushlab, sekin buramiz. Har mos tushganda belgi yonadi.",
          "Bir aylanishda u necha marta o'ziga mos tushadi? Javobni tanlang.",
        ],
        ru: [
          'В середину окна ставят розетку из четырёх лепестков. Лепестки расположены поровну.',
          'Возьмём её за центр и медленно повернём. При каждом совпадении загорается метка.',
          'Сколько раз за оборот она совпадёт с собой? Выбери ответ.',
        ],
        en: [
          'A four-petal rosette goes into the middle of the window. The petals are placed evenly.',
          'Hold it by the centre and turn it slowly. A marker lights up at every match.',
          'How many times will it match itself in one turn? Choose an answer.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Ikki tekshiruv', ru: 'Две проверки', en: 'Two checks' },
    title: {
      uz: 'O\'q bormi, burish bormi?',
      ru: 'Есть ось, есть поворот?',
      en: 'Is there an axis, is there a turn?',
    },
    lead: {
      uz: "Bu ikkisi har xil tekshiruv. Bir naqshda faqat bittasi bo'lishi ham mumkin.",
      ru: 'Это две разные проверки. В одном узоре может быть только одна из них.',
      en: 'These are two different checks. A pattern may have only one of them.',
    },
    note: {
      uz: "Shuning uchun har bir naqsh ikki tekshiruvdan alohida o'tadi.",
      ru: 'Поэтому каждый узор проходит обе проверки по отдельности.',
      en: 'That is why every pattern goes through both checks separately.',
    },
    audio: {
      intro: {
        uz: [
          "Uchta naqshni yonma-yon qo'yamiz va ikkala tekshiruvni o'tkazamiz.",
          "Birinchisi buklaganda mos tushdi, lekin burasak mos tushmadi. Unda faqat o'q bor.",
          "Ikkinchisi buklaganda mos tushmadi, burasak esa mos tushdi. Unda faqat burish bor.",
          "Uchinchisida ikkalasi ham bor. Demak, o'q borligidan burish bor degan xulosa chiqmaydi.",
        ],
        ru: [
          'Поставим рядом три узора и проведём обе проверки.',
          'Первый совпал при сгибе, но не совпал при повороте. У него есть только ось.',
          'Второй не совпал при сгибе, зато совпал при повороте. У него есть только поворот.',
          'У третьего есть и то, и другое. Значит, из наличия оси не следует наличие поворота.',
        ],
        en: [
          'Put three patterns side by side and run both checks.',
          'The first matched after a fold but not after a turn. It has only an axis.',
          'The second did not match after a fold, yet it matched after a turn. It has only a turn.',
          'The third has both. So having an axis does not mean having a turn.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Burish burchagi', ru: 'Угол поворота', en: 'The turn angle' },
    title: {
      uz: 'Burish burchagi qancha?',
      ru: 'Чему равен угол поворота?',
      en: 'What is the turn angle?',
    },
    question: {
      uz: "Olti bargli guldasta necha darajaga burilsa, o'ziga mos tushadi?",
      ru: 'На сколько градусов повернуть розетку из шести лепестков, чтобы она совпала с собой?',
      en: 'Through how many degrees must a six-petal rosette turn to land on itself?',
    },
    options: [
      { uz: '30 daraja', ru: '30 градусов', en: '30 degrees' },
      { uz: '60 daraja', ru: '60 градусов', en: '60 degrees' },
      { uz: '90 daraja', ru: '90 градусов', en: '90 degrees' },
      { uz: '360 daraja', ru: '360 градусов', en: '360 degrees' },
    ],
    correctIndex: 1,
    correctText: {
      uz: "To'g'ri. 360 : 6 = 60. Har oltmish darajada guldasta o'ziga mos tushadi.",
      ru: 'Верно. 360 : 6 = 60. Каждые шестьдесят градусов розетка ложится на себя.',
      en: 'Correct. 360 : 6 = 60. Every sixty degrees the rosette lands on itself.',
    },
    wrong: [
      {
        uz: "O'ttiz daraja — bu bitta bargning yarmi. Barg qo'shnisining o'rniga to'liq kelishi kerak.",
        ru: 'Тридцать градусов — это половина лепестка. Лепесток должен полностью встать на место соседнего.',
        en: 'Thirty degrees is half a petal. A petal has to land fully on the place of its neighbour.',
      },
      null,
      {
        uz: "To'qson daraja to'rt bargli guldastada edi. Bu yerda barglar oltita.",
        ru: 'Девяносто градусов было у розетки из четырёх лепестков. Здесь лепестков шесть.',
        en: 'Ninety degrees belonged to the four-petal rosette. Here there are six petals.',
      },
      {
        uz: "Uch yuz oltmish daraja — bu butun aylanish. Guldasta undan ancha oldin mos tushadi.",
        ru: 'Триста шестьдесят градусов — это целый оборот. Розетка совпадёт гораздо раньше.',
        en: 'Three hundred and sixty degrees is a whole turn. The rosette matches much earlier.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Katta guldastada olti barg bor. Ular ham teng joylashgan.",
          "Bir aylanishni barglar soniga bo'lamiz.",
          "Guldasta necha darajaga burilsa, o'ziga mos tushadi? Javobni tanlang.",
        ],
        ru: [
          'У большой розетки шесть лепестков. Они тоже расположены поровну.',
          'Разделим полный оборот на число лепестков.',
          'На сколько градусов повернуть розетку, чтобы она совпала с собой? Выбери ответ.',
        ],
        en: [
          'The large rosette has six petals. They are placed evenly as well.',
          'Divide the full turn by the number of petals.',
          'Through how many degrees must the rosette turn to land on itself? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Ikki qoida — ikki tekshiruv',
      ru: 'Два правила — две проверки',
      en: 'Two rules, two checks',
    },
    lead: {
      uz: 'Naqshni tekshirishda shu ikki qoidaga tayanamiz.',
      ru: 'При проверке узора опираемся на эти два правила.',
      en: 'When we check a pattern we rely on these two rules.',
    },
    audio: {
      intro: {
        uz: [
          "Endi qoidani yig'amiz. Birinchisi darslikdan.",
          "O'zaro simmetrik nuqtalar simmetriya o'qidan ayni bir xil masofada yotadi.",
          "Ikkinchisi burish uchun. Shakl bir aylanishda necha marta o'ziga mos tushsa, uch yuz oltmishni shu songa bo'lamiz. Chiqqan son burish burchagi bo'ladi.",
        ],
        ru: [
          'Теперь соберём правило. Первое взято из учебника.',
          'Взаимно симметричные точки лежат на одинаковом расстоянии от оси симметрии.',
          'Второе правило про поворот. Сколько раз фигура совпадает с собой за оборот, на столько и делим триста шестьдесят. Получится угол поворота.',
        ],
        en: [
          'Now let us put the rule together. The first one comes from the textbook.',
          'Mutually symmetric points lie at the same distance from the axis of symmetry.',
          'The second one is about turning. However many times a figure matches itself in one turn, divide three hundred and sixty by that number. The result is the turn angle.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Qaysi yo\'l tez?', ru: 'Какой путь быстрее?', en: 'Which way is quicker?' },
    title: {
      uz: 'Qaysi tekshiruv qulay?',
      ru: 'Какая проверка удобнее?',
      en: 'Which check is more convenient?',
    },
    question: {
      uz: 'Dumaloq guldasta uchun qaysi tekshiruv qulayroq?',
      ru: 'Какая проверка удобнее для круглой розетки?',
      en: 'Which check is more convenient for a round rosette?',
    },
    options: [
      { uz: 'Buklab tekshirish', ru: 'Проверка сгибом', en: 'Checking by folding' },
      { uz: 'Burab tekshirish', ru: 'Проверка поворотом', en: 'Checking by turning' },
      { uz: 'Ikkalasini ham qilish', ru: 'Сделать обе', en: 'Doing both' },
    ],
    correctIndex: 1,
    correctText: {
      uz: "To'g'ri. Guldasta bitta bargdan burish bilan qurilgan, shuning uchun burish bir qadamda javob beradi.",
      ru: 'Верно. Розетка построена из одного лепестка поворотом, поэтому поворот даёт ответ за один шаг.',
      en: 'Correct. The rosette is built from one petal by turning, so the turn gives the answer in a single step.',
    },
    wrong: [
      {
        uz: "Buklab ham topsa bo'ladi, lekin dumaloq naqshda o'qlar ko'p: har birini alohida sinash uzoq.",
        ru: 'Сгибом тоже можно, но у круглого узора осей много: проверять каждую долго.',
        en: 'Folding also works, but a round pattern has many axes: testing each one takes long.',
      },
      null,
      {
        uz: "Ikkala tekshiruv ham to'g'ri javob beradi. Lekin bu yerda bittasi yetadi, ish esa tezroq bitadi.",
        ru: 'Обе проверки дают верный ответ. Но здесь хватает одной, и работа идёт быстрее.',
        en: 'Both checks give the right answer. But here one is enough, and the work goes faster.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ustaxonada vaqt cheklangan. Har bir naqsh uchun bitta tekshiruv tanlanadi.",
          "Oldingizda dumaloq guldasta turibdi.",
          "Qaysi tekshiruv qulayroq? Javobni tanlang.",
        ],
        ru: [
          'Времени в мастерской немного. Для каждого узора выбирают одну проверку.',
          'Перед тобой круглая розетка.',
          'Какая проверка удобнее? Выбери ответ.',
        ],
        en: [
          'Time in the workshop is short. One check is chosen for each pattern.',
          'A round rosette is in front of you.',
          'Which check is more convenient? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Pasportda qaysi qator yolg\'on?',
      ru: 'Какая строка в паспорте ложна?',
      en: 'Which line of the passport is false?',
    },
    question: {
      uz: "Bit oyna pasportini to'ldirdi. Qaysi qator noto'g'ri?",
      ru: 'Bit заполнил паспорт окна. Какая строка неверна?',
      en: 'Bit filled in the window passport. Which line is wrong?',
    },
    passport: [
      { uz: "Panjara panelida bitta simmetriya o'qi bor.", ru: 'У панели решётки есть одна ось симметрии.', en: 'The lattice panel has one axis of symmetry.' },
      { uz: "O'qning ikki tomonidagi barglar o'qdan bir xil masofada.", ru: 'Листья по обе стороны оси на одинаковом расстоянии от неё.', en: 'The leaves on both sides of the axis are at the same distance from it.' },
      { uz: "Panelda o'q bor, demak burish simmetriyasi ham bor.", ru: 'У панели есть ось, значит есть и поворотная симметрия.', en: 'The panel has an axis, so it also has rotational symmetry.' },
      { uz: 'Guldasta olti marta mos tushadi, burish burchagi 60 daraja.', ru: 'Розетка совпадает шесть раз, угол поворота 60 градусов.', en: 'The rosette matches six times, the turn angle is 60 degrees.' },
    ],
    options: [
      { uz: '1-qator', ru: 'Строка 1', en: 'Line 1' },
      { uz: '2-qator', ru: 'Строка 2', en: 'Line 2' },
      { uz: '3-qator', ru: 'Строка 3', en: 'Line 3' },
      { uz: '4-qator', ru: 'Строка 4', en: 'Line 4' },
    ],
    correctIndex: 2,
    correctText: {
      uz: "To'g'ri. O'q borligidan burish kelib chiqmaydi. Panelni burasak, barglar o'z o'rniga tushmaydi.",
      ru: 'Верно. Из наличия оси поворот не следует. Если повернуть панель, листья не встанут на свои места.',
      en: 'Correct. A turn does not follow from an axis. If you turn the panel, the leaves do not land on their places.',
    },
    wrong: [
      {
        uz: "Birinchi qator to'g'ri: panelni o'rtasidan buklasak, yarimlar mos tushadi.",
        ru: 'Первая строка верна: если сложить панель посередине, половины совпадут.',
        en: 'The first line is right: fold the panel in the middle and the halves match.',
      },
      {
        uz: "Ikkinchi qator to'g'ri: bu darslikdagi qoidaning o'zi.",
        ru: 'Вторая строка верна: это и есть правило из учебника.',
        en: 'The second line is right: it is the rule from the textbook itself.',
      },
      null,
      {
        uz: "To'rtinchi qator to'g'ri: uch yuz oltmishni oltiga bo'lsak, oltmish chiqadi.",
        ru: 'Четвёртая строка верна: триста шестьдесят разделить на шесть — шестьдесят.',
        en: 'The fourth line is right: three hundred and sixty divided by six is sixty.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Ish tugadi, Bit oyna pasportini to'ldirdi. To'rtta qatordan bittasi yolg'on.",
          "Har bir qatorni oynaning o'zi bilan solishtiring.",
          "Qaysi qator noto'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Работа закончена, Bit заполнил паспорт окна. Одна из четырёх строк ложна.',
          'Сверь каждую строку с самим окном.',
          'Какая строка неверна? Выбери ответ.',
        ],
        en: [
          'The work is done and Bit filled in the window passport. One of the four lines is false.',
          'Check every line against the window itself.',
          'Which line is wrong? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Qaysi panel oynaga tushadi?',
      ru: 'Какая панель встанет в окно?',
      en: 'Which panel goes into the window?',
    },
    question: {
      uz: 'Dastgoh bitta ko\'zgu bilan qaysi panelni kesa oladi?',
      ru: 'Какую панель станок вырежет одним зеркальным проходом?',
      en: 'Which panel can the cutter make with a single mirror pass?',
    },
    options: [
      { uz: '1-panel', ru: 'Панель 1', en: 'Panel 1' },
      { uz: '2-panel', ru: 'Панель 2', en: 'Panel 2' },
      { uz: '3-panel', ru: 'Панель 3', en: 'Panel 3' },
    ],
    correctIndex: 2,
    correctText: {
      uz: "To'g'ri. Uchinchi panelda o'q bor, shuning uchun yarmi kesiladi va qolgani ko'zgu bilan chiqadi. Oyna joyiga tushdi va chok qovushdi.",
      ru: 'Верно. У третьей панели есть ось, поэтому режут половину, а остальное даёт зеркало. Окно встало на место, и стык сошёлся.',
      en: 'Correct. The third panel has an axis, so half is cut and the mirror gives the rest. The window is in place and the seam meets.',
    },
    wrong: [
      {
        uz: "Birinchi panelda o'q yo'q: uni butunlay kesishga to'g'ri keladi.",
        ru: 'У первой панели нет оси: её пришлось бы резать целиком.',
        en: 'The first panel has no axis: it would have to be cut whole.',
      },
      {
        uz: "Ikkinchi panelda burish bor, lekin o'q yo'q. Ko'zgu bu yerda yordam bermaydi.",
        ru: 'У второй панели есть поворот, но нет оси. Зеркало здесь не поможет.',
        en: 'The second panel has a turn but no axis. The mirror does not help here.',
      },
      null,
    ],
    audio: {
      intro: {
        uz: [
          "Bekat uchun uchta tayyor panel qoldi. Dastgoh vaqti oz.",
          "Bitta ko'zgu bilan kesish uchun panelda simmetriya o'qi bo'lishi kerak.",
          "Qaysi panel tanlanadi? Javobni tanlang.",
        ],
        ru: [
          'Для станции осталось три готовые панели. Времени у станка мало.',
          'Чтобы вырезать одним зеркальным проходом, у панели должна быть ось симметрии.',
          'Какую панель выберут? Выбери ответ.',
        ],
        en: [
          'Three finished panels are left for the station. The cutter has little time.',
          'To cut with a single mirror pass, the panel needs an axis of symmetry.',
          'Which panel will be chosen? Choose an answer.',
        ],
      },
    },
  },

  s15: {
    eyebrow: { uz: 'Mukofot', ru: 'Награда', en: 'Reward' },
    stageLabel: { uz: 'YAKUNIY BOSQICH', ru: 'ФИНАЛЬНЫЙ ЭТАП', en: 'FINAL STAGE' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: "Qoidani tanlang va simmetriyani tushunganingizni ko'rsating.",
      ru: 'Выбери правило и покажи, что понимаешь симметрию.',
      en: 'Choose the rule and show that you understand symmetry.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Qaysi qoida simmetriya o\'qini to\'g\'ri tasvirlaydi?',
      ru: 'Какое правило верно описывает ось симметрии?',
      en: 'Which rule correctly describes the axis of symmetry?',
    },
    reflectionStart: {
      uz: "Bitta javobni tanlang: aks nuqta qayerda turadi?",
      ru: 'Выбери один ответ: где стоит симметричная точка?',
      en: 'Choose one answer: where does the symmetric point stand?',
    },
    reflectionOptions: [
      { uz: "O'qdan xuddi shuncha masofada, narigi tomonda", ru: 'На таком же расстоянии от оси, по другую сторону', en: 'At the same distance from the axis, on the other side' },
      { uz: "O'qning yonida, masofa muhim emas", ru: 'Рядом с осью, расстояние не важно', en: 'Next to the axis, the distance does not matter' },
      { uz: 'Panel chetidan xuddi shuncha masofada', ru: 'На таком же расстоянии от края панели', en: 'At the same distance from the edge of the panel' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "Shunday. Masofa har doim o'qdan o'lchanadi, panel chetidan emas.",
      ru: 'Именно так. Расстояние всегда отмеряют от оси, а не от края панели.',
      en: 'Exactly. The distance is always measured from the axis, not from the edge of the panel.',
    },
    reflectionWrong: {
      uz: "Hali emas. Buklash chizig'ini eslang: nuqta va uning aksi shu chiziqdan teng uzoqlikda.",
      ru: 'Пока нет. Вспомни линию сгиба: точка и её отражение одинаково удалены от неё.',
      en: 'Not yet. Remember the fold line: a point and its reflection are equally far from it.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Darsning ikki qoidasi', ru: 'Два правила урока', en: 'The two rules of the lesson' },
    main: [
      { uz: "O'zaro simmetrik nuqtalar o'qdan bir xil masofada yotadi.", ru: 'Взаимно симметричные точки лежат на одинаковом расстоянии от оси.', en: 'Mutually symmetric points lie at the same distance from the axis.' },
      { uz: 'Shaklni uchlari bo\'yicha quramiz, keyin tutashtiramiz.', ru: 'Фигуру строим по вершинам, затем соединяем.', en: 'We build a figure vertex by vertex, then join them.' },
      { uz: "Shakl n marta mos tushsa, burish burchagi 360 : n.", ru: 'Если фигура совпадает n раз, угол поворота равен 360 : n.', en: 'If a figure matches n times, the turn angle is 360 : n.' },
      { uz: "O'q borligidan burish simmetriyasi kelib chiqmaydi.", ru: 'Из наличия оси поворотная симметрия не следует.', en: 'Rotational symmetry does not follow from having an axis.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Naqsh ustasi', ru: 'Мастер орнамента', en: 'Pattern master' },
        text: { uz: "Barcha oltita vazifa birinchi urinishda yechildi.", ru: 'Все шесть заданий решены с первой попытки.', en: 'All six tasks were solved on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: 'Panjara chizmachisi', ru: 'Чертёжник решётки', en: 'Lattice draughtsman' },
        text: { uz: "Siz o'q va burishni ishonchli ajratasiz.", ru: 'Ты уверенно различаешь ось и поворот.', en: 'You can tell an axis from a turn with confidence.' },
      },
      {
        min: 0,
        title: { uz: 'Ustaxona shogirdi', ru: 'Подмастерье мастерской', en: 'Workshop apprentice' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Oyna tasdiqlandi. Buyurtmada panellar soni muhr ostida qoldi — boshqaruv markazi noma'lum sonni topishni so'raydi.",
      ru: 'Окно утверждено. В заказе число панелей осталось под пломбой — центр управления просит найти неизвестное.',
      en: 'The window is approved. In the order the number of panels is still sealed, and the control centre asks you to find the unknown.',
    },
    audio: {
      intro: {
        uz: [
          "Panjara-oyna bekat devoriga o'rnatildi. Chok qovushdi, naqsh yopildi.",
          "Endi bitta savol qoldi. Qoidani tanlang va unvonni oling.",
          "Aks nuqta qayerda turadi? Javobni tanlang.",
        ],
        ru: [
          'Решётчатое окно установили в стену станции. Стык сошёлся, узор закрылся.',
          'Остался один вопрос. Выбери правило и получи звание.',
          'Где стоит симметричная точка? Выбери ответ.',
        ],
        en: [
          'The lattice window has been set into the wall of the station. The seam met and the pattern closed.',
          'One question is left. Choose the rule and claim your title.',
          'Where does the symmetric point stand? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Naqsh motivi ataylab NOSIMMETRIK (barg bir tomonga qaraydi): faqat shunda
// nusxa bilan ko'zgu ko'z bilan farqlanadi. Animatsiya faqat matematik holat
// o'zgarishini ko'rsatadi: o'q paydo bo'ladi, aks o'z masofasiga tushadi,
// guldasta bir qadam buriladi. Bezak uchun harakat yo'q.
// ---------------------------------------------------------------------------
const WOOD = '#B5813F';
const WOOD_DARK = '#6B451F';
const WOOD_LIGHT = '#F0DFC0';
const GLASS = '#EAF4F0';

// Bitta o'yma barg (islimi naqshi). dir = 1 o'ngga qaraydi, dir = -1 chapga.
// Shakl ataylab nosimmetrik: nusxa va ko'zgu ko'z bilan darrov ajraladi.
const Leaf = ({ x, y, s = 1, dir = 1, tone = WOOD, muted = false }) => (
  <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`} opacity={muted ? 0.4 : 1}>
    <path
      d="M-16 1 C-16 -9 -9 -15 -1 -13 C4 -12 9 -8 17 0 C9 8 4 12 -1 13 C-9 15 -16 9 -16 1 Z"
      fill={tone}
      stroke={WOOD_DARK}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M-11 0 C-5 -3 3 -2 12 0" fill="none" stroke={WOOD_LIGHT} strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="-8" cy="0" r="2.6" fill={WOOD_LIGHT} />
  </g>
);

// Yog'och ramka, shisha va panjara chiviqlari. Chiviqlar naqshni ushlab
// turadi va panelga haqiqiy panjara ko'rinishini beradi.
const PanelBox = ({ x, y, w, h, glass = GLASS, stroke = WOOD_DARK, width = 3, bars = true }) => {
  const inset = 10;
  const cols = 3;
  const rows = 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={glass} />
      {bars && (
        <g opacity="0.5">
          {Array.from({ length: cols - 1 }, (_, index) => (
            <line
              key={`bv${index}`}
              x1={x + (w * (index + 1)) / cols}
              y1={y + inset}
              x2={x + (w * (index + 1)) / cols}
              y2={y + h - inset}
              stroke={WOOD}
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          ))}
          {Array.from({ length: rows - 1 }, (_, index) => (
            <line
              key={`bh${index}`}
              x1={x + inset}
              y1={y + (h * (index + 1)) / rows}
              x2={x + w - inset}
              y2={y + (h * (index + 1)) / rows}
              stroke={WOOD}
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          ))}
        </g>
      )}
      <rect x={x} y={y} width={w} height={h} rx="10" fill="none" stroke={stroke} strokeWidth={width} />
    </g>
  );
};

const AxisLine = ({ x, y1, y2, tone = T.accent, dash = '7 6' }) => (
  <line x1={x} y1={y1} x2={x} y2={y2} stroke={tone} strokeWidth="2.4" strokeDasharray={dash} strokeLinecap="round" />
);

// s0 va s14 fon: bekat panjara-oynasi. `mirrored` — o'ng yarim ko'zgu bo'lsa.
const LatticeWindow = ({ mirrored }) => {
  const t = useT();
  const seam = 450;
  const rows = [112, 196];
  const leftCols = [160, 262, 364];
  const rightCols = [536, 638, 740];
  return (
    <FitSvg viewBox="0 0 900 300">
      <defs>
        <linearGradient id="d41glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123246" />
          <stop offset="100%" stopColor="#0A2233" />
        </linearGradient>
      </defs>
      <rect x="34" y="26" width="832" height="248" rx="18" fill="url(#d41glass)" stroke={WOOD} strokeWidth="7" />
      <rect x="46" y="38" width="808" height="224" rx="12" fill="none" stroke="rgba(144,228,235,.22)" strokeWidth="2" />

      {/* panjara chiviqlari: naqsh ular ustiga o'rnatiladi */}
      <g opacity="0.42">
        {[211, 313, 415, 485, 587, 689].map((x) => (
          <line key={`bv${x}`} x1={x} y1="52" x2={x} y2="248" stroke={WOOD} strokeWidth="4" strokeLinecap="round" />
        ))}
        {[154].map((y) => (
          <line key={`bh${y}`} x1="60" y1={y} x2="840" y2={y} stroke={WOOD} strokeWidth="4" strokeLinecap="round" />
        ))}
      </g>

      {rows.map((y) => (
        <g key={`row-${y}`}>
          {leftCols.map((x) => <Leaf key={`l-${x}-${y}`} x={x} y={y} dir={1} s={1.12} />)}
          {rightCols.map((x) => <Leaf key={`r-${x}-${y}`} x={x} y={y} dir={mirrored ? -1 : 1} s={1.12} />)}
        </g>
      ))}

      <AxisLine x={seam} y1="46" y2="254" tone={mirrored ? T.lime : T.accent} />
      <circle cx={seam} cy="150" r="9" fill={mirrored ? T.lime : T.accent} opacity="0.9" />
      <text x={seam} y="288" textAnchor="middle" fill={mirrored ? T.lime : '#FFB39B'} fontSize="15" fontWeight="800" fontFamily="Manrope, sans-serif">
        {mirrored
          ? t({ uz: 'chok qovushdi', ru: 'стык сошёлся', en: 'the seam meets' })
          : t({ uz: 'chok qovushmadi', ru: 'стык не сошёлся', en: 'the seam does not meet' })}
      </text>
    </FitSvg>
  );
};

// s1: buklash. Kadr 0 panel, 1 o'q, 2 to'g'ri o'qda mos tushdi, 3 boshqa
// chiziqda mos tushmadi. Ko'zgu haqiqiy: matrix(-1 0 0 1 2a 0).
const FoldPanel = ({ frame }) => {
  const t = useT();
  const axis = frame >= 3 ? 386 : 310;
  const ok = frame === 2;
  const bad = frame >= 3;
  const rows = [96, 174];
  const left = [222, 272];
  const right = [348, 398];
  return (
    <FitSvg viewBox="0 0 620 250">
      <PanelBox x={150} y={46} w={320} h={164} />
      {rows.map((y) => (
        <g key={y}>
          {left.map((x) => <Leaf key={`l${x}${y}`} x={x} y={y} dir={1} s={0.78} />)}
          {right.map((x) => <Leaf key={`r${x}${y}`} x={x} y={y} dir={-1} s={0.78} />)}
        </g>
      ))}

      {frame >= 1 && <AxisLine x={axis} y1="40" y2="216" tone={bad ? T.warn : T.cyan} />}

      {frame >= 2 && (
        <g transform={`matrix(-1 0 0 1 ${2 * axis} 0)`} opacity="0.85">
          {rows.map((y) => right.map((x) => (
            <Leaf key={`m${x}${y}`} x={x} y={y} dir={-1} s={0.78} tone={bad ? '#E9C08F' : '#8FD3B5'} />
          )))}
        </g>
      )}

      {frame >= 2 && (
        <g>
          <rect x="176" y="222" width="268" height="24" rx="12" fill={ok ? T.successSoft : T.warnSoft} />
          <text x="310" y="239" textAnchor="middle" fill={ok ? T.success : T.warn} fontSize="13" fontWeight="800" fontFamily="Manrope, sans-serif">
            {ok
              ? t({ uz: "ustma-ust tushdi — bu o'q", ru: 'совпало — это ось', en: 'they match — this is an axis' })
              : t({ uz: "mos tushmadi — o'q emas", ru: 'не совпало — не ось', en: 'no match — not an axis' })}
          </text>
        </g>
      )}
    </FitSvg>
  );
};

// Bitta panel: `kind` naqsh turini beradi.
//   mirror — o'qqa nisbatan simmetrik
//   copy   — o'ng yarim ko'chirma
//   shift  — o'ng yarim pastga siljigan
//   spin   — parrakcha (burish bor, o'q yo'q)
//   plain  — tartibsiz (ikkalasi ham yo'q)
const PatternPanel = ({ x, y, w, h, kind, state = 'idle', label, bare = false }) => {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const dx = w * 0.19;
  const dy = h * 0.19;
  const tone = state === 'right' ? T.success : state === 'wrong' ? T.accent : WOOD_DARK;
  const glass = state === 'right' ? '#EAF6EF' : state === 'wrong' ? '#FDECE6' : GLASS;
  const s = Math.min(w, h) / 210;
  const leaves = [];
  if (kind === 'spin') {
    [0, 90, 180, 270].forEach((a) => leaves.push({ x: cx, y: cy, dir: 1, rot: a, off: dx }));
  } else if (kind === 'plain') {
    leaves.push({ x: cx - dx, y: cy - dy, dir: 1 }, { x: cx + dx, y: cy - dy, dir: 1 },
      { x: cx - dx * 0.2, y: cy + dy, dir: -1 });
  } else {
    const rightDir = kind === 'mirror' || kind === 'shift' ? -1 : 1;
    const drop = kind === 'shift' ? dy * 0.55 : 0;
    leaves.push({ x: cx - dx, y: cy - dy, dir: 1 }, { x: cx - dx, y: cy + dy, dir: 1 },
      { x: cx + dx, y: cy - dy + drop, dir: rightDir }, { x: cx + dx, y: cy + dy + drop, dir: rightDir });
  }
  return (
    <g>
      {!bare && <PanelBox x={x} y={y} w={w} h={h} glass={glass} stroke={tone} width={state === 'idle' ? 3 : 4} />}
      {kind !== 'spin' && kind !== 'plain' && <AxisLine x={cx} y1={y + 10} y2={y + h - 10} tone={T.cyan} />}
      {leaves.map((leaf, index) => (leaf.rot !== undefined
        ? (
          <g key={index} transform={`rotate(${leaf.rot} ${cx} ${cy})`}>
            <Leaf x={cx + leaf.off} y={cy} dir={1} s={s * 0.72} />
          </g>
        )
        : <Leaf key={index} x={leaf.x} y={leaf.y} dir={leaf.dir} s={s * 0.72} />))}
      {label && (
        <text x={cx} y={y + h + 24} textAnchor="middle" fill={tone} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {label}
        </text>
      )}
    </g>
  );
};

// s2 va s14: uchta bir xil o'lchamli ramka, markazda.
const PanelRow = ({ kinds, picked, solved, correctIndex }) => {
  const w = 226;
  const h = 238;
  const gap = 26;
  const total = kinds.length * w + (kinds.length - 1) * gap;
  const x0 = (780 - total) / 2;
  return (
    <FitSvg viewBox="0 0 780 300">
      {kinds.map((kind, index) => {
        const state = solved && index === correctIndex
          ? 'right'
          : picked === index && !solved ? 'wrong' : 'idle';
        return (
          <PatternPanel
            key={kind + index}
            x={x0 + index * (w + gap)}
            y={14}
            w={w}
            h={h}
            kind={kind}
            state={state}
            label={String(index + 1)}
          />
        );
      })}
    </FitSvg>
  );
};

// Katakli maydon: o'q, nuqta va uning aksi.
const CELL = 26;
const GX = 62;
const GY = 30;
const gx = (col) => GX + col * CELL;
const gy = (row) => GY + row * CELL;
const AXIS_COL = 10;

const GridBase = ({ cols = 20, rows = 7 }) => (
  <g>
    <rect x={GX} y={GY} width={cols * CELL} height={rows * CELL} rx="8" fill="#FBFDF7" stroke="rgba(23,59,82,.12)" strokeWidth="1.5" />
    {Array.from({ length: cols + 1 }, (_, index) => (
      <line key={`v${index}`} x1={gx(index)} y1={GY} x2={gx(index)} y2={gy(rows)} stroke="rgba(23,59,82,.10)" strokeWidth="1" />
    ))}
    {Array.from({ length: rows + 1 }, (_, index) => (
      <line key={`h${index}`} x1={GX} y1={gy(index)} x2={gx(cols)} y2={gy(index)} stroke="rgba(23,59,82,.10)" strokeWidth="1" />
    ))}
  </g>
);

const Dot = ({ col, row, tone, name, ghost = false }) => (
  <g>
    <circle cx={gx(col)} cy={gy(row)} r="7.5" fill={ghost ? 'none' : tone} stroke={tone} strokeWidth="2.4" strokeDasharray={ghost ? '4 4' : undefined} />
    {name && (
      <text x={gx(col)} y={gy(row) - 14} textAnchor="middle" fill={tone} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {name}
      </text>
    )}
  </g>
);

const Span = ({ fromCol, toCol, row, tone, text }) => (
  <g>
    <line x1={gx(fromCol)} y1={gy(row)} x2={gx(toCol)} y2={gy(row)} stroke={tone} strokeWidth="2" strokeDasharray="5 4" />
    <text x={(gx(fromCol) + gx(toCol)) / 2} y={gy(row) + 22} textAnchor="middle" fill={tone} fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">
      {text}
    </text>
  </g>
);

// s3: masofa qoidasi.
const AxisGrid = ({ frame }) => {
  const t = useT();
  const row = 3;
  return (
    <FitSvg viewBox="0 0 640 250">
      <GridBase />
      <AxisLine x={gx(AXIS_COL)} y1={GY - 6} y2={gy(7) + 6} />
      <text x={gx(AXIS_COL)} y={GY - 12} textAnchor="middle" fill={T.accent} fontSize="12" fontWeight="800" fontFamily="Manrope, sans-serif">
        {t({ uz: "simmetriya o'qi", ru: 'ось симметрии', en: 'axis of symmetry' })}
      </text>
      {frame >= 1 && <Dot col={7} row={row} tone={T.cyan} name="A" />}
      {frame >= 1 && <Span fromCol={7} toCol={AXIS_COL} row={row} tone={T.cyan} text="3" />}
      {frame >= 2 && <Span fromCol={AXIS_COL} toCol={13} row={row} tone={T.success} text="3" />}
      {frame >= 2 && <Dot col={13} row={row} tone={T.success} name="A'" />}
      {frame >= 3 && (
        <text x="320" y="240" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="750" fontFamily="Manrope, sans-serif">
          {t({ uz: "o'qdan chapga 3, o'ngga ham 3", ru: 'от оси влево 3 и вправо тоже 3', en: 'three left of the axis and three right' })}
        </text>
      )}
    </FitSvg>
  );
};

// s4: aksni o'z katagiga qo'yish. `picked` — tanlangan slot.
const AxisPlace = ({ solved, picked }) => {
  const t = useT();
  const row = 3;
  const cols = [12, 14, 16];
  return (
    <FitSvg viewBox="0 0 640 250">
      <GridBase />
      <AxisLine x={gx(AXIS_COL)} y1={GY - 6} y2={gy(7) + 6} />
      <Dot col={6} row={row} tone={T.cyan} name="B" />
      <Span fromCol={6} toCol={AXIS_COL} row={row} tone={T.cyan} text="4" />
      {cols.map((col, index) => {
        const chosen = picked === index;
        const right = solved && index === 1;
        const tone = right ? T.success : chosen ? T.accent : T.ink3;
        return <Dot key={col} col={col} row={row} tone={tone} ghost={!chosen && !right} name={right ? "B'" : null} />;
      })}
      {solved && <Span fromCol={AXIS_COL} toCol={14} row={row} tone={T.success} text="4" />}
      <text x="320" y="240" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: "masofa o'qdan sanaladi", ru: 'расстояние считают от оси', en: 'the distance is counted from the axis' })}
      </text>
    </FitSvg>
  );
};

const SQ = { c1: 4, c2: 8, r1: 1, r2: 4 };
const mirrorCol = (col) => 2 * AXIS_COL - col;

// s5 — ikki qadamli ekran (metodist qarori 2026-08-19).
//   1-qadam: ovoz bilan birinchi uch ko'zguga qanday o'tishi ko'rsatiladi.
//   2-qadam: qolgan uchta uchni BOLA O'ZI qo'yadi — katakli maydonning o'ng
//            yarmi tegiladigan bo'ladi, faol uch chapda yonib turadi.
// Hamma uch qo'yilgach kvadrat o'zi tutashadi.
const MIRROR_DEMO = [SQ.c1, SQ.r1];
const MIRROR_TARGETS = [[SQ.c2, SQ.r1], [SQ.c2, SQ.r2], [SQ.c1, SQ.r2]];
const HOT_COLS = [11, 12, 13, 14, 15, 16, 17, 18, 19];
const HOT_ROWS = [0, 1, 2, 3, 4, 5, 6];

const MirrorBuild = ({ frame, placed, done, canPlace, onPick }) => {
  const t = useT();
  const corners = [[SQ.c1, SQ.r1], [SQ.c2, SQ.r1], [SQ.c2, SQ.r2], [SQ.c1, SQ.r2]];
  const placedSet = placed ?? new Set();
  const showDemo = frame >= 1 || canPlace;
  const activeIndex = Math.min(placedSet.size, MIRROR_TARGETS.length - 1);
  const [aCol, aRow] = MIRROR_TARGETS[activeIndex];
  const live = canPlace && !done;
  const points = corners.map(([col, row]) => `${gx(mirrorCol(col))},${gy(row)}`).join(' ');
  return (
    <FitSvg viewBox="0 0 640 250">
      <GridBase />
      <AxisLine x={gx(AXIS_COL)} y1={GY - 6} y2={gy(7) + 6} />
      <polygon
        points={corners.map(([col, row]) => `${gx(col)},${gy(row)}`).join(' ')}
        fill="rgba(149,201,61,.18)"
        stroke={T.cyan}
        strokeWidth="2.6"
      />

      {/* 1-qadam: namuna uch. Chapdagi manba uch ham nuqta bilan belgilanadi —
          bola qaysi uch ko'chirilayotganini ko'rib turadi. */}
      {showDemo && (
        <g>
          <line
            x1={gx(MIRROR_DEMO[0])}
            y1={gy(MIRROR_DEMO[1])}
            x2={gx(mirrorCol(MIRROR_DEMO[0]))}
            y2={gy(MIRROR_DEMO[1])}
            stroke={T.success}
            strokeWidth="1.6"
            strokeDasharray="4 4"
          />
          <Dot col={MIRROR_DEMO[0]} row={MIRROR_DEMO[1]} tone={T.cyan} />
          <Dot col={mirrorCol(MIRROR_DEMO[0])} row={MIRROR_DEMO[1]} tone={T.success} />
        </g>
      )}

      {/* 2-qadam: bola qo'ygan uchlar — chapdagi juftligi bilan birga */}
      {MIRROR_TARGETS.map(([col, row], index) => (placedSet.has(`${col},${row}`) ? (
        <g key={`p${index}`}>
          <line x1={gx(col)} y1={gy(row)} x2={gx(mirrorCol(col))} y2={gy(row)} stroke={T.success} strokeWidth="1.6" strokeDasharray="4 4" />
          <Dot col={col} row={row} tone={T.cyan} />
          <Dot col={mirrorCol(col)} row={row} tone={T.success} />
        </g>
      ) : null))}

      {done && <polygon points={points} fill="rgba(34,122,83,.16)" stroke={T.success} strokeWidth="2.6" />}

      {/* faol uch va tegiladigan kataklar */}
      {live && (
        <g>
          {/* Faol uch chapda: to'ldirilgan nuqta + halqa. */}
          <Dot col={aCol} row={aRow} tone={T.accent} />
          <circle cx={gx(aCol)} cy={gy(aRow)} r="12" fill="none" stroke={T.accent} strokeWidth="2.2" opacity="0.55" />
          <line x1={gx(aCol)} y1={gy(aRow)} x2={gx(AXIS_COL)} y2={gy(aRow)} stroke={T.accent} strokeWidth="1.6" strokeDasharray="4 4" />
          {/* Tegiladigan zona ko'rinmaydi: ortiqcha katak chizilmaydi,
              maydonning o'z panjarasi yetarli (metodist qarori). */}
          {HOT_ROWS.map((row) => HOT_COLS.map((col) => (
            <rect
              key={`h${col}-${row}`}
              x={gx(col) - CELL / 2}
              y={gy(row) - CELL / 2}
              width={CELL}
              height={CELL}
              fill="transparent"
              stroke="none"
              style={{ cursor: 'pointer' }}
              onClick={() => onPick(col === mirrorCol(aCol) && row === aRow, `${aCol},${aRow}`)}
            />
          )))}
        </g>
      )}

      <text x="320" y="240" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="750" fontFamily="Manrope, sans-serif">
        {done
          ? t({ uz: 'uchlar tutashdi — kvadrat tayyor', ru: 'вершины соединились — квадрат готов', en: 'the vertices joined — the square is ready' })
          : live
            ? t({ uz: "belgilangan uchning aksini bosing", ru: 'нажми клетку отражения отмеченной вершины', en: 'tap the cell where the marked vertex is reflected' })
            : t({ uz: "har uch — o'z masofasiga", ru: 'каждая вершина — на своё расстояние', en: 'each vertex to its own distance' })}
      </text>
    </FitSvg>
  );
};

// s6: to'rtta bir xil ramka, har birida o'q, asl kvadrat va nomzod.
const MIRROR_CANDIDATES = [
  { shift: 2, drop: 0, turn: 0 },
  { shift: -2, drop: 0, turn: 0 },
  { shift: 0, drop: 0, turn: 0 },
  { shift: 0, drop: 0, turn: 38 },
];

const MirrorChoice = ({ picked, solved, correctIndex }) => {
  const w = 182;
  const h = 232;
  const gap = 14;
  const total = 4 * w + 3 * gap;
  const x0 = (800 - total) / 2;
  const cell = 15;
  return (
    <FitSvg viewBox="0 0 800 300">
      {MIRROR_CANDIDATES.map((cand, index) => {
        const state = solved && index === correctIndex
          ? 'right'
          : picked === index && !solved ? 'wrong' : 'idle';
        const tone = state === 'right' ? T.success : state === 'wrong' ? T.accent : WOOD_DARK;
        const glass = state === 'right' ? '#EAF6EF' : state === 'wrong' ? '#FDECE6' : GLASS;
        const x = x0 + index * (w + gap);
        const ax = x + w / 2;
        const top = 32;
        const src = [[-4, 0], [-1.6, 0], [-1.6, 2.4], [-4, 2.4]];
        const dst = src.map(([cx, cy]) => [-cx + cand.shift, cy + cand.drop]);
        const toPt = ([cx, cy]) => `${ax + cx * cell},${top + 44 + cy * cell}`;
        const cxm = dst.reduce((sum, p) => sum + p[0], 0) / 4;
        const cym = dst.reduce((sum, p) => sum + p[1], 0) / 4;
        return (
          <g key={index}>
            <PanelBox x={x} y={top} w={w} h={h} glass={glass} stroke={tone} width={state === 'idle' ? 2.6 : 4} bars={false} />
            <AxisLine x={ax} y1={top + 10} y2={top + h - 10} tone={T.cyan} />
            <polygon points={src.map(toPt).join(' ')} fill="rgba(23,59,82,.10)" stroke={T.ink3} strokeWidth="2" />
            <g transform={cand.turn ? `rotate(${cand.turn} ${ax + cxm * cell} ${top + 44 + cym * cell})` : undefined}>
              <polygon points={dst.map(toPt).join(' ')} fill="rgba(255,91,53,.14)" stroke={T.accent} strokeWidth="2.4" />
            </g>
            <text x={ax} y={top + h + 22} textAnchor="middle" fill={tone} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {index + 1}
            </text>
          </g>
        );
      })}
    </FitSvg>
  );
};

// s7, s8, s10: burish. `n` — bir aylanishdagi mos tushishlar soni.
// Burish silliq va AYLANA ICHIDA bo'ladi (metodist qarori 2026-08-19):
//   * shakl aylananing ichiga qirqiladi (clipPath) va radiusi halqadan kichik —
//     hech qachon halqadan chiqmaydi;
//   * burilish qadam-baqadam, har qadam CSS transition bilan silliq o'tadi va
//     mos tushgan joyda bir lahza to'xtaydi — bola aynan mos tushishni ko'radi;
//   * halqada har bir mos tushish burchagida belgi bor, o'tilgani yonadi.
// prefers-reduced-motion da harakat yo'q: shakl yakuniy holatda turadi.
const ROTOR_STEP_MS = 1500;

const RotorFigure = ({ n, mode = 'rosette', running = true, solved = false, showAngle = false }) => {
  const t = useT();
  const reduced = usePrefersReducedMotion();
  const [tick, setTick] = useState(0);
  const step = 360 / n;
  const auto = running && !reduced;

  useEffect(() => {
    if (!auto) return undefined;
    let value = 0;
    const id = window.setInterval(() => {
      value += 1;
      setTick(value);
      if (value >= n * 2) window.clearInterval(id);
    }, ROTOR_STEP_MS);
    return () => window.clearInterval(id);
  }, [auto, n]);

  // Harakat o'chirilgan bo'lsa shakl yakuniy holatda turadi.
  const turn = auto ? tick : n;
  const matches = Math.min(turn, n);
  const angle = step * turn;
  const cx = 176;
  const cy = 125;
  const ring = 108;
  const reach = 74;               // shakl radiusi — halqadan ancha ichkarida
  const clipId = `d41rotor-${mode}-${n}`;
  const petals = Array.from({ length: n }, (_, index) => index);

  return (
    <FitSvg viewBox="0 0 640 250">
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={ring - 4} />
        </clipPath>
      </defs>

      {/* halqa va mos tushish belgilari */}
      <circle cx={cx} cy={cy} r={ring} fill="#F7FBF5" stroke="rgba(23,59,82,.14)" strokeWidth="1.6" />
      {petals.map((index) => {
        const a = ((index * step - 90) * Math.PI) / 180;
        const lit = index < matches;
        return (
          <circle
            key={`tick-${index}`}
            cx={cx + (ring + 9) * Math.cos(a)}
            cy={cy + (ring + 9) * Math.sin(a)}
            r={lit ? 6 : 4}
            fill={lit ? T.lime : 'rgba(23,59,82,.18)'}
            style={{ transition: 'fill .3s ease, r .3s ease' }}
          />
        );
      })}

      <g clipPath={`url(#${clipId})`}>
        <g
          transform={`rotate(${angle} ${cx} ${cy})`}
          style={{ transition: `transform ${ROTOR_STEP_MS - 400}ms cubic-bezier(.32,.06,.28,1)` }}
        >
          {mode === 'triangle'
            ? (
              <g>
                <polygon
                  points={petals.map((index) => {
                    const a = ((index * 120 - 90) * Math.PI) / 180;
                    return `${cx + reach * Math.cos(a)},${cy + reach * Math.sin(a)}`;
                  }).join(' ')}
                  fill="rgba(149,201,61,.20)"
                  stroke={T.cyan}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <circle cx={cx} cy={cy - reach} r="8" fill={T.accent} />
              </g>
            )
            : petals.map((index) => (
              <g key={index} transform={`rotate(${index * step} ${cx} ${cy})`}>
                <path
                  d={`M${cx} ${cy - 18} Q${cx + 24} ${cy - 52} ${cx} ${cy - reach} Q${cx - 24} ${cy - 52} ${cx} ${cy - 18} Z`}
                  fill={index === 0 ? 'rgba(255,91,53,.24)' : 'rgba(149,201,61,.22)'}
                  stroke={index === 0 ? T.accent : T.cyan}
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
              </g>
            ))}
        </g>
      </g>
      <circle cx={cx} cy={cy} r="6" fill={T.navy} />

      <g>
        <text x="330" y="62" fill={T.ink2} fontSize="14" fontWeight="750" fontFamily="Manrope, sans-serif">
          {t({ uz: 'mos tushdi', ru: 'совпадений', en: 'matches' })}
        </text>
        <text x="330" y="112" fill={T.cyan} fontSize="44" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {matches}
        </text>
        <text x="330" y="150" fill={T.ink3} fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
          {t({ uz: 'bir aylanishda', ru: 'за один оборот', en: 'in one full turn' })}
        </text>
        {(showAngle || solved) && (
          <g>
            <rect x="322" y="166" width="248" height="52" rx="14" fill={T.successSoft} />
            <text x="446" y="199" textAnchor="middle" fill={T.success} fontSize="21" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {`360 : ${n} = ${step}`}
            </text>
          </g>
        )}
      </g>
    </FitSvg>
  );
};

// s9: bitta naqsh ikki tekshiruvdan alohida o'tadi.
const SYMMETRY_CASES = [
  { kind: 'mirror', fold: true, turn: false },
  { kind: 'spin', fold: false, turn: true },
  { kind: 'rosette', fold: true, turn: true },
];

const SymmetryPair = ({ frame }) => {
  const t = useT();
  const w = 218;
  const h = 186;
  const gap = 24;
  const total = 3 * w + 2 * gap;
  const x0 = (780 - total) / 2;
  return (
    <FitSvg viewBox="0 0 780 292">
      {SYMMETRY_CASES.map((item, index) => {
        const x = x0 + index * (w + gap);
        const open = frame >= index + 1;
        const cx = x + w / 2;
        return (
          <g key={index}>
            <PanelBox x={x} y={16} w={w} h={h} stroke={open ? T.cyan : 'rgba(23,59,82,.2)'} width={open ? 3 : 2} />
            {item.kind === 'rosette'
              ? Array.from({ length: 4 }, (_, petal) => (
                <g key={petal} transform={`rotate(${petal * 90} ${cx} ${93})`}>
                  <path d={`M${cx} 78 Q${cx + 16} 44 ${cx} 32 Q${cx - 16} 44 ${cx} 78 Z`} fill="rgba(22,143,163,.16)" stroke={T.cyan} strokeWidth="2" />
                </g>
              ))
              : (
                <PatternPanel x={x + 16} y={30} w={w - 32} h={h - 28} kind={item.kind} bare />
              )}
            {[['fold', item.fold], ['turn', item.turn]].map(([key, value], badge) => (
              <g key={key} opacity={open ? 1 : 0.25}>
                <rect x={x + 14 + badge * 100} y={h + 26} width="90" height="30" rx="15" fill={value ? T.successSoft : T.warnSoft} />
                <text x={x + 59 + badge * 100} y={h + 46} textAnchor="middle" fill={value ? T.success : T.warn} fontSize="12" fontWeight="800" fontFamily="Manrope, sans-serif">
                  {key === 'fold'
                    ? `${t({ uz: 'buklash', ru: 'сгиб', en: 'fold' })} ${value ? '✓' : '✕'}`
                    : `${t({ uz: 'burish', ru: 'поворот', en: 'turn' })} ${value ? '✓' : '✕'}`}
                </text>
              </g>
            ))}
          </g>
        );
      })}
    </FitSvg>
  );
};

// s11: QOIDA kartasi. Matn ko'p bo'lgani uchun HTML — o'lchami kontentga qarab.
const RuleCard = ({ frame }) => {
  const t = useT();
  const rows = [
    {
      badge: '1',
      tone: T.cyan,
      head: t({ uz: "O'q simmetriyasi", ru: 'Осевая симметрия', en: 'Line symmetry' }),
      body: t({
        uz: "O'zaro simmetrik nuqtalar simmetriya o'qidan ayni bir xil masofada yotadi.",
        ru: 'Взаимно симметричные точки лежат на одинаковом расстоянии от оси симметрии.',
        en: 'Mutually symmetric points lie at the same distance from the axis of symmetry.',
      }),
      formula: null,
    },
    {
      badge: '2',
      tone: T.accent,
      head: t({ uz: 'Burish simmetriyasi', ru: 'Поворотная симметрия', en: 'Rotational symmetry' }),
      body: t({
        uz: "Shakl bir aylanishda n marta o'ziga mos tushsa, burish burchagi shunga teng:",
        ru: 'Если фигура совпадает с собой n раз за оборот, угол поворота равен:',
        en: 'If a figure matches itself n times in one turn, the turn angle is:',
      }),
      formula: '360 : n',
    },
  ];
  return (
    <div className="d41-rule">
      {rows.map((row, index) => (
        <div key={row.badge} className={`d41-rule-row ${frame >= index + 1 ? 'is-open' : ''}`}>
          <span className="d41-rule-num" style={{ background: row.tone }}>{row.badge}</span>
          <div>
            <strong style={{ color: row.tone }}>{row.head}</strong>
            <p>{row.body}</p>
          </div>
          {row.formula && <b className="d41-rule-formula">{row.formula}</b>}
        </div>
      ))}
    </div>
  );
};

// s13: Bit pasporti. To'rt qator, bittasi yolg'on.
const PassportAudit = ({ picked, solved, rows, falseIndex }) => {
  const t = useT();
  return (
    <div className="d41-passport">
      {rows.map((row, index) => {
        const isFalse = solved && index === falseIndex;
        const isPicked = picked === index && !solved;
        return (
          <div key={index} className={`d41-row ${isFalse ? 'is-false' : ''} ${isPicked ? 'is-picked' : ''}`}>
            <span className="d41-row-num">{index + 1}</span>
            <p>{t(row)}</p>
            {isFalse && <b>{t({ uz: "yolg'on", ru: 'ложь', en: 'false' })}</b>}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// EKRANLAR
// ---------------------------------------------------------------------------
const Screen0 = (props) => (
  <ChoiceScreen
    {...props}
    plain
    ratio="30 / 11"
    ordinal={3}
    figure={({ solved }) => (
      <div className="hero-scene">
        <div className="hero-head">
          <span>LUMO CITY · ARXITEKTURA BYUROSI · NAQSH USTAXONASI</span>
          {/* Javob berilmaguncha holat NEYTRAL: "NUSXA" so'zi savolning
              javobini oldindan aytib qo'yardi (METODIK_PROFIL). */}
          <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
            {solved ? "KO'ZGU" : 'TEKSHIRUV'}
          </span>
        </div>
        <div className="hero-body">
          <LatticeWindow mirrored={solved} />
        </div>
        <div className="d41-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'happy' : 'think'} /></div>
      </div>
    )}
  />
);
const Screen1 = (props) => <RevealScreen {...props} ratio="62 / 25" figure={({ frame }) => <FoldPanel frame={frame} />} />;
const Screen2 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="78 / 30"
    figure={({ solved, picked }) => (
      <PanelRow kinds={['copy', 'mirror', 'shift']} picked={picked} solved={solved} correctIndex={1} />
    )}
  />
);
const Screen3 = (props) => <RevealScreen {...props} ratio="64 / 25" figure={({ frame }) => <AxisGrid frame={frame} />} />;
const Screen4 = (props) => (
  <SlotScreen
    {...props}
    ratio="64 / 25"
    figure={({ solved, picked }) => <AxisPlace solved={solved} picked={picked} />}
  />
);
const Screen5 = (props) => (
  <BuildScreen
    {...props}
    ratio="64 / 25"
    figure={({ frame, placed, done, canPlace, onPick }) => (
      <MirrorBuild frame={frame} placed={placed} done={done} canPlace={canPlace} onPick={onPick} />
    )}
  />
);
const Screen6 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={2}
    ratio="80 / 30"
    figure={({ solved, picked }) => <MirrorChoice picked={picked} solved={solved} correctIndex={2} />}
  />
);
const Screen7 = (props) => (
  <RevealScreen {...props} ratio="64 / 25" figure={() => <RotorFigure n={3} mode="triangle" showAngle />} />
);
const Screen8 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={3}
    ratio="64 / 25"
    figure={({ solved }) => <RotorFigure n={4} solved={solved} />}
  />
);
const Screen9 = (props) => <RevealScreen {...props} ratio="78 / 29" figure={({ frame }) => <SymmetryPair frame={frame} />} />;
const Screen10 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={4}
    ratio="64 / 25"
    figure={({ solved }) => <RotorFigure n={6} solved={solved} />}
  />
);
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={5}
    ratio="64 / 25"
    figure={({ solved }) => <RotorFigure n={6} solved={solved} />}
  />
);
const Screen13 = (props) => (
  <ChoiceScreen
    {...props}
    plain
    ratio="auto"
    ordinal={6}
    figure={({ solved, picked }) => (
      <PassportAudit rows={CONTENT.s13.passport} picked={picked} solved={solved} falseIndex={2} />
    )}
  />
);
const Screen14 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={7}
    ratio="78 / 30"
    figure={({ solved, picked }) => (
      <PanelRow kinds={['plain', 'spin', 'mirror']} picked={picked} solved={solved} correctIndex={2} />
    )}
  />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

// ---------------------------------------------------------------------------
// Darsning o'z uslublari. Umumiy qatlam — KIT_STYLES.
// ---------------------------------------------------------------------------
const LESSON_STYLES = `
.d41-hero-bit {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 62px;
  height: 78px;
  transform: translateY(-50%);
  pointer-events: none;
}
.d41-hero-bit svg { width: 100%; height: 100%; }

.d41-rule { display: grid; gap: 10px; align-content: center; }
.d41-rule-row {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,59,82,.1), 0 12px 26px -24px rgba(${T.shadowBase}, .5);
  opacity: .3;
  transition: opacity .4s ease;
}
.d41-rule-row.is-open { opacity: 1; }
.d41-rule-num {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 900;
}
.d41-rule-row strong { display: block; font-size: 13px; letter-spacing: .01em; }
.d41-rule-row p { margin-top: 3px; color: ${T.ink2}; font-size: clamp(12px, 1.5vw, 14px); line-height: 1.38; }
.d41-rule-formula {
  padding: 7px 12px;
  border-radius: 11px;
  color: ${T.accent};
  background: ${T.accentSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(15px, 2vw, 19px);
}

.d41-passport { display: grid; gap: 7px; align-content: center; }
.d41-row {
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 13px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,59,82,.1);
  transition: background .25s, box-shadow .25s;
}
.d41-row p { color: ${T.ink}; font-size: clamp(12px, 1.5vw, 14px); line-height: 1.35; }
.d41-row-num {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 800;
}
.d41-row.is-picked { background: #FFF6F3; box-shadow: inset 0 0 0 1.6px rgba(255,91,53,.45); }
.d41-row.is-false { background: ${T.warnSoft}; box-shadow: inset 0 0 0 1.8px rgba(169,111,19,.45); }
.d41-row.is-false .d41-row-num { color: ${T.warn}; background: rgba(169,111,19,.14); }
.d41-row b {
  padding: 4px 9px;
  border-radius: 999px;
  color: ${T.warn};
  background: rgba(169,111,19,.14);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}
`;

export default function Grade4Dars41(props) {
  return (
    <TheoryLessonRoot
      {...props}
      lessonMeta={LESSON_META}
      screenMeta={SCREEN_META}
      totalScreens={TOTAL_SCREENS}
      frameCounts={FRAME_COUNTS}
      content={CONTENT}
      screens={SCREENS}
      styles={KIT_STYLES + LESSON_STYLES}
    />
  );
}
