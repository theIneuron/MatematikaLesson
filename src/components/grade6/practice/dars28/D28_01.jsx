import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni ayirish",
    "ru": "Вычитание рациональных чисел",
    "en": "Subtracting rational numbers"
  },
  "prompt": {
    "uz": "9 − (−4) ayirmani qo‘shishga aylantirib hisoblang.",
    "ru": "Замените вычитание сложением и вычислите 9 − (−4).",
    "en": "Turn the difference 9 − (−4) into an addition and work it out."
  },
  "options": [
    "5",
    "−5",
    "13",
    "−13"
  ],
  "answer": "13",
  "explanation": {
    "uz": "Manfiy sonni ayirish unga qarama-qarshi musbat sonni qo‘shishdir: 9 + 4 = 13.",
    "ru": "Вычесть отрицательное число — значит прибавить положительное: 9 + 4 = 13.",
    "en": "Taking away a negative number means adding the positive number opposite to it: 9 + 4 = 13."
  }
};

export default function D28_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={28} task={1}/>;
}
