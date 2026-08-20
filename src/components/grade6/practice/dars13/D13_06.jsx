import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Qismidan butunni topish",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого",
    "en": "Finding the whole from a part"
  },
  "prompt": {
    "uz": "Sonning ko'rsatilgan kasr qismi ma'lum. Har bir shartdan butun sonni topib, mos javob bilan bog'lang.",
    "ru": "По известной дробной части найдите целое и соедините с ответом.",
    "en": "A fractional part of a number is known. Find the whole number in each case and connect it with the right answer."
  },
  "left": [
    "Sonning 2/5 qismi 14",
    "Sonning 3/8 qismi 18",
    "Sonning 5/6 qismi 35"
  ],
  "right": [
    "42",
    "48",
    "35"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "Sonning 2/5 qismi 14": "2/5 числа равны 14",
    "Sonning 3/8 qismi 18": "3/8 числа равны 18",
    "Sonning 5/6 qismi 35": "5/6 числа равны 35"
  },
  "translationsEn": {
    "Sonning 2/5 qismi 14": "2/5 of the number is 14",
    "Sonning 3/8 qismi 18": "3/8 of the number is 18",
    "Sonning 5/6 qismi 35": "5/6 of the number is 35"
  },
  "explanation": {
    "uz": "14 : 2 × 5 = 35, 18 : 3 × 8 = 48, 35 : 5 × 6 = 42.",
    "ru": "Все пары найдены правильно. Произведение взаимно обратных чисел равно единице.",
    "en": "14 : 2 × 5 = 35, 18 : 3 × 8 = 48, 35 : 5 × 6 = 42."
  }
};

export default function D13_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={6}/>;
}
