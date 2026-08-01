import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ratsional sonlarni ayirish",
    "ru": "Вычитание рациональных чисел"
  },
  "prompt": {
    "uz": "−20 − (−7) − 5 ifodaning qiymatini yozing.",
    "ru": "Вычислите −20 − (−7) − 5 и запишите ответ."
  },
  "answer": "-18",
  "explanation": {
    "uz": "−20 + 7 − 5 = −13 − 5 = −18.",
    "ru": "−20 + 7 − 5 = −13 − 5 = −18."
  }
};

export default function D28_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={28} task={8}/>;
}
