import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "EKUBni aniqlash",
    "ru": "Практика к уроку 8. Сокращение дробей",
    "en": "Finding the GCD"
  },
  "prompt": {
    "uz": "42/56 kasrining surat va maxraji uchun EKUBni topib yozing.",
    "ru": "Найдите НОД числителя и знаменателя дроби 42/56.",
    "en": "Find the GCD of the numerator and the denominator of 42/56 and write it down."
  },
  "answer": "14",
  "explanation": {
    "uz": "42 va 56 ning eng katta umumiy bo'luvchisi 14.",
    "ru": "Правильный ответ: 14. Для полного сокращения числитель и знаменатель делят на их НОД.",
    "en": "The greatest common divisor of 42 and 56 is 14."
  }
};

export default function D08_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={2}/>;
}
