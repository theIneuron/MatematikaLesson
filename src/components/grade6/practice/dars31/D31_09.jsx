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
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 4x+3 dagi koeffitsiyent ↔ 4; 9−y dagi ozod had ↔ 9; ab dagi ko‘paytuvchilar soni ↔ 2.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D31_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={9}/>;
}
