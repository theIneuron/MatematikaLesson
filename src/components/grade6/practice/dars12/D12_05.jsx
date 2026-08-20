import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Bo'linmani tekshirish",
    "ru": "Практика к уроку 12. Деление обыкновенных дробей",
    "en": "Checking a quotient"
  },
  "prompt": {
    "uz": "9/14 : 3/7 bo'lish amalining natijasi 3/2 ga teng, degan fikrni teskari kasr bilan tekshiring.",
    "ru": "Верно ли, что 9/14 : 3/7 = 3/2?",
    "en": "Use the reciprocal to check the statement that the result of 9/14 : 3/7 is equal to 3/2."
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
    "uz": "9/14 : 3/7 = 9/14 × 7/3 = 3/2, shuning uchun fikr to'g'ri.",
    "ru": "Правильный ответ: Да. Деление на дробь заменяют умножением на обратную дробь.",
    "en": "9/14 : 3/7 = 9/14 × 7/3 = 3/2, so the statement is true."
  }
};

export default function D12_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={12} task={5}/>;
}
