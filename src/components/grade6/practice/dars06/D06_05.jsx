import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "EKUK tengligini tekshirish",
    "ru": "Практика к уроку 6. Наименьшее общее кратное",
    "en": "Checking an LCM equality"
  },
  "prompt": {
    "uz": "EKUK(10, 15) = 30.",
    "ru": "Верно ли равенство НОК(10, 15) = 30?",
    "en": "LCM(10, 15) = 30."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Ha",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "10 va 15 ning eng kichik umumiy karralisi 30; fikr to'g'ri.",
    "ru": "Правильный ответ: Да. НОК — наименьшее положительное общее кратное.",
    "en": "The least common multiple of 10 and 15 is 30, so the statement is true."
  }
};

export default function D06_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={5}/>;
}
