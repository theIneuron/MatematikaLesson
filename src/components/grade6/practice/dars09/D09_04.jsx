import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Teng kasr hosil qilish",
    "ru": "Практика к уроку 9. Приведение дробей к общему знаменателю",
    "en": "Making an equal fraction"
  },
  "prompt": {
    "uz": "3/7 kasrini maxraji 35 bo'lgan teng kasr ko'rinishida yozing.",
    "ru": "Запишите дробь 3/7 с знаменателем 35.",
    "en": "Write the fraction 3/7 as an equal fraction with the denominator 35."
  },
  "options": [
    "9/35",
    "12/35",
    "15/35",
    "21/35"
  ],
  "answer": "15/35",
  "explanation": {
    "uz": "7 × 5 = 35, surat ham 3 × 5 = 15: 3/7 = 15/35.",
    "ru": "Правильный ответ: 15/35. Наименьший общий знаменатель равен НОК знаменателей.",
    "en": "7 × 5 = 35, and the numerator too: 3 × 5 = 15, so 3/7 = 15/35."
  }
};

export default function D09_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={9} task={4}/>;
}
