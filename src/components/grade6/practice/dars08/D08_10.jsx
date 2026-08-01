import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Bir qadamda qisqartirish",
    "ru": "Практика к уроку 8. Сокращение дробей"
  },
  "prompt": {
    "uz": "88/120 kasrini eng sodda ko'rinishgacha qisqartiring.",
    "ru": "Сократите дробь 88/120 до несократимого вида."
  },
  "options": [
    "8/11",
    "11/15",
    "22/30",
    "44/60"
  ],
  "answer": "11/15",
  "explanation": {
    "uz": "88 va 120 ning EKUBi 8: 88/120 = 11/15.",
    "ru": "Правильный ответ: 11/15. Для полного сокращения числитель и знаменатель делят на их НОД."
  }
};

export default function D08_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={10}/>;
}
