import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasrni to'liq qisqartirish",
    "ru": "Практика к уроку 8. Сокращение дробей",
    "en": "Reducing a fraction completely"
  },
  "prompt": {
    "uz": "18/24 kasrini eng sodda ko'rinishgacha qisqartiring.",
    "ru": "Сократите дробь 18/24 до несократимого вида.",
    "en": "Reduce the fraction 18/24 to its simplest form."
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
    "ru": "Правильный ответ: 3/4. Для полного сокращения числитель и знаменатель делят на их НОД.",
    "en": "The GCD of 18 and 24 is 6: 18 : 6 = 3, 24 : 6 = 4. The result is 3/4."
  }
};

export default function D08_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={1}/>;
}
