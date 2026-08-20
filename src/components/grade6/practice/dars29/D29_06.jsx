import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел",
    "en": "Multiplying and dividing rational numbers"
  },
  "prompt": {
    "uz": "Kasrli amallarni javoblari bilan bog‘lang.",
    "ru": "Соедините действия с дробями с ответами.",
    "en": "Connect the operations with fractions with their answers."
  },
  "left": [
    "−2/3 · 9/4",
    "−5/8 : 15/16",
    "7/10 · (−5/14)"
  ],
  "right": [
    "−3/2",
    "−2/3",
    "−1/4"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Qisqartirib hisoblanganda natijalar −3/2, −2/3 va −1/4 chiqadi.",
    "ru": "После сокращения получаем −3/2, −2/3 и −1/4.",
    "en": "After cancelling the results are −3/2, −2/3 and −1/4."
  }
};

export default function D29_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={6}/>;
}
