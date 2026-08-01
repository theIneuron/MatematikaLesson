import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Harfli ifodalar",
    "ru": "Буквенные выражения"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
  },
  "left": [
    "2x + 5",
    "4a − 1",
    "3m"
  ],
  "right": [
    "x=3 → 11",
    "a=2 → 7",
    "m=5 → 15"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "m=5 → 15": "м=5 → 15"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 2x + 5 ↔ x=3 → 11; 4a − 1 ↔ a=2 → 7; 3m ↔ m=5 → 15.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D31_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={3}/>;
}
