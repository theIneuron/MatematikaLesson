import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
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
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: (2;5) x o‘qiga ↔ (2;−5); (−4;3) y o‘qiga ↔ (4;3); (1;−6) y o‘qiga ↔ (−1;−6).",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D40_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={6}/>;
}
