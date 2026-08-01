import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Ratsional sonlarni ayirish",
    "ru": "Вычитание рациональных чисел"
  },
  "prompt": {
    "uz": "−5 − (−9) ifodaning qiymati 4 ga teng.",
    "ru": "Значение выражения −5 − (−9) равно 4."
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Ha",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "explanation": {
    "uz": "−5 − (−9) = −5 + 9 = 4.",
    "ru": "−5 − (−9) = −5 + 9 = 4."
  }
};

export default function D28_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={28} task={5}/>;
}
