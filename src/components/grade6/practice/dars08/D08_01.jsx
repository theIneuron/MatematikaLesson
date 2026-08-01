import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasrni to'liq qisqartirish",
    "ru": "Практика к уроку 8. Сокращение дробей"
  },
  "prompt": {
    "uz": "18/24 kasrini eng sodda ko'rinishgacha qisqartiring.",
    "ru": "Сократите дробь 18/24 до несократимого вида."
  },
  "options": [
    "2/3",
    "3/4",
    "4/5",
    "9/10"
  ],
  "answer": "3/4",
  "explanation": {
    "uz": "18 va 24 ning EKUBi 6: 18 : 6 = 3, 24 : 6 = 4. Natija 3/4.",
    "ru": "Правильный ответ: 3/4. Для полного сокращения числитель и знаменатель делят на их НОД."
  }
};

export default function D08_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={1}/>;
}
