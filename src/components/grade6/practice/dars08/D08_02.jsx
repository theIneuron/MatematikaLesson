import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "EKUBni aniqlash",
    "ru": "Практика к уроку 8. Сокращение дробей"
  },
  "prompt": {
    "uz": "42/56 kasrining surat va maxraji uchun EKUBni topib yozing.",
    "ru": "Найдите НОД числителя и знаменателя дроби 42/56."
  },
  "answer": "14",
  "explanation": {
    "uz": "42 va 56 ning eng katta umumiy bo'luvchisi 14.",
    "ru": "Правильный ответ: 14. Для полного сокращения числитель и знаменатель делят на их НОД."
  }
};

export default function D08_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={8} task={2}/>;
}
