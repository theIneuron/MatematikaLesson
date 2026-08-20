import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Fazoviy shakllar hajmi va o'lchov birliklari",
    "ru": "Объём пространственных фигур и единицы",
    "en": "The volume of solids and units of measure"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "2·3·7",
    "4³",
    "10·5·2"
  ],
  "right": [
    "42",
    "64",
    "100"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 2·3·7 ↔ 42; 4³ ↔ 64; 10·5·2 ↔ 100.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: 2·3·7 ↔ 42; 4³ ↔ 64; 10·5·2 ↔ 100."
  }
};

export default function D44_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={44} task={3}/>;
}
