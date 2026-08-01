import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Masalalarni moslashtirish",
    "ru": "Практика к уроку 23. Задачи на пропорции"
  },
  "prompt": {
    "uz": "Har bir masalani hisoblab, unga mos natijani bog'lang.",
    "ru": "Решите каждую задачу и соедините с ответом."
  },
  "left": [
    "4 litr bo‘yoq 28 m²; 10 litr → ?",
    "6 non 27 000 so‘m; 14 non → ?",
    "8 kran 15 soat; 12 kran → ?"
  ],
  "right": [
    "10 soat",
    "63 000 so‘m",
    "70 m²"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "4 litr bo‘yoq 28 m²; 10 litr → ?": "4 литра краски → 28 м²; 10 литров → ?",
    "6 non 27 000 so‘m; 14 non → ?": "6 лепёшек → 27 000 сумов; 14 лепёшек → ?",
    "8 kran 15 soat; 12 kran → ?": "8 кранов → 15 часов; 12 кранов → ?",
    "10 soat": "10 часа",
    "63 000 so‘m": "63 000 сум",
    "70 m²": "70 м²"
  },
  "explanation": {
    "uz": "10 litr 70 m²; 14 non 63 000 so'm; 12 kran 10 soat.",
    "ru": "Все пары найдены правильно. Сначала определяют вид зависимости, затем составляют и решают пропорцию."
  }
};

export default function D23_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={23} task={3}/>;
}
