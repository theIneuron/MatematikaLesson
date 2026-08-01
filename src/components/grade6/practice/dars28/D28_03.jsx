import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ratsional sonlarni ayirish",
    "ru": "Вычитание рациональных чисел"
  },
  "prompt": {
    "uz": "Ayirmalarni javoblari bilan moslashtiring.",
    "ru": "Соедините разности с ответами."
  },
  "left": [
    "12 − 19",
    "−6 − (−10)",
    "−15 − 3"
  ],
  "right": [
    "−7",
    "4",
    "−18"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Ayirish qarama-qarshi sonni qo‘shish bilan almashtiriladi.",
    "ru": "Вычитание заменяется сложением противоположного числа."
  }
};

export default function D28_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={28} task={3}/>;
}
