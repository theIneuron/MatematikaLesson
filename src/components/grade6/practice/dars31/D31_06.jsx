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
    "5x",
    "a+9",
    "2(m−1)"
  ],
  "right": [
    "5·x",
    "a ga 9 qo‘shish",
    "m−1 ni 2 ga ko‘paytirish"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "2(m−1)": "2(м−1)",
    "a ga 9 qo‘shish": "a прибавить 9",
    "m−1 ni 2 ga ko‘paytirish": "м−1 умножить на 2"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 5x ↔ 5·x; a+9 ↔ a ga 9 qo‘shish; 2(m−1) ↔ m−1 ni 2 ga ko‘paytirish.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D31_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={6}/>;
}
