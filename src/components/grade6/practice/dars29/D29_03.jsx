import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ratsional sonlarni ko'paytirish va bo'lish",
    "ru": "Умножение и деление рациональных чисел",
    "en": "Multiplying and dividing rational numbers"
  },
  "prompt": {
    "uz": "Amallarni natijalari bilan moslashtiring.",
    "ru": "Соедините действия с результатами.",
    "en": "Match the operations with their results."
  },
  "left": [
    "−8 · (−5)",
    "54 : (−6)",
    "−3 · 11"
  ],
  "right": [
    "40",
    "−9",
    "−33"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Bir xil ishora musbat, har xil ishora manfiy natija beradi.",
    "ru": "Одинаковые знаки дают плюс, разные — минус.",
    "en": "The same signs give a positive result and different signs give a negative one."
  }
};

export default function D29_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={29} task={3}/>;
}
