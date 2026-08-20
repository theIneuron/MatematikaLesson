import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел",
    "en": "Adding rational numbers"
  },
  "prompt": {
    "uz": "Har bir yig‘indini uning qiymati bilan moslashtiring.",
    "ru": "Соедините каждую сумму с её значением.",
    "en": "Match each sum with its value."
  },
  "left": [
    "−6 + (−8)",
    "−11 + 15",
    "13 + (−7)"
  ],
  "right": [
    "−14",
    "4",
    "6"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Bir xil ishoralarda modullar qo‘shiladi, har xil ishoralarda kichik modul kattasidan ayriladi.",
    "ru": "При одинаковых знаках модули складывают, при разных — меньший модуль вычитают из большего.",
    "en": "With the same signs the moduli are added; with different signs the smaller modulus is taken away from the bigger one."
  }
};

export default function D27_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={3}/>;
}
