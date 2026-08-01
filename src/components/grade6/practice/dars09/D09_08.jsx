import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Qo'shimcha ko'paytuvchi",
    "ru": "Практика к уроку 9. Приведение дробей к общему знаменателю"
  },
  "prompt": {
    "uz": "11/15 kasrini maxraji 105 bo'lgan kasrga keltirish uchun qo'shimcha ko'paytuvchini yozing.",
    "ru": "Найдите дополнительный множитель для приведения 11/15 к знаменателю 105."
  },
  "answer": "7",
  "explanation": {
    "uz": "15 × 7 = 105; qo'shimcha ko'paytuvchi 7.",
    "ru": "Правильный ответ: 7. Наименьший общий знаменатель равен НОК знаменателей."
  }
};

export default function D09_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={9} task={8}/>;
}
