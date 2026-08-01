import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Qisqarmaslikni tekshirish",
    "ru": "Практика к уроку 8. Сокращение дробей"
  },
  "prompt": {
    "uz": "14/25 kasri qisqarmas kasr hisoblanadi.",
    "ru": "Верно ли, что дробь 14/25 несократима?"
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
  "explanation": {
    "uz": "14 va 25 ning EKUBi 1, shuning uchun 14/25 qisqarmas kasr.",
    "ru": "Правильный ответ: Да. Для полного сокращения числитель и знаменатель делят на их НОД."
  }
};

export default function D08_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={5}/>;
}
