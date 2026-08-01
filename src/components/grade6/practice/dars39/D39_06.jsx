import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Doira yuzi",
    "ru": "Площадь круга"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
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
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: chegara uzunligi ↔ 2πr; ichki qism yuzi ↔ πr²; radius kvadrati ↔ r².",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D39_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={39} task={6}/>;
}
