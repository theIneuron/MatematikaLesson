import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел",
    "en": "Multiplying and dividing rational numbers"
  },
  "prompt": {
    "uz": "Uchta manfiy ko‘paytuvchi (−2) · (−3) · (−4) natijasini toping.",
    "ru": "Найдите значение произведения трёх отрицательных множителей (−2) · (−3) · (−4).",
    "en": "Find the value of the product of the three negative factors (−2) · (−3) · (−4)."
  },
  "options": [
    "−24",
    "24",
    "−9",
    "9"
  ],
  "answer": "−24",
  "explanation": {
    "uz": "Manfiy ko‘paytuvchilar soni toq, shuning uchun natija manfiy; 2 · 3 · 4 = 24.",
    "ru": "Отрицательных множителей нечётное число, поэтому результат отрицательный; 2 · 3 · 4 = 24.",
    "en": "The number of negative factors is odd, so the result is negative; 2 · 3 · 4 = 24."
  }
};

export default function D29_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={7}/>;
}
