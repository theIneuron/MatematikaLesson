import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ratsional sonlarni ayirish",
    "ru": "Вычитание рациональных чисел"
  },
  "prompt": {
    "uz": "Har bir ayirmani mos qiymat bilan juftlang.",
    "ru": "Соедините каждую разность с её значением."
  },
  "left": [
    "−2/5 − 1/10",
    "3/4 − (−1/8)",
    "−5/6 − (−1/2)"
  ],
  "right": [
    "−1/2",
    "7/8",
    "−1/3"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Umumiy maxrajdan foydalanib −1/2, 7/8 va −1/3 olinadi.",
    "ru": "После приведения к общему знаменателю получаем −1/2, 7/8 и −1/3."
  }
};

export default function D28_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={28} task={9}/>;
}
