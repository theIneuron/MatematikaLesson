import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Qo'shimcha ko'paytuvchi",
    "ru": "Практика к уроку 9. Приведение дробей к общему знаменателю"
  },
  "prompt": {
    "uz": "5/12 kasrini maxraji 60 bo'lgan kasrga aylantirish uchun surat va maxraj nechaga ko'paytiriladi?",
    "ru": "На какое число нужно умножить числитель и знаменатель 5/12, чтобы получить знаменатель 60?"
  },
  "answer": "5",
  "explanation": {
    "uz": "12 × 5 = 60; shu sabab qo'shimcha ko'paytuvchi 5.",
    "ru": "Правильный ответ: 5. Наименьший общий знаменатель равен НОК знаменателей."
  }
};

export default function D09_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={9} task={2}/>;
}
