import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "EKUB tengligini tekshirish",
    "ru": "Практика к уроку 5. Наибольший общий делитель",
    "en": "Checking a GCD equality"
  },
  "prompt": {
    "uz": "EKUB(14, 21) = 7.",
    "ru": "Верно ли равенство НОД(14, 21) = 7?",
    "en": "GCD(14, 21) = 7."
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
    "uz": "14 va 21 ning eng katta umumiy bo'luvchisi 7, shuning uchun tenglik to'g'ri.",
    "ru": "Правильный ответ: Да. НОД — наибольший из общих делителей.",
    "en": "The greatest common divisor of 14 and 21 is 7, so the equality is true."
  }
};

export default function D05_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={5}/>;
}
