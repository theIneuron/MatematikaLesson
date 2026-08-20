import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Qolgan qism",
    "ru": "Практика к уроку 22. Задачи на проценты",
    "en": "The part that is left"
  },
  "prompt": {
    "uz": "Bir sinfdagi 35 o'quvchining 40 foizi qizlar. O'g'il bolalar sonini toping.",
    "ru": "В классе 35 учеников, 40% из них — девочки. Сколько мальчиков?",
    "en": "40 percent of the 35 pupils in a class are girls. Find the number of boys."
  },
  "options": [
    "14",
    "18",
    "21",
    "24"
  ],
  "answer": "21",
  "explanation": {
    "uz": "Qizlar 35 × 40% = 14; o'g'il bolalar 35 − 14 = 21.",
    "ru": "Правильный ответ: 21. Новое значение находят умножением начального значения на коэффициент изменения.",
    "en": "The girls are 35 × 40% = 14; the boys are 35 − 14 = 21."
  }
};

export default function D22_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={22} task={4}/>;
}
