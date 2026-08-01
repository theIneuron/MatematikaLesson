import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
  },
  "left": [
    "(2;3)",
    "(−5;1)",
    "(4;−7)"
  ],
  "right": [
    "(−2;−3)",
    "(5;−1)",
    "(−4;7)"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: (2;3) ↔ (−2;−3); (−5;1) ↔ (5;−1); (4;−7) ↔ (−4;7).",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D41_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={3}/>;
}
