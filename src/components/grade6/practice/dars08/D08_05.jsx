import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Qisqarmaslikni tekshirish",
    "ru": "Практика к уроку 8. Сокращение дробей",
    "en": "Checking the simplest form"
  },
  "prompt": {
    "uz": "14/25 kasri qisqarmas kasr hisoblanadi.",
    "ru": "Верно ли, что дробь 14/25 несократима?",
    "en": "The fraction 14/25 is in its simplest form."
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
    "uz": "14 va 25 ning EKUBi 1, shuning uchun 14/25 qisqarmas kasr.",
    "ru": "Правильный ответ: Да. Для полного сокращения числитель и знаменатель делят на их НОД.",
    "en": "The GCD of 14 and 25 is 1, so 14/25 is a fraction in its simplest form."
  }
};

export default function D08_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={5}/>;
}
