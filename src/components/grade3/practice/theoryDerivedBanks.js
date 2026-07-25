import { SCREENS as DARS22_SCREENS } from '../Dars22.jsx';
import { SCREENS as DARS23_SCREENS } from '../Dars23.jsx';
import { SCREENS as DARS24_SCREENS } from '../Dars24.jsx';
import { SCREENS as DARS25_SCREENS } from '../Dars25.jsx';
import { SCREENS as DARS27_SCREENS } from '../Dars27.jsx';
import { SCREENS as DARS28_SCREENS } from '../Dars28.jsx';
import { SCREENS as DARS29_SCREENS } from '../Dars29.jsx';
import { SCREENS as DARS30_SCREENS } from '../Dars30.jsx';
import { SCREENS as DARS31_SCREENS } from '../Dars31.jsx';
import { SCREENS as DARS32_SCREENS } from '../Dars32.jsx';
import { SCREENS as DARS33_SCREENS } from '../Dars33.jsx';
import { SCREENS as DARS34_SCREENS } from '../Dars34.jsx';
import { SCREENS as DARS35_SCREENS } from '../Dars35.jsx';
import { GEOMETRY_LESSONS } from '../Grade3GeometryBlock.jsx';
import { FINAL_LESSONS } from '../Grade3FinalBlock.jsx';

const TITLES = {
  22: "Amallarni teskari amal bilan tekshirish",
  23: "Yozma ko'paytirish va bo'lish",
  24: "Ikki xonali sonni ikki xonali songa ko'paytirish",
  25: "Qurilishga oid masalalar",
  27: "Kattalik ulushi",
  28: "Kasrlarning hosil bo'lishi",
  29: "Ulushlarni taqqoslash",
  30: "Sonning ulushini topish",
  31: "To'g'ri va noto'g'ri kasrlar. Aralash son",
  32: "Kasrlarni taqqoslash",
  33: "Bir xil maxrajli kasrlarni qo'shish va ayirish",
  34: "O'nli kasrlarni o'qish, yozish va taqqoslash",
  35: "Ulush va kasrlarga oid masalalar",
  37: 'Perimetr',
  38: 'Yuza birliklari',
  39: "To'g'ri to'rtburchak yuzasi",
  40: 'Kvadrat yuzasi',
  41: 'Perimetr va yuzani taqqoslash',
  42: 'Perimetr va yuzaga oid masalalar',
  43: "Uchburchak turlari. Parallel va perpendikulyar chiziqlar",
  44: "O'q simmetriyasi. Burchakni gradusda o'lchash",
  45: 'Piramida va konus',
  47: 'Massa birliklari',
  48: 'Vaqt birliklari',
  49: 'Uzunlik birliklari va nisbatlari',
  50: 'Kalendar',
  51: 'Tenglamalar',
  52: 'Tenglamalarni yechish va tekshirish',
  53: 'Murakkab masalalar',
  54: "Tengsizliklar. Rost va yolg'on fikrlar",
  55: "Doiraviy diagramma va ma'lumotlar",
  56: 'Yakuniy takrorlash',
};

const SCREEN_SOURCES = {
  22: DARS22_SCREENS,
  23: DARS23_SCREENS,
  24: DARS24_SCREENS,
  25: DARS25_SCREENS,
  27: DARS27_SCREENS,
  28: DARS28_SCREENS,
  29: DARS29_SCREENS,
  30: DARS30_SCREENS,
  31: DARS31_SCREENS,
  32: DARS32_SCREENS,
  33: DARS33_SCREENS,
  34: DARS34_SCREENS,
  35: DARS35_SCREENS,
};

const ROLE = [
  ['Tanish qoida', '🟢', 'recall'],
  ["Yo'naltirilgan", '🟢', 'guided'],
  ["Boshqa ko'rinish", '🟡', 'representation'],
  ['Mustaqil hisob', '🟡', 'calculation'],
  ["Yo'qolgan qism", '🟡', 'missing-part'],
  ['Matnli masala', '🟡', 'story'],
  ['Saralash', '🟡', 'multi-model'],
  ['Tuzoq holati', '🔴', 'boundary'],
  ['Xatoni toping', '🔴', 'error'],
  ['Transfer', '🔴', 'transfer'],
];

const PLAN = [
  { type: 'choice', source: 0 },
  { type: 'choice', source: 7 },
  { type: 'choice', source: 8 },
  { type: 'input', source: 9 },
  { type: 'input', source: 10 },
  { type: 'choice', source: 12 },
  { type: 'multi', sources: [4, 5] },
  { type: 'choice', source: 3 },
  { type: 'choice', source: 11 },
  { type: 'choice', source: 13 },
];

const locale = (value, lang) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[lang] ?? value.uz ?? value.ru ?? '';
  }
  return value ?? '';
};

const optionsFor = (question, lang) => (question.options || []).map((option) => locale(option, lang));

const correctOption = (question, lang) => optionsFor(question, lang)[question.correct] ?? '';

const explanation = (question, lang) => {
  const hint = locale(question.hint, lang);
  if (hint) return hint;
  return lang === 'uz'
    ? "Javobni darsdagi model va qoida bilan tekshiring."
    : "Проверь ответ по модели и правилу урока.";
};

const setup = (question, lang) => {
  const text = locale(question.text, lang);
  if (text) return text;
  return lang === 'uz'
    ? "Darsdagi usulni yangi topshiriqda qo'llang."
    : "Примени способ урока в задании.";
};

const singleText = (question, type) => {
  const make = (lang) => {
    const typed = type === 'input';
    const hint = explanation(question, lang);
    const ask = locale(question.ask, lang);
    return {
      eyebrow: lang === 'uz' ? 'Amaliy mashq' : 'Практическое задание',
      setup: setup(question, lang),
      ask,
      options: typed ? undefined : optionsFor(question, lang),
      correct: lang === 'uz' ? `To'g'ri! ${hint}` : `Верно! ${hint}`,
      wrong: lang === 'uz' ? `Maslahat: ${hint}` : `Подсказка: ${hint}`,
      rule: hint,
      visual: question.visual,
      placeholder: lang === 'uz' ? 'Javob' : 'Ответ',
      orderHint: lang === 'uz'
        ? "Kartalarni kerakli tartibda bosing."
        : "Нажимай карточки в нужном порядке.",
    };
  };
  return { uz: make('uz'), ru: make('ru') };
};

const singleItem = (number, index, question, role, type) => {
  const answerUz = correctOption(question, 'uz');
  const answerRu = correctOption(question, 'ru');
  return {
    id: String(index + 1).padStart(2, '0'),
    label: role[0],
    level: role[1],
    tag: `d${number}-${role[2]}`,
    type,
    emoji: type === 'input' ? '✍️' : index === 7 ? '🔎' : index === 9 ? '🚀' : '🧩',
    correct: type === 'input' ? [...new Set([answerUz, answerRu])] : question.correct,
    inputMode: type === 'input' ? 'text' : undefined,
    text: singleText(question, type),
  };
};

const multiItem = (number, index, first, second, role) => {
  const make = (lang) => {
    const firstCorrect = correctOption(first, lang);
    const secondCorrect = correctOption(second, lang);
    const firstWrong = optionsFor(first, lang).find((_, optionIndex) => optionIndex !== first.correct) ?? '—';
    const secondWrong = optionsFor(second, lang).find((_, optionIndex) => optionIndex !== second.correct) ?? '—';
    const firstAsk = locale(first.ask, lang);
    const secondAsk = locale(second.ask, lang);
    return {
      eyebrow: lang === 'uz' ? 'Bir nechta javob' : 'Несколько ответов',
      setup: lang === 'uz'
        ? `A) ${firstAsk}\nB) ${secondAsk}`
        : `A) ${firstAsk}\nB) ${secondAsk}`,
      ask: lang === 'uz'
        ? "Avval A ni, keyin B ni yeching. Har biri uchun bittadan javob belgilang."
        : "Сначала реши A, затем B. Для каждого задания отметь по одному ответу.",
      options: [`A: ${firstCorrect}`, `A: ${firstWrong}`, `B: ${secondCorrect}`, `B: ${secondWrong}`],
      correct: lang === 'uz'
        ? "To'g'ri! Har bir kichik vazifa alohida tekshirildi."
        : "Верно! Каждое маленькое задание проверено отдельно.",
      wrong: lang === 'uz'
        ? "Maslahat: avval A ni, keyin B ni alohida yeching."
        : "Подсказка: сначала отдельно реши A, затем B.",
      rule: lang === 'uz'
        ? `${explanation(first, lang)} ${explanation(second, lang)}`
        : `${explanation(first, lang)} ${explanation(second, lang)}`,
      visual: `A: ${first.visual ?? ''}   |   B: ${second.visual ?? ''}`,
      orderHint: lang === 'uz'
        ? "Kartalarni kerakli tartibda bosing."
        : "Нажимай карточки в нужном порядке.",
    };
  };

  return {
    id: String(index + 1).padStart(2, '0'),
    label: role[0],
    level: role[1],
    tag: `d${number}-${role[2]}`,
    type: 'multi',
    emoji: '✅',
    correct: [0, 2],
    text: { uz: make('uz'), ru: make('ru') },
  };
};

function questionsFor(number) {
  if (SCREEN_SOURCES[number]) return SCREEN_SOURCES[number];
  if (GEOMETRY_LESSONS[number]) return GEOMETRY_LESSONS[number].checks;
  if (FINAL_LESSONS[number]) return FINAL_LESSONS[number].checks;
  return [];
}

function buildPracticeBank(number) {
  const questions = questionsFor(number);
  if (questions.length < 14) {
    throw new Error(`${number}-dars amaliyoti uchun kamida 14 ta nazariy savol kerak.`);
  }

  return {
    title: `Dars ${number} · ${TITLES[number]}`,
    items: PLAN.map((step, index) => {
      const role = ROLE[index];
      if (step.type === 'multi') {
        return multiItem(number, index, questions[step.sources[0]], questions[step.sources[1]], role);
      }
      return singleItem(number, index, questions[step.source], role, step.type);
    }),
  };
}

export const PRACTICE_LESSON_NUMBERS = [
  22, 23, 24, 25,
  27, 28, 29, 30, 31, 32, 33, 34, 35,
  37, 38, 39, 40, 41, 42, 43, 44, 45,
  47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
];

export const GRADE3_THEORY_DERIVED_BANKS = Object.fromEntries(
  PRACTICE_LESSON_NUMBERS.map((number) => [number, buildPracticeBank(number)]),
);
