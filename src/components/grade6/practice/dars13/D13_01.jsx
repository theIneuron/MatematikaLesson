import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Teskari kasr",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого"
  },
  "prompt": {
    "uz": "7/11 kasriga o'zaro teskari kasrni toping. Tekshirish uchun ikkala kasrning ko'paytmasi 1 bo'lishini hisobga oling.",
    "ru": "Найдите дробь, обратную дроби 7/11."
  },
  "options": [
    "7/11",
    "11/7",
    "4/11",
    "11/18"
  ],
  "answer": "11/7",
  "explanation": {
    "uz": "7/11 va 11/7 o'zaro teskari, chunki ularning ko'paytmasi 1 ga teng.",
    "ru": "Правильный ответ: 11/7. Произведение взаимно обратных чисел равно единице."
  }
};

export default function D13_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={1}/>;
}
