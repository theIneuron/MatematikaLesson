import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел",
    "en": "Adding rational numbers"
  },
  "prompt": {
    "uz": "Bir xil ishorali −7 va −5 sonlarini qo‘shib, natijani tanlang.",
    "ru": "Сложите числа −7 и −5 с одинаковыми знаками и выберите результат.",
    "en": "Add the numbers −7 and −5, which have the same sign, and choose the result."
  },
  "options": [
    "−2",
    "2",
    "−12",
    "12"
  ],
  "answer": "−12",
  "explanation": {
    "uz": "Modullar 7 + 5 = 12, ikkala son manfiy bo‘lgani uchun javob −12.",
    "ru": "Модули дают 7 + 5 = 12; оба числа отрицательные, поэтому ответ −12.",
    "en": "The moduli give 7 + 5 = 12, and both numbers are negative, so the answer is −12."
  }
};

export default function D27_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={1}/>;
}
