import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия",
    "en": "Reflection symmetry"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "(2;5) x o‘qiga",
    "(−4;3) y o‘qiga",
    "(1;−6) y o‘qiga"
  ],
  "right": [
    "(2;−5)",
    "(4;3)",
    "(−1;−6)"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "(2;5) x o‘qiga": "(2;5) относительно оси x",
    "(−4;3) y o‘qiga": "(−4;3) относительно оси y",
    "(1;−6) y o‘qiga": "(1;−6) относительно оси y"
  },
  "translationsEn": {
    "(2;5) x o‘qiga": "(2;5) in the x axis",
    "(−4;3) y o‘qiga": "(−4;3) in the y axis",
    "(1;−6) y o‘qiga": "(1;−6) in the y axis"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: (2;5) x o‘qiga ↔ (2;−5); (−4;3) y o‘qiga ↔ (4;3); (1;−6) y o‘qiga ↔ (−1;−6).",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: (2;5) in the x axis ↔ (2;−5); (−4;3) in the y axis ↔ (4;3); (1;−6) in the y axis ↔ (−1;−6)."
  }
};

export default function D40_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={6}/>;
}
