import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Harfli ifodalar",
    "ru": "Буквенные выражения",
    "en": "Expressions with letters"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "4x+3 dagi koeffitsiyent",
    "9−y dagi ozod had",
    "ab dagi ko‘paytuvchilar soni"
  ],
  "right": [
    "4",
    "9",
    "2"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "4x+3 dagi koeffitsiyent": "4x+3: коэффициент",
    "9−y dagi ozod had": "9−y: свободный член",
    "ab dagi ko‘paytuvchilar soni": "число множителей в ab"
  },
  "translationsEn": {
    "4x+3 dagi koeffitsiyent": "the coefficient in 4x+3",
    "9−y dagi ozod had": "the constant term in 9−y",
    "ab dagi ko‘paytuvchilar soni": "the number of factors in ab"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 4x+3 dagi koeffitsiyent ↔ 4; 9−y dagi ozod had ↔ 9; ab dagi ko‘paytuvchilar soni ↔ 2.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: the coefficient in 4x+3 ↔ 4; the constant term in 9−y ↔ 9; the number of factors in ab ↔ 2."
  }
};

export default function D31_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={9}/>;
}
