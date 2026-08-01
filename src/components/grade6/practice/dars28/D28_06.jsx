import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ratsional sonlarni ayirish",
    "ru": "Вычитание рациональных чисел"
  },
  "prompt": {
    "uz": "O‘nli sonli ayirmalarni natijalar bilan bog‘lang.",
    "ru": "Соедините разности десятичных чисел с результатами."
  },
  "left": [
    "2,4 − 5,9",
    "−1,7 − (−3,2)",
    "−4,8 − 2,6"
  ],
  "right": [
    "−3,5",
    "1,5",
    "−7,4"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Qarama-qarshi sonni qo‘shish qoidasi natijalarni to‘g‘ri beradi.",
    "ru": "Правило прибавления противоположного числа даёт эти результаты."
  }
};

export default function D28_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={28} task={6}/>;
}
