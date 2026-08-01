import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni ayirish",
    "ru": "Вычитание рациональных чисел"
  },
  "prompt": {
    "uz": "5/6 − (−1/3) ayirmani hisoblang.",
    "ru": "Вычислите разность 5/6 − (−1/3)."
  },
  "options": [
    "1/2",
    "7/6",
    "−7/6",
    "3/6"
  ],
  "answer": "7/6",
  "explanation": {
    "uz": "5/6 − (−1/3) = 5/6 + 2/6 = 7/6.",
    "ru": "5/6 − (−1/3) = 5/6 + 2/6 = 7/6."
  }
};

export default function D28_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={28} task={7}/>;
}
