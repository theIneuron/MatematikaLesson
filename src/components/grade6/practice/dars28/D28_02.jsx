import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ratsional sonlarni ayirish",
    "ru": "Вычитание рациональных чисел"
  },
  "prompt": {
    "uz": "−8 − 7 ayirmaning qiymatini yozing.",
    "ru": "Запишите значение разности −8 − 7."
  },
  "answer": "-15",
  "explanation": {
    "uz": "−8 − 7 = −8 + (−7) = −15.",
    "ru": "−8 − 7 = −8 + (−7) = −15."
  }
};

export default function D28_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={28} task={2}/>;
}
