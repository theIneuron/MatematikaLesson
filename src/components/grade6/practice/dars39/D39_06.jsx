import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Doira yuzi",
    "ru": "Площадь круга",
    "en": "The area of a disc"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "chegara uzunligi",
    "ichki qism yuzi",
    "radius kvadrati"
  ],
  "right": [
    "2πr",
    "πr²",
    "r²"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "chegara uzunligi": "длина границы",
    "ichki qism yuzi": "площадь внутри",
    "radius kvadrati": "квадрат радиуса"
  },
  "translationsEn": {
    "chegara uzunligi": "the length of the boundary",
    "ichki qism yuzi": "the area of the inside",
    "radius kvadrati": "the square of the radius"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: chegara uzunligi ↔ 2πr; ichki qism yuzi ↔ πr²; radius kvadrati ↔ r².",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: the length of the boundary ↔ 2πr; the area of the inside ↔ πr²; the square of the radius ↔ r²."
  }
};

export default function D39_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={39} task={6}/>;
}
