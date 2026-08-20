import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел",
    "en": "Adding rational numbers"
  },
  "prompt": {
    "uz": "−27 + 35 + (−6) ifodaning qiymatini yozing.",
    "ru": "Вычислите −27 + 35 + (−6) и запишите ответ.",
    "en": "Write the value of the expression −27 + 35 + (−6)."
  },
  "answer": "2",
  "explanation": {
    "uz": "−27 + 35 = 8, so‘ng 8 − 6 = 2.",
    "ru": "−27 + 35 = 8, затем 8 − 6 = 2.",
    "en": "−27 + 35 = 8, and then 8 − 6 = 2."
  }
};

export default function D27_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={8}/>;
}
