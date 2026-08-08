import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// 4-sinf · 8-dars · Ko'p xonali sonlarni qo'shish va ayirish
// The lesson follows the approved 15-screen plan. Explanation beats never wait
// for a learner action; audio/currentSegment drives the microanimations.

const b = (uz, ru) => ({ uz, ru });

const CONTENT = {
  0: {
    eyebrow: b("Xona qiymati detektivi", "Детектор разрядов"),
    title: b("Bir misol, ikki natija", "Один пример, два результата"),
    lead: b(
      "Bit bir xil misoldan ikki natija oldi. Qaysi yozuvga ishonasiz?",
      "Бит получил два ответа для одного примера. Какой записи ты доверяешь?",
    ),
    audio: {
      uz: [
        "Bit qirq sakkiz ming uch yuz to'qson ikkiga yetti ming olti yuz beshni qo'shdi.",
        "Bir yozuvda birliklar birliklar ostida, ikkinchisida sonlar chapdan tekislangan.",
        "Qaysi yozuv matematik ma'noni saqlaydi?",
      ],
      ru: [
        "Бит складывал сорок восемь тысяч триста девяносто два и семь тысяч шестьсот пять.",
        "В одной записи единицы стоят под единицами, а во второй числа выровнены слева.",
        "Какая запись сохраняет разрядный смысл?",
      ],
    },
  },
  1: {
    eyebrow: b("Xona ostiga xona", "Разряд под разрядом"),
    title: b("Sonlarni o'ngdan tekislaymiz", "Выравниваем числа справа"),
    lead: b("32 415 + 6 203", "32 415 + 6 203"),
    instruction: b("Ikkinchi sonni to'g'ri joyga qo'ying.", "Поставь второе число на правильное место."),
    audio: {
      uz: [
        "Sonlar uzunligi turlicha bo'lsa ham, ularni chap tomondan tekislamaymiz.",
        "Birlar xonasini birlar xonasi ostiga qo'yamiz.",
        "Shunda har bir xona faqat o'ziga teng xona bilan qo'shiladi.",
      ],
      ru: [
        "Даже если числа разной длины, их не выравнивают слева.",
        "Поставим единицы под единицами.",
        "Тогда каждый разряд складывается только с одноимённым разрядом.",
      ],
    },
  },
  2: {
    eyebrow: b("Almashtirishsiz qo'shish", "Сложение без обмена"),
    title: b("Har xona o'z ustunida", "Каждый разряд в своём столбце"),
    lead: b("32 415 + 6 203 = 38 618", "32 415 + 6 203 = 38 618"),
    audio: {
      uz: [
        "Birliklardan boshlaymiz.",
        "Besh birlik va uch birlik sakkiz birlik bo'ladi.",
        "Bir o'nlik va nol o'nlik bir o'nlik bo'ladi.",
        "To'rt yuzlik va ikki yuzlik olti yuzlik bo'ladi.",
        "Ikki minglik va olti minglik sakkiz minglik bo'ladi.",
        "Natija o'ttiz sakkiz ming olti yuz o'n sakkiz.",
      ],
      ru: [
        "Начинаем с единиц.",
        "Пять единиц и три единицы дают восемь.",
        "Один десяток и ноль десятков дают один десяток.",
        "Четыре сотни и две сотни дают шесть сотен.",
        "Две тысячи и шесть тысяч дают восемь тысяч.",
        "Получается тридцать восемь тысяч шестьсот восемнадцать.",
      ],
    },
  },
  3: {
    eyebrow: b("Yiriklashtirish", "Укрупнение"),
    title: b("O'n ikkita birlikni almashtiramiz", "Обмениваем двенадцать единиц"),
    lead: b("28 467 + 15 785", "28 467 + 15 785"),
    instruction: b("12 birlikni qanday yozamiz?", "Как записать 12 единиц?"),
    audio: {
      uz: [
        "Yetti birlik va besh birlik o'n ikki birlik bo'ladi.",
        "O'n ikkita birlikni bitta o'nlik va ikkita birlikka almashtiramiz.",
        "Ikki birlik natijada qoladi, bitta o'nlik keyingi xonaga o'tadi.",
      ],
      ru: [
        "Семь единиц и пять единиц дают двенадцать единиц.",
        "Заменим двенадцать единиц одним десятком и двумя единицами.",
        "Две единицы остаются в ответе, а один десяток переходит в следующий разряд.",
      ],
    },
  },
  4: {
    eyebrow: b("Almashtirishsiz ayirish", "Вычитание без размена"),
    title: b("Bir xil xonalarni ayiramiz", "Вычитаем одинаковые разряды"),
    lead: b("76 854 − 24 132 = 52 722", "76 854 − 24 132 = 52 722"),
    audio: {
      uz: [
        "Ayirishda ham sonlarni birlar xonasi bo'yicha tekislaymiz.",
        "To'rt birlikdan ikki birlikni, besh o'nlikdan uch o'nlikni ayiramiz.",
        "Har ustunda yuqoridagi raqam yetarli bo'lsa, almashtirish kerak emas.",
        "Natija ellik ikki ming yetti yuz yigirma ikki.",
      ],
      ru: [
        "При вычитании числа также выравнивают по единицам.",
        "Из четырёх единиц вычитаем две, а из пяти десятков три.",
        "Если верхней цифры хватает, размен не нужен.",
        "Получается пятьдесят две тысячи семьсот двадцать два.",
      ],
    },
  },
  5: {
    eyebrow: b("Maydalash", "Размен"),
    title: b("Bitta o'nlik o'nta birlik bo'ladi", "Один десяток становится десятью единицами"),
    lead: b("63 241 − 27 856", "63 241 − 27 856"),
    instruction: b(
      "1 birlikdan 6 birlikni ayirish uchun qaysi xonadan foydalanamiz?",
      "Из какого разряда возьмём единицу, чтобы вычесть 6 из 1?",
    ),
    audio: {
      uz: [
        "Bir birlikdan olti birlikni ayirib bo'lmaydi.",
        "Eng yaqin chapdagi o'nlikdan bitta o'nlikni olamiz.",
        "Bitta o'nlik o'nta birlikka aylanadi.",
        "Endi o'n bir birlikdan oltini ayirib, besh birlik qoladi.",
      ],
      ru: [
        "Из одной единицы нельзя вычесть шесть.",
        "Возьмём один десяток из ближайшего разряда слева.",
        "Один десяток превращается в десять единиц.",
        "Теперь из одиннадцати единиц вычитаем шесть, остаётся пять.",
      ],
    },
  },
  6: {
    eyebrow: b("Nollar zanjiri", "Цепочка нулей"),
    title: b("Birinchi nol bo'lmagan donor", "Первый ненулевой донор"),
    lead: b("40 005 − 17 268", "40 005 − 17 268"),
    instruction: b(
      "5 birlik yetmaydi. Chapdagi qaysi raqam birinchi donor bo'la oladi?",
      "Пяти единиц не хватает. Какая цифра слева первой может стать донором?",
    ),
    audio: {
      uz: [
        "Nolning o'zidan xona birligini olib bo'lmaydi.",
        "Chapga qarab birinchi nol bo'lmagan xonani topamiz.",
        "Bitta o'n minglik ketma-ket minglik, yuzlik, o'nlik va birliklarga maydalanadi.",
        "Shundan keyin har ustunda ayirish mumkin bo'ladi.",
      ],
      ru: [
        "Из нуля нельзя взять разрядную единицу.",
        "Найдём первый ненулевой разряд слева.",
        "Один десяток тысяч последовательно разменивается на тысячи, сотни, десятки и единицы.",
        "После этого вычитание возможно в каждом столбце.",
      ],
    },
  },
  7: {
    eyebrow: b("Ikki xil tekshiruv", "Два способа проверки"),
    title: b("Taxmin va teskari amal", "Оценка и обратное действие"),
    lead: b(
      "Taxmin kattalikni, teskari amal aniq hisobni tekshiradi.",
      "Оценка проверяет величину, обратное действие — точность.",
    ),
    audio: {
      uz: [
        "Taxmin javob qaysi kattalikda bo'lishi kerakligini ko'rsatadi.",
        "Teskari amal esa aniq natijani tekshiradi.",
        "Qo'shish ayirish bilan, ayirish qo'shish bilan tekshiriladi.",
      ],
      ru: [
        "Оценка показывает ожидаемую величину ответа.",
        "Обратное действие проверяет точный результат.",
        "Сложение проверяют вычитанием, а вычитание сложением.",
      ],
    },
  },
  8: {
    eyebrow: b("Tekshiruv", "Проверка"),
    title: b("To'g'ri tekislangan yozuv", "Верно выровненная запись"),
    lead: b(
      "84 215 − 19 730 misoli qaysi ustunda to'g'ri yozilgan?",
      "В каком столбике верно записан пример 84 215 − 19 730?",
    ),
    audio: {
      uz: ["Ayirishdan oldin xonalar joylashuvini tekshiring."],
      ru: ["Перед вычитанием проверь расположение разрядов."],
    },
  },
  9: {
    eyebrow: b("Xona kartalari", "Карточки разрядов"),
    title: b("Natijani yasang", "Составь результат"),
    lead: b("63 708 + 8 596", "63 708 + 8 596"),
    instruction: b(
      "Hisobni birliklardan boshlang va raqamlarni o'z xonasiga joylashtiring.",
      "Начни с единиц и поставь каждую полученную цифру в свой разряд.",
    ),
    audio: {
      uz: ["Hisobni birliklardan boshlang va hosil bo'lgan raqamlarni o'z xonasiga joylashtiring."],
      ru: ["Начни с единиц и поставь каждую полученную цифру в свой разряд."],
    },
  },
  10: {
    eyebrow: b("Bitning xatosi", "Ошибка Бита"),
    title: b("Birinchi xatoni toping", "Найди первую ошибку"),
    lead: b("36 475 + 28 689 = 64 164", "36 475 + 28 689 = 64 164"),
    instruction: b(
      "Birinchi xato qaysi xonada paydo bo'lgan?",
      "В каком разряде впервые появилась ошибка?",
    ),
    audio: {
      uz: [
        "O'ngdan boshlab har ustunni tekshiring.",
        "Birinchi noto'g'ri ustunni tanlang, keyingi xatolar uning oqibati bo'lishi mumkin.",
      ],
      ru: [
        "Проверь каждый столбец справа налево.",
        "Выбери первый неверный разряд; следующие ошибки могут быть его следствием.",
      ],
    },
  },
  11: {
    eyebrow: b("Holatni tiklash", "Восстановление состояния"),
    title: b("Nollar zanjirini tuzing", "Составь цепочку размена"),
    lead: b("60 002 − 24 785", "60 002 − 24 785"),
    instruction: b(
      "2 dan 5 ni ayirishdan oldingi holatni tuzing.",
      "Составь состояние перед вычитанием 5 из 2.",
    ),
    audio: {
      uz: [
        "Chapdagi birinchi nol bo'lmagan xonada olti o'n minglik bor. Undan bitta o'n minglikni olamiz.",
        "U nollar zanjiri orqali birliklargacha maydalanadi.",
      ],
      ru: [
        "В первом ненулевом разряде слева есть шесть десятков тысяч. Возьмём один десяток тысяч.",
        "Она последовательно разменивается через нулевые разряды до единиц.",
      ],
    },
  },
  12: {
    eyebrow: b("Teskari amal", "Обратное действие"),
    title: b("Hisob va tekshiruvni juftlang", "Соедини вычисление и проверку"),
    lead: b(
      "Har hisobni mos teskari amal bilan juftlang.",
      "Соедини каждое вычисление с подходящей проверкой.",
    ),
    audio: {
      uz: [
        "Natijadan bir qo'shiluvchini ayirsak, ikkinchi qo'shiluvchi chiqadi.",
        "Ayirma va ayriluvchini qo'shsak, kamayuvchi qaytadi.",
      ],
      ru: [
        "Если из суммы вычесть одно слагаемое, получится другое.",
        "Если сложить разность и вычитаемое, получится уменьшаемое.",
      ],
    },
  },
  13: {
    eyebrow: b("Shahar kutubxonasi", "Городская библиотека"),
    title: b("Nechta kitob qoldi?", "Сколько книг осталось?"),
    lead: b(
      "Kutubxonada 72 000 ta kitob bor edi. 18 756 tasi filiallarga berildi. Nechta kitob qoldi?",
      "В библиотеке было 72 000 книг. В филиалы передали 18 756. Сколько книг осталось?",
    ),
    audio: {
      uz: [
        "Qolgan miqdorni topish uchun ayiramiz.",
        "Nollar orqali maydalashni va javobning ellik uch ming atrofida bo'lishini tekshiring.",
      ],
      ru: [
        "Чтобы найти остаток, выполняем вычитание.",
        "Проверь размен через нули и то, что ответ должен быть около пятидесяти трёх тысяч.",
      ],
    },
  },
  14: {
    eyebrow: b("Yakuniy missiya", "Финальная миссия"),
    title: b("To'rt tayanch qoida", "Четыре опорных правила"),
    lead: b(
      "Yozma qo'shish va ayirishning ma'nosini bir sahnada qaytaramiz.",
      "Соберём смысл письменного сложения и вычитания в одной сцене.",
    ),
    audio: {
      uz: [
        "Qo'shish va ayirishda sonlarni birlar xonasi bo'yicha tekislang.",
        "Qo'shishda o'nta kichik xona birligini bitta katta xona birligiga almashtiring.",
        "Ayirishda kerak bo'lsa, chapdagi birinchi nol bo'lmagan xonadan boshlab maydalang.",
        "Javobni taxmin va teskari amal bilan tekshiring.",
      ],
      ru: [
        "При сложении и вычитании выравнивай числа по единицам.",
        "При сложении заменяй десять меньших разрядных единиц одной большей.",
        "При вычитании при необходимости начинай размен с первого ненулевого разряда слева.",
        "Проверяй ответ оценкой и обратным действием.",
      ],
    },
  },
};

const SCREEN_META = [
  { type: "hook", scope: "hook", scored: false },
  { type: "exploration", scope: null, scored: false },
  { type: "model", scope: null, scored: false },
  { type: "discovery", scope: null, scored: false },
  { type: "comparison", scope: null, scored: false },
  { type: "exploration", scope: null, scored: false },
  { type: "exploration", scope: null, scored: false },
  { type: "strategy", scope: null, scored: false },
  { type: "test", scope: "module-mikro", scored: true },
  { type: "construction", scope: "module-mikro", scored: true },
  { type: "error", scope: "module-mikro", scored: true },
  { type: "construction", scope: "final", scored: true },
  { type: "matching", scope: "final", scored: true },
  { type: "case", scope: "final", scored: true },
  { type: "summary", scope: null, scored: false },
];

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: "num-4-08-v1",
  title: b(
    "8-dars. Ko'p xonali sonlarni qo'shish va ayirish",
    "Урок 8. Сложение и вычитание многозначных чисел",
  ),
};

let runtimeConfig = {
  ttsApiBase: "",
  voiceGender: "f",
  correctSoundUrl: "",
  wrongSoundUrl: "",
  previewMode: false,
};

const LangContext = createContext("uz");
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback(
    (value) => {
      if (value == null) return "";
      if (typeof value === "string" || typeof value === "number") return String(value);
      return value[lang] || value.uz || value.ru || "";
    },
    [lang],
  );
};

function useIsMobile() {
  const [mobile, setMobile] = useState(() => (
    typeof window !== "undefined" ? window.innerWidth <= 639 : false
  ));
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return mobile;
}

const buildTtsUrl = (base, text, gender) => (
  base + "/api/tts?text=" + encodeURIComponent(String(text).slice(0, 1000))
  + "&g=" + (gender === "m" ? "m" : "f")
);

class AudioEngine {
  constructor() {
    this.audio = null;
    this.previewUtterance = null;
    this.queue = [];
    this.index = 0;
    this.lang = "ru";
    this.muted = false;
    this.playing = false;
    this.listener = null;
    this.timer = null;
  }

  emit(extra = {}) {
    this.listener?.({ isPlaying: this.playing, muted: this.muted, ...extra });
  }

  stop() {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) {
      this.audio.pause();
      this.audio.onended = null;
      this.audio.onerror = null;
    }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
    }
    if (runtimeConfig.previewMode && typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Browser speech is optional in local preview.
      }
    }
    this.previewUtterance = null;
    this.playing = false;
  }

  load(queue) {
    this.stop();
    this.queue = queue;
    this.index = 0;
  }

  setLang(lang) {
    this.lang = lang;
  }

  start() {
    if (!this.queue.length) {
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    if (this.muted) {
      this.emit({ completed: true, currentSegment: this.queue[this.queue.length - 1].id });
      return;
    }
    this.emit({ completed: false });
    this.playNext();
  }

  simulate(item) {
    this.playing = true;
    this.emit({ completed: false, currentSegment: item.id });
    this.timer = window.setTimeout(() => {
      this.index += 1;
      this.playNext();
    }, 1450);
  }

  playPreviewSpeech(item) {
    const speech = typeof window !== "undefined" ? window.speechSynthesis : null;
    const Utterance = typeof window !== "undefined"
      ? (window.SpeechSynthesisUtterance || globalThis.SpeechSynthesisUtterance)
      : null;
    if (!speech || !Utterance) {
      this.simulate(item);
      return;
    }

    try {
      speech.cancel();
      const utterance = new Utterance(String(item.text));
      utterance.lang = this.lang === "uz" ? "uz-UZ" : "ru-RU";
      utterance.rate = 0.94;
      utterance.onstart = () => {
        this.playing = true;
        this.emit({ completed: false, currentSegment: item.id });
      };
      utterance.onend = () => {
        this.playing = false;
        this.index += 1;
        this.playNext();
      };
      utterance.onerror = () => {
        this.playing = false;
        this.simulate(item);
      };
      this.previewUtterance = utterance;
      this.timer = window.setTimeout(() => {
        this.timer = null;
        try {
          speech.speak(utterance);
        } catch {
          this.simulate(item);
        }
      }, 50);
    } catch {
      this.simulate(item);
    }
  }

  playNext() {
    const item = this.queue[this.index];
    if (!item) {
      this.playing = false;
      this.emit({
        completed: true,
        currentSegment: this.queue[this.queue.length - 1]?.id || null,
      });
      return;
    }

    if (!runtimeConfig.ttsApiBase) {
      if (runtimeConfig.previewMode) {
        this.playPreviewSpeech(item);
      } else {
        this.simulate(item);
      }
      return;
    }

    if (typeof Audio === "undefined") {
      this.simulate(item);
      return;
    }

    if (!this.audio) this.audio = new Audio();
    this.audio.onended = () => {
      this.index += 1;
      this.playNext();
    };
    this.audio.onerror = () => {
      this.index += 1;
      this.playNext();
    };
    this.audio.src = buildTtsUrl(
      runtimeConfig.ttsApiBase,
      item.text,
      runtimeConfig.voiceGender,
    );
    this.emit({ completed: false, currentSegment: item.id });
    this.audio.play().then(() => {
      this.playing = true;
      this.emit({ completed: false, currentSegment: item.id });
    }).catch(() => this.simulate(item));
  }

  replay() {
    this.index = 0;
    this.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    this.stop();
    this.emit({
      muted: this.muted,
      completed: this.muted,
      currentSegment: this.muted ? this.queue[this.queue.length - 1]?.id || null : null,
    });
  }

  one(text) {
    this.load([{ id: "feedback-0", text }]);
    this.start();
  }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === "undefined") return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(audio, screen) {
  const lang = useLang();
  const stableSegments = useMemo(
    () => {
      const localized = audio?.[lang] || audio?.uz || [];
      return (Array.isArray(localized) ? localized : [localized])
        .filter(Boolean)
        .map((text, index) => ({ id: "s" + screen + "-b" + index, text }));
    },
    [audio, lang, screen],
  );
  const segmentKey = JSON.stringify(stableSegments);
  const queueKey = "d8-s" + screen + "-" + lang + "-" + segmentKey;
  const [state, setState] = useState({
    isPlaying: false,
    muted: false,
    completed: false,
    currentSegment: null,
    queueKey: null,
  });

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.listener = (next) => {
      setState((old) => ({ ...old, ...next, queueKey }));
    };
    engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 260);
    return () => {
      window.clearTimeout(timer);
      engine.stop();
      if (engine.listener) engine.listener = null;
    };
  }, [queueKey, stableSegments, lang]);

  const replay = useCallback(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engine.load(stableSegments);
    engine.start();
  }, [stableSegments]);

  const toggleMute = useCallback(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    const turningOn = engine.muted;
    engine.toggleMute();
    if (turningOn) {
      engine.load(stableSegments);
      engine.start();
    }
  }, [stableSegments]);

  const pushOneOff = useCallback((text) => {
    if (text) getAudioEngine()?.one(text);
  }, []);

  return {
    ...state,
    completed: state.queueKey === queueKey && state.completed,
    replay,
    toggleMute,
    pushOneOff,
  };
}

function useAutoPhase(audio, count, screen) {
  const [fallbackPhase, setFallbackPhase] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const reducedTimer = window.setTimeout(
        () => setFallbackPhase(Math.max(0, count - 1)),
        0,
      );
      return () => window.clearTimeout(reducedTimer);
    }
    const timer = window.setInterval(() => {
      setFallbackPhase((current) => Math.min(count - 1, current + 1));
    }, 1550);
    return () => window.clearInterval(timer);
  }, [count, screen]);

  const marker = "-b";
  const audioPhase = audio.currentSegment?.startsWith("s" + screen + marker)
    ? Number(audio.currentSegment.split(marker)[1])
    : 0;
  return Math.max(
    fallbackPhase,
    Number.isFinite(audioPhase) ? Math.min(count - 1, audioPhase) : 0,
  );
}

const playSfx = (kind) => {
  const url = kind === "correct"
    ? runtimeConfig.correctSoundUrl
    : runtimeConfig.wrongSoundUrl;
  if (!url || typeof Audio === "undefined") return;
  try {
    const sound = new Audio(url);
    sound.play().catch(() => {});
  } catch {
    // Sound effects are optional.
  }
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

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const muteLabel = audio.muted
    ? (lang === "uz" ? "Ovozni yoqish" : "Включить звук")
    : (lang === "uz" ? "Ovozni o'chirish" : "Выключить звук");
  const replayLabel = lang === "uz" ? "Qayta eshitish" : "Повторить";
  return (
    <div className="audio-controls">
      <button
        type="button"
        className="icon-btn"
        onClick={audio.toggleMute}
        aria-label={muteLabel}
        title={muteLabel}
      >
        {audio.muted ? "🔇" : (audio.isPlaying ? "🔊" : "🔉")}
      </button>
      {!audio.muted && (
        <button
          type="button"
          className="icon-btn"
          onClick={audio.replay}
          aria-label={replayLabel}
          title={replayLabel}
        >
          ↻
        </button>
      )}
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const aliases = {
    model: "exploration",
    discovery: "exploration",
    comparison: "exploration",
    strategy: "exploration",
    construction: "practice",
    error: "practice",
    matching: "practice",
  };
  const labels = {
    hook: lang === "uz" ? "Missiya" : "Миссия",
    diagnostic: lang === "uz" ? "Diagnostika" : "Диагностика",
    exploration: lang === "uz" ? "Kashfiyot" : "Исследование",
    rule: lang === "uz" ? "Qoida" : "Правило",
    practice: lang === "uz" ? "Mashq" : "Практика",
    test: lang === "uz" ? "Tekshiruv" : "Проверка",
    case: lang === "uz" ? "Vazifa" : "Задача",
    summary: lang === "uz" ? "Yakun" : "Итог",
  };
  const semanticType = aliases[type] ?? type;
  return <span className="screen-type">{labels[semanticType] ?? type}</span>;
};

function Stage({ screen, audio, onBack, onNext, onFinish, children }) {
  const t = useT();
  const isMobile = useIsMobile();
  const contentRef = useRef(null);
  const final = screen === TOTAL_SCREENS - 1;

  useEffect(() => {
    const node = contentRef.current;
    node?.scrollTo({ top: 0, behavior: "auto" });
  }, [screen]);

  return (
    <main className={"stage stage-" + SCREEN_META[screen].type + (isMobile ? " stage-mobile" : "")}>
      <header className="stage-header">
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin="1"
          aria-valuemax={TOTAL_SCREENS}
          aria-valuenow={screen + 1}
        >
          <div
            className="progress-fill"
            style={{ width: ((screen + 1) / TOTAL_SCREENS * 100) + "%" }}
          />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title">
            <span className="status-dot" />
            <span>{t(LESSON_META.title)}</span>
          </div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={SCREEN_META[screen].type} />
            <AudioIndicator audio={audio} />
            <span className="screen-count">{String(screen + 1).padStart(2, "0")} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section className="stage-content" ref={contentRef}>{children}</section>
      <footer className="stage-nav">
        {screen > 0
          ? (
            <button type="button" className="button button-ghost" onClick={onBack}>
              ← {t(b("Orqaga", "Назад"))}
            </button>
          )
          : <span />}
        <button
          type="button"
          className="button button-primary"
          onClick={final ? onFinish : onNext}
        >
          {final ? t(b("Darsni yakunlash", "Завершить урок")) : t(b("Davom etish", "Продолжить"))} →
        </button>
      </footer>
    </main>
  );
}

function Heading({ screen, bitState = null }) {
  const t = useT();
  const c = CONTENT[screen];
  return (
    <div className={
      "heading "
      + (bitState ? "heading-with-bit " : "")
      + (bitState && screen !== 0 ? "heading-with-small-bit" : "")
    }>
      <div>
        <span className="eyebrow">{t(c.eyebrow)}</span>
        <h1>{t(c.title)}</h1>
        <p>{t(c.lead)}</p>
      </div>
      {bitState && (
        <div className={"bit-shell " + (screen !== 0 ? "bit-shell-small" : "")}>
          <BitSVG state={bitState} />
        </div>
      )}
    </div>
  );
}

function MiniCoach({ state, cue }) {
  return (
    <div className="mini-coach" aria-hidden="true">
      <BitSVG state={state} />
      <span>{cue}</span>
    </div>
  );
}

function Feedback({ show, correct, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!show) return undefined;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        ref.current?.scrollIntoView({
          behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "nearest",
        });
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [show]);
  if (!show) return null;
  return (
    <div
      ref={ref}
      className={"feedback feedback-visible " + (correct ? "feedback-correct" : "feedback-wrong")}
      aria-live="polite"
    >
      <span aria-hidden="true">{correct ? "✓" : "↻"}</span>
      <p>{children}</p>
    </div>
  );
}

const PLACE_LABELS = {
  uz: ["O'N MING", "MING", "YUZ", "O'N", "BIR"],
  ru: ["ДЕС. ТЫС.", "ТЫС.", "СОТ.", "ДЕС.", "ЕД."],
};

function PlaceHeader() {
  const lang = useLang();
  return (
    <div className="place-row place-labels" aria-hidden="true">
      {PLACE_LABELS[lang].map((label) => <span key={label}>{label}</span>)}
    </div>
  );
}

function PlaceWarehouseSVG({ phase }) {
  const places = ["10⁴", "10³", "10²", "10¹", "10⁰"];
  const topDigits = ["3", "2", "4", "1", "5"];
  const lowerDigits = ["6", "2", "0", "3"];
  const step = Math.max(0, Math.min(2, phase));
  return (
    <svg
      className={`place-warehouse-svg phase-${step}`}
      viewBox="0 0 600 118"
      aria-hidden="true"
      focusable="false"
    >
      <path className="warehouse-belt" d="M38 103 H562" />
      {places.map((place, index) => {
        const x = 42 + index * 104;
        return (
          <g className="warehouse-bay" key={place}>
            <rect x={x} y="12" width="84" height="88" rx="12" />
            <text x={x + 42} y="29">{place}</text>
            <rect className="warehouse-crate top-crate" x={x + 23} y="36" width="38" height="25" rx="7" />
            <text className="warehouse-digit" x={x + 42} y="54">{topDigits[index]}</text>
          </g>
        );
      })}
      <g className="warehouse-moving">
        {lowerDigits.map((digit, index) => {
          const x = 146 + index * 104;
          return (
            <g key={`${digit}-${index}`}>
              <rect className="warehouse-crate lower-crate" x={x + 23} y="68" width="38" height="25" rx="7" />
              <text className="warehouse-digit lower-digit" x={x + 42} y="86">{digit}</text>
            </g>
          );
        })}
      </g>
      <path className="warehouse-unit-guide" d="M498 96 V108 M490 101 L498 109 L506 101" />
    </svg>
  );
}

function ExchangeBundleSVG({ phase }) {
  const bundled = phase >= 1;
  return (
    <svg
      className={`exchange-bundle-svg ${bundled ? "is-bundled" : ""}`}
      viewBox="0 0 600 116"
      aria-hidden="true"
      focusable="false"
    >
      <g className="loose-ten">
        {Array.from({ length: 10 }, (_, index) => (
          <circle cx={72 + (index % 5) * 23} cy={43 + Math.floor(index / 5) * 24} r="8" key={index} />
        ))}
      </g>
      <path className="exchange-flow" d="M202 56 H252" />
      <path className="exchange-flow-tip" d="M242 47 L253 56 L242 65" />
      <g className="bundled-ten">
        <rect x="269" y="21" width="92" height="70" rx="15" />
        {Array.from({ length: 10 }, (_, index) => (
          <circle cx={289 + (index % 5) * 13} cy={42 + Math.floor(index / 5) * 18} r="4.5" key={index} />
        ))}
        <text x="315" y="82">10</text>
      </g>
      <path className="exchange-plus" d="M389 48 V66 M380 57 H398" />
      <g className="remainder-two">
        <circle cx="442" cy="56" r="11" />
        <circle cx="474" cy="56" r="11" />
        <text x="458" y="92">2</text>
      </g>
    </svg>
  );
}

function DonorPathSVG({ phase }) {
  const active = phase >= 2;
  const digits = ["4", "0", "0", "0", "5"];
  return (
    <svg
      className={`donor-path-svg ${active ? "path-active" : ""}`}
      viewBox="0 0 600 108"
      aria-hidden="true"
      focusable="false"
    >
      <path className="donor-route" d="M58 50 C150 4 450 4 542 50" />
      <path className="donor-route-tip" d="M531 40 L544 50 L530 58" />
      {digits.map((digit, index) => {
        const x = 58 + index * 121;
        return (
          <g className={digit === "0" ? "donor-checkpoint zero-checkpoint" : "donor-checkpoint"} key={`${digit}-${index}`}>
            <circle cx={x} cy="64" r="21" />
            <text x={x} y="71">{digit}</text>
          </g>
        );
      })}
      <g className="donor-token">
        <rect x="39" y="12" width="38" height="24" rx="12" />
        <text x="58" y="29">1</text>
      </g>
      <text className="donor-change donor-change-start" x="58" y="103">4→3</text>
      <text className="donor-change donor-change-zero" x="300" y="103">0→9</text>
    </svg>
  );
}

function DigitCells({
  digits,
  active = -1,
  tone = "",
  reveal = null,
  className = "",
}) {
  return (
    <div className={"place-row digit-row " + tone + " " + className}>
      {digits.map((digit, index) => {
        const shown = !reveal || reveal(index);
        return (
          <span
            className={(index === active ? "active-place " : "") + (!shown ? "digit-hidden" : "")}
            key={index}
          >
            {digit === "" ? <i aria-label="bo'sh" /> : digit}
          </span>
        );
      })}
    </div>
  );
}

function ColumnMath({ top, bottom, result, operator, phase, beatCount, borrowed = null }) {
  const active = Math.max(0, 5 - Math.min(5, phase + 1));
  const reveal = (index) => {
    if (beatCount <= 4) return phase >= beatCount - 1;
    return phase >= 5 - index;
  };
  return (
    <div className="column-board" aria-label={top.join("") + " " + operator + " " + bottom.join("")}>
      <PlaceHeader />
      {borrowed && (
        <DigitCells
          digits={borrowed}
          active={active}
          tone="borrow-row"
        />
      )}
      <DigitCells digits={top} active={active} />
      <div className="operator-row">
        <b>{operator}</b>
        <DigitCells digits={bottom} active={active} tone="second-row" />
      </div>
      <div className="column-rule" />
      <DigitCells digits={result} active={active} tone="result-row" reveal={reveal} />
    </div>
  );
}

function Captions({ lines, phase }) {
  return (
    <div className="captions" aria-live="polite">
      {lines.map((line, index) => (
        <p
          className={index === phase ? "caption-active" : index < phase ? "caption-done" : ""}
          key={line}
        >
          <span aria-hidden="true">{index < phase ? "✓" : "•"}</span>
          {line}
        </p>
      ))}
    </div>
  );
}

function OptionalGuess({ options, correctIndex, feedback, onPick }) {
  const t = useT();
  const [picked, setPicked] = useState(null);
  return (
    <div className="optional-guess">
      <span>{t(b("Ixtiyoriy taxmin", "Необязательный прогноз"))}</span>
      <div className="guess-options">
        {options.map((option, index) => (
          <button
            type="button"
            className={
              "guess-chip "
              + (picked === index ? (index === correctIndex ? "is-correct" : "is-wrong") : "")
            }
            onClick={() => {
              setPicked(index);
              onPick?.(index);
            }}
            key={t(option)}
          >
            {t(option)}
          </button>
        ))}
      </div>
      {picked != null && (
        <small className={picked === correctIndex ? "guess-good" : "guess-hint"}>
          {picked === correctIndex
            ? t(b("Taxmin mos keldi.", "Прогноз совпал."))
            : t(feedback)}
        </small>
      )}
    </div>
  );
}

function AlignmentScene({ phase }) {
  return (
    <div className="alignment-board">
      <PlaceWarehouseSVG phase={phase} />
      <PlaceHeader />
      <DigitCells digits={["3", "2", "4", "1", "5"]} />
      <div className={"sliding-row slide-position-" + Math.min(2, phase)}>
        <b>+</b>
        <DigitCells digits={["", "6", "2", "0", "3"]} tone="second-row" />
      </div>
      <div className={"alignment-guide " + (phase >= 1 ? "guide-visible" : "")}>
        <span />
        <span />
        <span />
        <span />
        <span className="units-guide">↕</span>
      </div>
      <strong className={phase >= 2 ? "answer-visible" : ""}>38 618</strong>
    </div>
  );
}

function ExchangeScene({ phase }) {
  const lang = useLang();
  return (
    <div className="exchange-scene">
      <div className="equation-focus">
        <span>7 {phase >= 0 ? "+" : ""} 5</span>
        <b className={phase >= 0 ? "pop-in" : ""}>= 12</b>
      </div>
      <ExchangeBundleSVG phase={phase} />
      <MiniCoach state="point" cue="10 → 1" />
      <div className={"exchange-result " + (phase >= 1 ? "answer-visible" : "")}>
        <span className="ten-bundle">10 {lang === "uz" ? "birlik" : "единиц"}</span>
        <b>→</b>
        <span>1 {lang === "uz" ? "o'nlik" : "десяток"}</span>
        <span>+</span>
        <span>2 {lang === "uz" ? "birlik" : "единицы"}</span>
      </div>
      <div className={"final-equation " + (phase >= 2 ? "answer-visible" : "")}>
        28 467 + 15 785 = <b>44 252</b>
      </div>
    </div>
  );
}

function BorrowScene({ phase, picked, onPick }) {
  const lang = useLang();
  const labels = lang === "uz"
    ? ["o'n ming", "ming", "yuz", "o'n", "bir"]
    : ["дес. тысяч", "тысяч", "сотен", "десятков", "единиц"];
  return (
    <div className="borrow-scene">
      <div className="donor-strip">
        {["6", "3", "2", "4", "1"].map((digit, index) => (
          <button
            type="button"
            className={
              (picked === index ? "guessed " : "")
              + (phase >= 1 && index === 3 ? "auto-donor" : "")
            }
            onClick={() => onPick(index)}
            aria-label={digit + " " + labels[index]}
            key={index}
          >
            <small>{labels[index]}</small>
            <b>{digit}</b>
          </button>
        ))}
      </div>
      <div className={"borrow-arrow " + (phase >= 1 ? "answer-visible" : "")}>
        <span>4 → 3</span>
        <i>↘</i>
        <span>1 → 11</span>
      </div>
      <div className={"borrow-units " + (phase >= 2 ? "answer-visible" : "")}>
        <b>11 − 6 = 5</b>
        <div>{Array.from({ length: 11 }, (_, index) => <i className={index >= 5 ? "taken" : ""} key={index} />)}</div>
      </div>
      <div className={"final-equation " + (phase >= 3 ? "answer-visible" : "")}>
        63 241 − 27 856 = <b>35 385</b>
      </div>
    </div>
  );
}

function ZeroChainScene({ phase, picked, onPick }) {
  const lang = useLang();
  const labels = lang === "uz"
    ? ["o'n ming", "ming", "yuz", "o'n", "bir"]
    : ["дес. тысяч", "тысяч", "сотен", "десятков", "единиц"];
  const after = ["3", "9", "9", "9", "15"];
  return (
    <div className="zero-chain-scene">
      <div className="donor-strip">
        {["4", "0", "0", "0", "5"].map((digit, index) => (
          <button
            type="button"
            className={
              (picked === index ? "guessed " : "")
              + (phase >= 1 && index === 0 ? "auto-donor" : "")
              + (digit === "0" ? "zero-donor" : "")
            }
            onClick={() => onPick(index)}
            aria-label={digit + " " + labels[index]}
            key={index}
          >
            <small>{labels[index]}</small>
            <b>{digit}</b>
          </button>
        ))}
      </div>
      <DonorPathSVG phase={phase} />
      <MiniCoach state="focus" cue="4 → 3" />
      <div className={"state-row " + (phase >= 2 ? "answer-visible" : "")}>
        {after.map((value, index) => (
          <span key={index}><small>{labels[index]}</small><b>{value}</b></span>
        ))}
      </div>
      <div className={"final-equation " + (phase >= 3 ? "answer-visible" : "")}>
        40 005 − 17 268 = <b>22 737</b>
      </div>
    </div>
  );
}

function StrategyScene({ phase }) {
  const t = useT();
  return (
    <div className="strategy-scene">
      <div className={"strategy-card " + (phase >= 0 ? "strategy-live" : "")}>
        <span>≈</span>
        <h3>{t(b("Taxmin", "Оценка"))}</h3>
        <p>{t(b("Javobning kattaligini tekshiradi", "Проверяет величину ответа"))}</p>
        <strong className={phase >= 1 ? "answer-visible" : ""}>28 467 + 15 785 ≈ 44 000</strong>
      </div>
      <div className={"strategy-card strategy-inverse " + (phase >= 1 ? "strategy-live" : "")}>
        <span>↔</span>
        <h3>{t(b("Teskari amal", "Обратное действие"))}</h3>
        <p>{t(b("Aniq hisobni tekshiradi", "Проверяет точность вычисления"))}</p>
        <strong className={phase >= 2 ? "answer-visible" : ""}>44 252 − 15 785 = 28 467</strong>
      </div>
    </div>
  );
}

function ExplanationScreen({ screen, audio }) {
  const t = useT();
  const lang = useLang();
  const c = CONTENT[screen];
  const phase = useAutoPhase(audio, c.audio[lang].length, screen);
  const [donor, setDonor] = useState(null);
  const [donorFeedback, setDonorFeedback] = useState(null);

  const pickBorrowDonor = (index) => {
    setDonor(index);
    setDonorFeedback(
      index === 3
        ? b("Eng yaqin o'nlik tanlandi.", "Выбран ближайший десяток.")
        : b("Avval eng yaqin chapdagi xonani tekshiring.", "Сначала проверь ближайший разряд слева."),
    );
  };
  const pickZeroDonor = (index) => {
    setDonor(index);
    setDonorFeedback(
      index === 0
        ? b("Birinchi nol bo'lmagan donor topildi.", "Первый ненулевой донор найден.")
        : b(
          "Nol donor bo'la olmaydi; chapdagi birinchi nol bo'lmagan raqamni toping.",
          "Ноль не может быть донором; найди первую ненулевую цифру слева.",
        ),
    );
  };

  return (
    <>
      <Heading screen={screen} />
      {c.instruction && <h2 className="scene-question">{t(c.instruction)}</h2>}
      <section className="semantic-scene">
        {screen === 1 && (
          <>
            <AlignmentScene phase={phase} />
            <OptionalGuess
              options={[
                b("O'ngdan", "Справа"),
                b("O'rtadan", "По центру"),
                b("Chapdan", "Слева"),
              ]}
              correctIndex={0}
              feedback={b(
                "Birlar xonasini birlar xonasi ostiga qo'ying.",
                "Поставь единицы под единицами.",
              )}
            />
          </>
        )}
        {screen === 2 && (
          <ColumnMath
            top={["3", "2", "4", "1", "5"]}
            bottom={["", "6", "2", "0", "3"]}
            result={["3", "8", "6", "1", "8"]}
            operator="+"
            phase={phase}
            beatCount={6}
          />
        )}
        {screen === 3 && (
          <>
            <ExchangeScene phase={phase} />
            <OptionalGuess
              options={[
                b("1 o'nlik va 2 birlik", "1 десяток и 2 единицы"),
                b("12 ni birlar katagiga", "12 в разряд единиц"),
                b("2 o'nlik va 1 birlik", "2 десятка и 1 единица"),
              ]}
              correctIndex={0}
              feedback={b(
                "Birlar katagida faqat 0 dan 9 gacha birlik qoladi.",
                "В разряде единиц остаётся только число от 0 до 9.",
              )}
            />
          </>
        )}
        {screen === 4 && (
          <ColumnMath
            top={["7", "6", "8", "5", "4"]}
            bottom={["2", "4", "1", "3", "2"]}
            result={["5", "2", "7", "2", "2"]}
            operator="−"
            phase={phase}
            beatCount={4}
          />
        )}
        {screen === 5 && (
          <>
            <BorrowScene phase={phase} picked={donor} onPick={pickBorrowDonor} />
            {donorFeedback && <small className={donor === 3 ? "guess-good" : "guess-hint"}>{t(donorFeedback)}</small>}
          </>
        )}
        {screen === 6 && (
          <>
            <ZeroChainScene phase={phase} picked={donor} onPick={pickZeroDonor} />
            {donorFeedback && <small className={donor === 0 ? "guess-good" : "guess-hint"}>{t(donorFeedback)}</small>}
          </>
        )}
        {screen === 7 && (
          <>
            <StrategyScene phase={phase} />
            <OptionalGuess
              options={[
                b("Taxmin", "Оценка"),
                b("Teskari amal", "Обратное действие"),
              ]}
              correctIndex={1}
              feedback={b(
                "Taxmin javob kattaligini tekshiradi; aniq hisobni teskari amal tekshiradi.",
                "Оценка проверяет величину; точный расчёт проверяет обратное действие.",
              )}
            />
          </>
        )}
      </section>
      <Captions lines={c.audio[lang]} phase={phase} />
    </>
  );
}

function recordPayload(screen, correct, attempts, extra = {}) {
  return {
    screenIdx: screen,
    stage: SCREEN_META[screen].scope,
    question: extra.question || "",
    correct,
    firstTry: correct && attempts === 1,
    attempts,
    ...extra,
  };
}

function HookScreen({ onAnswer, audio }) {
  const screen = 0;
  const t = useT();
  const c = CONTENT[screen];
  const phase = useAutoPhase(audio, 3, screen);
  const [picked, setPicked] = useState(null);
  const correct = picked === 0;
  const choose = (index) => {
    setPicked(index);
    onAnswer(recordPayload(screen, index === 0, 1, {
      question: t(c.lead),
      studentAnswerIndex: index,
      studentAnswer: index === 0
        ? t(b("Xonalar o'ngdan tekislangan yozuvga.", "Записи, выровненной справа."))
        : t(b("Xonalar chapdan tekislangan yozuvga.", "Записи, выровненной слева.")),
      correctAnswer: t(b("Xonalar o'ngdan tekislangan yozuvga.", "Записи, выровненной справа.")),
    }));
  };
  return (
    <>
      <Heading screen={screen} bitState="awkward" />
      <section className="hook-terminals">
        <article
          className={"terminal terminal-correct " + (picked === 0 ? "terminal-picked" : "")}
        >
          <span>{t(b("O'ngdan tekislangan", "Выровнено справа"))}</span>
          <small>48 392 + 7 605</small>
          <div className="terminal-column">
            <b>48 392</b>
            <b>+ 7 605</b>
            <i />
            <strong>55 997</strong>
          </div>
          <em className={phase >= 1 ? "units-lit" : ""}>{t(b("birlar ↕ birlar", "единицы ↕ единицы"))}</em>
        </article>
        <article
          className={"terminal terminal-wrong " + (picked === 1 ? "terminal-picked" : "")}
        >
          <span>{t(b("Chapdan tekislangan", "Выровнено слева"))}</span>
          <small>48 392 + 7 605</small>
          <div className="wrong-digit-cards">
            {["7", "6", "0", "5", ""].map((digit, index) => (
              <i className={phase >= 2 && index === 3 ? "misplaced-digit" : ""} key={index}>
                {digit || "·"}
              </i>
            ))}
          </div>
          <div className="terminal-column">
            <b>48 392</b>
            <b>+ 7 6 0 5 ·</b>
            <i />
            <strong>124 442</strong>
          </div>
        </article>
      </section>
      <div className="choice-grid hook-choice-grid">
        {[
          b("Xonalar o'ngdan tekislangan yozuvga.", "Записи, выровненной справа."),
          b("Xonalar chapdan tekislangan yozuvga.", "Записи, выровненной слева."),
        ].map((option, index) => (
          <button
            type="button"
            className={"choice-button " + (picked === index ? (index === 0 ? "choice-correct" : "choice-wrong") : "")}
            onClick={() => choose(index)}
            key={index}
          >
            {t(option)}
          </button>
        ))}
      </div>
      <Feedback show={picked != null} correct={correct}>
        {t(correct
          ? b("Javobni xonalar yordamida tekshiramiz.", "Проверим ответ с помощью разрядов.")
          : b(
            "Chapdan tekislash 7 605 sonining xona qiymatini o'zgartirib yubordi.",
            "Выравнивание слева изменило разрядное значение числа 7 605.",
          ))}
      </Feedback>
    </>
  );
}

function MiniColumn({ top, bottom, mode }) {
  const topDigits = {
    left: ["", "8", "4", "2", "1", "5"],
    right: ["8", "4", "2", "1", "5", ""],
    correct: ["", "8", "4", "2", "1", "5"],
  }[mode];
  const bottomDigits = {
    left: ["1", "9", "7", "3", "0", ""],
    right: ["", "", "1", "9", "7", "3"],
    correct: ["", "1", "9", "7", "3", "0"],
  }[mode];
  return (
    <div className="mini-column" aria-label={top + " minus " + bottom}>
      <small>{top}</small>
      <div>{topDigits.map((digit, index) => <span key={index}>{digit}</span>)}</div>
      <b>−</b>
      <div>{bottomDigits.map((digit, index) => <span key={index}>{digit}</span>)}</div>
      <i />
    </div>
  );
}

function ChoicePractice({
  screen,
  storedAnswer,
  onAnswer,
  audio,
  options,
  correctIndex,
  correctFeedback,
  wrongFeedback,
  feedbackAudio = null,
  renderOption,
  bit = false,
}) {
  const t = useT();
  const c = CONTENT[screen];
  const [picked, setPicked] = useState(
    storedAnswer?.correct ? storedAnswer.studentAnswerIndex : null,
  );
  const [solved, setSolved] = useState(Boolean(storedAnswer?.correct));
  const [attempts, setAttempts] = useState(storedAnswer?.attempts || 0);
  const [lastCorrect, setLastCorrect] = useState(Boolean(storedAnswer?.correct));

  const choose = (index) => {
    if (solved) return;
    const nextAttempts = attempts + 1;
    const isCorrect = index === correctIndex;
    setPicked(index);
    setAttempts(nextAttempts);
    setLastCorrect(isCorrect);
    if (isCorrect) setSolved(true);
    playSfx(isCorrect ? "correct" : "wrong");
    const spokenFeedback = isCorrect
      ? (feedbackAudio?.correct || correctFeedback)
      : (feedbackAudio?.wrong?.[index] || wrongFeedback[index] || wrongFeedback[0]);
    audio.pushOneOff(t(spokenFeedback));
    onAnswer(recordPayload(screen, isCorrect, nextAttempts, {
      question: t(c.lead),
      options: options.map(t),
      correctIndex,
      correctAnswer: t(options[correctIndex]),
      studentAnswerIndex: index,
      studentAnswer: t(options[index]),
      solved: isCorrect,
    }));
  };

  return (
    <>
      <Heading
        screen={screen}
        bitState={bit ? (solved ? "nod" : "awkward") : null}
      />
      {c.instruction && <h2 className="scene-question">{t(c.instruction)}</h2>}
      <div className={"choice-grid practice-options " + (renderOption ? "visual-options" : "")}>
        {options.map((option, index) => (
          <button
            type="button"
            className={
              "choice-button "
              + (picked === index ? (index === correctIndex ? "choice-correct" : "choice-wrong") : "")
            }
            onClick={() => choose(index)}
            key={index}
          >
            {renderOption ? renderOption(index) : t(option)}
          </button>
        ))}
      </div>
      {screen === 10 && solved && (
        <div className="repair-animation" aria-live="polite">
          <span>6 + 8 + 1 = 15</span>
          <i>1 ↘</i>
          <strong>36 475 + 28 689 = 65 164</strong>
        </div>
      )}
      <Feedback show={picked != null} correct={lastCorrect}>
        {t(lastCorrect ? correctFeedback : wrongFeedback[picked] || wrongFeedback[0])}
      </Feedback>
    </>
  );
}

const RESULT_FEEDBACK = [
  b(
    "6 va ko'chgan 1 yig'indisi 7.",
    "Сумма 6 и переноса 1 равна 7.",
  ),
  b(
    "3, 8 va ko'chgan 1 yig'indisi 12; minglar xonasida 2 qoladi.",
    "Сумма 3, 8 и переноса 1 равна 12; в тысячах остаётся 2.",
  ),
  b(
    "7, 5 va ko'chgan 1 yig'indisi 13; yuzlar xonasida 3 qoladi.",
    "Сумма 7, 5 и переноса 1 равна 13; в сотнях остаётся 3.",
  ),
  b(
    "0, 9 va ko'chgan 1 yig'indisi 10; o'nlar xonasida 0 qoladi. Nol xona o'rnini saqlaydi.",
    "Сумма 0, 9 и переноса 1 равна 10; в десятках остаётся 0. Ноль сохраняет разряд.",
  ),
  b(
    "8 va 6 yig'indisi 14; 4 yozilib, 1 o'nlik ko'chadi.",
    "Сумма 8 и 6 равна 14; записывается 4 и переносится 1 десяток.",
  ),
];

function BuildPractice({
  screen,
  storedAnswer,
  onAnswer,
  audio,
  cards,
  correct,
  labels,
  feedbackBySlot,
  feedbackAudioBySlot = null,
  solvedResult,
  fillFromRight = false,
}) {
  const t = useT();
  const c = CONTENT[screen];
  const restored = storedAnswer?.correct
    ? correct.map((value, index) => ({ id: "restored-" + index, value }))
    : Array(correct.length).fill(null);
  const [slots, setSlots] = useState(restored);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts || 0);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.correct));
  const [feedbackIndex, setFeedbackIndex] = useState(null);
  const [lastCorrect, setLastCorrect] = useState(Boolean(storedAnswer?.correct));

  const check = (next) => {
    if (next.some((slot) => !slot)) return;
    const values = next.map((slot) => slot.value);
    const mismatch = values.findIndex((value, index) => value !== correct[index]);
    const nextAttempts = attempts + 1;
    const isCorrect = mismatch === -1;
    setAttempts(nextAttempts);
    setLastCorrect(isCorrect);
    setFeedbackIndex(isCorrect ? -1 : mismatch);
    if (isCorrect) setSolved(true);
    playSfx(isCorrect ? "correct" : "wrong");
    const feedback = isCorrect
      ? b("Barcha xonalar to'g'ri tiklandi.", "Все разряды восстановлены верно.")
      : feedbackBySlot[mismatch];
    audio.pushOneOff(t(
      isCorrect
        ? feedback
        : (feedbackAudioBySlot?.[mismatch] || feedback),
    ));
    onAnswer(recordPayload(screen, isCorrect, nextAttempts, {
      question: t(c.instruction),
      correctAnswer: correct.join("|"),
      studentAnswer: values.join("|"),
      solved: isCorrect,
      details: { values },
    }));
  };

  const placeCard = (card) => {
    if (solved || slots.some((slot) => slot?.id === card.id)) return;
    const emptyIndex = fillFromRight
      ? slots.map((slot) => Boolean(slot)).lastIndexOf(false)
      : slots.findIndex((slot) => !slot);
    if (emptyIndex < 0) return;
    const next = [...slots];
    next[emptyIndex] = card;
    setSlots(next);
    check(next);
  };

  const clearSlot = (index) => {
    if (solved || !slots[index]) return;
    const next = [...slots];
    next[index] = null;
    setSlots(next);
    setFeedbackIndex(null);
  };

  return (
    <>
      <Heading screen={screen} />
      <h2 className="scene-question">{t(c.instruction)}</h2>
      <section className="build-board">
        <div className="build-slots">
          {slots.map((slot, index) => (
            <button
              type="button"
              className={
                "build-slot "
                + (feedbackIndex === index ? "slot-wrong " : "")
                + (solved ? "slot-correct" : "")
              }
              onClick={() => clearSlot(index)}
              aria-label={t(labels[index]) + ": " + (slot?.value || t(b("bo'sh", "пусто")))}
              key={index}
            >
              <small>{t(labels[index])}</small>
              <b>{slot?.value || "·"}</b>
            </button>
          ))}
        </div>
        <div className="card-pool" aria-label={t(b("Raqam kartalari", "Карточки чисел"))}>
          {cards.map((card) => {
            const used = slots.some((slot) => slot?.id === card.id);
            return (
              <button
                type="button"
                className={"number-card " + (used ? "card-used" : "")}
                disabled={used || solved}
                onClick={() => placeCard(card)}
                key={card.id}
              >
                {card.value}
              </button>
            );
          })}
        </div>
        <p className="tap-help">
          {t(b(
            "Kartani bosing; o'chirish uchun to'ldirilgan katakni bosing.",
            "Нажми карточку; чтобы убрать её, нажми заполненную ячейку.",
          ))}
        </p>
        {solved && solvedResult && (
          <div className="build-result" aria-live="polite">{solvedResult}</div>
        )}
      </section>
      <Feedback show={feedbackIndex != null} correct={lastCorrect}>
        {t(lastCorrect
          ? b("To'g'ri. Har bir qiymat o'z xonasida.", "Верно. Каждое значение стоит в своём разряде.")
          : feedbackBySlot[feedbackIndex])}
      </Feedback>
    </>
  );
}

const MATCH_PAIRS = [
  {
    id: "a",
    left: "27 908 + 6 754 = 34 662",
    right: "34 662 − 6 754 = 27 908",
  },
  {
    id: "b",
    left: "84 215 − 19 730 = 64 485",
    right: "64 485 + 19 730 = 84 215",
  },
  {
    id: "c",
    left: "60 002 − 24 785 = 35 217",
    right: "35 217 + 24 785 = 60 002",
  },
];

function MatchingPractice({ storedAnswer, onAnswer, audio }) {
  const screen = 12;
  const t = useT();
  const c = CONTENT[screen];
  const allRestored = Boolean(storedAnswer?.correct);
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState(allRestored ? { a: "a", b: "b", c: "c" } : {});
  const [attempts, setAttempts] = useState(storedAnswer?.attempts || 0);
  const [feedback, setFeedback] = useState(allRestored ? "correct" : null);
  const shuffledRight = [MATCH_PAIRS[1], MATCH_PAIRS[2], MATCH_PAIRS[0]];

  const pickRight = (rightId) => {
    if (!selected || matches[selected]) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (rightId !== selected) {
      setFeedback("wrong");
      playSfx("wrong");
      audio.pushOneOff(t(b(
        "Qo'shish va ayirish teskari juftligini tekshiring.",
        "Проверь пару обратных действий сложения и вычитания.",
      )));
      onAnswer(recordPayload(screen, false, nextAttempts, {
        question: t(c.lead),
        studentAnswer: selected + "→" + rightId,
        correctAnswer: selected + "→" + selected,
      }));
      return;
    }
    const nextMatches = { ...matches, [selected]: rightId };
    const complete = Object.keys(nextMatches).length === MATCH_PAIRS.length;
    setMatches(nextMatches);
    setFeedback(complete ? "correct" : "pair");
    setSelected(null);
    playSfx("correct");
    if (complete) {
      audio.pushOneOff(t(b(
        "Barcha hisoblar mos teskari amal bilan tekshirildi.",
        "Все вычисления проверены подходящими обратными действиями.",
      )));
      onAnswer(recordPayload(screen, true, nextAttempts, {
        question: t(c.lead),
        studentAnswer: "a→a, b→b, c→c",
        correctAnswer: "a→a, b→b, c→c",
        solved: true,
      }));
    }
  };

  return (
    <>
      <Heading screen={screen} />
      <section className="matching-board">
        <div className="match-column">
          <span>{t(b("Hisob", "Вычисление"))}</span>
          {MATCH_PAIRS.map((pair) => (
            <button
              type="button"
              className={
                "match-card "
                + (selected === pair.id ? "match-selected " : "")
                + (matches[pair.id] ? "match-done" : "")
              }
              disabled={Boolean(matches[pair.id])}
              onClick={() => setSelected(pair.id)}
              key={pair.id}
            >
              {pair.left}
            </button>
          ))}
        </div>
        <div className="match-arrows" aria-hidden="true">
          <span>↔</span><span>↔</span><span>↔</span>
        </div>
        <div className="match-column">
          <span>{t(b("Teskari tekshiruv", "Обратная проверка"))}</span>
          {shuffledRight.map((pair) => {
            const used = Object.values(matches).includes(pair.id);
            return (
              <button
                type="button"
                className={"match-card " + (used ? "match-done" : "")}
                disabled={used}
                onClick={() => pickRight(pair.id)}
                key={pair.id}
              >
                {pair.right}
              </button>
            );
          })}
        </div>
      </section>
      <Feedback show={feedback != null} correct={feedback !== "wrong"}>
        {t(feedback === "wrong"
          ? b(
            "Xato juft uzildi. Qo'shish ↔ ayirish belgilarini solishtiring.",
            "Неверная пара разорвана. Сравни знаки сложения ↔ вычитания.",
          )
          : feedback === "correct"
            ? b("Barcha juftlar to'g'ri.", "Все пары верны.")
            : b("Bu juft mos. Qolganlarini davom ettiring.", "Эта пара подходит. Продолжай."))}
      </Feedback>
    </>
  );
}

function NumericPractice({ storedAnswer, onAnswer, audio }) {
  const screen = 13;
  const t = useT();
  const c = CONTENT[screen];
  const [value, setValue] = useState(storedAnswer?.correct ? "53244" : "");
  const [attempts, setAttempts] = useState(storedAnswer?.attempts || 0);
  const [checked, setChecked] = useState(Boolean(storedAnswer?.correct));
  const [correct, setCorrect] = useState(Boolean(storedAnswer?.correct));

  const submit = () => {
    const normalized = value.replace(/\s/g, "");
    const nextAttempts = attempts + 1;
    const isCorrect = normalized === "53244";
    setAttempts(nextAttempts);
    setChecked(true);
    setCorrect(isCorrect);
    playSfx(isCorrect ? "correct" : "wrong");
    const message = isCorrect
      ? b(
        "To'g'ri. Ellik uch ming ikki yuz qirq to'rtta kitob qoldi.",
        "Верно. Осталось пятьдесят три тысячи двести сорок четыре книги.",
      )
      : b(
        "Taxmin chizig'iga qarang: javob ellik uch ming atrofida bo'lishi kerak.",
        "Посмотри на оценку: ответ должен быть около пятидесяти трёх тысяч.",
      );
    audio.pushOneOff(t(message));
    onAnswer(recordPayload(screen, isCorrect, nextAttempts, {
      question: t(c.lead),
      correctAnswer: "53 244",
      studentAnswer: value,
      solved: isCorrect,
    }));
  };

  return (
    <>
      <Heading screen={screen} />
      <section className="library-scene">
        <div className="books-visual" aria-hidden="true">
          <span>72 000</span>
          <i>−18 756</i>
          <b>?</b>
        </div>
        <div className="estimate-support">72 000 − 19 000 ≈ 53 000</div>
        <label className="numeric-answer">
          <span>{t(b("Javob", "Ответ"))}</span>
          <input
            inputMode="numeric"
            value={value}
            placeholder="0"
            onChange={(event) => {
              setValue(event.target.value.replace(/[^\d\s]/g, ""));
              setChecked(false);
            }}
            aria-label={t(b("Qolgan kitoblar soni", "Количество оставшихся книг"))}
          />
        </label>
        <button type="button" className="button button-check" onClick={submit}>
          {t(b("Tekshirish", "Проверить"))}
        </button>
      </section>
      <Feedback show={checked} correct={correct}>
        {t(correct
          ? b(
            "To'g'ri. Ellik uch ming ikki yuz qirq to'rtta kitob qoldi.",
            "Верно. Осталось пятьдесят три тысячи двести сорок четыре книги.",
          )
          : b(
            "Javob ellik uch ming atrofida bo'lishi kerak. Xonalarni o'ngdan tekshiring.",
            "Ответ должен быть около пятидесяти трёх тысяч. Проверь разряды справа.",
          ))}
      </Feedback>
    </>
  );
}

function SummaryScreen({ audio, answers = {} }) {
  const screen = 14;
  const t = useT();
  const lang = useLang();
  const c = CONTENT[screen];
  const phase = useAutoPhase(audio, 4, screen);
  const finalBeat = phase >= 3 || audio.completed || audio.muted;
  const scoredIndexes = SCREEN_META.reduce((indexes, meta, index) => (meta.scored ? [...indexes, index] : indexes), []);
  const answeredCount = scoredIndexes.filter((index) => answers[index]).length;
  const firstTryCount = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const totalScored = scoredIndexes.length;
  const solvedCount = scoredIndexes.filter((index) => answers[index]?.correct === true).length;
  const rewardTitles = {
    top: b("Yozma hisob me'mori", "Архитектор вычислений"),
    middle: b("Yozma hisob ustasi", "Мастер вычислений"),
    base: b("Xonalar tadqiqotchisi", "Исследователь разрядов"),
  };
  const rewardTitle = firstTryCount === totalScored
    ? rewardTitles.top
    : firstTryCount >= Math.max(1, totalScored - 1)
      ? rewardTitles.middle
      : rewardTitles.base;
  const rewardReady = finalBeat && solvedCount === totalScored;
  const rules = [
    b("Xona ostiga xona", "Разряд под разрядом"),
    b("10 ta kichik birlik → 1 ta katta birlik", "10 меньших единиц → 1 большая"),
    b("1 ta katta birlik → 10 ta kichik birlik", "1 большая единица → 10 меньших"),
    b("Taxmin + teskari amal", "Оценка + обратное действие"),
  ];
  return (
    <>
      <section className="summary-scene">
        <header className="finale-heading">
          <span>{t(b("YAKUNIY BOSQICH", "ФИНАЛЬНЫЙ ЭТАП"))}</span>
          <h1>{t(c.title)}</h1>
          <p>{t(c.lead)}</p>
        </header>
        <div className="finale-main-grid">
          <div className="finale-payoff-card">
            <span className="finale-section-kicker">{t(b("BOSHLANG'ICH MISSIYA YECHIMI", "РЕШЕНИЕ СТАРТОВОЙ МИССИИ"))}</span>
            <div className={"hook-repair " + (phase >= 2 ? "hook-repairing" : "")}>
              <div>
                <small>48 392 + 7 605</small>
                <span className="moving-number">7 605</span>
              </div>
              <b>{phase >= 3 ? "55 997" : "124 442"}</b>
            </div>
            <p className="finale-payoff-copy">{t(b(
              "Dars boshidagi noto'g'ri tekislash tuzatildi. Javob 55 997.",
              "Неверное выравнивание из начала урока исправлено. Ответ 55 997.",
            ))}</p>
          </div>
          <div className="finale-mastery-card">
            <span className="finale-section-kicker">{t(b("SIZ O'RGANGAN TAYANCHLAR", "ОСВОЕННЫЕ ОПОРЫ"))}</span>
            <div className="summary-rules">
              {rules.map((rule, index) => (
                <div className={index <= phase ? "summary-rule rule-visible" : "summary-rule"} key={index}>
                  <span>{index + 1}</span>
                  <p>{t(rule)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={rewardReady ? "finale-reward finale-reward-ready" : "finale-reward"} role="status" aria-live="polite" aria-atomic="true">
          {rewardReady && <div className="finale-confetti" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>}
          <div className="finale-medal"><i>{rewardReady ? "★" : "🔒"}</i><span>{t(b("MEDAL", "МЕДАЛЬ"))}</span></div>
          <div className="finale-bit"><BitSVG state={rewardReady ? "happy" : "present"} /></div>
          <div className="finale-reward-copy">
            <span>{rewardReady ? t(b("UNVON OLINDI", "ЗВАНИЕ ПОЛУЧЕНО")) : t(b("MUKOFOT KUTILMOQDA", "НАГРАДА ЖДЁТ"))}</span>
            <strong>{rewardReady ? t(rewardTitle) : t(b("Unvonni oching", "Открой звание"))}</strong>
            {!finalBeat ? (
              <div className="finale-status"><b>…</b><span>{t(b("Bilimlar jamlanmoqda", "Знания собираются вместе"))}</span></div>
            ) : rewardReady ? (
              <div className="finale-status"><b>{firstTryCount}/{totalScored}</b><span>{t(b("birinchi urinishda", "с первой попытки"))}<small>{answeredCount}/{totalScored} {t(b("mashq bajarildi", "заданий выполнено"))}</small></span></div>
            ) : (
              <div className="finale-status"><b>{solvedCount}/{totalScored}</b><span>{t(b("yechildi", "решено"))}<small>{answeredCount}/{totalScored} {t(b("mashq bajarildi", "заданий выполнено"))}</small></span></div>
            )}
          </div>
        </div>
        <div className={phase >= 3 ? "bridge bridge-visible" : "bridge"}>
          <span>{t(b("KEYINGI MISSIYA", "СЛЕДУЮЩАЯ МИССИЯ"))}</span>
          <strong>{t(b(
            "Ko'p xonali sonni bir xonali songa ko'paytirish",
            "Умножение многозначного числа на однозначное",
          ))}</strong>
        </div>
      </section>
      <Captions lines={c.audio[lang]} phase={phase} />
    </>
  );
}

function ScreenBody({ screen, storedAnswer, onAnswer, audio, answers }) {
  const t = useT();
  if (screen === 0) return <HookScreen onAnswer={onAnswer} audio={audio} />;
  if (screen >= 1 && screen <= 7) return <ExplanationScreen screen={screen} audio={audio} />;
  if (screen === 8) {
    const options = [
      b("Chapga siljigan", "Сдвинуто влево"),
      b("Birlar ostiga birlar", "Единицы под единицами"),
      b("O'ngga siljigan", "Сдвинуто вправо"),
    ];
    return (
      <ChoicePractice
        screen={screen}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        audio={audio}
        options={options}
        correctIndex={1}
        correctFeedback={b(
          "To'g'ri: sonlar uzunligiga emas, birlar xonasiga qarab tekislanadi.",
          "Верно: числа выравниваются по единицам, а не по длине.",
        )}
        wrongFeedback={[
          b(
            "Pastki son chapga siljigan: birlar bir chiziqda emas.",
            "Нижнее число сдвинуто влево: единицы не на одной линии.",
          ),
          b("", ""),
          b(
            "Pastki son o'ngga siljigan: birinchi mos kelmagan ustunni tekshiring.",
            "Нижнее число сдвинуто вправо: проверь первый несовпавший столбец.",
          ),
        ]}
        renderOption={(index) => (
          <MiniColumn
            top="84 215"
            bottom="19 730"
            mode={index === 0 ? "left" : index === 1 ? "correct" : "right"}
          />
        )}
      />
    );
  }
  if (screen === 9) {
    return (
      <BuildPractice
        screen={screen}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        audio={audio}
        cards={[
          { id: "seven", value: "7" },
          { id: "two", value: "2" },
          { id: "three", value: "3" },
          { id: "zero", value: "0" },
          { id: "four", value: "4" },
          { id: "one", value: "1" },
          { id: "nine", value: "9" },
        ]}
        correct={["7", "2", "3", "0", "4"]}
        labels={[
          b("o'n ming", "дес. тысяч"),
          b("ming", "тысяч"),
          b("yuz", "сотен"),
          b("o'n", "десятков"),
          b("bir", "единиц"),
        ]}
        feedbackBySlot={RESULT_FEEDBACK}
        feedbackAudioBySlot={[
          b(
            "Olti va ko'chgan bir yig'indisi yetti bo'ladi.",
            "Шесть и перенесённая единица дают семь.",
          ),
          b(
            "Uch, sakkiz va ko'chgan bir yig'indisi o'n ikki bo'ladi. Minglar xonasida ikki qoladi.",
            "Три, восемь и перенесённая единица дают двенадцать. В разряде тысяч остаётся два.",
          ),
          b(
            "Yetti, besh va ko'chgan bir yig'indisi o'n uch bo'ladi. Yuzlar xonasida uch qoladi.",
            "Семь, пять и перенесённая единица дают тринадцать. В разряде сотен остаётся три.",
          ),
          b(
            "Nol, to'qqiz va ko'chgan bir yig'indisi o'n bo'ladi. O'nlar xonasida nol qoladi.",
            "Ноль, девять и перенесённая единица дают десять. В разряде десятков остаётся ноль.",
          ),
          b(
            "Sakkiz va olti yig'indisi o'n to'rt bo'ladi. To'rt yozilib, bir o'nlik ko'chadi.",
            "Восемь и шесть дают четырнадцать. Записывается четыре и переносится один десяток.",
          ),
        ]}
        solvedResult={<span>63 708 + 8 596 = <b>72 304</b></span>}
        fillFromRight
      />
    );
  }
  if (screen === 10) {
    const options = [
      b("birlar", "единицы"),
      b("o'nlar", "десятки"),
      b("yuzlar", "сотни"),
      b("minglar", "тысячи"),
    ];
    const wrong = [
      b(
        "Birlar ustuni to'g'ri. O'ngdan keyingi ustunlarni tekshiring.",
        "Столбец единиц верен. Проверь следующие столбцы справа налево.",
      ),
      b(
        "O'nlar ustuni to'g'ri. Ko'chirilgan birlik qayerda yo'qolganini toping.",
        "Столбец десятков верен. Найди, где потерялась перенесённая единица.",
      ),
      b(
        "Yuzlar natijasi keyingi xonaga 1 minglik ko'chiradi.",
        "Результат в сотнях переносит 1 тысячу в следующий разряд.",
      ),
      b("", ""),
    ];
    return (
      <ChoicePractice
        screen={screen}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        audio={audio}
        options={options}
        correctIndex={3}
        correctFeedback={b(
          "To'g'ri. Yuzliklardan kelgan 1 minglik qo'shilmagan; javob 65 164.",
          "Верно. Перенесённая из сотен 1 тысяча не была добавлена; ответ 65 164.",
        )}
        wrongFeedback={wrong}
        feedbackAudio={{
          correct: b(
            "To'g'ri. Yuzliklardan kelgan bir minglik qo'shilmagan. Javob oltmish besh ming bir yuz oltmish to'rt.",
            "Верно. Перенесённая из сотен одна тысяча не была добавлена. Ответ равен шестидесяти пяти тысячам ста шестидесяти четырём.",
          ),
          wrong: [
            wrong[0],
            wrong[1],
            b(
              "Yuzlar natijasi keyingi xonaga bir minglik ko'chiradi.",
              "Результат в сотнях переносит одну тысячу в следующий разряд.",
            ),
            wrong[3],
          ],
        }}
        bit
      />
    );
  }
  if (screen === 11) {
    const zeroFeedback = b(
      "Bu nol orqali almashinuv hali oxirigacha yetmagan.",
      "Размен через этот нулевой разряд ещё не завершён.",
    );
    return (
      <BuildPractice
        screen={screen}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        audio={audio}
        cards={[
          { id: "five", value: "5" },
          { id: "nine-a", value: "9" },
          { id: "nine-b", value: "9" },
          { id: "nine-c", value: "9" },
          { id: "twelve", value: "12" },
          { id: "six", value: "6" },
          { id: "zero", value: "0" },
        ]}
        correct={["5", "9", "9", "9", "12"]}
        labels={[
          b("o'n ming", "дес. тысяч"),
          b("ming", "тысяч"),
          b("yuz", "сотен"),
          b("o'n", "десятков"),
          b("bir", "единиц"),
        ]}
        feedbackBySlot={[zeroFeedback, zeroFeedback, zeroFeedback, zeroFeedback, b(
          "Birliklarda 2 ga maydalangan 10 birlik qo'shilib, 12 bo'ladi.",
          "В единицах к 2 добавляются 10 разменянных единиц, получается 12.",
        )]}
        feedbackAudioBySlot={[
          zeroFeedback,
          zeroFeedback,
          zeroFeedback,
          zeroFeedback,
          b(
            "Birliklardagi ikkiga maydalangan o'nta birlik qo'shilib, o'n ikki bo'ladi.",
            "К двум единицам добавляются десять разменянных единиц, получается двенадцать.",
          ),
        ]}
        solvedResult={<span>60 002 − 24 785 = <b>35 217</b></span>}
      />
    );
  }
  if (screen === 12) return <MatchingPractice storedAnswer={storedAnswer} onAnswer={onAnswer} audio={audio} />;
  if (screen === 13) return <NumericPractice storedAnswer={storedAnswer} onAnswer={onAnswer} audio={audio} />;
  if (screen === 14) return <SummaryScreen audio={audio} answers={answers} />;
  return <p>{t(b("Ekran topilmadi.", "Экран не найден."))}</p>;
}

function LessonRuntime({
  studentName,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
  preview,
  previewLang,
  onPreviewLang,
}) {
  const lang = useLang();
  const t = useT();
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState({});
  const startedAt = useRef(null);
  const finishedRef = useRef(false);
  const audio = useAudio(CONTENT[screen].audio, screen);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    runtimeConfig = {
      ttsApiBase: ttsApiBase || "",
      voiceGender: voiceGender || "f",
      correctSoundUrl: correctSoundUrl || "",
      wrongSoundUrl: wrongSoundUrl || "",
      previewMode: preview,
    };
  }, [ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, preview]);

  const recordAnswer = useCallback((answer) => {
    setAnswers((current) => ({ ...current, [answer.screenIdx]: answer }));
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const scored = Object.values(answers).filter((answer) => (
      SCREEN_META[answer.screenIdx]?.scored
    ));
    const correctAnswers = scored.filter((answer) => answer.firstTry).length;
    const totalQuestions = 6;
    const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
    const durationSec = Math.max(
      1,
      Math.round((Date.now() - (startedAt.current || Date.now())) / 1000),
    );
    onFinished?.({
      lessonId: LESSON_META.lessonId,
      lessonTitle: t(LESSON_META.title),
      studentName: studentName || "",
      lang,
      duration: durationSec,
      durationSec,
      totalQuestions,
      correctAnswers,
      scorePercent,
      finalScore: correctAnswers,
      finalTotal: totalQuestions,
      passed: scorePercent >= 60,
      firstTryStats: {
        total: totalQuestions,
        firstTryCorrect: scored.filter((answer) => answer.firstTry).length,
      },
      attemptsTotal: scored.reduce((sum, answer) => sum + (answer.attempts || 0), 0),
      answers: scored.sort((left, right) => left.screenIdx - right.screenIdx),
    });
  }, [answers, lang, onFinished, studentName, t]);

  return (
    <div className="d8-root">
      {preview && (
        <div className="preview-language" aria-label="Preview language">
          {["ru", "uz"].map((code) => (
            <button
              type="button"
              className={previewLang === code ? "preview-active" : ""}
              onClick={() => onPreviewLang(code)}
              key={code}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <Stage
        screen={screen}
        audio={audio}
        onBack={() => setScreen((current) => Math.max(0, current - 1))}
        onNext={() => setScreen((current) => Math.min(TOTAL_SCREENS - 1, current + 1))}
        onFinish={finish}
      >
        <ScreenBody
          key={"screen-" + screen}
          screen={screen}
          answers={answers}
          storedAnswer={answers[screen]}
          onAnswer={recordAnswer}
          audio={audio}
        />
      </Stage>
    </div>
  );
}

export default function Grade4Dars08({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
}) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState("ru");
  const lang = preview ? previewLang : (langProp === "ru" ? "ru" : "uz");
  return (
    <LangContext.Provider value={lang}>
      <LessonRuntime
        studentName={studentName}
        ttsApiBase={ttsApiBase}
        voiceGender={voiceGender}
        correctSoundUrl={correctSoundUrl}
        wrongSoundUrl={wrongSoundUrl}
        onFinished={onFinished}
        preview={preview}
        previewLang={previewLang}
        onPreviewLang={setPreviewLang}
      />
      <LessonStyles />
    </LangContext.Provider>
  );
}

function LessonStyles() {
  return <style>{LESSON_CSS}</style>;
}

const LESSON_CSS = `
.d8-root {
  --bg: #F5F5F0;
  --paper: #FFFFFF;
  --ink: #12212C;
  --ink-2: #4E606C;
  --ink-3: #82919A;
  --navy: #173B52;
  --accent: #FF5B35;
  --accent-soft: #FFF0EA;
  --cyan: #168FA3;
  --cyan-soft: #E4F5F6;
  --lime: #95C93D;
  --success: #247553;
  --success-soft: #E7F4EC;
  --warning: #A96F13;
  --warning-soft: #FFF4D8;
  --line: #DDE4E7;
  width: 100%;
  min-height: 100dvh;
  height: 100dvh;
  overflow: hidden;
  color: var(--ink);
  background:
    radial-gradient(circle at 8% 4%, rgba(22, 143, 163, .09), transparent 28%),
    radial-gradient(circle at 94% 82%, rgba(255, 91, 53, .08), transparent 30%),
    var(--bg);
  font-family: Manrope, Arial, sans-serif;
  box-sizing: border-box;
}

.d8-root *,
.d8-root *::before,
.d8-root *::after {
  box-sizing: inherit;
}

.d8-root button,
.d8-root input {
  font: inherit;
}

.d8-root button {
  min-height: 44px;
  touch-action: manipulation;
}

.d8-root .stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: rgba(245, 245, 240, .94);
}

.d8-root .stage-header {
  flex: 0 0 auto;
  padding: 10px 24px 8px;
  background: rgba(247, 248, 244, .88);
  backdrop-filter: blur(14px);
}

.d8-root .progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(80, 97, 109, .16);
}

.d8-root .progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--cyan), var(--accent));
  box-shadow: 0 0 12px rgba(255, 91, 53, .42);
  transition: width .45s ease;
}

.d8-root .stage-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.d8-root .chrome-title,
.d8-root .chrome-actions,
.d8-root .audio-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}

.d8-root .chrome-title {
  min-width: 0;
  color: var(--ink-2);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.d8-root .chrome-title > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.d8-root .status-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px rgba(255, 91, 53, .65);
}

.d8-root .screen-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.d8-root .screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: var(--cyan);
  background: #E5F5F6;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.d8-root .icon-btn {
  width: 32px;
  height: 32px;
  min-height: 32px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: var(--ink-2);
  background: rgba(255, 255, 255, .75);
  cursor: pointer;
  box-shadow: 0 4px 12px -7px rgba(58, 53, 48, .3);
}

.d8-root .stage-content {
  min-height: 0;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 24px 32px 32px;
  scrollbar-gutter: stable;
}

.d8-root .stage-nav {
  flex: 0 0 auto;
  min-height: 74px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--line);
  background: rgba(255, 255, 255, .92);
  backdrop-filter: blur(10px);
}

.d8-root .button {
  min-width: 132px;
  padding: 11px 18px;
  border: 0;
  border-radius: 14px;
  font-weight: 850;
  cursor: pointer;
}

.d8-root .button-primary {
  color: #FFFFFF;
  background: var(--accent);
  box-shadow: 0 8px 20px rgba(255, 91, 53, .24);
}

.d8-root .button-ghost {
  color: var(--ink-2);
  border: 1px solid var(--line);
  background: var(--paper);
}

.d8-root .button-check {
  color: #FFFFFF;
  background: var(--navy);
}

.d8-root .heading {
  margin: 0 0 20px;
}

.d8-root .heading-with-bit {
  min-height: 132px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 108px;
  align-items: center;
  gap: 22px;
}

.d8-root .eyebrow {
  display: block;
  margin-bottom: 7px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .13em;
  text-transform: uppercase;
}

.d8-root h1 {
  max-width: 760px;
  margin: 0;
  font-family: "Source Serif 4", Georgia, serif;
  font-size: clamp(29px, 4vw, 46px);
  line-height: 1.04;
  letter-spacing: -.025em;
}

.d8-root .heading p {
  max-width: 720px;
  margin: 11px 0 0;
  color: var(--ink-2);
  font-size: 16px;
  line-height: 1.55;
}

.d8-root .bit-shell {
  width: 104px;
  height: 130px;
  display: grid;
  place-items: center;
}

.d8-root .heading-with-small-bit {
  min-height: 90px;
  grid-template-columns: minmax(0, 1fr) 72px;
}

.d8-root .bit-shell-small {
  width: 68px;
  height: 85px;
}

.d8-root .bit-shell-small .g1-char {
  width: 68px;
  height: 85px;
}

.d8-root .g1-char {
  width: 104px;
  height: 130px;
  overflow: visible;
}

.d8-root .g1-bit-ant {
  transform-origin: 60px 28px;
  animation: bitAntenna 2.4s ease-in-out infinite;
}

.d8-root .g1-bit-wave,
.d8-root .bit-wave-right {
  transform-origin: 84px 74px;
  animation: bitWave 1.6s ease-in-out infinite;
}

.d8-root .bit-wave-left {
  transform-origin: 36px 74px;
  animation: bitWaveLeft 1.6s ease-in-out infinite;
}

.d8-root .bit-awkward-hands {
  animation: awkwardHands 1.8s ease-in-out infinite;
}

.d8-root .mini-coach {
  width: max-content;
  max-width: 100%;
  margin: 7px 0 4px auto;
  display: grid;
  grid-template-columns: 68px auto;
  align-items: center;
  gap: 5px;
}

.d8-root .mini-coach .g1-char {
  width: 68px;
  height: 84px;
}

.d8-root .mini-coach > span {
  padding: 7px 10px;
  border: 1px solid rgba(255, 91, 53, .22);
  border-radius: 999px;
  color: var(--accent);
  background: var(--accent-soft);
  font: 900 13px/1 JetBrains Mono, monospace;
}

.d8-root .place-warehouse-svg,
.d8-root .exchange-bundle-svg,
.d8-root .donor-path-svg {
  width: 100%;
  display: block;
  overflow: visible;
}

.d8-root .place-warehouse-svg {
  height: 118px;
  margin: -5px auto 7px;
  overflow: hidden;
}

.d8-root .warehouse-belt {
  fill: none;
  stroke: var(--navy);
  stroke-width: 3;
  stroke-linecap: round;
  opacity: .16;
}

.d8-root .warehouse-bay > rect:first-child {
  fill: rgba(228, 245, 246, .72);
  stroke: rgba(22, 143, 163, .28);
  stroke-width: 1.5;
}

.d8-root .warehouse-bay > text {
  fill: var(--ink-3);
  font: 800 9px/1 JetBrains Mono, monospace;
  text-anchor: middle;
}

.d8-root .warehouse-crate {
  stroke-width: 1.5;
}

.d8-root .top-crate {
  fill: var(--paper);
  stroke: rgba(23, 59, 82, .2);
}

.d8-root .lower-crate {
  fill: var(--accent-soft);
  stroke: rgba(255, 91, 53, .34);
}

.d8-root .warehouse-digit {
  fill: var(--navy);
  font: 900 15px/1 JetBrains Mono, monospace;
  text-anchor: middle;
}

.d8-root .warehouse-digit.lower-digit {
  fill: var(--accent);
}

.d8-root .warehouse-moving {
  opacity: .45;
  transform: translateX(-46px);
  transition: transform .7s cubic-bezier(.16, 1, .3, 1), opacity .45s ease;
}

.d8-root .place-warehouse-svg.phase-1 .warehouse-moving,
.d8-root .place-warehouse-svg.phase-2 .warehouse-moving {
  opacity: 1;
  transform: translateX(0);
}

.d8-root .warehouse-unit-guide {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transition: opacity .35s ease;
}

.d8-root .place-warehouse-svg.phase-2 .warehouse-unit-guide {
  opacity: 1;
}

.d8-root .exchange-bundle-svg {
  height: 116px;
  margin: 5px auto 0;
}

.d8-root .loose-ten circle,
.d8-root .remainder-two circle {
  fill: var(--cyan);
}

.d8-root .loose-ten {
  transform-origin: 126px 56px;
  transition: opacity .5s ease, transform .65s cubic-bezier(.16, 1, .3, 1);
}

.d8-root .exchange-flow,
.d8-root .exchange-flow-tip,
.d8-root .exchange-plus {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.d8-root .bundled-ten {
  opacity: 0;
  transform: translateX(-28px) scale(.9);
  transform-origin: 315px 56px;
  transition: opacity .45s ease, transform .65s cubic-bezier(.16, 1, .3, 1);
}

.d8-root .bundled-ten rect {
  fill: var(--accent-soft);
  stroke: var(--accent);
  stroke-width: 2;
}

.d8-root .bundled-ten circle {
  fill: var(--accent);
}

.d8-root .bundled-ten text,
.d8-root .remainder-two text {
  fill: var(--navy);
  font: 900 13px/1 JetBrains Mono, monospace;
  text-anchor: middle;
}

.d8-root .exchange-bundle-svg.is-bundled .loose-ten {
  opacity: .12;
  transform: translateX(154px) scale(.5);
}

.d8-root .exchange-bundle-svg.is-bundled .bundled-ten {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.d8-root .donor-path-svg {
  height: 108px;
  margin: -2px auto 0;
}

.d8-root .donor-route,
.d8-root .donor-route-tip {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 660;
  stroke-dashoffset: 660;
  opacity: .18;
  transition: stroke-dashoffset .95s ease, opacity .3s ease;
}

.d8-root .donor-checkpoint circle {
  fill: var(--cyan-soft);
  stroke: rgba(22, 143, 163, .36);
  stroke-width: 2;
}

.d8-root .zero-checkpoint circle {
  fill: var(--warning-soft);
  stroke: rgba(169, 111, 19, .42);
}

.d8-root .donor-checkpoint text,
.d8-root .donor-token text {
  fill: var(--navy);
  font: 900 17px/1 JetBrains Mono, monospace;
  text-anchor: middle;
}

.d8-root .donor-token {
  opacity: 0;
  transition: transform 1.05s cubic-bezier(.16, 1, .3, 1), opacity .25s ease;
}

.d8-root .donor-token rect {
  fill: var(--accent);
}

.d8-root .donor-token text {
  fill: #FFFFFF;
  font-size: 12px;
}

.d8-root .donor-change {
  fill: var(--success);
  font: 900 11px/1 JetBrains Mono, monospace;
  text-anchor: middle;
  opacity: 0;
  transition: opacity .4s ease .45s;
}

.d8-root .donor-path-svg.path-active .donor-route,
.d8-root .donor-path-svg.path-active .donor-route-tip {
  stroke-dashoffset: 0;
  opacity: 1;
}

.d8-root .donor-path-svg.path-active .donor-token {
  opacity: 1;
  transform: translateX(484px);
}

.d8-root .donor-path-svg.path-active .donor-change {
  opacity: 1;
}

.d8-root .scene-question {
  max-width: 760px;
  margin: -4px 0 16px;
  color: var(--navy);
  font-family: "Source Serif 4", Georgia, serif;
  font-size: clamp(20px, 2.5vw, 29px);
  line-height: 1.25;
}

.d8-root .semantic-scene {
  display: grid;
  gap: 18px;
  padding: 4px 0;
}

.d8-root .place-row {
  width: min(570px, 100%);
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(5, minmax(44px, 1fr));
  gap: 6px;
}

.d8-root .place-row > span {
  min-width: 0;
  min-height: 54px;
  display: grid;
  place-items: center;
  border-radius: 12px;
}

.d8-root .place-labels > span {
  min-height: 28px;
  color: var(--ink-3);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .03em;
}

.d8-root .digit-row > span {
  border: 1px solid var(--line);
  color: var(--navy);
  background: var(--paper);
  font: 800 clamp(25px, 5vw, 38px)/1 JetBrains Mono, monospace;
  transition: transform .3s ease, background .3s ease, opacity .3s ease;
}

.d8-root .digit-row > span.active-place {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
  transform: translateY(-3px);
  box-shadow: 0 7px 18px rgba(255, 91, 53, .17);
}

.d8-root .digit-row > span.digit-hidden {
  opacity: .08;
  transform: translateY(-12px);
}

.d8-root .digit-row > span i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--line);
}

.d8-root .second-row > span {
  background: var(--cyan-soft);
}

.d8-root .result-row > span {
  border-color: #B8DFC7;
  color: var(--success);
  background: var(--success-soft);
}

.d8-root .borrow-row > span {
  min-height: 34px;
  color: var(--warning);
  background: var(--warning-soft);
  font-size: 17px;
}

.d8-root .column-board,
.d8-root .alignment-board,
.d8-root .exchange-scene,
.d8-root .borrow-scene,
.d8-root .zero-chain-scene {
  width: min(680px, 100%);
  margin-inline: auto;
  padding: clamp(14px, 3vw, 26px);
  border-left: 4px solid var(--cyan);
  border-radius: 0 20px 20px 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, .98), rgba(228, 245, 246, .7));
  box-shadow: 0 16px 38px rgba(23, 59, 82, .08);
}

.d8-root .operator-row {
  width: min(620px, 100%);
  margin: 6px auto 0;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
}

.d8-root .operator-row > b {
  color: var(--accent);
  font: 900 32px/1 JetBrains Mono, monospace;
}

.d8-root .operator-row .place-row {
  width: 100%;
}

.d8-root .column-rule {
  width: min(570px, calc(100% - 34px));
  height: 3px;
  margin: 8px 0 8px auto;
  border-radius: 99px;
  background: var(--navy);
}

.d8-root .alignment-board {
  position: relative;
  min-height: 286px;
  overflow: hidden;
}

.d8-root .alignment-board .sliding-row {
  width: min(610px, 100%);
  margin: 8px auto;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  transition: transform .7s cubic-bezier(.2, .9, .2, 1);
}

.d8-root .alignment-board .sliding-row > b {
  color: var(--accent);
  font-size: 28px;
}

.d8-root .alignment-board .sliding-row .place-row {
  width: 100%;
}

.d8-root .slide-position-0 {
  transform: translateX(-58px);
  opacity: .55;
}

.d8-root .slide-position-1,
.d8-root .slide-position-2 {
  transform: translateX(0);
  opacity: 1;
}

.d8-root .alignment-guide {
  width: min(570px, 100%);
  margin: -4px auto 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  opacity: 0;
  transition: opacity .35s ease;
}

.d8-root .alignment-guide.guide-visible {
  opacity: 1;
}

.d8-root .alignment-guide span {
  height: 28px;
  display: grid;
  place-items: center;
  color: var(--accent);
  font-weight: 900;
}

.d8-root .alignment-board > strong {
  display: block;
  margin-top: 4px;
  color: var(--success);
  font: 900 31px/1 JetBrains Mono, monospace;
  text-align: center;
  opacity: 0;
  transform: translateY(-8px);
  transition: .4s ease;
}

.d8-root .answer-visible {
  opacity: 1 !important;
  transform: translate(0, 0) !important;
}

.d8-root .optional-guess {
  width: min(680px, 100%);
  margin-inline: auto;
}

.d8-root .optional-guess > span {
  display: block;
  margin-bottom: 8px;
  color: var(--ink-3);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.d8-root .guess-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.d8-root .guess-chip {
  padding: 9px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink);
  background: var(--paper);
  cursor: pointer;
}

.d8-root .guess-chip.is-correct {
  border-color: var(--success);
  color: var(--success);
  background: var(--success-soft);
}

.d8-root .guess-chip.is-wrong {
  border-color: var(--warning);
  color: var(--warning);
  background: var(--warning-soft);
}

.d8-root .guess-good,
.d8-root .guess-hint {
  display: block;
  width: min(680px, 100%);
  margin: 9px auto 0;
  color: var(--success);
  line-height: 1.4;
}

.d8-root .guess-hint {
  color: var(--warning);
}

.d8-root .equation-focus {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font: 850 clamp(26px, 5vw, 42px)/1 JetBrains Mono, monospace;
}

.d8-root .equation-focus b {
  color: var(--accent);
}

.d8-root .unit-dots {
  width: min(430px, 100%);
  margin: 22px auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 6px;
}

.d8-root .unit-dots i {
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--cyan);
  transition: transform .55s ease, background .55s ease;
}

.d8-root .unit-dots.dots-bundled i:nth-child(-n+10) {
  background: var(--accent);
  transform: translateY(-8px) scale(.88);
}

.d8-root .exchange-result {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: .45s ease;
}

.d8-root .exchange-result span {
  padding: 10px 12px;
  border-radius: 11px;
  color: var(--navy);
  background: var(--cyan-soft);
  font-weight: 850;
}

.d8-root .exchange-result .ten-bundle {
  color: var(--accent);
  background: var(--accent-soft);
}

.d8-root .final-equation {
  margin-top: 20px;
  color: var(--navy);
  font: 800 clamp(22px, 4vw, 32px)/1.2 JetBrains Mono, monospace;
  text-align: center;
  opacity: 0;
  transform: translateY(10px);
  transition: .45s ease;
}

.d8-root .final-equation b {
  color: var(--success);
}

.d8-root .donor-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(54px, 1fr));
  gap: 7px;
}

.d8-root .donor-strip button {
  min-width: 0;
  padding: 8px 3px;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--navy);
  background: var(--paper);
  cursor: pointer;
  transition: .3s ease;
}

.d8-root .donor-strip small {
  min-height: 26px;
  display: block;
  color: var(--ink-3);
  font-size: 9px;
}

.d8-root .donor-strip b {
  display: block;
  font: 900 28px/1 JetBrains Mono, monospace;
}

.d8-root .donor-strip .guessed {
  border-color: var(--warning);
}

.d8-root .donor-strip .auto-donor {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
  box-shadow: 0 0 0 4px rgba(255, 91, 53, .12);
}

.d8-root .donor-strip .zero-donor:not(.auto-donor) {
  color: var(--ink-3);
}

.d8-root .borrow-arrow {
  margin: 18px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  opacity: 0;
  transform: translateY(-10px);
  transition: .45s ease;
}

.d8-root .borrow-arrow span {
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--accent);
  background: var(--accent-soft);
  font: 850 18px/1 JetBrains Mono, monospace;
}

.d8-root .borrow-arrow i {
  color: var(--accent);
  font-size: 28px;
}

.d8-root .borrow-units {
  margin-top: 18px;
  text-align: center;
  opacity: 0;
  transform: translateY(8px);
  transition: .4s ease;
}

.d8-root .borrow-units > b {
  font: 850 24px/1 JetBrains Mono, monospace;
}

.d8-root .borrow-units > div {
  width: min(330px, 100%);
  margin: 12px auto 0;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 5px;
}

.d8-root .borrow-units i {
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--lime);
}

.d8-root .borrow-units i.taken {
  opacity: .2;
  transform: scale(.75);
}

.d8-root .chain-arc {
  height: 56px;
  margin-top: -2px;
  opacity: 0;
}

.d8-root .chain-arc svg {
  width: 100%;
  height: 100%;
}

.d8-root .chain-arc path {
  fill: none;
  stroke: var(--accent);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 620;
  stroke-dashoffset: 620;
}

.d8-root .chain-arc.chain-running {
  opacity: 1;
}

.d8-root .chain-arc.chain-running path {
  animation: drawChain 1.2s ease forwards;
}

.d8-root .state-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 7px;
  opacity: 0;
  transform: translateY(10px);
  transition: .45s ease;
}

.d8-root .state-row span {
  min-width: 0;
  padding: 8px 3px;
  border-radius: 12px;
  color: var(--navy);
  background: var(--cyan-soft);
  text-align: center;
}

.d8-root .state-row small {
  min-height: 25px;
  display: block;
  color: var(--ink-3);
  font-size: 9px;
}

.d8-root .state-row b {
  font: 900 25px/1 JetBrains Mono, monospace;
}

.d8-root .strategy-scene {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.d8-root .strategy-card {
  min-height: 228px;
  padding: 22px;
  border-top: 5px solid var(--cyan);
  border-radius: 18px;
  background: var(--paper);
  box-shadow: 0 16px 35px rgba(23, 59, 82, .08);
  opacity: .45;
  transform: translateY(10px);
  transition: .45s ease;
}

.d8-root .strategy-card.strategy-live {
  opacity: 1;
  transform: none;
}

.d8-root .strategy-card > span {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: var(--cyan);
  background: var(--cyan-soft);
  font-size: 27px;
  font-weight: 900;
}

.d8-root .strategy-card h3 {
  margin: 14px 0 7px;
  font-family: "Source Serif 4", Georgia, serif;
  font-size: 26px;
}

.d8-root .strategy-card p {
  min-height: 46px;
  margin: 0 0 14px;
  color: var(--ink-2);
  line-height: 1.45;
}

.d8-root .strategy-card strong {
  display: block;
  color: var(--navy);
  font: 800 16px/1.45 JetBrains Mono, monospace;
  opacity: 0;
  transform: translateY(8px);
  transition: .4s ease;
}

.d8-root .strategy-inverse {
  border-color: var(--accent);
}

.d8-root .strategy-inverse > span {
  color: var(--accent);
  background: var(--accent-soft);
}

.d8-root .captions {
  width: min(760px, 100%);
  margin: 20px auto 0;
  display: grid;
  gap: 7px;
}

.d8-root .captions p {
  margin: 0;
  padding: 9px 12px;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 8px;
  border-left: 3px solid transparent;
  border-radius: 0 10px 10px 0;
  color: var(--ink-3);
  font-size: 13px;
  line-height: 1.45;
  transition: .3s ease;
}

.d8-root .captions p.caption-active {
  border-left-color: var(--accent);
  color: var(--ink);
  background: var(--accent-soft);
}

.d8-root .captions p.caption-done {
  color: var(--ink-2);
}

.d8-root .captions p span {
  color: var(--success);
  font-weight: 900;
}

.d8-root .hook-terminals {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.d8-root .terminal {
  position: relative;
  min-height: 260px;
  padding: 18px;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 20px;
  color: #EAF7FA;
  background: var(--navy);
  text-align: left;
  cursor: pointer;
  transition: transform .25s ease, border-color .25s ease;
}

.d8-root .terminal:hover,
.d8-root .terminal:focus-visible {
  transform: translateY(-3px);
}

.d8-root .terminal-picked {
  border-color: var(--accent);
}

.d8-root .terminal > span {
  display: block;
  color: #8FE5F3;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.d8-root .terminal > small {
  display: block;
  margin: 7px 0 14px;
  color: #C1D7DF;
}

.d8-root .terminal-column {
  width: min(220px, 100%);
  margin: 0 auto;
  display: grid;
  justify-items: end;
  gap: 4px;
  font: 800 clamp(20px, 4vw, 29px)/1.25 JetBrains Mono, monospace;
}

.d8-root .terminal-column i {
  width: 100%;
  height: 2px;
  background: #8FB1BE;
}

.d8-root .terminal-column strong {
  color: #A7E34C;
}

.d8-root .terminal-wrong .terminal-column strong {
  color: #FF9B82;
}

.d8-root .terminal em {
  display: block;
  margin-top: 13px;
  color: #C1D7DF;
  font-size: 12px;
  font-style: normal;
  text-align: center;
  opacity: .45;
}

.d8-root .terminal em.units-lit {
  color: #A7E34C;
  opacity: 1;
  animation: softPulse 1.2s ease-in-out infinite;
}

.d8-root .wrong-digit-cards {
  width: min(235px, 100%);
  margin: -3px auto 8px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}

.d8-root .wrong-digit-cards i {
  min-height: 35px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 7px;
  color: #FFFFFF;
  font: 800 16px/1 JetBrains Mono, monospace;
  font-style: normal;
}

.d8-root .wrong-digit-cards i.misplaced-digit {
  border-color: #FF9B82;
  color: #FF9B82;
  box-shadow: 0 0 0 3px rgba(255, 155, 130, .18);
}

.d8-root .choice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.d8-root .hook-choice-grid {
  margin-top: 14px;
}

.d8-root .choice-button {
  min-height: 54px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--ink);
  background: var(--paper);
  font-weight: 750;
  text-align: left;
  cursor: pointer;
  transition: .25s ease;
}

.d8-root .choice-button:hover,
.d8-root .choice-button:focus-visible {
  border-color: var(--cyan);
  transform: translateY(-2px);
}

.d8-root .choice-button.choice-correct {
  border-color: var(--success);
  color: var(--success);
  background: var(--success-soft);
}

.d8-root .choice-button.choice-wrong {
  border-color: var(--warning);
  color: var(--warning);
  background: var(--warning-soft);
}

.d8-root .practice-options {
  width: min(760px, 100%);
  margin-inline: auto;
}

.d8-root .visual-options {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.d8-root .visual-options .choice-button {
  padding: 8px;
}

.d8-root .mini-column {
  position: relative;
  padding: 8px 3px 4px;
}

.d8-root .mini-column > small {
  display: block;
  margin-bottom: 6px;
  color: var(--ink-3);
  text-align: center;
}

.d8-root .mini-column > div {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2px;
}

.d8-root .mini-column span {
  min-width: 0;
  min-height: 27px;
  display: grid;
  place-items: center;
  border-radius: 5px;
  background: #F1F4F5;
  font: 800 14px/1 JetBrains Mono, monospace;
}

.d8-root .mini-column > b {
  position: absolute;
  left: 0;
  top: 76px;
  color: var(--accent);
}

.d8-root .mini-column > i {
  display: block;
  height: 2px;
  margin-top: 4px;
  background: var(--navy);
}

.d8-root .feedback {
  width: min(760px, 100%);
  margin: 14px auto 0;
  padding: 12px 14px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: start;
  gap: 8px;
  border-radius: 13px;
}

.d8-root .feedback-correct {
  color: var(--success);
  background: var(--success-soft);
}

.d8-root .feedback-wrong {
  color: var(--warning);
  background: var(--warning-soft);
}

.d8-root .feedback > span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, .72);
  font-weight: 900;
}

.d8-root .feedback p {
  margin: 3px 0 0;
  line-height: 1.48;
}

.d8-root .repair-animation {
  width: min(680px, 100%);
  margin: 16px auto 0;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-left: 4px solid var(--success);
  border-radius: 0 14px 14px 0;
  background: var(--success-soft);
}

.d8-root .repair-animation span,
.d8-root .repair-animation strong {
  font: 800 17px/1.4 JetBrains Mono, monospace;
}

.d8-root .repair-animation i {
  color: var(--accent);
  font-style: normal;
  animation: carryDrop 1s ease both;
}

.d8-root .build-board {
  width: min(760px, 100%);
  margin-inline: auto;
}

.d8-root .build-slots {
  display: grid;
  grid-template-columns: repeat(5, minmax(50px, 1fr));
  gap: 8px;
}

.d8-root .build-slot {
  min-width: 0;
  min-height: 84px;
  padding: 7px 3px;
  border: 2px dashed #B8C6CC;
  border-radius: 14px;
  color: var(--navy);
  background: rgba(255, 255, 255, .72);
  cursor: pointer;
}

.d8-root .build-slot small {
  min-height: 28px;
  display: block;
  color: var(--ink-3);
  font-size: 9px;
}

.d8-root .build-slot b {
  display: block;
  font: 900 clamp(21px, 5vw, 32px)/1 JetBrains Mono, monospace;
}

.d8-root .build-slot.slot-wrong {
  border-color: var(--warning);
  color: var(--warning);
  background: var(--warning-soft);
  animation: gentleShake .35s ease;
}

.d8-root .build-slot.slot-correct {
  border-style: solid;
  border-color: var(--success);
  color: var(--success);
  background: var(--success-soft);
}

.d8-root .card-pool {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
}

.d8-root .number-card {
  min-width: 55px;
  padding: 9px 13px;
  border: 1px solid var(--cyan);
  border-radius: 12px;
  color: var(--cyan);
  background: var(--cyan-soft);
  font: 900 22px/1 JetBrains Mono, monospace;
  cursor: pointer;
}

.d8-root .number-card.card-used {
  opacity: .22;
}

.d8-root .tap-help {
  margin: 11px 0 0;
  color: var(--ink-3);
  font-size: 12px;
  text-align: center;
}

.d8-root .build-result {
  margin-top: 14px;
  padding: 14px;
  border-radius: 13px;
  color: var(--success);
  background: var(--success-soft);
  font: 800 clamp(19px, 4vw, 27px)/1.3 JetBrains Mono, monospace;
  text-align: center;
}

.d8-root .matching-board {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px minmax(0, 1fr);
  gap: 10px;
  align-items: stretch;
}

.d8-root .match-column {
  display: grid;
  grid-template-rows: auto repeat(3, minmax(76px, auto));
  gap: 9px;
}

.d8-root .match-column > span {
  color: var(--ink-3);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.d8-root .match-card {
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 13px;
  color: var(--navy);
  background: var(--paper);
  font: 750 clamp(12px, 2vw, 15px)/1.4 JetBrains Mono, monospace;
  text-align: left;
  cursor: pointer;
}

.d8-root .match-card.match-selected {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.d8-root .match-card.match-done {
  border-color: var(--success);
  color: var(--success);
  background: var(--success-soft);
  opacity: .82;
}

.d8-root .match-arrows {
  padding-top: 29px;
  display: grid;
  grid-template-rows: repeat(3, minmax(76px, auto));
  place-items: center;
  gap: 9px;
  color: var(--accent);
  font-size: 23px;
}

.d8-root .library-scene {
  width: min(650px, 100%);
  margin-inline: auto;
  display: grid;
  justify-items: center;
  gap: 14px;
}

.d8-root .books-visual {
  width: 100%;
  min-height: 130px;
  padding: 22px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  border-left: 5px solid var(--cyan);
  border-radius: 0 18px 18px 0;
  background: linear-gradient(135deg, var(--paper), var(--cyan-soft));
}

.d8-root .books-visual span,
.d8-root .books-visual i,
.d8-root .books-visual b {
  font: 900 clamp(22px, 5vw, 34px)/1 JetBrains Mono, monospace;
  text-align: center;
}

.d8-root .books-visual i {
  color: var(--accent);
  font-size: clamp(17px, 4vw, 25px);
  font-style: normal;
}

.d8-root .books-visual b {
  color: var(--success);
}

.d8-root .estimate-support {
  padding: 9px 13px;
  border-radius: 999px;
  color: var(--cyan);
  background: var(--cyan-soft);
  font: 800 14px/1.2 JetBrains Mono, monospace;
}

.d8-root .numeric-answer {
  width: min(310px, 100%);
}

.d8-root .numeric-answer > span {
  display: block;
  margin-bottom: 6px;
  color: var(--ink-2);
  font-size: 12px;
  font-weight: 850;
}

.d8-root .numeric-answer input {
  width: 100%;
  min-height: 58px;
  padding: 10px 15px;
  border: 2px solid var(--line);
  border-radius: 14px;
  color: var(--navy);
  background: var(--paper);
  font: 850 25px/1 JetBrains Mono, monospace;
  text-align: center;
  outline: none;
}

.d8-root .numeric-answer input:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 0 4px rgba(22, 143, 163, .12);
}

.d8-root .summary-scene {
  display: grid;
  gap: 12px;
}

.d8-root .finale-heading {
  padding: 12px 16px;
  display: grid;
  gap: 4px;
  border-left: 5px solid var(--orange);
  border-radius: 0 17px 17px 0;
  background: rgba(255, 255, 255, .78);
  box-shadow: 0 8px 22px var(--shadow);
}

.d8-root .finale-heading > span {
  color: var(--orange);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .11em;
}

.d8-root .finale-heading h1 {
  margin: 0;
  color: var(--ink);
  font: 800 clamp(21px, 3.3vw, 29px)/1.08 Source Serif 4, Georgia, serif;
}

.d8-root .finale-heading p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 11px;
  font-weight: 750;
  line-height: 1.35;
}

.d8-root .finale-main-grid {
  display: grid;
  grid-template-columns: minmax(260px, .8fr) minmax(0, 1.2fr);
  gap: 12px;
  align-items: stretch;
}

.d8-root .finale-payoff-card,
.d8-root .finale-mastery-card {
  min-width: 0;
  padding: 14px;
  border-radius: 19px;
  background: rgba(255, 255, 255, .74);
  box-shadow: 0 8px 22px var(--shadow);
}

.d8-root .finale-payoff-card {
  display: grid;
  align-content: center;
  gap: 9px;
}

.d8-root .finale-section-kicker {
  color: var(--cyan);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .1em;
}

.d8-root .summary-rules {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
  margin-top: 9px;
}

.d8-root .summary-rule {
  min-height: 56px;
  padding: 8px 9px;
  display: grid;
  grid-template-columns: 31px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  border-left: 3px solid var(--line);
  border-radius: 0 12px 12px 0;
  background: rgba(255, 255, 255, .6);
  opacity: .3;
  transform: translateX(-10px);
  transition: .4s ease;
}

.d8-root .summary-rule.rule-visible {
  border-left-color: var(--cyan);
  background: var(--paper);
  opacity: 1;
  transform: none;
}

.d8-root .summary-rule span {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: var(--cyan);
  background: var(--cyan-soft);
  font-weight: 900;
}

.d8-root .summary-rule p {
  margin: 0;
  font-size: 11px;
  font-weight: 750;
  line-height: 1.35;
}

.d8-root .hook-repair {
  min-height: 116px;
  padding: 14px;
  display: grid;
  align-content: center;
  gap: 12px;
  border-radius: 15px;
  color: #EAF7FA;
  background: var(--navy);
  text-align: center;
}

.d8-root .hook-repair div {
  display: grid;
  gap: 10px;
}

.d8-root .hook-repair small {
  color: #B9D0D9;
}

.d8-root .moving-number {
  display: block;
  font: 800 22px/1 JetBrains Mono, monospace;
  transition: transform .8s cubic-bezier(.2, .9, .2, 1);
}

.d8-root .hook-repairing .moving-number {
  transform: translateX(28px);
}

.d8-root .hook-repair > b {
  color: #FF9B82;
  font: 900 28px/1 JetBrains Mono, monospace;
  transition: color .35s ease;
}

.d8-root .hook-repairing > b {
  color: #A7E34C;
}

.d8-root .finale-payoff-copy {
  margin: 0;
  color: var(--ink-soft);
  font-size: 10px;
  font-weight: 800;
  line-height: 1.35;
}

.d8-root .finale-reward {
  position: relative;
  min-height: 128px;
  padding: 10px 22px;
  display: grid;
  grid-template-columns: 82px 106px minmax(0, 1fr);
  align-items: center;
  gap: 15px;
  border-radius: 22px;
  color: white;
  background: var(--navy);
  opacity: .52;
  overflow: hidden;
  transform: translateY(7px);
  transition: opacity .5s ease, transform .5s ease;
}

.d8-root .finale-reward-ready {
  opacity: 1;
  transform: none;
}

.d8-root .finale-medal {
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 6px;
  color: white;
  font-size: 7px;
  font-weight: 900;
  letter-spacing: .08em;
}

.d8-root .finale-medal i {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #704800;
  background: radial-gradient(circle at 35% 28%, #FFF0A0, #FFC23C 57%, #D69300);
  box-shadow: 0 0 0 7px rgba(255, 194, 60, .12), 0 12px 24px rgba(0, 0, 0, .22);
  font-size: 29px;
  font-style: normal;
}

.d8-root .finale-reward:not(.finale-reward-ready) .finale-medal i {
  color: #B7C3CA;
  background: radial-gradient(circle at 35% 28%, #F5F7F8, #B9C5CB 68%, #87949D);
  box-shadow: 0 0 0 7px rgba(255, 255, 255, .07);
}

.d8-root .finale-bit {
  z-index: 1;
  height: 112px;
}

.d8-root .finale-bit .g1-char {
  width: 100%;
  height: 100%;
}

.d8-root .finale-reward-copy {
  z-index: 1;
  min-width: 0;
  display: grid;
  gap: 5px;
}

.d8-root .finale-reward-copy > span {
  color: #9DEBF7;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .1em;
}

.d8-root .finale-reward-copy > strong {
  font: 800 clamp(18px, 2.4vw, 25px)/1.08 Source Serif 4, Georgia, serif;
}

.d8-root .finale-reward-copy > small {
  color: rgba(255, 255, 255, .7);
  font-size: 10px;
  font-weight: 800;
}

.d8-root .finale-status { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 8px; }
.d8-root .finale-status > b { color: #FFC23C; font: 900 20px/1 JetBrains Mono, monospace; }
.d8-root .finale-status > span { display: grid; gap: 2px; color: white; font-size: 9px; font-weight: 850; }
.d8-root .finale-status small { color: rgba(255, 255, 255, .68); font-size: 8px; }

.d8-root .finale-confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.d8-root .finale-confetti i {
  position: absolute;
  width: 6px;
  height: 10px;
  border-radius: 2px;
  background: var(--orange);
  animation: d8FinaleConfetti 1.2s cubic-bezier(.16, 1, .3, 1) both;
}

.d8-root .finale-confetti i:nth-child(1) { left: 8%; top: 12%; rotate: 17deg; }
.d8-root .finale-confetti i:nth-child(2) { left: 22%; top: 72%; background: #FFC23C; rotate: -24deg; }
.d8-root .finale-confetti i:nth-child(3) { left: 38%; top: 18%; background: #9DEBF7; rotate: 35deg; }
.d8-root .finale-confetti i:nth-child(4) { left: 51%; top: 76%; background: #A7E34C; rotate: -12deg; }
.d8-root .finale-confetti i:nth-child(5) { left: 66%; top: 13%; background: #FFC23C; rotate: 28deg; }
.d8-root .finale-confetti i:nth-child(6) { left: 78%; top: 70%; background: #9DEBF7; rotate: -30deg; }
.d8-root .finale-confetti i:nth-child(7) { left: 89%; top: 20%; background: #A7E34C; rotate: 12deg; }
.d8-root .finale-confetti i:nth-child(8) { left: 95%; top: 67%; rotate: -18deg; }

.d8-root .bridge {
  padding: 11px 15px;
  display: grid;
  gap: 3px;
  border-radius: 13px;
  color: white;
  background: var(--navy);
  opacity: 0;
  transform: translateY(8px);
  transition: .4s ease;
}

.d8-root .bridge.bridge-visible {
  opacity: 1;
  transform: none;
}

.d8-root .bridge > span {
  color: #9DEBF7;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .1em;
}

.d8-root .bridge > strong {
  font: 750 14px/1.25 Source Serif 4, Georgia, serif;
}

@keyframes bitAntenna {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(5deg); }
}

@keyframes d8FinaleConfetti {
  from { opacity: 0; translate: 0 -14px; rotate: 0deg; }
  to { opacity: .82; }
}

@keyframes bitWave {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(-12deg); }
}

@keyframes bitWaveLeft {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(12deg); }
}

@keyframes awkwardHands {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(2px); }
}

@keyframes drawChain {
  to { stroke-dashoffset: 0; }
}

@keyframes softPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

@keyframes gentleShake {
  0%, 100% { transform: translateX(0); }
  30% { transform: translateX(-4px); }
  65% { transform: translateX(4px); }
}

@keyframes carryDrop {
  from { transform: translateY(-12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.d8-root .preview-language {
  position: fixed;
  top: 9px;
  right: 9px;
  z-index: 30;
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 8px 20px -14px rgba(58, 53, 48, .6);
}

.d8-root .preview-language button {
  min-height: 0;
  padding: 4px 9px;
  border: 0;
  border-radius: 999px;
  color: var(--ink-2);
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  font-weight: 900;
}

.d8-root .preview-language .preview-active {
  color: #FFFFFF;
  background: var(--accent);
}

@media (max-width: 639px) {
  .d8-root .stage-header {
    padding: 60px 12px 8px;
  }

  .d8-root .screen-type {
    display: none;
  }

  .d8-root .stage-content {
    padding: 18px 14px 24px;
    scrollbar-gutter: auto;
  }

  .d8-root .stage-nav {
    min-height: 68px;
    padding: 9px 12px;
  }

  .d8-root .button {
    min-width: 112px;
    padding-inline: 13px;
    font-size: 14px;
  }

  .d8-root .heading {
    margin-bottom: 15px;
  }

  .d8-root .heading-with-bit {
    min-height: 118px;
    grid-template-columns: minmax(0, 1fr) 86px;
    gap: 8px;
  }

  .d8-root .heading-with-small-bit {
    min-height: 80px;
    grid-template-columns: minmax(0, 1fr) 62px;
  }

  .d8-root .bit-shell,
  .d8-root .g1-char {
    width: 82px;
    height: 104px;
  }

  .d8-root .bit-shell-small {
    width: 58px;
    height: 73px;
  }

  .d8-root .bit-shell-small .g1-char {
    width: 58px;
    height: 73px;
  }

  .d8-root .mini-coach {
    grid-template-columns: 60px auto;
    margin-top: 3px;
  }

  .d8-root .mini-coach .g1-char {
    width: 60px;
    height: 74px;
  }

  .d8-root .mini-coach > span {
    padding: 6px 8px;
    font-size: 11px;
  }

  .d8-root h1 {
    font-size: clamp(27px, 9vw, 36px);
  }

  .d8-root .heading p {
    font-size: 14px;
    line-height: 1.45;
  }

  .d8-root .hook-terminals,
  .d8-root .strategy-scene,
  .d8-root .summary-scene,
  .d8-root .finale-main-grid {
    grid-template-columns: 1fr;
  }

  .d8-root .hook-terminals {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .d8-root .terminal {
    min-height: 176px;
    padding: 10px 8px;
  }

  .d8-root .terminal > span {
    font-size: 9px;
    line-height: 1.2;
  }

  .d8-root .terminal > small {
    margin: 4px 0 7px;
    font-size: 9px;
  }

  .d8-root .terminal-column {
    gap: 2px;
    font-size: 16px;
    line-height: 1.18;
  }

  .d8-root .terminal em {
    margin-top: 7px;
    font-size: 9px;
  }

  .d8-root .wrong-digit-cards {
    margin: -1px auto 5px;
    gap: 2px;
  }

  .d8-root .wrong-digit-cards i {
    min-height: 28px;
    font-size: 12px;
  }

  .d8-root .hook-choice-grid,
  .d8-root .choice-grid {
    grid-template-columns: 1fr;
  }

  .d8-root .visual-options {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 5px;
  }

  .d8-root .visual-options .choice-button {
    min-height: 150px;
    padding: 4px;
  }

  .d8-root .mini-column span {
    min-height: 22px;
    font-size: 11px;
  }

  .d8-root .mini-column > b {
    top: 66px;
  }

  .d8-root .column-board,
  .d8-root .alignment-board,
  .d8-root .exchange-scene,
  .d8-root .borrow-scene,
  .d8-root .zero-chain-scene {
    padding: 12px 8px;
  }

  .d8-root .place-warehouse-svg {
    height: 86px;
  }

  .d8-root .exchange-bundle-svg {
    height: 92px;
  }

  .d8-root .donor-path-svg {
    height: 82px;
  }

  .d8-root .place-row {
    gap: 3px;
  }

  .d8-root .place-row > span {
    min-height: 46px;
  }

  .d8-root .place-labels > span {
    min-height: 24px;
    font-size: 7px;
  }

  .d8-root .digit-row > span {
    font-size: 22px;
  }

  .d8-root .operator-row {
    grid-template-columns: 26px minmax(0, 1fr);
  }

  .d8-root .donor-strip {
    gap: 3px;
  }

  .d8-root .donor-strip small,
  .d8-root .state-row small {
    font-size: 7px;
  }

  .d8-root .donor-strip b,
  .d8-root .state-row b {
    font-size: 20px;
  }

  .d8-root .borrow-arrow {
    gap: 7px;
  }

  .d8-root .borrow-arrow span {
    padding: 8px;
    font-size: 14px;
  }

  .d8-root .unit-dots {
    gap: 3px;
  }

  .d8-root .matching-board {
    grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1fr);
    gap: 5px;
  }

  .d8-root .match-arrows {
    padding-top: 24px;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, minmax(54px, auto));
    gap: 7px;
  }

  .d8-root .match-column {
    grid-template-rows: auto repeat(3, minmax(54px, auto));
    gap: 7px;
  }

  .d8-root .match-card {
    min-height: 54px;
    padding: 7px 6px;
    font-size: 10px;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  .d8-root .books-visual {
    grid-template-columns: 1fr;
  }

  .d8-root .finale-heading {
    padding: 10px 12px;
  }

  .d8-root .finale-heading h1 {
    font-size: 21px;
  }

  .d8-root .finale-heading p {
    font-size: 10px;
  }

  .d8-root .summary-scene .hook-repair {
    min-height: 104px;
  }

  .d8-root .finale-payoff-card,
  .d8-root .finale-mastery-card {
    padding: 10px;
  }

  .d8-root .summary-rules {
    gap: 5px;
  }

  .d8-root .summary-rule {
    min-height: 48px;
    padding: 6px;
  }

  .d8-root .summary-rule p {
    font-size: 9px;
  }

  .d8-root .finale-reward {
    min-height: 108px;
    padding: 8px 10px;
    grid-template-columns: 58px 72px minmax(0, 1fr);
    gap: 7px;
  }

  .d8-root .finale-medal i {
    width: 54px;
    height: 54px;
    font-size: 23px;
  }

  .d8-root .finale-bit {
    height: 88px;
  }

  .d8-root .finale-reward-copy > span {
    font-size: 7px;
  }

  .d8-root .finale-reward-copy > strong {
    font-size: 14px;
  }

  .d8-root .finale-reward-copy > small {
    font-size: 8px;
  }

  .d8-root .bridge {
    grid-column: auto;
  }
}

@media (max-width: 390px) {
  .d8-root .stage-content {
    padding-inline: 10px;
  }

  .d8-root .stage-nav {
    gap: 7px;
  }

  .d8-root .button {
    min-width: 102px;
    font-size: 13px;
  }

  .d8-root .chrome-actions {
    gap: 5px;
  }

  .d8-root .build-slots {
    gap: 4px;
  }

  .d8-root .build-slot {
    min-height: 76px;
    padding-inline: 1px;
  }

  .d8-root .build-slot small {
    font-size: 7px;
  }

  .d8-root .number-card {
    min-width: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .d8-root *,
  .d8-root *::before,
  .d8-root *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }

  .d8-root .summary-rule,
  .d8-root .finale-reward,
  .d8-root .bridge {
    opacity: 1 !important;
    transform: none !important;
  }
}
`;
