import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Qisqarmas kasr",
    "ru": "Практика к уроку 8. Сокращение дробей"
  },
  "prompt": {
    "uz": "Qaysi kasr allaqachon qisqarmas ko'rinishda yozilgan?",
    "ru": "Какая дробь уже является несократимой?"
  },
  "options": [
    "10/16",
    "14/21",
    "8/15",
    "18/27"
  ],
  "answer": "8/15",
  "explanation": {
    "uz": "8 va 15 ning umumiy bo'luvchisi faqat 1; 8/15 qisqarmaydi.",
    "ru": "Правильный ответ: 8/15. Для полного сокращения числитель и знаменатель делят на их НОД."
  }
};

export default function D08_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={4}/>;
}
